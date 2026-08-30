# LenspireCRM multi-studio organization branding

## Current status

The Worker already isolates CRM data by `organization_id`. Its login token includes the organization ID, and all leads, bookings, events, payments, production jobs, users, files, and backups are queried within that organization.

The remaining platform change is to return the organization name at sign-in. The desktop app then displays the customer workspace name while retaining **Powered by LenspireCRM** and the LenspireCRM copyright notice.

## Safe Worker change

In the `login` function, replace the user lookup with this query:

```js
const [user] = await sql`
  select u.id, u.organization_id, u.username, u.display_name, u.role,
         u.department_access, u.password_hash, u.password_salt,
         u.password_iterations, o.name as organization_name
  from users u
  join organizations o on o.id = u.organization_id
  where lower(u.username) = lower(${username}) and u.active = true
  limit 1
`;
```

Then add the organization object next to `user` in the successful login response:

```js
organization: { id: user.organization_id, name: user.organization_name },
```

This is read-only: it does not move, delete, or edit any studio record.

## Create Ankit Studios as the first tenant

Do this only after exporting a Cloud backup and confirming the exact current organization row in Neon. The migration must be one database transaction:

1. Create an **Ankit Studios** organization record.
2. Update the current Ankit users and all existing CRM tables to its new `organization_id`.
3. Verify equal record counts before and after for leads, customers, bookings, events, payments, production jobs, activities, team users, files, and integrations.
4. Keep the original **LenspireCRM** organization as the provider/platform organization; do not delete it.

Do not run an unscoped `UPDATE` against an organization table. The exact migration SQL must be generated only after the Neon table definition and current organization IDs are read.

## New photographer onboarding

For every future studio, LenspireCRM creates:

- one organization;
- one administrator login in that organization;
- the studio branding/configuration;
- an empty, isolated workspace.

All requests continue to derive organization scope from the signed access token, never from a browser or desktop value supplied by the user.
