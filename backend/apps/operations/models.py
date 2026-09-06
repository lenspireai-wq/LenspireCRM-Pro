from django.conf import settings
from django.db import models
from apps.core.models import OrganizationScopedModel
from apps.sales.models import Booking, Customer

class CalendarEvent(OrganizationScopedModel):
    booking = models.ForeignKey(Booking, null=True, blank=True, on_delete=models.CASCADE, related_name="events")
    customer = models.ForeignKey(Customer, null=True, blank=True, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    event_type = models.CharField(max_length=80, default="Shoot")
    start_date = models.DateField(null=True, blank=True)
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    city = models.CharField(max_length=120, blank=True)
    status = models.CharField(max_length=30, default="Scheduled")
    assigned_user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL)
    notes = models.TextField(blank=True)
    slotted = models.BooleanField(default=False)
    client_name = models.CharField(max_length=160, blank=True)
    handled_by = models.CharField(max_length=160, blank=True)
    couple_name = models.CharField(max_length=200, blank=True)
    contact_no = models.CharField(max_length=40, blank=True)
    photo = models.CharField(max_length=160, blank=True)
    video = models.CharField(max_length=160, blank=True)
    candid = models.CharField(max_length=160, blank=True)
    cinematic = models.CharField(max_length=160, blank=True)
    drone = models.CharField(max_length=160, blank=True)
    assistant = models.CharField(max_length=160, blank=True)
    bts = models.CharField(max_length=160, blank=True)
    date_status = models.CharField(max_length=20, default="Confirmed")
    tbd_month = models.CharField(max_length=7, blank=True)


class PhotographerDetail(OrganizationScopedModel):
    name = models.CharField(max_length=160)
    mobile = models.CharField(max_length=40, blank=True)
    living_in = models.CharField(max_length=120, blank=True)
    work = models.CharField(max_length=160, blank=True)
    status = models.CharField(max_length=30, default="Available")

    class Meta:
        ordering = ("name",)
