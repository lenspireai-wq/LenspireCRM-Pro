from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):
    dependencies = [("production", "0005_productiondeliverable")]
    operations = [
        migrations.CreateModel(name="ClientPortalAccess", fields=[("id",models.BigAutoField(auto_created=True,primary_key=True,serialize=False,verbose_name="ID")),("created_at",models.DateTimeField(auto_now_add=True)),("updated_at",models.DateTimeField(auto_now=True)),("token_hash",models.CharField(max_length=64,unique=True)),("expires_at",models.DateTimeField()),("revoked_at",models.DateTimeField(blank=True,null=True)),("last_accessed_at",models.DateTimeField(blank=True,null=True)),("access_count",models.PositiveIntegerField(default=0)),("booking",models.OneToOneField(on_delete=django.db.models.deletion.CASCADE,related_name="portal_access",to="sales.booking")),("organization",models.ForeignKey(on_delete=django.db.models.deletion.CASCADE,to="core.organization"))]),
        migrations.CreateModel(name="ClientPortalActivity", fields=[("id",models.BigAutoField(auto_created=True,primary_key=True,serialize=False,verbose_name="ID")),("created_at",models.DateTimeField(auto_now_add=True)),("updated_at",models.DateTimeField(auto_now=True)),("action",models.CharField(max_length=100)),("detail",models.TextField(blank=True)),("access",models.ForeignKey(on_delete=django.db.models.deletion.CASCADE,related_name="activities",to="production.clientportalaccess")),("booking",models.ForeignKey(on_delete=django.db.models.deletion.CASCADE,to="sales.booking")),("organization",models.ForeignKey(on_delete=django.db.models.deletion.CASCADE,to="core.organization"))],options={"ordering": ("-created_at","-id")}),
    ]
