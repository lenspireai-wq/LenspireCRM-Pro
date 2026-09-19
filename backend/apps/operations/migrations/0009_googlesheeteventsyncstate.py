from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [("operations", "0008_remove_exact_duplicate_photographers")]

    operations = [
        migrations.CreateModel(
            name="GoogleSheetEventSyncState",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("crm_values", models.JSONField(blank=True, default=dict)),
                ("sheet_values", models.JSONField(blank=True, default=dict)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("event", models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name="google_sheet_sync_state", to="operations.calendarevent")),
            ],
        )
    ]
