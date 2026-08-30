// Preload bridge: exposes a minimal, allowlisted IPC surface to the renderer.
// The renderer runs with contextIsolation enabled and nodeIntegration disabled.
const { contextBridge, ipcRenderer, clipboard } = require('electron');

const allowedChannels = new Set([
  'get-session-user',
  'add-lead',
  'import-leads-file',
  'export-leads-file',
  'export-monthly-report',
  'export-accounts-monthly-report',
  'import-photographers-file',
  'export-photographers-file',
  'import-events-file',
  'export-events-file',
  'create-crm-backup',
  'restore-crm-backup',
  'update-lead',
  'upload-quotation-drive',
  'update-lead-attachment',
  'add-lead-activity',
  'save-sales-target',
  'check-duplicate-mobile',
  'delete-lead',
  'reset-business-data',
  'authenticate-user',
  'logout-user',
  'change-cloud-password',
  'connect-google-drive',
  'list-users',
  'list-post-production-users',
  'create-user',
  'set-user-department-access',
  'set-user-role',
  'set-user-active',
  'reset-user-password',
  'list-platform-organizations',
  'create-platform-organization',
  'set-platform-organization-status',
  'update-platform-organization-subscription',
  'update-platform-organization-branding',
  'upload-platform-organization-logo',
  'get-workspace-data',
  'convert-lead',
  'update-production-stage',
  'save-calendar-event',
  'delete-calendar-event',
  'save-photographer-detail',
  'delete-photographer-detail',
  'get-accounts-data',
  'create-client-portal-link',
  'get-client-portal-access',
  'revoke-client-portal-access',
  'portal-invite',
  'add-payment',
  'update-payment',
  'delete-payment',
  'import-payments-file',
  'export-payments-file',
  'update-production-job',
  'export-production-file',
  'select-quotation-file',
  'open-quotation-attachment',
  'copy-to-clipboard',
  'backup-password-response',
  'get-autobackup-settings',
  'set-autobackup-settings',
  'run-autobackup'
]);
const allowedReceiveChannels = new Set(['events-import-progress', 'request-backup-password', 'show-toast', 'trigger-autobackup']);
const receiveListeners = new WeakMap();

contextBridge.exposeInMainWorld('electronAPI', {
  invoke: (channel, ...args) => {
    if (!allowedChannels.has(channel)) {
      return Promise.reject(new Error(`Blocked IPC channel: ${channel}`));
    }
    return ipcRenderer.invoke(channel, ...args);
  },
  send: (channel, ...args) => {
    if (!allowedChannels.has(channel)) {
      throw new Error(`Blocked IPC channel: ${channel}`);
    }
    ipcRenderer.send(channel, ...args);
  },
  on: (channel, callback) => {
    if (!allowedReceiveChannels.has(channel) || typeof callback !== 'function') return;
    const listener = (_event, ...args) => callback(null, ...args);
    receiveListeners.set(callback, listener);
    ipcRenderer.on(channel, listener);
  },
  removeListener: (channel, callback) => {
    if (!allowedReceiveChannels.has(channel)) return;
    const listener = receiveListeners.get(callback);
    if (listener) ipcRenderer.removeListener(channel, listener);
    receiveListeners.delete(callback);
  },
  clipboard: {
    writeText: text => clipboard.writeText(text)
  }
});
