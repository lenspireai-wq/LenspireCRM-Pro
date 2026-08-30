# Cloudflare Worker fix: Post Production editor dropdown

In the deployed Worker, replace the beginning of `usersApi` with this version.
It keeps all user-management actions Administrator-only, but allows a Post
Production user with full department access to read the limited active team list
needed by the Edit Queue assignment dropdown.

```js
async function usersApi(request, env, pathname) {
  const sql = getDatabase(env);
  try {
    const user = await requireUser(request, env, sql);
    if (!user) return json({ error: 'Authentication required' }, 401);

    const canReadPostProductionUsers = user.role === 'Administrator' ||
      (['Post Production', 'Editor'].includes(user.role) &&
       normalizeDepartmentAccess(user.department_access, user.role).postProduction === 'full');

    if (request.method === 'GET' && pathname === '/api/users') {
      if (!canReadPostProductionUsers) return json({ error: 'Administrator or Post Production access required' }, 403);

      const rows = user.role === 'Administrator'
        ? await sql`
            select id, username, display_name, role, department_access, active, last_login, created_at
            from users where organization_id = ${user.organization_id}
            order by active desc, display_name`
        : await sql`
            select id, username, display_name, role, department_access, active, last_login, created_at
            from users
            where organization_id = ${user.organization_id}
              and active = true
              and role in ('Post Production', 'Editor')
            order by display_name`;

      return json({ users: rows.map(mapUser) });
    }

    if (user.role !== 'Administrator') return json({ error: 'Administrator access required' }, 403);
    // Keep the rest of the existing usersApi function unchanged below this line.
```

Deploy the Worker after saving. Anuj Singh and Aarzoo Singh must each have
Post Production department access set to Full Access in Team Management.
