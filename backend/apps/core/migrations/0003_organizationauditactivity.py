from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [("core", "0002_organization_owner_portal_fields")]

    operations = [
        migrations.CreateModel(
            name="OrganizationAuditActivity",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("studio_name", models.CharField(max_length=120)),
                ("action", models.CharField(max_length=40)),
                ("description", models.TextField()),
                ("performed_by", models.CharField(max_length=150)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("organization", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="audit_activities", to="core.organization")),
            ],
            options={"ordering": ("-created_at", "-id")},
        ),
    ]
