from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("production", "0004_productionactivity"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="ProductionDeliverable",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("name", models.CharField(max_length=80)),
                ("enabled", models.BooleanField(default=True)),
                ("quantity", models.PositiveIntegerField(default=1)),
                ("events", models.CharField(blank=True, max_length=250)),
                ("due_date", models.DateField(blank=True, null=True)),
                ("priority", models.CharField(default="Normal", max_length=20)),
                ("status", models.CharField(default="Unassigned", max_length=40)),
                ("drive_link", models.URLField(blank=True, max_length=500)),
                ("revision_notes", models.TextField(blank=True)),
                ("revision_count", models.PositiveIntegerField(default=0)),
                ("submitted_at", models.DateTimeField(blank=True, null=True)),
                ("approved_at", models.DateTimeField(blank=True, null=True)),
                ("editor", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="production_deliverables", to=settings.AUTH_USER_MODEL)),
                ("job", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="deliverables", to="production.productionjob")),
                ("organization", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to="core.organization")),
            ],
            options={"ordering": ("id",)},
        ),
        migrations.AddConstraint(
            model_name="productiondeliverable",
            constraint=models.UniqueConstraint(fields=("organization", "job", "name"), name="unique_production_deliverable_per_job"),
        ),
    ]
