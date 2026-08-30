# Sales conversion sync fix

This change lets a Sales user create the *connected* records for a confirmed lead while keeping Operations, Accounts, and Post Production permissions unchanged.  It does **not** give Sales users the ability to create, edit, or delete unrelated Operations events.

## 1. Open the Worker

In Cloudflare, open **Workers & Pages** → **lenspirecrm-api** → **Edit code**.

## 2. Find the lead conversion block

Search for this exact line in `leadsApi`:

```js
const booking = bookingRows[0];
```

Immediately below it, replace the existing block from the `production_jobs` insert through the `converted = { ... }` line with this block:

```js
const eventDate = lead.event_date || new Date().toISOString().slice(0, 10);
let eventRows = await tx`
  select * from calendar_events
  where booking_id=${booking.id} and organization_id=${user.organization_id}
  limit 1
`;
if (!eventRows.length) eventRows = await tx`
  insert into calendar_events (
    organization_id, booking_id, customer_id, title, event_type, start_date,
    city, status, notes, client_name, handled_by, couple_name, contact_no,
    slotted, date_status
  ) values (
    ${user.organization_id}, ${booking.id}, ${customer.id},
    ${`${lead.name || "Client"} · ${lead.event_type || "Event"}`},
    ${lead.event_type || "Shoot"}, ${eventDate}, ${lead.city || null},
    ${"Scheduled"}, ${lead.notes || null}, ${lead.client_name || lead.name || null},
    ${lead.assigned_to || null}, ${lead.couple_name || null},
    ${lead.mobile || lead.client_mobile || null}, ${false}, ${"Confirmed"}
  ) returning *
`;
const calendarEvent = eventRows[0];

await tx`insert into production_jobs (organization_id,booking_id,customer_id,stage,raw_status,editing_status,album_status,video_status,delivery_status,due_date) values (${user.organization_id},${booking.id},${customer.id},${"Shoot Planning"},${"Pending"},${"Not Started"},${"Not Started"},${"Not Started"},${"Pending"},${lead.event_date||null}) on conflict (booking_id) do nothing`;
const paymentRows = await tx`select id from payments where booking_id=${booking.id} and organization_id=${user.organization_id} limit 1`;
if (quoted>0 && !paymentRows.length) await tx`insert into payments (organization_id,booking_id,customer_id,amount,payment_type,status,due_date) values (${user.organization_id},${booking.id},${customer.id},${Math.round(quoted*.3)},${"Advance"},${"Pending"},${lead.event_date||null})`;
await tx`update leads set status=${"Confirmed"} where id=${leadId} and organization_id=${user.organization_id}`;
converted = { customerId: customer.id, bookingId: booking.id, eventId: calendarEvent.id, customerCode: customer.customer_code, bookingCode: booking.booking_code };
```

## 3. Deploy and verify

Click **Deploy**. Then sign out and sign back in to the desktop app.

Test using a Sales user whose Operations access is `view`:

1. Add or change a lead to **Confirmed**.
2. Confirm that the lead appears in Sales, the customer/booking appears in Accounts, the job appears in Post Production, and its event appears in Operations.
3. Confirm the same Sales user still cannot add, edit, or delete unrelated Operations events.

The desktop fix in version 1.0.11 stops it from calling the general Operations event endpoint after conversion, so the Worker change above is required before installing that version.
