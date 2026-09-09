from django.db import migrations


def remove_exact_duplicates(apps, schema_editor):
    PhotographerDetail = apps.get_model("operations", "PhotographerDetail")
    seen = set()
    delete_ids = []

    # Only remove rows that are identical in every user-facing field. This
    # deliberately preserves different photographers who happen to share a
    # name, city, job type, or contact number.
    for photographer in PhotographerDetail.objects.all().order_by("organization_id", "id").iterator():
        identity = (
            photographer.organization_id,
            photographer.name.strip().casefold(),
            photographer.mobile.strip(),
            photographer.living_in.strip().casefold(),
            photographer.work.strip().casefold(),
            photographer.status.strip().casefold(),
        )
        if identity in seen:
            delete_ids.append(photographer.id)
        else:
            seen.add(identity)

    if delete_ids:
        PhotographerDetail.objects.filter(id__in=delete_ids).delete()


class Migration(migrations.Migration):
    dependencies = [("operations", "0007_calendarevent_is_archived")]

    operations = [migrations.RunPython(remove_exact_duplicates, migrations.RunPython.noop)]
