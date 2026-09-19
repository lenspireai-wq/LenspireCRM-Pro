# Google Sheets event mirror setup

The CRM mirrors calendar events to these tabs in the configured spreadsheet:

- `Upcoming Events` for all non-completed events
- `Completed Events` after an event is marked completed

The CRM is the source of truth. Sheet edits are not imported back into the CRM.

## Production setup

1. In Google Cloud, create a service account and enable the Google Sheets API.
2. Create a JSON key for that service account.
3. Share the target spreadsheet with the service-account email as an Editor.
4. Base64-encode the complete JSON key and add these environment variables to
   `/docker/lenspire-crm-django/.env` on the production VPS:

```text
GOOGLE_SHEETS_SYNC_SPREADSHEET_ID=1Wm3o99vBTuuGiTc8TPhH51T0vKET8mwgskeXxvKdxLk
GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON_B64=<base64-encoded JSON key>
```

For PowerShell, create the base64 value without changing the JSON file:

```powershell
[Convert]::ToBase64String([System.IO.File]::ReadAllBytes("C:\path\service-account.json"))
```

Do not commit the JSON key or the base64 value to Git.

The first CRM event save adds a `CRM Event ID` column to each target tab. That stable ID lets later updates move an event between Upcoming and Completed without creating duplicate records.
