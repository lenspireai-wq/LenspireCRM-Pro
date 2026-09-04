from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [("production", "0008_clientportaluser")]

    operations = [
        migrations.AlterField(
            model_name="productionjob",
            name="booking",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="production_jobs",
                to="sales.booking",
            ),
        )
    ]
