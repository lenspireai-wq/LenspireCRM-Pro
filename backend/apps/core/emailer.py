"""Tiny wrapper that sends email via SMTP when configured; otherwise writes to the EmailLog table.

This keeps external email providers optional while still capturing every send in a queryable audit trail.
"""
import logging
import os
import smtplib
from email.message import EmailMessage

from .models import EmailLog

logger = logging.getLogger("apps.core.email")


def send_email(*, subject, body, to, html=None, category="transactional"):
    """Send a plain-text (and optional HTML) email; always records an EmailLog row."""
    smtp_host = os.getenv("SMTP_HOST")
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASSWORD")
    smtp_port = int(os.getenv("SMTP_PORT", "587") or 587)
    smtp_from = os.getenv("SMTP_FROM", smtp_user or "no-reply@lenspirecrm.local")
    use_tls = os.getenv("SMTP_TLS", "true").lower() == "true"

    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = smtp_from
    message["To"] = ", ".join(to) if isinstance(to, (list, tuple)) else to
    message.set_content(body)
    if html:
        message.add_alternative(html, subtype="html")

    delivered = False
    error = None
    if smtp_host and smtp_user and smtp_pass:
        try:
            with smtplib.SMTP(smtp_host, smtp_port, timeout=10) as smtp:
                if use_tls:
                    smtp.starttls()
                smtp.login(smtp_user, smtp_pass)
                smtp.send_message(message)
            delivered = True
        except Exception as exc:  # pragma: no cover - depends on host
            error = str(exc)
            logger.warning("SMTP delivery failed", extra={"to": to, "subject": subject, "error": error})
    else:
        logger.info("SMTP not configured; EmailLog only", extra={"to": to, "subject": subject})

    EmailLog.objects.create(
        category=category,
        subject=subject,
        body=body,
        recipient=", ".join(to) if isinstance(to, (list, tuple)) else to,
        delivered=delivered,
        error=error or "",
    )
    return delivered
