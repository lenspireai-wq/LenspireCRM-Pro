from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("users", "0005_usernotificationpreference"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="profile_photo",
            field=models.FileField(blank=True, upload_to="profile-photos/%Y/%m/"),
        ),
    ]
