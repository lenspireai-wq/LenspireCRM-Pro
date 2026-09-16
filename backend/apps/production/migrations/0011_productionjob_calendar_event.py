from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("operations", "0008_remove_exact_duplicate_photographers"),
        ("production", "0010_productiondeliverable_thumbnail_url"),
    ]

    operations = [
        migrations.AddField(
            model_name="productionjob",
            name="calendar_event",
            field=models.OneToOneField(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="production_job",
                to="operations.calendarevent",
            ),
        ),
    ]
