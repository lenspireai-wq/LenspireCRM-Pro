from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):
    dependencies = [("production", "0007_clientportalaccess_closed_at")]
    operations = [
        migrations.CreateModel(name="ClientPortalUser", fields=[
            ("id",models.BigAutoField(auto_created=True,primary_key=True,serialize=False,verbose_name="ID")),("created_at",models.DateTimeField(auto_now_add=True)),("updated_at",models.DateTimeField(auto_now=True)),("name",models.CharField(max_length=150)),("email",models.EmailField(max_length=254)),("mobile",models.CharField(blank=True,max_length=30)),("password_hash",models.CharField(blank=True,max_length=256)),("invite_token_hash",models.CharField(blank=True,max_length=64)),("invite_expires_at",models.DateTimeField(blank=True,null=True)),("session_token_hash",models.CharField(blank=True,max_length=64)),("session_expires_at",models.DateTimeField(blank=True,null=True)),("last_login_at",models.DateTimeField(blank=True,null=True)),("active",models.BooleanField(default=True)),("booking",models.ForeignKey(on_delete=django.db.models.deletion.CASCADE,related_name="portal_users",to="sales.booking")),("organization",models.ForeignKey(on_delete=django.db.models.deletion.CASCADE,to="core.organization"))
        ],options={"constraints":[models.UniqueConstraint(fields=("organization","email"),name="unique_client_portal_email_per_org")]}),
    ]
