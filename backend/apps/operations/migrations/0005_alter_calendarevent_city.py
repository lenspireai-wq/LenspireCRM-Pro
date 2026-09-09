from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("operations", "0004_backfill_confirmed_lead_details"),
    ]

    operations = [
        migrations.AlterField(
            model_name="calendarevent",
            name="city",
            field=models.TextField(blank=True),
        ),
    ]
