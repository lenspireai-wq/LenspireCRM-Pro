const baseUrl = String(process.env.LENSPIRE_API_URL || 'https://lenspirecrm-api.lenspirecrm-worker.workers.dev').replace(/\/$/, '');
let accessToken = String(process.env.LENSPIRE_OWNER_ACCESS_TOKEN || '').trim();

async function request(path, options = {}) {
  const headers = new Headers(options.headers || {});
  if (accessToken) headers.set('authorization', `Bearer ${accessToken}`);
  const response = await fetch(baseUrl + path, { ...options, headers });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`${path} returned HTTP ${response.status}: ${result.error || 'request failed'}`);
  return result;
}

(async () => {
  const health = await request('/api/health');
  const database = await request('/api/db-health');
  if (!accessToken) {
    const username = String(process.env.LENSPIRE_SMOKE_USERNAME || '').trim();
    const password = String(process.env.LENSPIRE_SMOKE_PASSWORD || '');
    if (!username || !password) throw new Error('Set LENSPIRE_OWNER_ACCESS_TOKEN, or set LENSPIRE_SMOKE_USERNAME and LENSPIRE_SMOKE_PASSWORD for this shell only.');
    const login = await request('/api/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-lenspire-web': '1' },
      body: JSON.stringify({ username, password })
    });
    accessToken = String(login.accessToken || '');
    if (!accessToken) throw new Error('Owner login did not return an access token.');
  }
  const workspace = await request('/api/workspace');
  const smoke = await request('/api/platform/smoke-tests');
  if (!smoke.ok) throw new Error(`Production smoke checks failed: ${JSON.stringify(smoke.checks)}`);
  console.log(`production-smoke\tok=true\tschema=${smoke.schemaVersion}\tleads=${workspace.leads?.length || 0}\tdatabase=${database.database}\tservice=${health.service}`);
})().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
}).finally(() => {
  accessToken = '';
});
