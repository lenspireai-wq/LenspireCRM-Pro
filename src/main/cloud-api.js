const API_BASE_URL = String(
  process.env.LENSPIRECRM_API_URL || 'https://lenspirecrm-api.lenspirecrm-worker.workers.dev'
).replace(/\/$/, '');

async function request(pathname, options = {}) {
  const controller = new AbortController();
  const { timeoutMs = 15000, ...fetchOptions } = options;
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${API_BASE_URL}${pathname}`, {
      ...fetchOptions,
      headers: { accept: 'application/json', ...(fetchOptions.headers || {}) },
      signal: controller.signal
    });
    const contentType = response.headers.get('content-type') || '';
    const result = contentType.includes('application/json') ? await response.json() : null;
    if (!response.ok) {
      const message = result?.error
        ? (result.diagnostic && result.diagnostic !== result.error ? `${result.error} (${result.diagnostic})` : result.error)
        : `Cloud service returned HTTP ${response.status}${result === null && contentType ? ' (' + contentType + ')' : ''}`;
      const error = new Error(message);
      error.status = response.status;
      error.diagnostic = result?.diagnostic;
      error.rawBody = result;
      throw error;
    }
    return result;
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('Cloud sign-in timed out. Check your internet connection and try again.');
    if (typeof error.status === 'number') throw error;
    throw new Error('Cannot reach LenspireCRM Cloud. Check your internet connection and try again.');
  } finally {
    clearTimeout(timeout);
  }
}

async function login(username, password) {
  const options = { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ username, password }), timeoutMs: 30000 };
  for (let attempt = 0; attempt < 5; attempt++) {
    try { return await request('/api/auth/login', options); }
    catch (error) {
      if (![502,503,504].includes(error.status) || attempt === 4) {
        if ([502,503,504].includes(error.status)) throw new Error('LenspireCRM Cloud is temporarily unavailable. Please wait a moment and try again.');
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }
}

const refresh = async (refreshToken) => {
  const options = { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ refreshToken }), timeoutMs: 30000 };
  for (let attempt = 0; attempt < 5; attempt++) {
    try { return await request('/api/auth/refresh', options); }
    catch (error) {
      if (![502,503,504].includes(error.status) || attempt === 4) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }
};

const changePassword = (token, currentPassword, newPassword) => request('/api/auth/change-password', authorized(token, {
  method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ currentPassword, newPassword })
}));

function authorized(token, options = {}) {
  return { ...options, headers: { ...(options.headers || {}), authorization: `Bearer ${token}` } };
}

const listLeads = token => request('/api/leads', authorized(token));
const importLeads = (token, leads) => request('/api/leads/import', authorized(token, {
  method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ leads }), timeoutMs: 120000
}));
const createLead = (token, lead) => request('/api/leads', authorized(token, {
  method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(lead)
}));
const updateLead = (token, id, lead) => request(`/api/leads/${encodeURIComponent(id)}`, authorized(token, {
  method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(lead)
}));
const deleteLead = (token, id) => request(`/api/leads/${encodeURIComponent(id)}`, authorized(token, { method: 'DELETE' }));
const RESET_MARKER_NAME = '__LENSPIRECRM_WORKSPACE_RESET__';
const RESET_MARKER_SOURCE = 'LenspireCRM Reset';
const isResetMarker = lead => lead?.name === RESET_MARKER_NAME && lead?.source === RESET_MARKER_SOURCE;
const resetMarkerTime = marker => {
  const value = Date.parse(marker?.created_at || '');
  return Number.isFinite(value) ? value : 0;
};
const selectCloudWorkspace = rows => {
  const all = Array.isArray(rows) ? rows : [];
  const markers = all.filter(isResetMarker).sort((a, b) => resetMarkerTime(b) - resetMarkerTime(a));
  const marker = markers[0] || null;
  const cutoff = resetMarkerTime(marker);
  const leads = all.filter(lead => {
    if (isResetMarker(lead)) return false;
    if (!marker) return true;
    const created = Date.parse(lead?.created_at || '');
    return Number.isFinite(created) && created > cutoff;
  });
  return { marker, leads };
};
const resetBusinessData = async token => {
  const initial = await listLeads(token);
  const leads = Array.isArray(initial?.leads) ? initial.leads : [];
  const clearedLeadIds = leads.map(lead => lead?.id).filter(Boolean).map(String);
  try {
    const backup = await request('/api/backup', authorized(token, { timeoutMs: 120000 }));
    await request('/api/backup/restore', authorized(token, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        kind: 'lenspirecrm-cloud-backup',
        leads: [], customers: [], bookings: [], production: [], events: [],
        payments: [], activities: [], salesTargets: [],
        photographers: Array.isArray(backup?.photographers) ? backup.photographers : []
      }),
      timeoutMs: 120000
    }));
    const markerResult = await createLead(token, {
      name: RESET_MARKER_NAME, eventType: 'System Reset', eventDate: new Date().toISOString().slice(0, 10),
      city: 'System', source: RESET_MARKER_SOURCE, status: 'New', priority: 'Low',
      notes: 'Desktop synchronization marker. This record is hidden by LenspireCRM Pro.'
    });
    return { ok: true, clearedLeadIds, marker: markerResult?.lead || null };
  } catch (error) {
    if (![404, 500].includes(error.status)) throw error;
    let deletedLeads = 0;
    for (const lead of leads) {
      if (!lead?.id) continue;
      try { await deleteLead(token, lead.id); deletedLeads++; }
      catch (deleteError) {
        if (deleteError.status === 404) { deletedLeads++; continue; }
        if ([401, 403].includes(deleteError.status)) throw deleteError;
        // Older cloud deployments can reject converted leads with dependent records.
        // The desktop reset marker below keeps those legacy records cleared locally.
      }
    }
    const markerResult = await createLead(token, {
      name: RESET_MARKER_NAME, eventType: 'System Reset', eventDate: new Date().toISOString().slice(0, 10),
      city: 'System', source: RESET_MARKER_SOURCE, status: 'New', priority: 'Low',
      notes: 'Desktop synchronization marker. This record is hidden by LenspireCRM Pro.'
    });
    return { ok: true, compatibilityMode: true, deletedLeads, clearedLeadIds, marker: markerResult?.lead || null };
  }
};
const listLeadActivities = token => request('/api/lead-activities', authorized(token));
// The workspace endpoint is the server-authoritative snapshot for every CRM
// module other than leads/activities (which have their own endpoints).
const getWorkspace = token => request('/api/workspace', authorized(token));
const jsonBody = body => ({ method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
const saveSalesTarget = (token, target = {}) => {
  const salesperson = String(target.salesperson || target.salesPerson || '').trim();
  const targetMonth = String(target.targetMonth || target.target_month || target.month || '').trim().slice(0, 7);
  const payload = {
    ...target,
    salesperson,
    salesPerson: salesperson,
    month: targetMonth,
    targetMonth,
    target_month: targetMonth,
    targetAmount: Number(target.targetAmount ?? target.target_amount ?? 0),
    targetBookings: Number(target.targetBookings ?? target.target_bookings ?? 0)
  };
  return request('/api/sales-targets', authorized(token, jsonBody(payload)));
};
const saveEvent = (token, id, event) => {
  const dateStatus = event?.dateStatus || event?.date_status || 'Confirmed';
  const tbdMonth = event?.tbdMonth || event?.tbd_month || null;
  const startDate = dateStatus === 'TBD Month' && tbdMonth ? `${String(tbdMonth).slice(0, 7)}-01` : (event?.startDate || event?.start_date || null);
  const payload = {
    ...event,
    startDate,
    start_date: startDate,
    dateStatus,
    date_status: dateStatus,
    tbdMonth,
    tbd_month: tbdMonth,
    city: event?.venue || event?.city || '',
    slotted: event?.slotted === true || String(event?.slotted) === '1' || event?.slotted === 'true'
  };
  return request(id ? `/api/events/${encodeURIComponent(id)}` : '/api/events', authorized(token, { ...jsonBody(payload), method: id ? 'PUT' : 'POST' }));
};
const deleteEvent = (token, id) => request(`/api/events/${encodeURIComponent(id)}`, authorized(token, { method: 'DELETE' }));
const savePhotographer = (token, id, detail) => request(id ? `/api/photographers/${encodeURIComponent(id)}` : '/api/photographers', authorized(token, { ...jsonBody(detail), method: id ? 'PUT' : 'POST' }));
const deletePhotographer = (token, id) => request(`/api/photographers/${encodeURIComponent(id)}`, authorized(token, { method: 'DELETE' }));
const updateProduction = (token, id, data) => {
  const payload = {
    ...data,
    rawStatus: data?.rawStatus ?? data?.raw_status,
    raw_status: data?.rawStatus ?? data?.raw_status,
    editingStatus: data?.editingStatus ?? data?.editing_status,
    editing_status: data?.editingStatus ?? data?.editing_status,
    albumStatus: data?.albumStatus ?? data?.album_status,
    album_status: data?.albumStatus ?? data?.album_status,
    videoStatus: data?.videoStatus ?? data?.video_status,
    video_status: data?.videoStatus ?? data?.video_status,
    deliveryStatus: data?.deliveryStatus ?? data?.delivery_status,
    delivery_status: data?.deliveryStatus ?? data?.delivery_status,
    dueDate: data?.dueDate ?? data?.due_date,
    due_date: data?.dueDate ?? data?.due_date,
    deliveredAt: data?.deliveredAt ?? data?.delivered_at,
    delivered_at: data?.deliveredAt ?? data?.delivered_at,
    clientApprovedAt: data?.clientApprovedAt ?? data?.client_approved_at,
    client_approved_at: data?.clientApprovedAt ?? data?.client_approved_at
  };
  return request(`/api/production/${encodeURIComponent(id)}`, authorized(token, { ...jsonBody(payload), method: 'PUT' }));
};
const addPayment = (token, data) => request('/api/payments', authorized(token, jsonBody(data)));
const updatePayment = (token, id, data) => request(`/api/payments/${encodeURIComponent(id)}`, authorized(token, { ...jsonBody(data), method: 'PUT' }));
const deletePayment = (token, id) => request(`/api/payments/${encodeURIComponent(id)}`, authorized(token, { method: 'DELETE' }));
const createClientPortalLink = (token, bookingId, options = {}) => request('/api/client-portal/link', authorized(token, jsonBody({ bookingId, ...options })));
const getClientPortalAccess = (token, bookingId) => request('/api/client-portal/link?bookingId=' + encodeURIComponent(bookingId), authorized(token));
const revokeClientPortalAccess = (token, bookingId) => request('/api/client-portal/link', authorized(token, { ...jsonBody({ bookingId }), method: 'DELETE' }));
const convertLead = (token, id, options) => request(`/api/leads/${encodeURIComponent(id)}/convert`, authorized(token, jsonBody(options || {})));
const createBackup = token => request('/api/backup', authorized(token, { timeoutMs: 120000 }));
const restoreBackup = (token, backup) => request('/api/backup/restore', authorized(token, { ...jsonBody(backup), timeoutMs: 120000 }));
// Older cloud deployments expose the non-lead tables through backup/restore
// but do not yet have every granular mutation endpoint. For those versions,
// update the server snapshot while preserving all unrelated records.
const mutateWorkspace = async (token, mutator) => {
  const backup = await createBackup(token);
  const next = JSON.parse(JSON.stringify(backup));
  const value = await mutator(next);
  await restoreBackup(token, next);
  return value;
};
const importLeadActivities = (token, activities) => request('/api/lead-activities/import', authorized(token, {
  method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ activities }), timeoutMs: 120000
}));
const createLeadActivity = (token, leadId, activity) => request(`/api/leads/${encodeURIComponent(leadId)}/activities`, authorized(token, {
  method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(activity)
}));
const updateLeadAttachment = (token, leadId, attachment) => request(`/api/leads/${encodeURIComponent(leadId)}/attachment`, authorized(token, {
  method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(attachment)
}));
const listUsers = token => request('/api/users', authorized(token));
const createUser = (token, user) => request('/api/users', authorized(token, {
  method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(user)
}));
const setUserDepartmentAccess = (token, userId, access) => request('/api/users/' + encodeURIComponent(userId) + '/access', authorized(token, {
  method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ access })
}));
const setUserRole = (token, userId, role) => request('/api/users/' + encodeURIComponent(userId) + '/role', authorized(token, {
  method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ role })
}));
const setUserActive = (token, userId, active) => request('/api/users/' + encodeURIComponent(userId) + '/active', authorized(token, {
  method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ active })
}));
const resetUserPassword = (token, userId, password) => request('/api/users/' + encodeURIComponent(userId) + '/reset-password', authorized(token, {
  method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ password })
}));
// Platform routes are separately authorized by the Cloud service. They are
// deliberately not implemented as a wider version of /api/users: a studio
// administrator must never be able to enumerate another studio's users.
const listPlatformOrganizations = token => request('/api/platform/organizations', authorized(token));
const createPlatformOrganization = (token, organization) => request('/api/platform/organizations', authorized(token, {
  method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(organization)
}));
const setPlatformOrganizationStatus = (token, organizationId, status) => request('/api/platform/organizations/' + encodeURIComponent(organizationId) + '/status', authorized(token, {
  method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ status })
}));
const updatePlatformOrganizationSubscription = (token, organizationId, details) => request('/api/platform/organizations/' + encodeURIComponent(organizationId) + '/subscription', authorized(token, {
  method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify(details)
}));
const updatePlatformOrganizationBranding = (token, organizationId, details) => request('/api/platform/organizations/' + encodeURIComponent(organizationId) + '/branding', authorized(token, {
  method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify(details)
}));
const uploadPlatformOrganizationLogo = (token, organizationId, { name, mimeType, buffer }) => {
  const form = new FormData();
  form.append('file', new Blob([buffer], { type: mimeType || 'application/octet-stream' }), String(name || 'studio-logo'));
  return request('/api/platform/organizations/' + encodeURIComponent(organizationId) + '/logo', authorized(token, { method: 'POST', body: form, timeoutMs: 120000 }));
};
const googleConnect = token => request('/api/google/connect', authorized(token));

const uploadDriveFile = (token, { leadId, name, mimeType, buffer }) => {
  const form = new FormData();
  form.append('leadId', String(leadId || ''));
  form.append('name', String(name || 'quotation'));
  form.append('file', new Blob([buffer], { type: mimeType || 'application/octet-stream' }), String(name || 'quotation'));
  return request('/api/drive/upload', authorized(token, { method: 'POST', body: form, timeoutMs: 180000 }));
};
const listDriveFiles = (token, leadId) => request('/api/drive/files?leadId=' + encodeURIComponent(leadId || ''), authorized(token));
const deleteDriveFile = (token, fileId) => request('/api/drive/files/' + encodeURIComponent(fileId), authorized(token, { method: 'DELETE' }));
module.exports = { API_BASE_URL, login, refresh, changePassword, listUsers, createUser, setUserDepartmentAccess, setUserRole, setUserActive, resetUserPassword, listPlatformOrganizations, createPlatformOrganization, setPlatformOrganizationStatus, updatePlatformOrganizationSubscription, updatePlatformOrganizationBranding, uploadPlatformOrganizationLogo, listLeads, importLeads, createLead, updateLead, deleteLead, resetBusinessData, selectCloudWorkspace, getWorkspace, saveSalesTarget, saveEvent, deleteEvent, savePhotographer, deletePhotographer, updateProduction, addPayment, updatePayment, deletePayment, createClientPortalLink, getClientPortalAccess, revokeClientPortalAccess, convertLead, createBackup, restoreBackup, mutateWorkspace, listLeadActivities, importLeadActivities, createLeadActivity, updateLeadAttachment, googleConnect, uploadDriveFile, listDriveFiles, deleteDriveFile };
