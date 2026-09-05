from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [("production", "0006_client_portal")]
    operations = [migrations.AddField(model_name="clientportalaccess", name="closed_at", field=models.DateTimeField(blank=True, null=True))]
