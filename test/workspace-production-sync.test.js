const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const source = fs.readFileSync(path.resolve(__dirname, '..', 'index.js'), 'utf8');

test('completed-event sync reuses production placeholders without a uniqueness failure', () => {
  const start = source.indexOf('async function syncCompletedEventsToProduction');
  const end = source.indexOf('__name(syncCompletedEventsToProduction', start);
  const implementation = source.slice(start, end);
  assert.match(implementation, /select distinct on \(e\.id\)/);
  assert.match(implementation, /e\.id = \$\{sourceEventId\}/);
  assert.match(implementation, /source_event_id is null and event_segment=\$\{"Wedding"\}/);
  assert.match(implementation, /update production_jobs set event_segment=\$\{segment\}, source_event_id=\$\{event\.id\}/);
  assert.match(implementation, /where organization_id=\$\{organizationId\} and source_event_id=\$\{event\.id\} limit 1/);
  assert.match(implementation, /on conflict do nothing/);
  assert.match(implementation, /error\?\.code === "23505"/);
  assert.doesNotMatch(implementation, /on conflict \(source_event_id\).*do nothing/);
});

test('workspace reads stay fast while completed events synchronize when saved', () => {
  const readyStart = source.indexOf('async function ensureCloudSchemaReady');
  const readyEnd = source.indexOf('__name(ensureCloudSchemaReady', readyStart);
  const ready = source.slice(readyStart, readyEnd);
  const workspaceStart = source.indexOf('async function workspaceApi');
  const workspaceEnd = source.indexOf('__name(workspaceApi', workspaceStart);
  const workspace = source.slice(workspaceStart, workspaceEnd);
  assert.match(ready, /to_regclass\('public\.production_jobs'\)/);
  assert.match(ready, /information_schema\.columns/);
  assert.match(workspace, /await ensureCloudSchemaReady\(sql\)/);
  const workspaceRead = workspace.slice(workspace.indexOf('if (request.method === "GET" && pathname === "/api/workspace")'), workspace.indexOf('const eventMatch'));
  assert.doesNotMatch(workspaceRead, /syncCompletedEventsToProduction/);
  assert.match(workspace, /await syncCompletedEventsToProduction\(sql, org2, created\.id\)/);
  assert.match(workspace, /await syncCompletedEventsToProduction\(sql, org2, updated\.id\)/);
});
