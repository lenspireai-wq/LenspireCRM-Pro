"""One-way Google Sheets mirror for operational calendar events.

The CRM remains authoritative.  This module is deliberately a no-op until a
dedicated service account and target spreadsheet are configured in production.
"""

import base64
import json
import logging
from datetime import date, datetime

from django.conf import settings


logger = logging.getLogger(__name__)
UPCOMING_TAB = "Upcoming Events"
COMPLETED_TAB = "Completed Events"
CRM_ID_HEADER = "CRM Event ID"
SHEET_EVENT_FIELDS = {
    "date": "start_date",
    "clientname": "client_name",
    "handledby": "handled_by",
    "couplename": "couple_name",
    "contactno": "contact_no",
    "event": "event_type",
    "photo": "photo",
    "video": "video",
    "candid": "candid",
    "cinematic": "cinematic",
    "drone": "drone",
    "assistant": "assistant",
    "bts": "bts",
    "venue": "city",
    "time": "start_time",
    "notes": "notes",
}


def is_configured() -> bool:
    return bool(
        settings.GOOGLE_SHEETS_SYNC_SPREADSHEET_ID
        and settings.GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON_B64
    )


def target_tab(event) -> str:
    return COMPLETED_TAB if str(event.status).casefold() == "completed" else UPCOMING_TAB


def _header_key(value) -> str:
    return "".join(character for character in str(value or "").casefold() if character.isalnum())


def _event_values(event):
    """Canonical comparison values for the columns staff can edit in Sheets."""
    return {
        "start_date": event.start_date.isoformat() if event.start_date else "",
        "client_name": event.client_name or "",
        "handled_by": event.handled_by or "",
        "couple_name": event.couple_name or "",
        "contact_no": event.contact_no or "",
        "event_type": event.event_type or "",
        "photo": event.photo or "",
        "video": event.video or "",
        "candid": event.candid or "",
        "cinematic": event.cinematic or "",
        "drone": event.drone or "",
        "assistant": event.assistant or "",
        "bts": event.bts or "",
        "city": event.city or "",
        "start_time": event.start_time.isoformat() if event.start_time else "",
        "notes": event.notes or "",
    }


def _record_sync_state(events):
    from .models import GoogleSheetEventSyncState

    for event in events:
        values = _event_values(event)
        GoogleSheetEventSyncState.objects.update_or_create(
            event=event, defaults={"crm_values": values, "sheet_values": values}
        )


def event_row(headers, event, serial_number=0):
    """Map known sheet headings without changing a studio's existing layout."""
    event_date = event.start_date.isoformat() if event.start_date else ""
    booking_code = event.booking.booking_code if event.booking_id else ""
    assigned_to = (
        event.assigned_user.display_name or event.assigned_user.username
        if event.assigned_user_id
        else event.handled_by
    )
    values = {
        "srno": serial_number,
        "crmeventid": event.id,
        "id": event.id,
        "title": event.title,
        "clientname": event.client_name,
        "couplename": event.couple_name,
        "contactno": event.contact_no,
        "event": event.event_type,
        "eventtype": event.event_type,
        "date": event_date,
        "eventdate": event_date,
        "startdate": event_date,
        "starttime": event.start_time.isoformat() if event.start_time else "",
        "endtime": event.end_time.isoformat() if event.end_time else "",
        "city": event.city,
        "status": event.status,
        "datestatus": event.date_status,
        "assignedto": assigned_to,
        "handledby": event.handled_by,
        "bookingcode": booking_code,
        "photographer": event.photo,
        "photo": event.photo,
        "video": event.video,
        "candid": event.candid,
        "cinematic": event.cinematic,
        "drone": event.drone,
        "assistant": event.assistant,
        "bts": event.bts,
        "notes": event.notes,
    }
    return [values.get(_header_key(header), "") for header in headers]


def _sheet_service():
    encoded = settings.GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON_B64
    info = json.loads(base64.b64decode(encoded).decode("utf-8"))
    from google.oauth2.service_account import Credentials
    from googleapiclient.discovery import build

    credentials = Credentials.from_service_account_info(
        info,
        scopes=("https://www.googleapis.com/auth/spreadsheets",),
    )
    return build("sheets", "v4", credentials=credentials, cache_discovery=False)


def _tab_rows(values_api, spreadsheet_id, tab):
    return values_api.get(
        spreadsheetId=spreadsheet_id,
        range=f"'{tab}'!A:ZZ",
    ).execute().get("values", [])


def _ensure_crm_id_column(values_api, spreadsheet_id, tab, rows):
    headers = list(rows[0]) if rows else []
    if CRM_ID_HEADER not in headers:
        headers.append(CRM_ID_HEADER)
        values_api.update(
            spreadsheetId=spreadsheet_id,
            range=f"'{tab}'!1:1",
            valueInputOption="RAW",
            body={"values": [headers]},
        ).execute()
        rows = [headers, *rows[1:]] if rows else [headers]
    return headers, rows, headers.index(CRM_ID_HEADER)


def _hide_crm_id_columns(service, spreadsheet_id, tab_columns):
    """Keep the internal upsert key available but out of the staff-facing view."""
    sheets = service.spreadsheets().get(
        spreadsheetId=spreadsheet_id,
        fields="sheets.properties(sheetId,title)",
    ).execute().get("sheets", [])
    sheet_ids = {
        sheet["properties"]["title"]: sheet["properties"]["sheetId"]
        for sheet in sheets
    }
    requests = [
        {
            "updateDimensionProperties": {
                "range": {
                    "sheetId": sheet_ids[tab],
                    "dimension": "COLUMNS",
                    "startIndex": column,
                    "endIndex": column + 1,
                },
                "properties": {"hiddenByUser": True},
                "fields": "hiddenByUser",
            }
        }
        for tab, column in tab_columns.items()
        if tab in sheet_ids
    ]
    if requests:
        service.spreadsheets().batchUpdate(
            spreadsheetId=spreadsheet_id,
            body={"requests": requests},
        ).execute()


def _find_event_row(rows, id_column, event_id):
    for index, row in enumerate(rows[1:], start=2):
        if len(row) > id_column and str(row[id_column]) == str(event_id):
            return index
    return None


def _parse_sheet_date(value):
    text = str(value or "").strip()
    if not text:
        return None
    for pattern in ("%Y-%m-%d", "%d-%b-%Y", "%d-%b-%y", "%d/%m/%Y", "%d-%m-%Y"):
        try:
            return datetime.strptime(text, pattern).date()
        except ValueError:
            continue
    raise ValueError(f"Invalid Date value: {value!r}")


def _parse_sheet_time(value):
    text = str(value or "").strip()
    if not text:
        return None
    for pattern in ("%H:%M", "%H:%M:%S", "%I:%M %p", "%I:%M%p"):
        try:
            return datetime.strptime(text.upper(), pattern).time()
        except ValueError:
            continue
    raise ValueError(f"Invalid Time value: {value!r}")


def _sheet_row_values(headers, row):
    values = {}
    for index, header in enumerate(headers):
        field = SHEET_EVENT_FIELDS.get(_header_key(header))
        if not field:
            continue
        raw_value = row[index] if index < len(row) else ""
        if field == "start_date":
            values[field] = _parse_sheet_date(raw_value)
        elif field == "start_time":
            values[field] = _parse_sheet_time(raw_value)
        else:
            values[field] = str(raw_value or "").strip()
    return values


def _comparable_values(values):
    comparable = {}
    for field, value in values.items():
        if isinstance(value, (date, datetime)):
            comparable[field] = value.isoformat()
        elif value is None:
            comparable[field] = ""
        else:
            comparable[field] = str(value)
    return comparable


def import_calendar_events_from_sheet():
    """Pull staff edits from both tabs. CRM wins only when both sides changed."""
    if not is_configured():
        return {"created": 0, "updated": 0, "conflicts": 0, "skipped": 0}

    from apps.core.models import Organization
    from .models import CalendarEvent, GoogleSheetEventSyncState

    created = updated = conflicts = skipped = 0
    try:
        service = _sheet_service()
        spreadsheet_id = settings.GOOGLE_SHEETS_SYNC_SPREADSHEET_ID
        values_api = service.spreadsheets().values()
        organizations = list(Organization.objects.filter(active=True))
        for tab in (UPCOMING_TAB, COMPLETED_TAB):
            rows = _tab_rows(values_api, spreadsheet_id, tab)
            if not rows:
                continue
            headers = rows[0]
            id_column = next((index for index, header in enumerate(headers) if _header_key(header) == "crmeventid"), None)
            for row in rows[1:]:
                event_id = row[id_column] if id_column is not None and id_column < len(row) else ""
                try:
                    incoming = _sheet_row_values(headers, row)
                except ValueError:
                    skipped += 1
                    continue
                if not incoming:
                    continue
                if event_id:
                    try:
                        event = CalendarEvent.objects.filter(pk=int(event_id), is_archived=False).first()
                    except (TypeError, ValueError):
                        skipped += 1
                        continue
                    if not event:
                        skipped += 1
                        continue
                    current = _event_values(event)
                    incoming_values = _comparable_values(incoming)
                    state = GoogleSheetEventSyncState.objects.filter(event=event).first()
                    if state:
                        crm_changed = any(current[field] != state.crm_values.get(field, "") for field in incoming_values)
                        sheet_changed = any(incoming_values[field] != state.sheet_values.get(field, "") for field in incoming_values)
                        if crm_changed and sheet_changed:
                            _record_sync_state([event])
                            conflicts += 1
                            continue
                        if not sheet_changed:
                            continue
                    if any(current[field] != incoming_values[field] for field in incoming_values):
                        for field, value in incoming.items():
                            setattr(event, field, value)
                        event.save(update_fields=[*incoming.keys(), "updated_at"])
                        updated += 1
                    _record_sync_state([event])
                    continue

                if len(organizations) != 1:
                    skipped += 1
                    continue
                client_name = incoming.get("client_name", "")
                event_type = incoming.get("event_type", "Shoot") or "Shoot"
                if not client_name and not incoming.get("couple_name"):
                    skipped += 1
                    continue
                event = CalendarEvent.objects.create(
                    organization=organizations[0],
                    title=f"{client_name or incoming.get('couple_name')} · {event_type}",
                    **incoming,
                )
                _record_sync_state([event])
                created += 1
    except Exception:
        logger.exception("Unable to import calendar events from Google Sheets")
        skipped += 1
    return {"created": created, "updated": updated, "conflicts": conflicts, "skipped": skipped}


def sync_calendar_event(event) -> bool:
    """Upsert an event into the appropriate mirror tab and clear an old copy."""
    if not is_configured():
        return False
    try:
        service = _sheet_service()
        spreadsheet_id = settings.GOOGLE_SHEETS_SYNC_SPREADSHEET_ID
        values_api = service.spreadsheets().values()
        destination = target_tab(event)
        id_columns = {}
        for tab in (UPCOMING_TAB, COMPLETED_TAB):
            rows = _tab_rows(values_api, spreadsheet_id, tab)
            headers, rows, id_column = _ensure_crm_id_column(
                values_api, spreadsheet_id, tab, rows
            )
            id_columns[tab] = id_column
            matching_row = _find_event_row(rows, id_column, event.id)
            if tab != destination:
                if matching_row:
                    values_api.clear(
                        spreadsheetId=spreadsheet_id,
                        range=f"'{tab}'!A{matching_row}:ZZ{matching_row}",
                    ).execute()
                continue
            row = event_row(headers, event, serial_number=matching_row - 1 if matching_row else len(rows))
            if matching_row:
                values_api.update(
                    spreadsheetId=spreadsheet_id,
                    range=f"'{tab}'!A{matching_row}",
                    valueInputOption="RAW",
                    body={"values": [row]},
                ).execute()
            else:
                values_api.append(
                    spreadsheetId=spreadsheet_id,
                    range=f"'{tab}'!A:ZZ",
                    valueInputOption="RAW",
                    insertDataOption="INSERT_ROWS",
                    body={"values": [row]},
                ).execute()
        _hide_crm_id_columns(service, spreadsheet_id, id_columns)
        _record_sync_state([event])
        return True
    except Exception:
        # A temporary Google outage must never prevent staff from saving CRM work.
        logger.exception("Unable to mirror calendar event %s to Google Sheets", event.id)
        return False


def remove_calendar_event(event) -> bool:
    """Clear a deleted event from both mirror tabs by its stable CRM ID."""
    if not is_configured():
        return False
    try:
        service = _sheet_service()
        spreadsheet_id = settings.GOOGLE_SHEETS_SYNC_SPREADSHEET_ID
        values_api = service.spreadsheets().values()
        id_columns = {}
        for tab in (UPCOMING_TAB, COMPLETED_TAB):
            rows = _tab_rows(values_api, spreadsheet_id, tab)
            headers, rows, id_column = _ensure_crm_id_column(values_api, spreadsheet_id, tab, rows)
            id_columns[tab] = id_column
            matching_row = _find_event_row(rows, id_column, event.id)
            if matching_row:
                values_api.clear(
                    spreadsheetId=spreadsheet_id,
                    range=f"'{tab}'!A{matching_row}:ZZ{matching_row}",
                ).execute()
        _hide_crm_id_columns(service, spreadsheet_id, id_columns)
        return True
    except Exception:
        logger.exception("Unable to remove calendar event %s from Google Sheets", event.id)
        return False


def sync_all_calendar_events(events) -> int:
    """Efficiently seed or reconcile all active CRM events in the mirror."""
    if not is_configured():
        return 0
    try:
        events = list(events)
        service = _sheet_service()
        spreadsheet_id = settings.GOOGLE_SHEETS_SYNC_SPREADSHEET_ID
        values_api = service.spreadsheets().values()
        tabs = {}
        for tab in (UPCOMING_TAB, COMPLETED_TAB):
            rows = _tab_rows(values_api, spreadsheet_id, tab)
            headers, rows, id_column = _ensure_crm_id_column(
                values_api, spreadsheet_id, tab, rows
            )
            tabs[tab] = {"headers": headers, "rows": rows, "id_column": id_column}
        _hide_crm_id_columns(
            service,
            spreadsheet_id,
            {tab: data["id_column"] for tab, data in tabs.items()},
        )

        active_ids = {str(event.id) for event in events}
        updates, clears, appends = [], [], {UPCOMING_TAB: [], COMPLETED_TAB: []}
        for tab, data in tabs.items():
            for row_number, row in enumerate(data["rows"][1:], start=2):
                if len(row) > data["id_column"] and str(row[data["id_column"]]) in active_ids:
                    clears.append(f"'{tab}'!A{row_number}:ZZ{row_number}")

        for event in events:
            tab = target_tab(event)
            data = tabs[tab]
            matching_row = _find_event_row(data["rows"], data["id_column"], event.id)
            row = event_row(
                data["headers"],
                event,
                serial_number=matching_row - 1 if matching_row else len(data["rows"]) + len(appends[tab]),
            )
            if matching_row:
                updates.append({"range": f"'{tab}'!A{matching_row}", "values": [row]})
                clears.remove(f"'{tab}'!A{matching_row}:ZZ{matching_row}")
            else:
                appends[tab].append(row)

        if clears:
            values_api.batchClear(
                spreadsheetId=spreadsheet_id, body={"ranges": clears}
            ).execute()
        if updates:
            values_api.batchUpdate(
                spreadsheetId=spreadsheet_id,
                body={"valueInputOption": "RAW", "data": updates},
            ).execute()
        for tab, rows in appends.items():
            if rows:
                values_api.append(
                    spreadsheetId=spreadsheet_id,
                    range=f"'{tab}'!A:ZZ",
                    valueInputOption="RAW",
                    insertDataOption="INSERT_ROWS",
                    body={"values": rows},
                ).execute()
        _record_sync_state(events)
        return len(events)
    except Exception:
        logger.exception("Unable to bulk mirror calendar events to Google Sheets")
        return 0
