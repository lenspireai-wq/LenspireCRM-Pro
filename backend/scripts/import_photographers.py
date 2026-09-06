"""Import tab-separated photographer details without creating duplicates."""

from __future__ import annotations

import argparse
import os
import re
import sys
from pathlib import Path

import django


BACKEND_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND_DIR))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "lenspirecrm.settings")
django.setup()

from django.db import transaction  # noqa: E402

from apps.core.models import Organization  # noqa: E402
from apps.operations.models import PhotographerDetail  # noqa: E402


def normalized_mobile(value: str) -> str:
    digits = "".join(character for character in value if character.isdigit())
    return digits[-10:]


def read_rows(source: Path) -> list[dict[str, str]]:
    records: list[dict[str, str]] = []
    for raw_line in source.read_text(encoding="utf-8-sig").splitlines():
        if not re.match(r"^\d+\t", raw_line):
            continue
        cells = [cell.strip() for cell in raw_line.split("\t")]
        if len(cells) < 6:
            continue
        _, name, mobile, living_in, work, status, *_ = cells
        records.append(
            {
                "name": name,
                "mobile": mobile,
                "living_in": living_in.title(),
                "work": work,
                "status": status,
            }
        )
    return records


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("--organization", type=int)
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()

    organizations = Organization.objects.all()
    if args.organization:
        organization = organizations.get(pk=args.organization)
    elif organizations.count() == 1:
        organization = organizations.get()
    else:
        raise SystemExit("Specify --organization when the database has multiple organizations.")

    source_rows = read_rows(args.source)
    existing = list(PhotographerDetail.objects.filter(organization=organization))
    existing_names = {item.name.strip().casefold() for item in existing}
    existing_mobiles = {
        normalized_mobile(item.mobile) for item in existing if normalized_mobile(item.mobile)
    }
    seen_names: set[str] = set()
    seen_mobiles: set[str] = set()
    pending: list[PhotographerDetail] = []
    skipped: list[str] = []

    for row in source_rows:
        name_key = row["name"].strip().casefold()
        mobile_key = normalized_mobile(row["mobile"])
        duplicate_source = name_key in seen_names or (
            mobile_key and mobile_key in seen_mobiles
        )
        duplicate_database = name_key in existing_names or (
            mobile_key and mobile_key in existing_mobiles
        )
        if duplicate_source or duplicate_database:
            reason = "source duplicate" if duplicate_source else "already in database"
            skipped.append(f'{row["name"]} ({row["mobile"]}) — {reason}')
            continue
        seen_names.add(name_key)
        if mobile_key:
            seen_mobiles.add(mobile_key)
        pending.append(PhotographerDetail(organization=organization, **row))

    print(f"Organization: {organization.name} (ID {organization.id})")
    print(f"Parsed rows: {len(source_rows)}")
    print(f"New unique rows: {len(pending)}")
    print(f"Skipped rows: {len(skipped)}")
    for item in skipped:
        print(f"  SKIP {item}")

    if not args.apply:
        print("Dry run only. Re-run with --apply to insert the new rows.")
        return

    with transaction.atomic():
        PhotographerDetail.objects.bulk_create(pending)
    print(f"Inserted: {len(pending)}")
    print(
        "Photographer total: "
        f"{PhotographerDetail.objects.filter(organization=organization).count()}"
    )


if __name__ == "__main__":
    main()
