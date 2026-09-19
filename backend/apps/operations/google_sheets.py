"""One-way Google Sheets mirror for operational calendar events.

The CRM remains authoritative.  This module is deliberately a no-op until a
dedicated service account and target spreadsheet are configured in production.
"""

import base64
import json
import logging
from datetime import date

from django.conf import settings


logger = logging.getLogger(__name__)
UPCOMING_TAB = "Upcoming Events"
COMPLETED_TAB = "Completed Events"
CRM_ID_HEADER = "CRM Event ID"


def is_configured() -> bool:
    return bool(
        settings.GOOGLE_SHEETS_SYNC_SPREADSHEET_ID
        and settings.GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON_B64
    )


def target_tab(event) -> str:
    return COMPLETED_TAB if str(event.status).casefold() == "completed" else UPCOMING_TAB


def _header_key(value) -> str:
    return "".join(character for character in str(value or "").casefold() if character.isalnum())


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
        "eventtype": event.event_type,
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


def _find_event_row(rows, id_column, event_id):
    for index, row in enumerate(rows[1:], start=2):
        if len(row) > id_column and str(row[id_column]) == str(event_id):
            return index
    return None


def sync_calendar_event(event) -> bool:
    """Upsert an event into the appropriate mirror tab and clear an old copy."""
    if not is_configured():
        return False
    try:
        service = _sheet_service()
        spreadsheet_id = settings.GOOGLE_SHEETS_SYNC_SPREADSHEET_ID
        values_api = service.spreadsheets().values()
        destination = target_tab(event)
        for tab in (UPCOMING_TAB, COMPLETED_TAB):
            rows = _tab_rows(values_api, spreadsheet_id, tab)
            headers, rows, id_column = _ensure_crm_id_column(
                values_api, spreadsheet_id, tab, rows
            )
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
        for tab in (UPCOMING_TAB, COMPLETED_TAB):
            rows = _tab_rows(values_api, spreadsheet_id, tab)
            headers, rows, id_column = _ensure_crm_id_column(values_api, spreadsheet_id, tab, rows)
            matching_row = _find_event_row(rows, id_column, event.id)
            if matching_row:
                values_api.clear(
                    spreadsheetId=spreadsheet_id,
                    range=f"'{tab}'!A{matching_row}:ZZ{matching_row}",
                ).execute()
        return True
    except Exception:
        logger.exception("Unable to remove calendar event %s from Google Sheets", event.id)
        return False
