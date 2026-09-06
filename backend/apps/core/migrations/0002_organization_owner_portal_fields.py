from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("core", "0001_initial")]

    operations = [
        migrations.AddField(model_name="organization", name="plan", field=models.CharField(choices=[("starter", "Starter"), ("professional", "Professional"), ("enterprise", "Enterprise")], default="starter", max_length=24)),
        migrations.AddField(model_name="organization", name="subscription_expires_at", field=models.DateField(blank=True, null=True)),
        migrations.AddField(model_name="organization", name="license_code", field=models.CharField(blank=True, max_length=80)),
        migrations.AddField(model_name="organization", name="logo_url", field=models.URLField(blank=True, max_length=500)),
        migrations.AddField(model_name="organization", name="contact_phone", field=models.CharField(blank=True, max_length=40)),
        migrations.AddField(model_name="organization", name="whatsapp_number", field=models.CharField(blank=True, max_length=40)),
        migrations.AddField(model_name="organization", name="contact_email", field=models.EmailField(blank=True, max_length=254)),
        migrations.AddField(model_name="organization", name="studio_address", field=models.TextField(blank=True)),
        migrations.AddField(model_name="organization", name="document_header", field=models.TextField(blank=True)),
        migrations.AddField(model_name="organization", name="document_footer", field=models.TextField(blank=True)),
    ]
