# Post Production HTTP 500 fix

The Worker currently sends an empty due date (`""`) to the PostgreSQL `date` field. PostgreSQL rejects that value, which becomes HTTP 500. This fix stores a missing due date as `null`.

## Steps

1. In Cloudflare open **Workers & Pages** → **lenspirecrm-api** → **Edit code**.
2. Press `Ctrl + F` and search for this exact line:

```js
dueDate: raw.dueDate ?? raw.due_date ?? existing.due_date ?? null,
```

3. Replace it with:

```js
dueDate: String(raw.dueDate ?? raw.due_date ?? existing.due_date ?? "").trim() || null,
```

4. Click **Deploy**.
5. Sign out and sign in again in LenspireCRM, then save the Post Production job again.

This does not change user access or existing records; it only handles a blank due date correctly.
