const endpoint = String(process.env.LENSPIRE_API_URL || 'https://lenspirecrm-api.lenspirecrm-worker.workers.dev').replace(/\/$/, '');
const accessToken = String(process.env.LENSPIRE_OWNER_ACCESS_TOKEN || '').trim();

if (!accessToken) {
  console.error('Usage: set LENSPIRE_OWNER_ACCESS_TOKEN to a current owner access token, then run npm run migrate:cloud');
  process.exit(1);
}

(async () => {
  const response = await fetch(`${endpoint}/api/platform/migrations`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${accessToken}`,
      'content-type': 'application/json'
    },
    body: '{}'
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || `Migration request failed with HTTP ${response.status}`);
  console.log(`cloud-migrations\tversion=${result.currentVersion}\tapplied=${(result.applied || []).join(',') || 'none'}`);
})().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
