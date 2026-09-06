import hashlib
import secrets
from datetime import timedelta
from urllib.parse import quote

from django.conf import settings
from django.contrib.auth.hashers import check_password, make_password
from django.db.models import F, Q, Sum
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.throttling import AnonRateThrottle
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.core.permissions import AccountsAccessPermission
from apps.core.models import Organization
from apps.operations.models import CalendarEvent
from apps.sales.models import Booking
from .models import ClientPortalAccess, ClientPortalActivity, ClientPortalUser, ProductionActivity, ProductionDeliverable


def token_hash(token):
    return hashlib.sha256(token.encode()).hexdigest()


def access_status(access):
    if not access:
        return "Not Generated"
    if access.closed_at:
        return "Closed"
    if access.revoked_at:
        return "Revoked"
    if access.expires_at <= timezone.now():
        return "Expired"
    return "Active"


def organization_available(organization):
    return bool(
        organization.active
        and (
            not organization.subscription_expires_at
            or organization.subscription_expires_at >= timezone.localdate()
        )
    )


def ensure_portal_access(booking):
    access, _ = ClientPortalAccess.objects.get_or_create(
        booking=booking,
        defaults={"organization": booking.organization, "token_hash": token_hash(secrets.token_urlsafe(32)), "expires_at": timezone.now() + timedelta(days=3650)},
    )
    return access


class ClientPortalManageView(APIView):
    permission_classes = (AccountsAccessPermission,)

    def booking(self, request):
        return Booking.objects.select_related("customer", "lead").filter(
            pk=request.query_params.get("booking") or request.data.get("booking"),
            organization=request.user.organization,
        ).first()

    def get(self, request):
        booking = self.booking(request)
        if not booking:
            return Response({"detail": "Booking not found."}, status=404)
        access = ClientPortalAccess.objects.filter(booking=booking).first()
        return Response({
            "status": access_status(access),
            "expires_at": access.expires_at if access else None,
            "last_accessed_at": access.last_accessed_at if access else None,
            "access_count": access.access_count if access else 0,
            "activities": list(access.activities.values("action", "detail", "created_at")[:25]) if access else [],
            "portal_users": list(booking.portal_users.values("id", "name", "email", "mobile", "active", "last_login_at", "invite_expires_at")),
        })

    def post(self, request):
        booking = self.booking(request)
        if not booking:
            return Response({"detail": "Booking not found."}, status=404)
        days = int(request.data.get("expiry_days", 60))
        if days not in {30, 60, 90, 365}:
            return Response({"expiry_days": "Choose 30, 60, 90, or 365 days."}, status=400)
        raw = secrets.token_urlsafe(32)
        access, _ = ClientPortalAccess.objects.update_or_create(
            booking=booking,
            defaults={"organization": booking.organization, "token_hash": token_hash(raw), "expires_at": timezone.now() + timedelta(days=days), "revoked_at": None},
        )
        ClientPortalActivity.objects.create(organization=booking.organization, access=access, booking=booking, action="Link Generated", detail=f"Secure portal link generated for {days} days.")
        base = getattr(settings, "CLIENT_PORTAL_BASE_URL", "http://127.0.0.1:3000").rstrip("/")
        return Response({"url": f"{base}/client-portal/{raw}", "status": "Active", "expires_at": access.expires_at})

    def delete(self, request):
        booking = self.booking(request)
        access = ClientPortalAccess.objects.filter(booking=booking).first() if booking else None
        if not access:
            return Response({"detail": "Portal access not found."}, status=404)
        access.revoked_at = timezone.now(); access.save(update_fields=("revoked_at", "updated_at"))
        ClientPortalActivity.objects.create(organization=booking.organization, access=access, booking=booking, action="Access Revoked", detail="Studio revoked Client Portal access.")
        return Response({"status": "Revoked"})


class ClientPortalInviteView(APIView):
    permission_classes = (AccountsAccessPermission,)

    def post(self, request):
        booking = Booking.objects.select_related("organization", "customer", "lead").filter(pk=request.data.get("booking"), organization=request.user.organization).first()
        if not booking:
            return Response({"detail": "Booking not found."}, status=404)
        name = str(request.data.get("name", "")).strip()
        email = str(request.data.get("email", "")).strip().lower()
        mobile = str(request.data.get("mobile", "")).strip()
        if not name or "@" not in email:
            return Response({"detail": "Enter the client name and a valid email address."}, status=400)
        raw = secrets.token_urlsafe(32)
        user, _ = ClientPortalUser.objects.update_or_create(
            organization=booking.organization,
            email=email,
            defaults={"booking": booking, "name": name, "mobile": mobile, "active": True, "invite_token_hash": token_hash(raw), "invite_expires_at": timezone.now() + timedelta(days=7), "session_token_hash": "", "session_expires_at": None},
        )
        access = ensure_portal_access(booking)
        ClientPortalActivity.objects.create(organization=booking.organization, access=access, booking=booking, action="Client Invited", detail=f"Password setup invitation generated for {email}.")
        base = getattr(settings, "CLIENT_PORTAL_BASE_URL", "http://127.0.0.1:3000").rstrip("/")
        url = f"{base}/client-portal/setup/{raw}"
        text = f"Hello {name}, {booking.organization.name} has invited you to your secure Client Portal for {booking.booking_code}. Set your password here: {url}"
        return Response({"id": user.id, "url": url, "whatsapp_url": f"https://wa.me/{''.join(filter(str.isdigit, mobile))}?text={quote(text)}", "expires_in_days": 7})

    def patch(self, request):
        user = ClientPortalUser.objects.filter(pk=request.data.get("user"), organization=request.user.organization).select_related("booking").first()
        if not user:
            return Response({"detail": "Client account not found."}, status=404)
        action = request.data.get("action")
        access = ensure_portal_access(user.booking)
        if action == "disable":
            user.active = False; user.session_token_hash = ""; user.session_expires_at = None; label = "Client Access Disabled"
        elif action == "enable":
            user.active = True; label = "Client Access Enabled"
        elif action == "reset":
            raw = secrets.token_urlsafe(32); user.active = True; user.password_hash = ""; user.invite_token_hash = token_hash(raw); user.invite_expires_at = timezone.now() + timedelta(days=7); user.session_token_hash = ""; user.session_expires_at = None; label = "Client Password Reset"
        else:
            return Response({"detail": "Choose reset, disable, or enable."}, status=400)
        user.save()
        ClientPortalActivity.objects.create(organization=user.organization, access=access, booking=user.booking, action=label, detail=f"{label} for {user.email}.")
        response = {"active": user.active}
        if action == "reset":
            base = getattr(settings, "CLIENT_PORTAL_BASE_URL", "http://127.0.0.1:3000").rstrip("/"); response["url"] = f"{base}/client-portal/setup/{raw}"
            reset_text = f"Hello {user.name}, {user.organization.name} has reset your Client Portal password. Create a new password here: {response['url']}"
            response["whatsapp_url"] = f"https://wa.me/?text={quote(reset_text)}"
        return Response(response)

    def put(self, request):
        booking = Booking.objects.filter(pk=request.data.get("booking"), organization=request.user.organization).first()
        if not booking:
            return Response({"detail": "Booking not found."}, status=404)
        access = ensure_portal_access(booking)
        ClientPortalActivity.objects.create(organization=booking.organization, access=access, booking=booking, action="WhatsApp Invitation Copied", detail="Client password setup invitation copied for WhatsApp sharing.")
        return Response({"detail": "Invitation copy recorded."})


class ClientPortalWhatsAppView(APIView):
    permission_classes = (AccountsAccessPermission,)

    def post(self, request):
        booking = Booking.objects.select_related("organization", "customer", "lead").filter(
            pk=request.data.get("booking"), organization=request.user.organization
        ).first()
        if not booking:
            return Response({"detail": "Booking not found."}, status=404)
        access = ensure_portal_access(booking)
        message_type = str(request.data.get("message_type", "login"))
        event = str(request.data.get("event", "prepared"))
        labels = {
            "login": "Client Portal Login",
            "gallery_ready": "Gallery Ready",
            "payment_reminder": "Payment Reminder",
            "approval_confirmation": "Approval Confirmation",
            "revision_acknowledgement": "Revision Acknowledgement",
        }
        if message_type not in labels:
            return Response({"message_type": "Select a valid WhatsApp message."}, status=400)
        portal_user = booking.portal_users.filter(active=True).first()
        client_name = portal_user.name if portal_user else (getattr(booking.lead, "couple_name", "") or booking.customer.name)
        base = getattr(settings, "CLIENT_PORTAL_BASE_URL", "http://127.0.0.1:3000").rstrip("/")
        login_url = f"{base}/client-portal/login?studio={booking.organization.slug}"
        paid = booking.payments.filter(status="Paid").aggregate(
            received=Sum("amount", filter=~Q(payment_type="Refund")),
            refunded=Sum("amount", filter=Q(payment_type="Refund")),
        )
        received = (paid["received"] or 0) - (paid["refunded"] or 0)
        balance = max(booking.quoted_amount - received, 0)
        messages = {
            "login": f"Hello {client_name},\n\nYou can access your secure {booking.organization.name} Client Portal here:\n{login_url}\n\nStudio ID: {booking.organization.slug}\nBooking: {booking.booking_code}",
            "gallery_ready": f"Hello {client_name},\n\nYour gallery for {booking.event_type} is ready to review. Please open your Client Portal, view the gallery and select Approve or Request Changes.\n\n{login_url}\nStudio ID: {booking.organization.slug}",
            "payment_reminder": f"Hello {client_name},\n\nPayment reminder for {booking.booking_code}:\nTotal: ₹{booking.quoted_amount:,.2f}\nReceived: ₹{received:,.2f}\nBalance: ₹{balance:,.2f}\n\nYou can review the statement here: {login_url}",
            "approval_confirmation": f"Hello {client_name},\n\nThank you. Your approval for {booking.booking_code} has been recorded successfully. Our production team will proceed with the next delivery step.",
            "revision_acknowledgement": f"Hello {client_name},\n\nWe have received your requested changes for {booking.booking_code}. Our production team will update the work and notify this group when it is ready for review.",
        }
        text = messages[message_type]
        action = {"copied": "WhatsApp Message Copied", "opened": "WhatsApp Opened"}.get(event, "WhatsApp Message Prepared")
        ClientPortalActivity.objects.create(
            organization=booking.organization, access=access, booking=booking,
            action=action, detail=f"{labels[message_type]} message {event}.",
        )
        return Response({"label": labels[message_type], "message": text, "whatsapp_url": f"https://wa.me/?text={quote(text)}"})


class ClientPortalAuthView(APIView):
    permission_classes = (AllowAny,)
    authentication_classes = ()

    def post(self, request, action):
        now = timezone.now()
        if action == "setup":
            raw = str(request.data.get("token", "")); password = str(request.data.get("password", ""))
            user = ClientPortalUser.objects.select_related("booking", "organization").filter(invite_token_hash=token_hash(raw), active=True, invite_expires_at__gt=now).first()
            if not user or not organization_available(user.organization):
                return Response({"detail": "This invitation is invalid or expired."}, status=401)
            if len(password) < 10:
                return Response({"password": "Use at least 10 characters."}, status=400)
            user.password_hash = make_password(password); user.invite_token_hash = ""; user.invite_expires_at = None
            audit_action = "Password Created"
        elif action == "login":
            email = str(request.data.get("email", "")).strip().lower(); password = str(request.data.get("password", "")); studio = str(request.data.get("studio", "")).strip()
            user = ClientPortalUser.objects.select_related("booking", "organization").filter(email=email, organization__slug=studio, active=True).first()
            if not user or not organization_available(user.organization) or not check_password(password, user.password_hash):
                return Response({"detail": "Invalid email or password."}, status=401)
            user.last_login_at = now; audit_action = "Client Login"
        else:
            return Response({"detail": "Not found."}, status=404)
        session = secrets.token_urlsafe(32); user.session_token_hash = token_hash(session); user.session_expires_at = now + timedelta(days=7); user.save()
        access = ensure_portal_access(user.booking)
        ClientPortalActivity.objects.create(organization=user.organization, access=access, booking=user.booking, action=audit_action, detail=f"{audit_action} for {user.email}.")
        return Response({"access_token": session, "portal_url": f"/client-portal/{session}", "studio": user.organization.slug})


class ClientPortalResetThrottle(AnonRateThrottle):
    scope = "client_portal_reset"


class ClientPortalResetRequestView(APIView):
    permission_classes = (AllowAny,)
    authentication_classes = ()
    throttle_classes = (ClientPortalResetThrottle,)

    def post(self, request):
        studio_slug = str(request.data.get("studio", "")).strip().lower()
        client_name = str(request.data.get("name", "")).strip()
        mobile = str(request.data.get("mobile", "")).strip()
        organization = Organization.objects.filter(slug=studio_slug, active=True).first()
        if not organization or not organization_available(organization):
            return Response({"detail": "Please verify the Studio ID or contact your studio directly."}, status=400)
        destination = "".join(filter(str.isdigit, organization.whatsapp_number or organization.contact_phone))
        if not destination:
            return Response({"detail": "This studio has not configured a WhatsApp support number."}, status=400)
        entered_mobile = "".join(filter(str.isdigit, mobile))
        matched_user = next(
            (
                user
                for user in ClientPortalUser.objects.filter(organization=organization, active=True).select_related("booking")
                if user.name.strip().casefold() == client_name.casefold()
                and entered_mobile
                and "".join(filter(str.isdigit, user.mobile))[-10:] == entered_mobile[-10:]
            ),
            None,
        )
        booking_reference = matched_user.booking.booking_code if matched_user else "Not verified"
        text = (
            f"Hello {organization.name},\n\nI forgot my Client Portal password and need a reset link.\n"
            f"Client name: {client_name}\nMobile: {mobile}\nStudio ID: {studio_slug}\n"
            f"Booking: {booking_reference}\n\nPlease verify my details and share a new password setup link in our wedding group."
        )
        if matched_user:
            access = ensure_portal_access(matched_user.booking)
            ClientPortalActivity.objects.create(
                organization=organization,
                access=access,
                booking=matched_user.booking,
                action="Password Reset Requested",
                detail=f"WhatsApp reset request prepared for {matched_user.name} ({matched_user.mobile}).",
            )
        return Response(
            {
                "detail": "Send this prepared WhatsApp request to the studio. The studio will verify your details before issuing a reset link.",
                "message": text,
                "whatsapp_url": f"https://wa.me/{destination}?text={quote(text)}",
            }
        )


class ClientPortalPublicView(APIView):
    permission_classes = (AllowAny,)
    authentication_classes = ()

    def access(self, token):
        hashed = token_hash(token)
        access = ClientPortalAccess.objects.select_related("booking__customer", "booking__lead", "organization").filter(token_hash=hashed).first()
        if access:
            return access, False
        user = ClientPortalUser.objects.select_related("booking__customer", "booking__lead", "organization").filter(session_token_hash=hashed, session_expires_at__gt=timezone.now(), active=True).first()
        return (ensure_portal_access(user.booking), True) if user else (None, False)

    def get(self, request, token):
        access, permanent = self.access(token)
        if not access or not organization_available(access.organization) or access.closed_at or (not permanent and access_status(access) != "Active"):
            return Response({"detail": "This Client Portal link is invalid, expired, or revoked."}, status=401)
        access.last_accessed_at = timezone.now(); access.access_count = F("access_count") + 1
        access.save(update_fields=("last_accessed_at", "access_count", "updated_at")); access.refresh_from_db()
        booking = access.booking
        payments = booking.payments.order_by("paid_at", "due_date", "created_at")
        totals = payments.filter(status="Paid").aggregate(received=Sum("amount", filter=~Q(payment_type="Refund")), refunded=Sum("amount", filter=Q(payment_type="Refund")))
        received = (totals["received"] or 0) - (totals["refunded"] or 0)
        events = CalendarEvent.objects.filter(organization=access.organization, booking=booking).order_by("start_date")
        deliverables = ProductionDeliverable.objects.filter(organization=access.organization, job__booking=booking, drive_link__gt="").select_related("job")
        ClientPortalActivity.objects.create(organization=access.organization, access=access, booking=booking, action="Portal Opened", detail="Client opened the secure portal.")
        return Response({
            "studio": {"name": access.organization.name, "phone": access.organization.contact_phone, "email": access.organization.contact_email, "logo_url": access.organization.logo_url},
            "booking": {"id": booking.id, "code": booking.booking_code, "client_name": booking.customer.name, "couple_name": getattr(booking.lead, "couple_name", "") if booking.lead else "", "event_type": booking.event_type, "event_date": booking.event_date, "total": booking.quoted_amount, "received": received, "balance": max(booking.quoted_amount - received, 0)},
            "events": list(events.values("event_type", "start_date", "status")),
            "payments": list(payments.values("payment_type", "status", "amount", "due_date", "paid_at")),
            "deliverables": [{"id": item.id, "name": item.name, "status": item.status, "drive_link": item.drive_link, "revision_notes": item.revision_notes} for item in deliverables],
        })

    def post(self, request, token):
        access, permanent = self.access(token)
        if not access or not organization_available(access.organization) or access.closed_at or (not permanent and access_status(access) != "Active"):
            return Response({"detail": "This Client Portal link is invalid, expired, or revoked."}, status=401)
        deliverable = ProductionDeliverable.objects.filter(pk=request.data.get("deliverable"), organization=access.organization, job__booking=access.booking).first()
        if not deliverable:
            return Response({"detail": "Deliverable not found."}, status=404)
        action = request.data.get("action")
        message = str(request.data.get("message", "")).strip()
        if action == "approve":
            deliverable.status = "Client Approved"; deliverable.approved_at = timezone.now(); deliverable.revision_notes = ""
            activity = "Delivery Approved"
        elif action == "changes" and message:
            deliverable.status = "Client Changes"; deliverable.revision_notes = message; deliverable.revision_count += 1
            activity = "Changes Requested"
        else:
            return Response({"detail": "Enter the requested changes."}, status=400)
        deliverable.save(update_fields=("status", "approved_at", "revision_notes", "revision_count", "updated_at"))
        job = deliverable.job
        if action == "approve" and not job.deliverables.filter(enabled=True).exclude(status="Client Approved").exists():
            job.client_approval_status = "Approved"; job.client_approved_at = timezone.now(); job.stage = "Ready for Delivery"
            job.save(update_fields=("client_approval_status", "client_approved_at", "stage", "updated_at"))
        elif action == "changes":
            job.client_approval_status = "Revision Requested"; job.stage = "Client Approval"
            job.save(update_fields=("client_approval_status", "stage", "updated_at"))
        ProductionActivity.objects.create(organization=access.organization, job=job, activity_type="Client Portal Feedback", description=f"{deliverable.name}: {activity}. {message}".strip(), performed_by="Client")
        ClientPortalActivity.objects.create(organization=access.organization, access=access, booking=access.booking, action=activity, detail=message or f"Client approved {deliverable.name}.")
        return Response({"detail": "Feedback submitted successfully.", "status": deliverable.status})
