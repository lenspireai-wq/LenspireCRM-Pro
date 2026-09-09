from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("operations", "0006_alter_calendarevent_contact_no")]

    operations = [
        migrations.AddField(
            model_name="calendarevent",
            name="is_archived",
            field=models.BooleanField(default=False),
        ),
    ]
