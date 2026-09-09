from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("operations", "0005_alter_calendarevent_city"),
    ]

    operations = [
        migrations.AlterField(
            model_name="calendarevent",
            name="contact_no",
            field=models.CharField(blank=True, max_length=200),
        ),
    ]
