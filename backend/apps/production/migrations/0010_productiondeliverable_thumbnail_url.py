from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("production", "0009_allow_multiple_jobs_per_booking")]

    operations = [
        migrations.AddField(
            model_name="productiondeliverable",
            name="thumbnail_url",
            field=models.URLField(blank=True, max_length=500),
        ),
    ]
