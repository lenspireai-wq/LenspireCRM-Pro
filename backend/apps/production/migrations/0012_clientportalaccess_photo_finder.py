from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("production", "0011_productionjob_calendar_event")]

    operations = [
        migrations.AddField(
            model_name="clientportalaccess",
            name="photo_finder_status",
            field=models.CharField(default="Not Enabled", max_length=20),
        ),
        migrations.AddField(
            model_name="clientportalaccess",
            name="photo_finder_url",
            field=models.URLField(blank=True, max_length=500),
        ),
        migrations.AddField(
            model_name="clientportalaccess",
            name="photo_finder_requested_at",
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
