const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');

test('web release serves the exact Windows renderer source', () => {
  const generated = read('cloudflare-worker/desktop-bundle.generated.js');
  assert.match(generated, new RegExp(JSON.stringify(read('src/renderer/app.js')).slice(1, 180).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.match(generated, /desktop-style\.css\?v=/);
  assert.match(generated, /desktop-app\.js\?v=/);
  assert.match(generated, /web-bridge\.js\?v=/);
  assert.match(generated, /desktop-chart\.js\?v=/);
  assert.match(generated, /manifest\.webmanifest/);
  assert.match(generated, /sidebarHidden:matchMedia/);
  assert.match(generated, /export const LOGIN_HERO_PNG = /);
  assert.match(generated, /export const APP_ICON_PNG = /);
});

test('browser bridge covers every allowlisted Windows action', () => {
  const preload = read('src/main/preload.js');
  const bridge = read('cloudflare-worker/web-bridge.js');
  const allowedBlock = preload.match(/const allowedChannels = new Set\(\[([\s\S]*?)\]\);/)[1];
  const channels = [...allowedBlock.matchAll(/'([^']+)'/g)].map(match => match[1]);
  const missing = channels.filter(channel => !bridge.includes(`case '${channel}'`));
  assert.deepEqual(missing, []);
});

test('web worker wrapper leaves the existing cloud API intact', () => {
  const worker = read('cloudflare-worker/index.js');
  const bridge = read('cloudflare-worker/web-bridge.js');
  const builder = read('scripts/build-web-renderer.js');
  assert.match(worker, /return apiWorker\.fetch\(request, env, ctx\)/);
  assert.match(worker, /url\.pathname === '\/app'/);
  assert.match(worker, /url\.pathname === '\/login-studio-camera-v2\.png'/);
  assert.match(worker, /url\.pathname === '\/'/);
  assert.match(worker, /url\.pathname === '\/mobile'/);
  assert.match(worker, /url\.pathname === '\/manifest\.webmanifest'/);
  assert.match(worker, /url\.pathname === '\/sw\.js'/);
  assert.match(worker, /lenspirecrm-web-/);
  assert.doesNotMatch(worker, /ignoreSearch:true/);
  assert.match(worker, /desktop-app\.js\?v=\$\{WEB_RENDERER_VERSION\}/);
  assert.match(bridge, /updateViaCache:'none'/);
  assert.match(bridge, /registration\.update\(\)/);
  assert.match(builder, /getRegistration\(\)\.then\(registration=>registration\?\.update\(\)\)/);
  assert.match(worker, /url\.pathname\.startsWith\('\/api\/'\)/);
  assert.equal(/main = "\.\/index\.js"/.test(read('cloudflare-worker/wrangler.toml')), true);
});

test('web renderer includes mobile navigation and responsive touch layout', () => {
  const app = read('src/renderer/app.js');
  const css = read('src/renderer/style.css');
  assert.match(app, /sidebar-scrim/);
  assert.match(app, /closeMobileSidebar/);
  assert.match(app, /aria-expanded/);
  assert.match(css, /height:100dvh/);
  assert.match(css, /safe-area-inset-bottom/);
  assert.match(css, /\.app-shell:not\(\.sidebar-hidden\) \.sidebar-scrim/);
  assert.match(css, /@media\(max-width:600px\)/);
});

test('sidebar navigation delegates clicks across renderer refreshes', () => {
  const app = read('src/renderer/app.js');
  assert.match(app, /function bindPersistentSidebarNavigation\(\)/);
  assert.match(app, /document\._lenspireSidebarNavigationBound/);
  assert.match(app, /document\.addEventListener\('click',event=>[\s\S]*?\},true\);/);
  assert.match(app, /event\.target\.closest\?\.\('\.nav-item'\)/);
  assert.match(app, /state\.view=item\.dataset\.view/);
  assert.match(app, /closeMobileSidebar\(\);shell\(\)/);
  assert.match(app, /operationsMenuToggle:'operationsOpen'/);
});

test('web Sales mutations preserve the confirmed-lead workflow', () => {
  const bridge = read('cloudflare-worker/web-bridge.js');
  const worker = read('index.js');
  assert.match(bridge, /async function distributeConfirmedLead/);
  assert.match(bridge, /case 'add-lead': return createLead\(value\)/);
  assert.match(bridge, /case 'update-lead': return updateLead\(value\)/);
  assert.match(bridge, /result\.confirmedLeadIds\|\|\[\]/);
  assert.match(worker, /const confirmedLeadIds = \[\]/);
  assert.match(worker, /Sales write access required/);
  assert.match(worker, /"First Shoot", amount: firstShootAmount/);
  assert.match(worker, /var ALLOWED_PAYMENT_TYPES = \["Advance", "First Shoot", "Wedding Day", "Final Delivery"/);
});

test('Sales lead actions remain usable on mobile screens', () => {
  const css = read('src/renderer/style.css');
  assert.match(css, /\.filtered-leads-panel \.lead-toolbar/);
  assert.match(css, /\.filtered-leads-panel table\{min-width:1180px\}/);
  assert.match(css, /\.filtered-leads-panel \.lead-actions a/);
});

test('lead activity actions resolve their surrounding composer', () => {
  const app = read('src/renderer/app.js');
  assert.match(app, /event\.currentTarget\.closest\?\.\('#leadActivityForm'\)\|\|event\.currentTarget/);
});

test('Operations parity keeps confirmed bookings visible and orders TBD events last', () => {
  const app = read('src/renderer/app.js');
  const bridge = read('cloudflare-worker/web-bridge.js');
  const worker = read('index.js');
  assert.match(bridge, /function awaitingDetailsEventForBooking/);
  assert.match(bridge, /events:\[\.\.\.events,\.\.\.awaitingEvents\]/);
  assert.match(bridge, /startsWith\('awaiting-booking-'\)/);
  assert.match(app, /dateSequenceCompare\(a,b,a\.start_time\|\|''/);
  assert.match(app, /date-tile tbd/);
  assert.match(app, /name="slotted" value="1"/);
  assert.match(worker, /case when e\.date_status = 'TBD Month' then 1 else 0 end/);
});

test('Operations imports skip duplicates and continue past individual bad rows', () => {
  const bridge = read('cloudflare-worker/web-bridge.js');
  assert.match(bridge, /function areDuplicateImportedEvents/);
  assert.match(bridge, /skippedDuplicates/);
  assert.match(bridge, /const importErrors=\[\]/);
  assert.match(bridge, /consecutiveFailures>=3/);
  assert.match(bridge, /knownMobiles/);
});

test('Operations event updates validate crew and remain usable on mobile', () => {
  const worker = read('index.js');
  const css = read('src/renderer/style.css');
  const validationCount=(worker.match(/Select an active photographer or cinematographer\./g)||[]).length;
  assert.ok(validationCount >= 2);
  assert.match(css, /\.calendar-scroll>\.calendar-grid\{min-width:700px\}/);
  assert.match(css, /\.crew-picker-menu\{width:min\(290px,calc\(100vw - 48px\)\)/);
  assert.match(css, /\.slot-event-filter\{width:100%;height:42px\}/);
  assert.match(worker, /const startTime = String\([\s\S]*?\)\.trim\(\) \|\| null/);
  assert.match(worker, /const endTime = String\([\s\S]*?\)\.trim\(\) \|\| null/);
});
