const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const source = fs.readFileSync(path.join(__dirname, '..', 'index.js'), 'utf8');

function embeddedValue(name, nextName) {
  const startMarker = `var ${name} = `;
  const endMarker = `var ${nextName} = `;
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start);
  assert.notEqual(start, -1, `${name} must exist`);
  assert.notEqual(end, -1, `${nextName} must exist after ${name}`);
  const expression = source.slice(start + startMarker.length, end).trim().replace(/;$/, '');
  return Function(`"use strict"; return ${expression};`)();
}

test('embedded web/mobile client is valid JavaScript', () => {
  const app = embeddedValue('PWA_APP_JS', 'PWA_SERVICE_WORKER');
  assert.doesNotThrow(() => new Function(app));
});

test('web/mobile release exposes responsive, role-scoped workflows', () => {
  const app = embeddedValue('PWA_APP_JS', 'PWA_SERVICE_WORKER');
  const css = embeddedValue('PWA_APP_CSS', 'PWA_APP_JS');
  for (const expected of ['visibleNavGroups', 'Studio Management', 'Client Ledger', 'Ongoing Jobs', '/api/client-portal/link', 'beforeinstallprompt']) {
    assert.match(app, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
  assert.match(css, /\.mobile-nav/);
  assert.match(css, /max-width:900px/);
  assert.match(css, /env\(safe-area-inset-bottom\)/);
});

test('web workspace mirrors the Windows navigation and sign-in shell', () => {
  const app = embeddedValue('PWA_APP_JS', 'PWA_SERVICE_WORKER');
  const css = embeddedValue('PWA_APP_CSS', 'PWA_APP_JS');
  for (const expected of ['Sales & Marketing', 'Operations', 'Accounts', 'Post Production', 'sidebar-menu-card', 'Find <kbd>Ctrl F', 'login-page', 'login-visual']) {
    assert.match(app, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
  assert.match(css, /login-studio-camera-v2\.png/);
  assert.match(css, /\.nav-group-toggle/);
  assert.match(css, /\.topbar/);
});

test('service worker cache is versioned for the web/mobile release', () => {
  const worker = embeddedValue('PWA_SERVICE_WORKER', 'PWA_MANIFEST_JSON');
  assert.match(worker, /lenspirecrm-pwa-v5/);
  assert.match(worker, /app\.js\?v=5/);
  assert.doesNotThrow(() => new Function(worker));
});
