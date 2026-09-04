from django.contrib import admin

from .models import Contract, Invoice, InvoiceLineItem, Quotation, QuotationItem


class QuotationItemInline(admin.TabularInline):
    model = QuotationItem
    extra = 0


@admin.register(Quotation)
class QuotationAdmin(admin.ModelAdmin):
    list_display = ("quote_code", "title", "status", "total", "issue_date", "valid_until")
    list_filter = ("status", "event_type")
    search_fields = ("quote_code", "title", "package_name")
    inlines = [QuotationItemInline]


class InvoiceLineItemInline(admin.TabularInline):
    model = InvoiceLineItem
    extra = 0


@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ("invoice_number", "title", "status", "total", "amount_paid", "balance_due", "issue_date", "due_date")
    list_filter = ("status", "issue_date", "due_date")
    search_fields = ("invoice_number", "title", "gstin")
    inlines = [InvoiceLineItemInline]


@admin.register(Contract)
class ContractAdmin(admin.ModelAdmin):
    list_display = ("contract_code", "title", "status", "contract_value", "balance_due", "signed_date")
    list_filter = ("status",)
    search_fields = ("contract_code", "title", "counterparty_name")
