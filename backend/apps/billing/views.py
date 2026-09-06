from decimal import Decimal

from django.db import transaction
from django.utils import timezone
from drf_spectacular.utils import OpenApiParameter, extend_schema
from rest_framework import serializers
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.core.api import OrganizationScopedViewSet
from apps.core.permissions import AccountsAccessPermission, SalesAccessPermission
from apps.sales.models import Booking, Customer, Lead

from .models import Contract, Invoice, InvoiceLineItem, Quotation, QuotationItem


def _decimal(value, default=Decimal("0.00")):
    try:
        return Decimal(str(value))
    except Exception:
        return default


def _recalc_quotation_totals(quotation: Quotation) -> None:
    items = list(quotation.items.all())
    subtotal = Decimal("0.00")
    for item in items:
        line = _decimal(item.quantity) * _decimal(item.unit_price)
        item.line_total = line
        item.save(update_fields=("line_total", "updated_at"))
        subtotal += line
    discount = _decimal(quotation.discount)
    tax_rate = _decimal(quotation.tax_rate)
    tax_amount = max(Decimal("0.00"), (subtotal - discount) * tax_rate / Decimal("100"))
    quotation.subtotal = subtotal
    quotation.tax_amount = tax_amount.quantize(Decimal("0.01"))
    quotation.total = (subtotal - discount + tax_amount).quantize(Decimal("0.01"))
    quotation.save(update_fields=("subtotal", "tax_amount", "total", "updated_at"))


def _recalc_invoice_totals(invoice: Invoice) -> None:
    items = list(invoice.items.all())
    subtotal = Decimal("0.00")
    for item in items:
        line = _decimal(item.quantity) * _decimal(item.unit_price)
        item.line_total = line
        item.save(update_fields=("line_total", "updated_at"))
        subtotal += line
    discount = _decimal(invoice.discount)
    tax_rate = _decimal(invoice.tax_rate)
    tax_amount = max(Decimal("0.00"), (subtotal - discount) * tax_rate / Decimal("100"))
    paid = _decimal(invoice.amount_paid)
    invoice.subtotal = subtotal
    invoice.tax_amount = tax_amount.quantize(Decimal("0.01"))
    invoice.total = (subtotal - discount + tax_amount).quantize(Decimal("0.01"))
    invoice.balance_due = (invoice.total - paid).quantize(Decimal("0.01"))
    if paid <= Decimal("0.00"):
        invoice.status = Invoice.STATUS_ISSUED if invoice.status == Invoice.STATUS_DRAFT else invoice.status
    elif paid < invoice.total:
        invoice.status = Invoice.STATUS_PARTIALLY_PAID
    else:
        invoice.status = Invoice.STATUS_PAID
    invoice.save(update_fields=("subtotal", "tax_amount", "total", "balance_due", "status", "updated_at"))


def _next_organization_code(model, field_name: str, organization, padding: int) -> str:
    last = (
        model.objects.filter(organization=organization, **{f"{field_name}__startswith": field_name[:1]})
        .order_by("-id")
        .values_list(field_name, flat=True)
        .first()
    )
    next_index = 1
    if last:
        digits = "".join(c for c in str(last) if c.isdigit())
        if digits:
            next_index = int(digits) + 1
    return f"{field_name[:1]}{next_index:0{padding}d}"


class QuotationItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuotationItem
        fields = "__all__"
        read_only_fields = ("organization", "quotation", "line_total", "updated_at", "created_at")


class QuotationSerializer(serializers.ModelSerializer):
    items = QuotationItemSerializer(many=True, required=False)
    customer_name = serializers.CharField(source="customer.name", read_only=True, default="")
    lead_name = serializers.CharField(source="lead.name", read_only=True, default="")
    quote_code = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Quotation
        fields = "__all__"
        read_only_fields = ("organization", "subtotal", "tax_amount", "total", "updated_at", "created_at")

    def validate(self, attrs):
        request = self.context["request"]
        organization = request.user.organization
        for field in ("lead", "customer", "booking"):
            value = attrs.get(field, getattr(self.instance, field, None))
            if value and getattr(value, "organization_id", None) != organization.id:
                raise serializers.ValidationError({field: "Record does not belong to this organization."})
        if attrs.get("issue_date") and attrs.get("valid_until") and attrs.get("valid_until") < attrs.get("issue_date"):
            raise serializers.ValidationError({"valid_until": "Validity cannot end before issue date."})
        if attrs.get("tax_rate", getattr(self.instance, "tax_rate", 0)) < 0:
            raise serializers.ValidationError({"tax_rate": "Tax rate cannot be negative."})
        if attrs.get("discount", getattr(self.instance, "discount", 0)) < 0:
            raise serializers.ValidationError({"discount": "Discount cannot be negative."})
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        items = validated_data.pop("items", [])
        organization = self.context["request"].user.organization
        quote_code = validated_data.pop("quote_code", None) or _next_organization_code(Quotation, "quote_code", organization, 4)
        quotation = Quotation.objects.create(
            organization=organization,
            quote_code=quote_code,
            **{k: v for k, v in validated_data.items() if k != "organization"},
        )
        for index, item in enumerate(items):
            QuotationItem.objects.create(
                organization=organization,
                quotation=quotation,
                position=item.get("position", index),
                **{k: v for k, v in item.items() if k not in ("position",)},
            )
        _recalc_quotation_totals(quotation)
        return quotation

    @transaction.atomic
    def update(self, instance, validated_data):
        items = validated_data.pop("items", None)
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        if items is not None:
            existing = {item.pk: item for item in instance.items.all()}
            seen = set()
            for index, item in enumerate(items):
                pk = item.get("id")
                payload = {k: v for k, v in item.items() if k not in ("id",)}
                if pk and pk in existing:
                    obj = existing[pk]
                    for k, v in payload.items():
                        setattr(obj, k, v)
                    obj.save()
                    seen.add(pk)
                else:
                    QuotationItem.objects.create(
                        organization=instance.organization,
                        quotation=instance,
                        position=item.get("position", index),
                        **{k: v for k, v in payload.items() if k != "position"},
                    )
            for pk, obj in existing.items():
                if pk not in seen:
                    obj.delete()
        _recalc_quotation_totals(instance)
        return instance


class ContractSerializer(serializers.ModelSerializer):
    contract_code = serializers.CharField(required=False, allow_blank=True)
    customer_name = serializers.CharField(source="customer.name", read_only=True, default="")
    booking_code = serializers.CharField(source="booking.booking_code", read_only=True, default="")
    quote_code_ref = serializers.CharField(source="quotation.quote_code", read_only=True, default="")

    class Meta:
        model = Contract
        fields = "__all__"
        read_only_fields = ("organization", "updated_at", "created_at")

    def validate(self, attrs):
        request = self.context["request"]
        organization = request.user.organization
        for field in ("customer", "booking", "quotation"):
            value = attrs.get(field, getattr(self.instance, field, None))
            if value and getattr(value, "organization_id", None) != organization.id:
                raise serializers.ValidationError({field: "Record does not belong to this organization."})
        if attrs.get("contract_value", getattr(self.instance, "contract_value", 0)) < 0:
            raise serializers.ValidationError({"contract_value": "Contract value cannot be negative."})
        if attrs.get("advance_paid", getattr(self.instance, "advance_paid", 0)) < 0:
            raise serializers.ValidationError({"advance_paid": "Advance paid cannot be negative."})
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        organization = self.context["request"].user.organization
        code = validated_data.pop("contract_code", None) or _next_organization_code(Contract, "contract_code", organization, 4)
        contract = Contract.objects.create(
            organization=organization,
            contract_code=code,
            **{k: v for k, v in validated_data.items() if k != "organization"},
        )
        contract.balance_due = (contract.contract_value - contract.advance_paid).quantize(Decimal("0.01"))
        contract.save(update_fields=("balance_due", "updated_at"))
        return contract

    @transaction.atomic
    def update(self, instance, validated_data):
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.balance_due = (instance.contract_value - instance.advance_paid).quantize(Decimal("0.01"))
        instance.save()
        return instance


class InvoiceLineItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceLineItem
        fields = "__all__"
        read_only_fields = ("organization", "invoice", "line_total", "updated_at", "created_at")


class InvoiceSerializer(serializers.ModelSerializer):
    items = InvoiceLineItemSerializer(many=True, required=False)
    customer_name = serializers.CharField(source="customer.name", read_only=True, default="")
    booking_code = serializers.CharField(source="booking.booking_code", read_only=True, default="")
    invoice_number = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Invoice
        fields = "__all__"
        read_only_fields = ("organization", "subtotal", "tax_amount", "total", "balance_due", "updated_at", "created_at")

    def validate(self, attrs):
        request = self.context["request"]
        organization = request.user.organization
        for field in ("customer", "booking", "contract", "quotation"):
            value = attrs.get(field, getattr(self.instance, field, None))
            if value and getattr(value, "organization_id", None) != organization.id:
                raise serializers.ValidationError({field: "Record does not belong to this organization."})
        if attrs.get("issue_date") and attrs.get("due_date") and attrs.get("due_date") < attrs.get("issue_date"):
            raise serializers.ValidationError({"due_date": "Due date cannot be before issue date."})
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        items = validated_data.pop("items", [])
        organization = self.context["request"].user.organization
        number = validated_data.pop("invoice_number", None) or _next_organization_code(Invoice, "invoice_number", organization, 5)
        invoice = Invoice.objects.create(
            organization=organization,
            invoice_number=number,
            **{k: v for k, v in validated_data.items() if k != "organization"},
        )
        for index, item in enumerate(items):
            InvoiceLineItem.objects.create(
                organization=organization,
                invoice=invoice,
                position=item.get("position", index),
                **{k: v for k, v in item.items() if k != "position"},
            )
        _recalc_invoice_totals(invoice)
        return invoice

    @transaction.atomic
    def update(self, instance, validated_data):
        items = validated_data.pop("items", None)
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        if items is not None:
            existing = {item.pk: item for item in instance.items.all()}
            seen = set()
            for index, item in enumerate(items):
                pk = item.get("id")
                payload = {k: v for k, v in item.items() if k != "id"}
                if pk and pk in existing:
                    obj = existing[pk]
                    for k, v in payload.items():
                        setattr(obj, k, v)
                    obj.save()
                    seen.add(pk)
                else:
                    InvoiceLineItem.objects.create(
                        organization=instance.organization,
                        invoice=instance,
                        position=item.get("position", index),
                        **{k: v for k, v in payload.items() if k != "position"},
                    )
            for pk, obj in existing.items():
                if pk not in seen:
                    obj.delete()
        _recalc_invoice_totals(instance)
        return instance


class QuotationViewSet(OrganizationScopedViewSet):
    queryset = Quotation.objects.prefetch_related("items").select_related("lead", "customer", "booking").all()
    serializer_class = QuotationSerializer
    permission_classes = (SalesAccessPermission,)
    filterset_fields = {
        "status": ["exact", "in"],
        "event_type": ["exact", "in"],
        "lead": ["exact"],
        "customer": ["exact"],
        "booking": ["exact"],
        "issue_date": ["exact", "gte", "lte"],
        "valid_until": ["gte", "lte"],
        "total": ["gte", "lte"],
    }
    search_fields = ("quote_code", "title", "package_name", "lead__name", "customer__name", "city")
    ordering_fields = ("issue_date", "valid_until", "total", "created_at")

    @extend_schema(summary="Mark quotation as sent")
    @action(detail=True, methods=["post"])
    def send(self, request, pk=None):
        quotation = self.get_object()
        quotation.status = Quotation.STATUS_SENT
        quotation.save(update_fields=("status", "updated_at"))
        return Response(self.get_serializer(quotation).data)

    @extend_schema(summary="Mark quotation as accepted")
    @action(detail=True, methods=["post"])
    def accept(self, request, pk=None):
        quotation = self.get_object()
        quotation.status = Quotation.STATUS_ACCEPTED
        quotation.save(update_fields=("status", "updated_at"))
        if quotation.booking:
            booking = quotation.booking
            booking.quoted_amount = quotation.total
            booking.save(update_fields=("quoted_amount", "updated_at"))
        return Response(self.get_serializer(quotation).data)

    @extend_schema(summary="Mark quotation as rejected")
    @action(detail=True, methods=["post"])
    def reject(self, request, pk=None):
        quotation = self.get_object()
        quotation.status = Quotation.STATUS_REJECTED
        quotation.save(update_fields=("status", "updated_at"))
        return Response(self.get_serializer(quotation).data)

    @extend_schema(summary="Duplicate quotation as a new version")
    @action(detail=True, methods=["post"])
    def duplicate(self, request, pk=None):
        original = self.get_object()
        organization = request.user.organization
        new_code = _next_organization_code(Quotation, "quote_code", organization, 4)
        copy = Quotation.objects.create(
            organization=organization,
            quote_code=new_code,
            lead=original.lead,
            customer=original.customer,
            booking=original.booking,
            title=original.title,
            package_name=original.package_name,
            event_type=original.event_type,
            event_date=original.event_date,
            city=original.city,
            status=Quotation.STATUS_DRAFT,
            issue_date=timezone.localdate(),
            valid_until=original.valid_until,
            subtotal=original.subtotal,
            discount=original.discount,
            tax_rate=original.tax_rate,
            tax_amount=original.tax_amount,
            total=original.total,
            notes=original.notes,
            terms=original.terms,
            prepared_by=original.prepared_by,
            version=original.version + 1,
        )
        for item in original.items.all():
            QuotationItem.objects.create(
                organization=organization,
                quotation=copy,
                name=item.name,
                description=item.description,
                quantity=item.quantity,
                unit_price=item.unit_price,
                line_total=item.line_total,
                position=item.position,
            )
        return Response(self.get_serializer(copy).data, status=201)


class ContractViewSet(OrganizationScopedViewSet):
    queryset = Contract.objects.select_related("customer", "booking", "quotation").all()
    serializer_class = ContractSerializer
    permission_classes = (SalesAccessPermission,)
    filterset_fields = {
        "status": ["exact", "in"],
        "signed_date": ["exact", "gte", "lte"],
        "expires_on": ["gte", "lte"],
        "contract_value": ["gte", "lte"],
        "customer": ["exact"],
        "booking": ["exact"],
        "quotation": ["exact"],
    }
    search_fields = ("contract_code", "title", "counterparty_name", "counterparty_email", "customer__name")
    ordering_fields = ("signed_date", "expires_on", "contract_value", "created_at")

    @extend_schema(summary="Mark contract as signed")
    @action(detail=True, methods=["post"])
    def sign(self, request, pk=None):
        contract = self.get_object()
        contract.status = Contract.STATUS_SIGNED
        contract.signed_date = timezone.localdate()
        contract.balance_due = (contract.contract_value - contract.advance_paid).quantize(Decimal("0.01"))
        contract.save(update_fields=("status", "signed_date", "balance_due", "updated_at"))
        return Response(self.get_serializer(contract).data)


class InvoiceViewSet(OrganizationScopedViewSet):
    queryset = Invoice.objects.prefetch_related("items").select_related("customer", "booking", "contract", "quotation").all()
    serializer_class = InvoiceSerializer
    permission_classes = (AccountsAccessPermission,)
    filterset_fields = {
        "status": ["exact", "in"],
        "issue_date": ["exact", "gte", "lte"],
        "due_date": ["gte", "lte"],
        "total": ["gte", "lte"],
        "customer": ["exact"],
        "booking": ["exact"],
        "contract": ["exact"],
        "quotation": ["exact"],
    }
    search_fields = ("invoice_number", "title", "gstin", "customer__name", "booking__booking_code")
    ordering_fields = ("issue_date", "due_date", "total", "amount_paid", "created_at")

    @extend_schema(summary="Record a payment against this invoice")
    @action(detail=True, methods=["post"])
    def record_payment(self, request, pk=None):
        invoice = self.get_object()
        amount = _decimal(request.data.get("amount"))
        if amount <= 0:
            return Response({"amount": "Enter a positive amount."}, status=400)
        invoice.amount_paid = (invoice.amount_paid + amount).quantize(Decimal("0.01"))
        invoice.balance_due = (invoice.total - invoice.amount_paid).quantize(Decimal("0.01"))
        if invoice.balance_due <= 0:
            invoice.status = Invoice.STATUS_PAID
            invoice.balance_due = Decimal("0.00")
        elif invoice.amount_paid > 0:
            invoice.status = Invoice.STATUS_PARTIALLY_PAID
        invoice.save(update_fields=("amount_paid", "balance_due", "status", "updated_at"))
        return Response(self.get_serializer(invoice).data)
