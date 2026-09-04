from decimal import Decimal

from django.db import models

from apps.core.models import OrganizationScopedModel


class Quotation(OrganizationScopedModel):
    STATUS_DRAFT = "Draft"
    STATUS_SENT = "Sent"
    STATUS_ACCEPTED = "Accepted"
    STATUS_REJECTED = "Rejected"
    STATUS_EXPIRED = "Expired"
    STATUS_CHOICES = (
        (STATUS_DRAFT, "Draft"),
        (STATUS_SENT, "Sent"),
        (STATUS_ACCEPTED, "Accepted"),
        (STATUS_REJECTED, "Rejected"),
        (STATUS_EXPIRED, "Expired"),
    )

    quote_code = models.CharField(max_length=24)
    lead = models.ForeignKey(
        "sales.Lead", on_delete=models.SET_NULL, null=True, blank=True, related_name="quotations"
    )
    customer = models.ForeignKey(
        "sales.Customer", on_delete=models.SET_NULL, null=True, blank=True, related_name="quotations"
    )
    booking = models.ForeignKey(
        "sales.Booking", on_delete=models.SET_NULL, null=True, blank=True, related_name="quotations"
    )
    title = models.CharField(max_length=160)
    package_name = models.CharField(max_length=120, blank=True)
    event_type = models.CharField(max_length=80, blank=True)
    event_date = models.DateField(null=True, blank=True)
    city = models.CharField(max_length=80, blank=True)
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default=STATUS_DRAFT)
    issue_date = models.DateField()
    valid_until = models.DateField(null=True, blank=True)
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    discount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    tax_rate = models.DecimalField(max_digits=6, decimal_places=2, default=Decimal("0.00"))
    tax_amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    total = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    notes = models.TextField(blank=True)
    terms = models.TextField(blank=True)
    prepared_by = models.CharField(max_length=120, blank=True)
    version = models.PositiveSmallIntegerField(default=1)

    class Meta:
        ordering = ("-issue_date", "-id")
        constraints = [
            models.UniqueConstraint(
                fields=("organization", "quote_code"),
                name="unique_quote_code_per_org",
            ),
        ]


class QuotationItem(OrganizationScopedModel):
    quotation = models.ForeignKey(Quotation, on_delete=models.CASCADE, related_name="items")
    name = models.CharField(max_length=160)
    description = models.TextField(blank=True)
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    line_total = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    position = models.PositiveSmallIntegerField(default=0)


class Contract(OrganizationScopedModel):
    STATUS_DRAFT = "Draft"
    STATUS_SENT = "Sent"
    STATUS_PARTIALLY_SIGNED = "Partially Signed"
    STATUS_SIGNED = "Signed"
    STATUS_CANCELLED = "Cancelled"
    STATUS_CHOICES = (
        (STATUS_DRAFT, "Draft"),
        (STATUS_SENT, "Sent"),
        (STATUS_PARTIALLY_SIGNED, "Partially Signed"),
        (STATUS_SIGNED, "Signed"),
        (STATUS_CANCELLED, "Cancelled"),
    )

    contract_code = models.CharField(max_length=24)
    quotation = models.ForeignKey(
        Quotation, on_delete=models.SET_NULL, null=True, blank=True, related_name="contracts"
    )
    booking = models.ForeignKey(
        "sales.Booking", on_delete=models.SET_NULL, null=True, blank=True, related_name="contracts"
    )
    customer = models.ForeignKey(
        "sales.Customer", on_delete=models.SET_NULL, null=True, blank=True, related_name="contracts"
    )
    title = models.CharField(max_length=160)
    status = models.CharField(max_length=24, choices=STATUS_CHOICES, default=STATUS_DRAFT)
    signed_date = models.DateField(null=True, blank=True)
    effective_date = models.DateField(null=True, blank=True)
    expires_on = models.DateField(null=True, blank=True)
    contract_value = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    advance_paid = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    balance_due = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    counterparty_name = models.CharField(max_length=160, blank=True)
    counterparty_email = models.EmailField(blank=True)
    counterparty_phone = models.CharField(max_length=24, blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ("-signed_date", "-id")
        constraints = [
            models.UniqueConstraint(
                fields=("organization", "contract_code"),
                name="unique_contract_code_per_org",
            ),
        ]


class Invoice(OrganizationScopedModel):
    STATUS_DRAFT = "Draft"
    STATUS_ISSUED = "Issued"
    STATUS_PARTIALLY_PAID = "Partially Paid"
    STATUS_PAID = "Paid"
    STATUS_OVERDUE = "Overdue"
    STATUS_CANCELLED = "Cancelled"
    STATUS_CHOICES = (
        (STATUS_DRAFT, "Draft"),
        (STATUS_ISSUED, "Issued"),
        (STATUS_PARTIALLY_PAID, "Partially Paid"),
        (STATUS_PAID, "Paid"),
        (STATUS_OVERDUE, "Overdue"),
        (STATUS_CANCELLED, "Cancelled"),
    )

    invoice_number = models.CharField(max_length=24)
    booking = models.ForeignKey(
        "sales.Booking", on_delete=models.SET_NULL, null=True, blank=True, related_name="invoices"
    )
    customer = models.ForeignKey(
        "sales.Customer", on_delete=models.SET_NULL, null=True, blank=True, related_name="invoices"
    )
    contract = models.ForeignKey(
        Contract, on_delete=models.SET_NULL, null=True, blank=True, related_name="invoices"
    )
    quotation = models.ForeignKey(
        Quotation, on_delete=models.SET_NULL, null=True, blank=True, related_name="invoices"
    )
    title = models.CharField(max_length=160)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_DRAFT)
    issue_date = models.DateField()
    due_date = models.DateField(null=True, blank=True)
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    discount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    tax_rate = models.DecimalField(max_digits=6, decimal_places=2, default=Decimal("0.00"))
    tax_amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    total = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    amount_paid = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    balance_due = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    notes = models.TextField(blank=True)
    gstin = models.CharField(max_length=24, blank=True)
    sac_code = models.CharField(max_length=12, blank=True)

    class Meta:
        ordering = ("-issue_date", "-id")
        constraints = [
            models.UniqueConstraint(
                fields=("organization", "invoice_number"),
                name="unique_invoice_number_per_org",
            ),
        ]


class InvoiceLineItem(OrganizationScopedModel):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name="items")
    name = models.CharField(max_length=160)
    description = models.TextField(blank=True)
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    line_total = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    position = models.PositiveSmallIntegerField(default=0)
