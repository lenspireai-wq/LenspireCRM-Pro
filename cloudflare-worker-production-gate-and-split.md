# Post Production gate and Pre-wedding/Wedding split

This Worker change allows one booking to have separate `Pre-wedding`, `Engagement`, and `Wedding` production jobs. The desktop app only shows an eligible job after its event status is **Completed** and recorded payment is at least 50% of the booking value (10% advance + 40% first-shoot payment).

## Important

Make a Cloudflare Worker **version backup** before editing. Do not change Operations or Accounts permissions.

## 1. Add the segment helper

In `leadsApi`, add this function immediately **above** `async function leadsApi(...)`:

```js
function productionSegments(eventType) {
  const type = String(eventType || "").trim().toLowerCase();
  const hasPreWedding = /pre[-\s]?wedding/.test(type);
  const hasEngagement = /\bengagement\b/.test(type);
  const hasSeparateWedding = hasPreWedding && (/\+|&|\band\b|,|\//.test(type) || /\bwedding\b/.test(type.replace(/pre[-\s]?wedding/g, "")));
  const segments = [];
  if (hasPreWedding) segments.push("Pre-wedding");
  if (hasEngagement) segments.push("Engagement");
  if (hasSeparateWedding || (!hasPreWedding && !hasEngagement)) segments.push("Wedding");
  return segments;
}
```

## 2. Run the database upgrade during conversion

In the conversion route, find:

```js
if (!canWriteSales(user)) return json({ error: "Sales write access required" }, 403);
```

Directly below it add:

```js
await ensureCloudSchema(sql);
```

## 3. Allow two production jobs per booking

Inside `async function ensureCloudSchema(sql)`, immediately after this line:

```js
await sql`alter table production_jobs add column if not exists notes text`;
```

add:

```js
await sql`alter table production_jobs add column if not exists event_segment text`;
await sql`update production_jobs set event_segment = coalesce(nullif(event_segment, ''), 'Wedding') where event_segment is null or event_segment = ''`;
await sql`alter table production_jobs alter column event_segment set default 'Wedding'`;
await sql`alter table production_jobs alter column event_segment set not null`;
await sql`alter table production_jobs drop constraint if exists production_jobs_booking_id_key`;
await sql`create unique index if not exists production_jobs_booking_segment_unique on production_jobs (booking_id, event_segment)`;
```

## 4. Replace the production-job insert in the conversion route

Find the single line beginning with:

```js
await tx`insert into production_jobs (organization_id,booking_id,customer_id,stage,
```

Replace that one whole line with:

```js
for (const eventSegment of productionSegments(lead.event_type)) {
  await tx`insert into production_jobs (organization_id,booking_id,customer_id,event_segment,stage,raw_status,editing_status,album_status,video_status,delivery_status,due_date) values (${user.organization_id},${booking.id},${customer.id},${eventSegment},${"Shoot Planning"},${"Pending"},${"Not Started"},${"Not Started"},${"Not Started"},${"Pending"},${lead.event_date||null}) on conflict (booking_id,event_segment) do nothing`;
}
```

## 5. Preserve the separate jobs in Cloud backup restore

In the production restore insert, change:

```js
production_jobs (organization_id, booking_id, customer_id, stage,
```

to:

```js
production_jobs (organization_id, booking_id, customer_id, event_segment, stage,
```

Add this value immediately after `${r?.customer_id || null}` in its `values` list:

```js
${r?.event_segment || r?.eventSegment || "Wedding"},
```

Finally, change:

```js
on conflict (booking_id) do update
```

to:

```js
on conflict (booking_id,event_segment) do update
```

## 6. Deploy and test

Click **Deploy**, sign out/in to LenspireCRM, then test all three types:

1. `Only Wedding` → one `Wedding` post-production job.
2. `Only Pre-wedding` → one `Pre-wedding` post-production job.
3. `Pre-wedding + Wedding` → two independent jobs: `Pre-wedding` and `Wedding`.
4. `Engagement` → one independent `Engagement` job.

For each type, first mark the Operations event **Completed** and record at least 50% payment (10% advance + 40% first-shoot payment). Before both steps, the job must not appear in Post Production. Haldi and Mehendi jobs must not be created.
