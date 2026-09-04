from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("core", "0004_emaillog")]

    operations = [
        migrations.CreateModel(
            name="LegacyRecordMap",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("source_table", models.CharField(max_length=80)),
                ("source_id", models.CharField(max_length=80)),
                ("target_model", models.CharField(max_length=120)),
                ("target_pk", models.CharField(max_length=80)),
                ("imported_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "constraints": [
                    models.UniqueConstraint(fields=("source_table", "source_id"), name="unique_legacy_source_row")
                ]
            },
        )
    ]
