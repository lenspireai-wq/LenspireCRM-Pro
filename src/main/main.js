// ============================================================
// LenspireCRM Pro — Electron Main Process
// ============================================================
// Sections:
//   1. Session & auth helpers
//   2. Cloud workspace helpers
//   3. IPC handlers: sales (leads, imports/exports)
//   4. IPC handlers: operations (events, photographers)
//   5. IPC handlers: accounts (payments, reports)
//   6. IPC handlers: backup & restore
//   7. IPC handlers: users & roles
//   8. IPC handlers: production & calendar
//   9. IPC handlers: quotations & misc
// ============================================================

const { app, BrowserWindow, ipcMain, dialog, shell, safeStorage, clipboard } = require('electron');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const XLSX = require('xlsx');
const { encryptPayload, decryptPayload, isEncryptedPayload } = require('./backup-crypto');
const cloudApi = require('./cloud-api');
const { importDate, leadRowsFromSheet, mapLeadRows, mapEventRows, mapPhotographerRows, mapPaymentRows, areDuplicateImportedEvents } = require('./import-mappers');
const MAX_IMPORT_BYTES = 20 * 1024 * 1024;
const MAX_IMPORT_ROWS = 50000;
function assertImportFileSafe(filePath){if(fs.statSync(filePath).size>MAX_IMPORT_BYTES)throw new Error('Spreadsheet is too large. Maximum size is 20 MB.');}
function assertImportRowsSafe(rows){if(rows.length>MAX_IMPORT_ROWS)throw new Error('Spreadsheet has too many rows. Maximum is 50,000.');return rows;}
function showOwnedOpenDialog(event,options){const owner=BrowserWindow.fromWebContents(event.sender);if(owner){if(owner.isMinimized())owner.restore();owner.show();owner.focus();return dialog.showOpenDialog(owner,options);}return dialog.showOpenDialog(options);}
const { getLeads, addLead, importLeads, importPayments, updateLead, updateLeadAttachment, addLeadActivity, saveSalesTarget, checkDuplicateMobile, deleteLead, resetBusinessData, applySynchronizedBusinessReset, authenticateUser, getSessionUser, getSessionUserByUsername, listUsers, listPostProductionUsers, createUser, setUserActive, setUserDepartmentAccess, setUserRole, resetUserPassword, getWorkspaceData, convertLeadToCustomer, updateProductionStage, saveCalendarEvent, deleteCalendarEvent, savePhotographerDetail, deletePhotographerDetail, backupDatabase, validateDatabaseBackup, replaceDatabaseFromBackup, addPayment, updatePayment, deletePayment, getAccountsData, updateProductionJob } = require('../database/index');
const rendererSessions=new Map();
const cloudUsers=new Map();
const offlineUsers=new Map();
const offlineWorkspaces=new Map();
const offlineQueues=new Map();
const loginFailures=new Map();
function bindRendererSession(event,user){if(user?.id)rendererSessions.set(event.sender.id,user.id);return user;}
function resolveSessionUser(userId){return cloudUsers.get(String(userId))?.user||offlineUsers.get(String(userId))||getSessionUser(userId);}
function normalizeAccess(value){let parsed=value;while(typeof parsed==='string'){try{parsed=JSON.parse(parsed);}catch{break;}}return parsed&&typeof parsed==='object'?parsed:{};}
function requireAuthenticated(event){const user=resolveSessionUser(rendererSessions.get(event.sender.id));if(!user)throw new Error('Your session has expired. Please sign in again.');return user;}
function requireDepartmentRead(event,department){const user=requireAuthenticated(event);if(user.role==='Administrator'||['full','view'].includes(normalizeAccess(user.departmentAccess)?.[department]))return user;throw new Error(`You do not have access to ${department==='postProduction'?'Post Production':department} data.`);}
function requireDepartmentWrite(event,department){const user=requireAuthenticated(event);if(user.role==='Administrator'||normalizeAccess(user.departmentAccess)?.[department]==='full')return user;throw new Error(`View-only access: you cannot change ${department==='postProduction'?'Post Production':department} data.`);}
function requireAdministrator(event){const user=resolveSessionUser(rendererSessions.get(event.sender.id));if(!user||user.role!=='Administrator')throw new Error('Administrator access required.');return user;}
function cloudSession(event){const id=rendererSessions.get(event.sender.id);return id?cloudUsers.get(String(id)):null;}
function isCloudUnavailable(error){return !Number.isFinite(error?.status)||[404,429,500,502,503,504].includes(error.status);}

// Keep one encrypted, per-account copy of the last successfully loaded cloud
// workspace. It contains CRM records, so Windows DPAPI (Electron safeStorage)
// is used rather than a plain JSON file. Earlier versions kept the last synced
// Last synced data is read-only until the connection returns in older builds;
// queued event edits now remain
// encrypted locally and cloud remains the source of truth after replay.
function cloudWorkspaceCachePath(username){
    const key=crypto.createHash('sha256').update(String(username||'').trim().toLowerCase()).digest('hex');
    return path.join(app.getPath('userData'),'cloud-workspace-cache',`${key}.bin`);
}
function offlineAccountCachePath(username){
    const key=crypto.createHash('sha256').update(String(username||'').trim().toLowerCase()).digest('hex');
    return path.join(app.getPath('userData'),'cloud-workspace-cache',`${key}.account.bin`);
}
function offlineQueueCachePath(username){
    const key=crypto.createHash('sha256').update(String(username||'').trim().toLowerCase()).digest('hex');
    return path.join(app.getPath('userData'),'cloud-workspace-cache',`${key}.queue.bin`);
}
function writeEncryptedCache(filePath,value){
    if(!safeStorage.isEncryptionAvailable())return;
    fs.mkdirSync(path.dirname(filePath),{recursive:true});
    fs.writeFileSync(`${filePath}.tmp`,safeStorage.encryptString(JSON.stringify(value)));
    fs.renameSync(`${filePath}.tmp`,filePath);
}
function readEncryptedCache(filePath){
    try{return JSON.parse(safeStorage.decryptString(fs.readFileSync(filePath)));}catch{return null;}
}
function saveOfflineAccount(username,password,user){
    if(!username||!password||!safeStorage.isEncryptionAvailable())return;
    const salt=crypto.randomBytes(16).toString('hex');
    writeEncryptedCache(offlineAccountCachePath(username),{username:String(username).trim().toLowerCase(),salt,hash:crypto.scryptSync(String(password),salt,64).toString('hex'),user});
}
function verifyOfflineAccount(username,password){
    const saved=readEncryptedCache(offlineAccountCachePath(username));
    if(!saved||saved.username!==String(username||'').trim().toLowerCase()||!saved.salt||!saved.hash||!saved.user)return null;
    const supplied=Buffer.from(crypto.scryptSync(String(password||''),saved.salt,64).toString('hex'),'hex'),stored=Buffer.from(saved.hash,'hex');
    return supplied.length===stored.length&&crypto.timingSafeEqual(supplied,stored)?saved.user:null;
}
function loadOfflineQueue(username){const value=readEncryptedCache(offlineQueueCachePath(username));return Array.isArray(value?.changes)?value.changes:[];}
function saveOfflineQueue(username,changes){writeEncryptedCache(offlineQueueCachePath(username),{changes,updatedAt:new Date().toISOString()});}
function saveCloudWorkspaceCache(username,workspace){
    if(!username||!safeStorage.isEncryptionAvailable())return;
    try{
        const filePath=cloudWorkspaceCachePath(username),payload=JSON.stringify({username:String(username).trim().toLowerCase(),savedAt:new Date().toISOString(),workspace});
        fs.mkdirSync(path.dirname(filePath),{recursive:true});
        fs.writeFileSync(`${filePath}.tmp`,safeStorage.encryptString(payload));
        fs.renameSync(`${filePath}.tmp`,filePath);
    }catch(error){console.warn('Could not cache cloud workspace:',error.message);}
}
function loadCloudWorkspaceCache(username){
    if(!username||!safeStorage.isEncryptionAvailable())return null;
    try{
        const payload=JSON.parse(safeStorage.decryptString(fs.readFileSync(cloudWorkspaceCachePath(username))));
        if(payload?.username!==String(username).trim().toLowerCase()||!payload?.workspace||typeof payload.workspace!=='object')return null;
        return payload.workspace;
    }catch{return null;}
}
function offlineWorkspaceFor(event){
    const user=requireAuthenticated(event),key=String(user.id);
    const workspace=offlineWorkspaces.get(key)||loadCloudWorkspaceCache(user.username);
    if(!workspace)throw new Error('No saved workspace is available on this computer yet. Connect to Cloud once before using offline mode.');
    offlineWorkspaces.set(key,workspace);
    if(!offlineQueues.has(key))offlineQueues.set(key,loadOfflineQueue(user.username));
    return workspace;
}
function queueOfflineEventChange(event,change){
    const user=requireAuthenticated(event),workspace=offlineWorkspaceFor(event),key=String(user.id);
    if(change.type==='save-event'){
        const rows=workspace.events||(workspace.events=[]),id=change.eventId||`offline-${crypto.randomUUID()}`,index=rows.findIndex(row=>idMatches(row.id,id));
        const row={...(index>=0?rows[index]:{}),id,...change.event,created_at:index>=0?rows[index].created_at:new Date().toISOString()};
        if(index>=0)rows[index]=row;else rows.push(row);
        change={...change,eventId:id,event:row};
    }else if(change.type==='delete-event')workspace.events=(workspace.events||[]).filter(row=>!idMatches(row.id,change.eventId));
    const queue=offlineQueues.get(key)||[];queue.push(change);offlineQueues.set(key,queue);
    saveCloudWorkspaceCache(user.username,workspace);saveOfflineQueue(user.username,queue);
    return {...workspace,cloudStatus:'offline',pendingSync:queue.length};
}
async function flushOfflineEventQueue(session){
    const key=String(session.user.id),queue=offlineQueues.get(key)||loadOfflineQueue(session.user.username);
    if(!queue.length)return 0;
    const idMap=new Map(),remaining=[];
    for(const change of queue){
        try{
            if(change.type==='save-event'){
                const originalId=change.eventId,mappedId=idMap.get(String(originalId))||originalId;
                const remoteId=String(mappedId).startsWith('offline-')?null:mappedId;
                const result=await withCloudAuth(session,token=>cloudApi.saveEvent(token,remoteId,change.event));
                const createdId=result?.event?.id||result?.id;
                if(createdId&&remoteId===null)idMap.set(String(originalId),createdId);
            }else if(change.type==='delete-event'){
                const id=idMap.get(String(change.eventId))||change.eventId;
                if(!String(id).startsWith('offline-'))await withCloudAuth(session,token=>cloudApi.deleteEvent(token,id));
            }
        }catch(error){remaining.push(change);}
    }
    offlineQueues.set(key,remaining);saveOfflineQueue(session.user.username,remaining);
    return queue.length-remaining.length;
}
function outageWorkspace(event){
    const user=resolveSessionUser(rendererSessions.get(event?.sender?.id));
    return offlineWorkspaces.get(String(user?.id))||loadCloudWorkspaceCache(user?.username)||getWorkspaceData();
}

// Bearer and refresh tokens deliberately remain in memory only. Persisting them
// as JSON made a copied Windows profile equivalent to a live cloud session.
function mapCloudLeads(session,rows){
    const localByCode=new Map(getLeads().map(lead=>[lead.lead_code,lead.id]));
    return rows.map(row=>{
        if(!session.leadIds.has(row.id)){
            const preferred=localByCode.get(row.lead_code);
            session.leadIds.set(row.id,preferred??session.nextLeadId--);
        }
        return{...row,cloud_id:row.id,id:session.leadIds.get(row.id)};
    });
}
function cloudLeadUuid(session,clientId){for(const [uuid,id] of session.leadIds)if(String(id)===String(clientId))return uuid;return String(clientId);}
async function refreshCloudLeadMap(session){
    const result=await withCloudAuth(session,token=>cloudApi.listLeads(token));
    const selected=cloudApi.selectCloudWorkspace(result?.leads);
    mapCloudLeads(session,selected.leads.filter(lead=>!String(lead.notes||'').includes(DELETED_LEAD_MARKER)));
}
async function refreshCloudSession(session){
    if(!session.refreshPromise)session.refreshPromise=cloudApi.refresh(session.refreshToken).then(tokens=>{session.accessToken=tokens.accessToken||tokens.token;session.refreshToken=tokens.refreshToken||session.refreshToken;if(!session.accessToken)throw new Error('Cloud session refresh returned no access token.');}).finally(()=>{session.refreshPromise=null;});
    await session.refreshPromise;
}
async function withCloudAuth(session,operation){
    for(let attempt=0;attempt<3;attempt++){
        try{return await operation(session.accessToken);}catch(error){
            if(error.status===401){await refreshCloudSession(session);return operation(session.accessToken);}
            if(![502,503,504].includes(error.status)||attempt===2)throw error;
            await new Promise(resolve=>setTimeout(resolve,700*(attempt+1)));
        }
    }
}
async function retryTemporaryCloudFailure(operation){
    for(let attempt=0;attempt<3;attempt++){
        try{return await operation();}catch(error){
            if(![502,503,504].includes(error.status)||attempt===2)throw error;
            await new Promise(resolve=>setTimeout(resolve,700*(attempt+1)));
        }
    }
}
const normalizeCloudEvent = event => {
  if (!event || typeof event !== 'object') return event;
  const normalized = { ...event };
  normalized.slotted = normalized.slotted === true || String(normalized.slotted) === '1' || normalized.slotted === 'true';
  if (normalized.eventId === '' || normalized.eventId === 0) normalized.eventId = null;
  else if (normalized.eventId !== null && normalized.eventId !== undefined) normalized.eventId = Number(normalized.eventId) || null;
  for (const key of ['startTime', 'endTime', 'tbdMonth', 'venue', 'notes', 'photo', 'video', 'candid', 'cinematic', 'drone', 'assistant', 'bts', 'handledBy', 'coupleName', 'contactNo']) {
    if (normalized[key] === '') normalized[key] = null;
  }
  return normalized;
};

async function refreshCloudUser(session){
    try{
        const result=await withCloudAuth(session,token=>cloudApi.listUsers(token));
        const users=Array.isArray(result)?result:(result?.users||[]);
        const current=users.find(user=>idMatches(user.id,session.user.id)||String(user.username||'').toLowerCase()===String(session.user.username||'').toLowerCase());
        if(current){session.user={...session.user,...current,authSource:'cloud'};cloudUsers.set(String(session.user.id),session);}
    }catch(error){if(![403,404,405].includes(error.status))throw error;}
    return session.user;
}
async function cloudMutation(session, direct, fallback){
    try{return await withCloudAuth(session,direct);}catch(error){
        // Compatibility fallback is only for deployments that do not expose
        // the granular route. Retrying a genuine server error by restoring the
        // entire workspace can multiply D1 writes during large imports.
        if(![404,405].includes(error.status))throw error;
        return withCloudAuth(session,token=>cloudApi.mutateWorkspace(token,fallback));
    }
}
const idMatches=(left,right)=>String(left??'')===String(right??'');
const randomCloudId=()=>require('crypto').randomUUID();
const DELETED_LEAD_MARKER='[LENSPIRE_DELETED_LEAD]';
function awaitingDetailsEventForBooking(booking,lead,customer){
    const bookingId=booking?.id,clientName=booking?.client_name||booking?.clientName||customer?.name||lead?.name||'Client',eventType=booking?.event_type||booking?.eventType||lead?.event_type||lead?.eventType||'Event',eventDate=booking?.event_date||booking?.eventDate||lead?.event_date||lead?.eventDate||null;
    return{
        // Compatibility row for older confirmations that made a booking but
        // omitted its calendar event. Saving it creates one linked Cloud event.
        id:`awaiting-booking-${bookingId}`,
        awaiting_booking_event:true,
        booking_id:bookingId,
        customer_id:booking?.customer_id??booking?.customerId??customer?.id??null,
        title:`${clientName} · ${eventType}`,
        event_type:eventType,
        start_date:eventDate,
        start_time:null,
        end_time:null,
        city:booking?.city||lead?.city||null,
        status:'Scheduled',
        notes:null,
        client_name:clientName,
        handled_by:lead?.assigned_to||lead?.assignedTo||null,
        couple_name:lead?.couple_name||lead?.coupleName||clientName,
        contact_no:lead?.mobile||customer?.phone||null,
        slotted:false,
        date_status:eventDate?'Confirmed':'TBD Month',
        tbd_month:null
    };
}
function removeLeadFromCloudBackup(backup,uuid,leadId){
    const matchesLead=row=>idMatches(row?.lead_id??row?.leadId,uuid)||idMatches(row?.lead_id??row?.leadId,leadId)||idMatches(row?.id,uuid)||idMatches(row?.id,leadId);
    const customers=(backup.customers||[]).filter(matchesLead),customerIds=new Set(customers.map(row=>String(row.id)));
    const linkedCustomer=row=>customerIds.has(String(row?.customer_id??row?.customerId));
    const bookings=(backup.bookings||[]).filter(row=>matchesLead(row)||linkedCustomer(row)),bookingIds=new Set(bookings.map(row=>String(row.id)));
    const linkedBooking=row=>bookingIds.has(String(row?.booking_id??row?.bookingId));
    backup.leads=(backup.leads||[]).filter(row=>!idMatches(row.id,uuid)&&!idMatches(row.id,leadId));
    backup.activities=(backup.activities||[]).filter(row=>!matchesLead(row));
    backup.customers=(backup.customers||[]).filter(row=>!matchesLead(row));
    backup.bookings=(backup.bookings||[]).filter(row=>!matchesLead(row)&&!linkedCustomer(row));
    backup.production=(backup.production||[]).filter(row=>!linkedBooking(row)&&!linkedCustomer(row));
    backup.productionActivities=(backup.productionActivities||[]).filter(row=>!linkedBooking(row)&&!bookingIds.has(String(row?.booking_id??row?.bookingId)));
    backup.clientPortalAccess=(backup.clientPortalAccess||[]).filter(row=>!bookingIds.has(String(row?.booking_id??row?.bookingId)));
    backup.clientPortalAccessLog=(backup.clientPortalAccessLog||[]).filter(row=>!bookingIds.has(String(row?.booking_id??row?.bookingId)));
    backup.events=(backup.events||[]).filter(row=>!linkedBooking(row)&&!linkedCustomer(row));
    backup.payments=(backup.payments||[]).filter(row=>!linkedBooking(row)&&!linkedCustomer(row));
}
const normalizeEventData=data=>{const dateStatus=data?.dateStatus||data?.date_status||'Confirmed',tbdMonth=data?.tbdMonth||data?.tbd_month||null,startDate=data?.startDate||data?.start_date||null;return{title:data?.title||`${data?.clientName||'Client'} · ${data?.eventType||'Event'}`,event_type:data?.eventType||data?.event_type||'Shoot',start_date:dateStatus==='TBD Month'&&tbdMonth?`${String(tbdMonth).slice(0,7)}-01`:startDate,start_time:data?.startTime||data?.start_time||null,end_time:data?.endTime||data?.end_time||null,city:data?.venue||data?.city||null,status:data?.status||'Scheduled',assigned_user_id:data?.assignedUserId||data?.assigned_user_id||null,notes:data?.notes||null,client_name:data?.clientName||data?.client_name||null,handled_by:data?.handledBy||data?.handled_by||null,couple_name:data?.coupleName||data?.couple_name||null,contact_no:data?.contactNo||data?.contact_no||null,photo:data?.photo||null,video:data?.video||null,candid:data?.candid||data?.candid||null,cinematic:data?.cinematic||data?.cinematic||null,drone:data?.drone||data?.drone||null,assistant:data?.assistant||data?.assistant||null,bts:data?.bts||data?.bts||null,booking_id:data?.bookingId??data?.booking_id??null,customer_id:data?.customerId??data?.customer_id??null,slotted:data?.slotted===true||String(data?.slotted)==='1'||data?.slotted==='true',date_status:dateStatus,tbd_month:tbdMonth};};
const importClean=value=>String(value??'').trim().replace(/\s+/g,' ').toLowerCase();
const leadImportKey=lead=>[importClean(lead?.name),String(lead?.mobile||'').replace(/\D/g,'').slice(-10),importClean(lead?.eventType||lead?.event_type),String(lead?.eventDate||lead?.event_date||'').slice(0,10)].join('|');
const paymentImportKey=(payment,bookingCode='')=>[importClean(bookingCode||payment?.bookingCode),Number(payment?.amount||0).toFixed(2),importClean(payment?.paymentType||payment?.payment_type),importClean(payment?.status),String(payment?.paidAt||payment?.paid_at||payment?.dueDate||payment?.due_date||'').slice(0,10)].join('|');
const normalizeProductionData=data=>({stage:data?.stage,raw_status:data?.rawStatus??data?.raw_status,editing_status:data?.editingStatus??data?.editing_status,album_status:data?.albumStatus??data?.album_status,video_status:data?.videoStatus??data?.video_status,delivery_status:data?.deliveryStatus??data?.delivery_status,editor:data?.editor,due_date:data?.dueDate??data?.due_date,photo_count:data?.photoCount??data?.photo_count,video_count:data?.videoCount??data?.video_count,album_count:data?.albumCount??data?.album_count,notes:data?.notes,delivered_at:data?.deliveredAt??data?.delivered_at,client_approved_at:data?.clientApprovedAt??data?.client_approved_at});
const normalizePaymentData=data=>({booking_id:data?.bookingId??data?.booking_id,customer_id:data?.customerId??data?.customer_id,amount:Number(data?.amount||0),payment_type:data?.paymentType??data?.payment_type??'Advance',status:data?.status||'Paid',payment_mode:data?.paymentMode??data?.payment_mode??null,received_by:data?.receivedBy??data?.received_by??null,notes:data?.notes||null,due_date:data?.dueDate??data?.due_date??null,paid_at:data?.paidAt??data?.paid_at??null});
function workspaceAfterReset(workspace,marker){
    if(!marker)return workspace;
    const cutoff=Date.parse(marker.created_at||'');
    if(!Number.isFinite(cutoff))return workspace;
    const after=row=>{const time=Date.parse(row?.created_at||row?.updated_at||'');return Number.isFinite(time)&&time>cutoff;};
    const next={...workspace};
    for(const key of ['customers','bookings','production','events','payments','salesTargets'])next[key]=(workspace?.[key]||[]).filter(after);
    // Crew directory and user-derived lists are configuration, not business
    // transaction data, and intentionally survive Reset All Data.
    return next;
}
async function resetCloudBusinessData(session){
    const result=await withCloudAuth(session,token=>cloudApi.resetBusinessData(token));
    for(const id of result?.clearedLeadIds||[])session.clearedLeadIds.add(String(id));
    if(result?.marker?.id)session.lastResetMarkerId=String(result.marker.id);
    session.leadIds.clear();
    session.nextLeadId=-1;
}
const QUOTATION_MIME_BY_EXT = { '.pdf':'application/pdf', '.doc':'application/msword', '.docx':'application/vnd.openxmlformats-officedocument.wordprocessingml.document', '.xls':'application/vnd.ms-excel', '.xlsx':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.png':'image/png' };
async function uploadQuotationToDrive(session, cloudLeadId, filePath, name) {
  if (!session) return { uploaded: false, reason: 'offline' };
  if (!filePath || !fs.existsSync(filePath)) return { uploaded: false, reason: 'missing-file' };
  const buffer = fs.readFileSync(filePath);
  const safeName = String(name || path.basename(filePath));
  const mimeType = QUOTATION_MIME_BY_EXT[path.extname(safeName).toLowerCase()] || 'application/octet-stream';
  try {
    const result = await withCloudAuth(session, token => cloudApi.uploadDriveFile(token, { leadId: String(cloudLeadId || ''), name: safeName, mimeType, buffer }));
    return { uploaded: true, file: result?.file || null };
  } catch (error) {
    if (error.status === 409) return { uploaded: false, reason: 'not-connected', message: error.message };
    return { uploaded: false, reason: 'error', message: error.message };
  }
}
async function cloudWorkspace(event){
    const session=cloudSession(event);
    if(!session)return {...outageWorkspace(event),cloudStatus:'offline'};
    try{
        // Lead Management must be driven by its own live endpoint.  Do not
        // let a transient failure in Operations, Accounts, or Production turn
        // a successful lead response into an old cached workspace.
        const result=await retryTemporaryCloudFailure(()=>withCloudAuth(session,token=>cloudApi.listLeads(token)));
        let workspace,workspaceIsLive=true;
        try{
            workspace=await retryTemporaryCloudFailure(()=>withCloudAuth(session,token=>cloudApi.getWorkspace(token)));
        }catch(error){
            workspaceIsLive=false;
            console.warn('Workspace module refresh was unavailable; retaining the live lead list.',error.message);
            workspace=loadCloudWorkspaceCache(session.user?.username)||outageWorkspace(event)||{};
        }
        const selected=cloudApi.selectCloudWorkspace(result.leads);
        if(selected.marker?.id&&String(selected.marker.id)!==String(session.lastResetMarkerId||'')){
            applySynchronizedBusinessReset();session.lastResetMarkerId=String(selected.marker.id);session.leadIds.clear();session.nextLeadId=-1;
        }
        // Some older Worker list routes omit confirmed leads even though their
        // bookings are present in the same Cloud workspace. Recover only those
        // missing linked records from the read-only backup snapshot.
        let cloudLeadRows=selected.leads;
        const listedLeadIds=new Set(cloudLeadRows.map(lead=>String(lead.id)));
        const linkedLeadIds=new Set((workspace.bookings||[]).map(row=>String(row.lead_id??row.leadId??'')).filter(Boolean));
        if([...linkedLeadIds].some(id=>!listedLeadIds.has(id))){
            try{
                const backup=await withCloudAuth(session,token=>cloudApi.createBackup(token));
                const backupRows=cloudApi.selectCloudWorkspace(backup?.leads||[]).leads;
                const extras=backupRows.filter(row=>linkedLeadIds.has(String(row.id))&&!listedLeadIds.has(String(row.id)));
                if(extras.length)cloudLeadRows=[...cloudLeadRows,...extras];
            }catch(error){console.warn('Confirmed lead recovery was unavailable',error.message);}
        }
        const deletedRows=cloudLeadRows.filter(lead=>String(lead.notes||'').includes(DELETED_LEAD_MARKER)),deletedLeadIds=new Set(deletedRows.map(lead=>String(lead.id)));
        const visibleRows=cloudLeadRows.filter(lead=>!deletedLeadIds.has(String(lead.id))&&!session.clearedLeadIds.has(String(lead.id)));
        const leads=mapCloudLeads(session,visibleRows);
        const visibleIds=new Set(visibleRows.map(lead=>String(lead.id)));
        // Lead activities are supplementary data.  A temporary failure in that
        // endpoint must never discard an otherwise successful lead/workspace
        // refresh and replace it with an old local cache.  That was making a
        // freshly saved lead appear to vanish even though it was already in
        // the Cloud database and in GET /api/leads.
        let activityRows=[];
        try{
            const activityResult=await retryTemporaryCloudFailure(()=>withCloudAuth(session,token=>cloudApi.listLeadActivities(token)));
            activityRows=activityResult.activities||[];
        }catch(error){
            console.warn('Lead activity refresh was unavailable; keeping the current workspace data.',error.message);
            activityRows=loadCloudWorkspaceCache(session.user?.username)?.activities||[];
        }
        const activities=activityRows.filter(activity=>visibleIds.has(String(activity.lead_id))).map(activity=>({...activity,lead_id:session.leadIds.get(activity.lead_id)??activity.lead_id}));
        const visibleWorkspace=workspaceAfterReset(workspace,selected.marker),customers=(visibleWorkspace.customers||[]).filter(row=>!deletedLeadIds.has(String(row.lead_id??row.leadId))),deletedCustomerIds=new Set((visibleWorkspace.customers||[]).filter(row=>deletedLeadIds.has(String(row.lead_id??row.leadId))).map(row=>String(row.id))),bookings=(visibleWorkspace.bookings||[]).filter(row=>!deletedLeadIds.has(String(row.lead_id??row.leadId))&&!deletedCustomerIds.has(String(row.customer_id??row.customerId))),deletedBookingIds=new Set((visibleWorkspace.bookings||[]).filter(row=>deletedLeadIds.has(String(row.lead_id??row.leadId))||deletedCustomerIds.has(String(row.customer_id??row.customerId))).map(row=>String(row.id))),keepConnected=row=>!deletedBookingIds.has(String(row.booking_id??row.bookingId))&&!deletedCustomerIds.has(String(row.customer_id??row.customerId));
        const cachedEvents=new Map((loadCloudWorkspaceCache(session.user?.username)?.events||[]).map(row=>[String(row.id),row]));
        const savedEvents=(visibleWorkspace.events||[]).filter(keepConnected).map(row=>{
            const cached=cachedEvents.get(String(row.id)),remoteStatus=String(row.date_status??row.dateStatus??'').trim().toLowerCase(),cachedStatus=String(cached?.date_status??cached?.dateStatus??'').trim().toLowerCase(),cachedDate=String(cached?.start_date??cached?.startDate??'').slice(0,10);
            // Guard against a delayed workspace response overwriting a locally
            // saved confirmed date with its older TBD representation.
            return remoteStatus==='tbd month'&&cachedStatus==='confirmed'&&/^\d{4}-\d{2}-\d{2}$/.test(cachedDate)?{...row,start_date:cachedDate,startDate:cachedDate,date_status:'Confirmed',dateStatus:'Confirmed',tbd_month:null,tbdMonth:null}:row;
        });
        // Older Worker versions converted confirmed leads into customers and
        // bookings but did not create the companion calendar event. Derive a
        // visible Event Flow row for each of those bookings so Operations never
        // loses a confirmed job. Saving its details materializes a normal Cloud
        // event linked to the same booking and customer.
        const leadByCloudId=new Map(visibleRows.map(row=>[String(row.id),row]));
        const customerById=new Map(customers.map(row=>[String(row.id),row]));
        const eventBookingIds=new Set(savedEvents.map(row=>String(row.booking_id??row.bookingId??'')).filter(Boolean));
        const awaitingDetailsEvents=bookings.flatMap(booking=>{
            const lead=leadByCloudId.get(String(booking.lead_id??booking.leadId??''));
            if(!lead||String(lead.status)!=='Confirmed'||eventBookingIds.has(String(booking.id)))return[];
            return[awaitingDetailsEventForBooking(booking,lead,customerById.get(String(booking.customer_id??booking.customerId??'')))];
        });
        const events=[...savedEvents,...awaitingDetailsEvents];
        const snapshot={...visibleWorkspace,customers,bookings,production:(visibleWorkspace.production||[]).filter(keepConnected),events,payments:(visibleWorkspace.payments||[]).filter(keepConnected),leads,activities,cloudStatus:workspaceIsLive?'connected':'partial'};
        saveCloudWorkspaceCache(session.user?.username,snapshot);
        const queued=offlineQueues.get(String(session.user.id))||loadOfflineQueue(session.user.username);
        return {...snapshot,pendingSync:queued.length};
    }catch(error){
        const wins=BrowserWindow.getAllWindows();
        for(const win of wins){if(!win.isDestroyed()&&event?.sender&&win.webContents.id===event.sender.id){win.webContents.send('Cloud temporarily unavailable. Showing the last synced data.');break;}}
        const workspace=outageWorkspace(event),user=resolveSessionUser(rendererSessions.get(event?.sender?.id)),queued=offlineQueues.get(String(user?.id))||loadOfflineQueue(user?.username);
        return {...workspace,cloudStatus:'offline',pendingSync:queued.length};
    }
}

async function createCloudBackupSnapshot(session){
    try{
        const raw=await withCloudAuth(session,token=>cloudApi.createBackup(token));
        if(raw?.kind==='lenspirecrm-cloud-backup')return{...raw,backupVersion:2,scope:'complete-cloud-workspace',moduleCounts:cloudBackupModuleCounts(raw)};
    }catch(error){if(![404,405,500].includes(error.status))throw error;}
    const [leadResult,workspace,activityResult,userResult]=await Promise.all([
        withCloudAuth(session,token=>cloudApi.listLeads(token)),
        withCloudAuth(session,token=>cloudApi.getWorkspace(token)),
        withCloudAuth(session,token=>cloudApi.listLeadActivities(token)),
        withCloudAuth(session,token=>cloudApi.listUsers(token))
    ]);
    const selected=cloudApi.selectCloudWorkspace(leadResult?.leads||[]);
    const users=Array.isArray(userResult)?userResult:(userResult?.users||[]);
    const snapshot={
        kind:'lenspirecrm-cloud-backup',app:'LenspireCRM Pro',exportedAt:new Date().toISOString(),
        organization:{name:session.user?.organizationName||session.user?.organization_name||'Ankit Studios'},
        leads:selected.leads||[],customers:workspace?.customers||[],bookings:workspace?.bookings||[],
        production:workspace?.production||[],productionActivities:workspace?.productionActivities||[],clientPortalAccess:[],clientPortalAccessLog:[],events:workspace?.events||[],payments:workspace?.payments||[],
        activities:activityResult?.activities||[],salesTargets:workspace?.salesTargets||[],
        photographers:workspace?.photographers||[],users,backupVersion:2,scope:'complete-cloud-workspace'
    };return{...snapshot,moduleCounts:cloudBackupModuleCounts(snapshot)};
}

function cloudBackupModuleCounts(payload){
    return{
        salesMarketing:{leads:(payload.leads||[]).length,customers:(payload.customers||[]).length,bookings:(payload.bookings||[]).length,activities:(payload.activities||[]).length,salesTargets:(payload.salesTargets||[]).length},
        operations:{events:(payload.events||[]).length,photographers:(payload.photographers||[]).length},
        accounts:{payments:(payload.payments||[]).length,bookings:(payload.bookings||[]).length},
        postProduction:{jobs:(payload.production||[]).length,activities:(payload.productionActivities||[]).length,portalAccess:(payload.clientPortalAccess||[]).length,portalAudit:(payload.clientPortalAccessLog||[]).length},teamManagement:{users:(payload.users||[]).length}
    };
}

function cloudBackupLeadInput(row,index,batch){
    return{
        leadCode:`LD-RST-${batch}-${String(index+1).padStart(4,'0')}`,
        name:row?.name||row?.client_name||'Restored Client',eventType:row?.event_type||row?.eventType||'Wedding',
        eventDate:row?.event_date||row?.eventDate||new Date().toISOString().slice(0,10),city:row?.city||'',
        source:row?.source||'Backup Restore',status:row?.status||'New',budget:row?.budget||'',
        assignedTo:row?.assigned_to||row?.assignedTo||'',mobile:row?.mobile||row?.client_mobile||'',priority:row?.priority||'Medium',notes:row?.notes||'',
        nextFollowupAt:row?.next_followup_at||row?.nextFollowupAt||null,clientName:row?.client_name||row?.clientName||row?.name||'',
        clientMobile:row?.client_mobile||row?.clientMobile||row?.mobile||'',coupleName:row?.couple_name||row?.coupleName||'',
        weddingDates:row?.wedding_dates||row?.weddingDates||'',totalClosing:Number(row?.total_closing??row?.totalClosing??0),
        paymentMode:row?.payment_mode||row?.paymentMode||'',advanceReceived:Number(row?.advance_received??row?.advanceReceived??0),
        receivedBy:row?.received_by||row?.receivedBy||'',paymentReceivedDate:row?.payment_received_date||row?.paymentReceivedDate||null,
        lostReason:row?.lost_reason||row?.lostReason||'',quotationPath:row?.quotation_path||row?.quotationPath||'',quotationName:row?.quotation_name||row?.quotationName||'',
        referredBy:row?.referred_by||row?.referredBy||'',referralCode:row?.referral_code||row?.referralCode||''
    };
}

async function restoreCloudBackupCompatibility(event,session,payload){
    const batch=Date.now().toString(36).toUpperCase(),leads=(payload.leads||[]).map((row,index)=>cloudBackupLeadInput(row,index,batch));
    await resetCloudBusinessData(session);
    if(leads.length)await withCloudAuth(session,token=>cloudApi.importLeads(token,leads));
    let workspace=await cloudWorkspace(event);
    const restoredCodes=new Set(leads.map(lead=>lead.leadCode));
    for(const lead of workspace.leads.filter(item=>restoredCodes.has(item.lead_code||item.leadCode)&&item.status==='Confirmed')){
        try{await ensureConfirmedCloudWorkflow(event,session,{...lead,id:cloudLeadUuid(session,lead.id)},'Backup Restore');}catch(error){if(!/already converted/i.test(String(error?.message||'')))throw error;}
    }
    for(const target of payload.salesTargets||[]){try{await withCloudAuth(session,token=>cloudApi.saveSalesTarget(token,target));}catch(error){console.warn('Could not restore sales target',error.message);}}
    return cloudWorkspace(event);
}

async function ensureConfirmedCloudWorkflow(event,session,leadData,performedBy){
    const cloudId=leadData?.cloud_id||leadData?.id;
    if(!cloudId)throw new Error('Confirmed lead could not be identified.');
    try{await withCloudAuth(session,token=>cloudApi.convertLead(token,cloudId,{performedBy}));}
    catch(error){throw new Error(`Confirmed lead was saved, but Accounts/Post Production sync failed: ${error.message||'Cloud conversion failed'}`);}
    // The Cloud conversion endpoint creates its connected event atomically.  Do not
    // call the general Operations event endpoint here: Sales users may only view
    // Operations and must not receive broad Operations editing rights.
    return cloudWorkspace(event);
}

async function authenticateCloudUser(event,credentials){
    const attempt=loginFailures.get(event.sender.id);
    if(attempt?.blockedUntil>Date.now())return{success:false,message:'Too many failed sign-in attempts. Try again in a few minutes.'};
    const username=String(credentials?.username||'').trim(),password=String(credentials?.password||'');
    if(!username||!password)return{success:false,message:'Enter your username and password.'};
    try{
        const result=await cloudApi.login(username,password);
        // Keep the tenant identity in the authenticated in-memory session. The
        // desktop never trusts a renderer-supplied organization identifier.
        const organizationName=String(result?.organization?.name||result?.user?.organizationName||result?.user?.organization_name||'Ankit Studios').trim()||'Ankit Studios';
        const user={...result.user,organizationName,organizationBranding:result?.organization||{},authSource:'cloud'};
        const session={user,accessToken:result.accessToken,refreshToken:result.refreshToken,leadIds:new Map(),clearedLeadIds:new Set(),lastResetMarkerId:null,nextLeadId:-1};cloudUsers.set(String(user.id),session);
        offlineUsers.delete(String(user.id));
        bindRendererSession(event,user);
        offlineWorkspaces.delete(String(user.id));
        offlineQueues.set(String(user.id),loadOfflineQueue(username));
        saveOfflineAccount(username,password,user);
        const synced=user.passwordUpgradeRequired?0:await flushOfflineEventQueue(session);
        loginFailures.delete(event.sender.id);
        return{success:true,user,migration:{imported:0,activitiesImported:0,deferred:true,synced}};
    }catch(error){
        if(isCloudUnavailable(error)){
            const cachedUser=verifyOfflineAccount(username,password);
            if(cachedUser){
                const user={...cachedUser,authSource:'offline'};
                offlineUsers.set(String(user.id),user);
                bindRendererSession(event,user);
                const cached=loadCloudWorkspaceCache(username);
                if(cached)offlineWorkspaces.set(String(user.id),cached);
                offlineQueues.set(String(user.id),loadOfflineQueue(username));
                loginFailures.delete(event.sender.id);
                return{success:true,user,migration:{imported:0,activitiesImported:0,deferred:true,offline:true,cached:Boolean(cached)}};
            }
        }
        const previous=loginFailures.get(event.sender.id)||{count:0};
        const count=previous.count+1;
        loginFailures.set(event.sender.id,{count,blockedUntil:count>=5?Date.now()+5*60*1000:0});
        return{success:false,message:error.message||'Unable to sign in to LenspireCRM Cloud.'};
    }
}

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1440,
        height: 900,
        minWidth: 1100,
        minHeight: 700,
        show: false,
        backgroundColor: '#0b0f19',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: true
        },
        autoHideMenuBar: true
    });

    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
    mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
    mainWindow.webContents.on('will-navigate', event => event.preventDefault());
    mainWindow.once('ready-to-show', () => {
        mainWindow.maximize();
        mainWindow.show();
    });
}

app.whenReady().then(createWindow).then(startAutoBackupScheduler);

// Handle IPC Database requests from UI
ipcMain.handle('get-session-user', async event => {const user=requireAuthenticated(event);const session=cloudSession(event);return session?await refreshCloudUser(session):user;});
ipcMain.handle('copy-to-clipboard', (event, value) => {requireAuthenticated(event);const text=String(value??'');if(!text.trim())throw new Error('There is no message to copy.');if(text.length>1000000)throw new Error('The message is too large to copy.');clipboard.writeText(text);return{success:true};});
// --- Sales: leads, imports/exports ---
ipcMain.handle('add-lead', async (event, leadData) => {
    requireDepartmentWrite(event,'sales');
    const session=cloudSession(event);
    if(!session)return addLead(leadData);
    const digits=value=>String(value||'').replace(/\D/g,'').slice(-10);
    const sameInput=row=>digits(row?.mobile||row?.client_mobile)===digits(leadData?.mobile||leadData?.clientMobile)&&String(row?.name||'').trim().toLowerCase()===String(leadData?.name||'').trim().toLowerCase();
    const created=await withCloudAuth(session,token=>cloudApi.createLead(token,leadData));
    let lead=created?.lead||created;
    let listed=await withCloudAuth(session,token=>cloudApi.listLeads(token));
    let rows=Array.isArray(listed)?listed:(listed?.leads||[]);
    // Do not trust a success response by itself: older Worker revisions can
    // return an ID before the row is actually committed to the Cloud list.
    lead=rows.find(row=>lead?.id&&idMatches(row.id,lead.id))||rows.find(sameInput)||null;
    // Some Worker revisions acknowledge POST /api/leads before retaining the
    // row. The import route is transactional, so use it as a verified fallback.
    if(!lead?.id){
        const fallbackCode=`LD-MAN-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
        await withCloudAuth(session,token=>cloudApi.importLeads(token,[{...leadData,leadCode:fallbackCode}]));
        listed=await withCloudAuth(session,token=>cloudApi.listLeads(token));
        rows=Array.isArray(listed)?listed:(listed?.leads||[]);
        lead=rows.find(row=>String(row.lead_code||row.leadCode)==fallbackCode)||rows.find(sameInput);
    }
    if(!lead?.id)throw new Error('Cloud did not retain this lead. Nothing was saved; please try again after the Cloud service is updated.');
    // Confirmed leads are converted into connected CRM records immediately.
    // Keep the just-saved lead in the returned workspace as well: the Worker
    // can briefly return an older list while conversion is completing.
    const workspace=String(lead.status||leadData?.status)==='Confirmed'
        ?await ensureConfirmedCloudWorkflow(event,session,{...leadData,...lead},leadData?.performedBy)
        :await cloudWorkspace(event);
    const mapped=mapCloudLeads(session,[{...leadData,...lead}])[0],index=(workspace.leads||[]).findIndex(row=>String(row.cloud_id||row.id)===String(lead.id));
    if(index>=0)workspace.leads[index]={...workspace.leads[index],...mapped};else(workspace.leads||(workspace.leads=[])).push(mapped);
    saveCloudWorkspaceCache(session.user?.username,workspace);
    return workspace;
});
ipcMain.handle('import-leads-file', async (event) => {
    requireDepartmentWrite(event,'sales');
    const session = cloudSession(event);
    const selected = await showOwnedOpenDialog(event,{
        title: 'Import Leads from Excel', properties: ['openFile'],
        filters: [{ name: 'Excel and CSV files', extensions: ['xlsx', 'xls', 'csv'] }]
    });
    if (selected.canceled || !selected.filePaths[0]) return { canceled: true };
    assertImportFileSafe(selected.filePaths[0]);
    const workbook = XLSX.readFile(selected.filePaths[0], { cellDates: true });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    if (!sheet) throw new Error('The selected workbook has no worksheets.');
    const rows = assertImportRowsSafe(leadRowsFromSheet(sheet));
    if (!rows.length) throw new Error('The selected worksheet contains no lead rows.');
    const importBatch = `${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    let mapped=mapLeadRows(rows).map((lead,index)=>({...lead,leadCode:`LD-IMP-${importBatch}-${String(index+1).padStart(4,'0')}`}));
    if(session){
        const beforeImport=await cloudWorkspace(event),knownLeadKeys=new Set(beforeImport.leads.map(leadImportKey));let skippedDuplicates=0;
        mapped=mapped.filter(lead=>{const key=leadImportKey(lead);if(knownLeadKeys.has(key)){skippedDuplicates++;return false;}knownLeadKeys.add(key);return true;});
        if(!mapped.length)return{canceled:false,fileName:path.basename(selected.filePaths[0]),imported:0,skipped:skippedDuplicates,skippedDuplicates,converted:0,conversionSkipped:0,workspace:beforeImport};
        const result=await withCloudAuth(session,token=>cloudApi.importLeads(token,mapped));
        let workspace=await cloudWorkspace(event),converted=0,conversionSkipped=0;
        const importedCodes=new Set(mapped.map(lead=>lead.leadCode)),confirmedCodes=new Set(mapped.filter(lead=>lead.status==='Confirmed').map(lead=>lead.leadCode));
        const importedLeads=workspace.leads.filter(lead=>importedCodes.has(lead.lead_code||lead.leadCode));
        const confirmedImports=importedLeads.filter(lead=>confirmedCodes.has(lead.lead_code||lead.leadCode));
        for(const lead of confirmedImports){
            try{await ensureConfirmedCloudWorkflow(event,session,{...lead,id:cloudLeadUuid(session,lead.id)},'Excel Import');converted++;}
            catch(error){if(!/already converted/i.test(String(error?.message||'')))conversionSkipped++;}
        }
        return{canceled:false,fileName:path.basename(selected.filePaths[0]),imported:result?.imported??mapped.length,skipped:(result?.skipped??0)+skippedDuplicates,skippedDuplicates,converted,conversionSkipped,workspace};
    }
    return { canceled: false, fileName: path.basename(selected.filePaths[0]), ...importLeads(mapped) };
});

ipcMain.handle('import-payments-file', async (event) => {
    requireDepartmentWrite(event, 'accounts');
    const session = cloudSession(event);
    const selected = await dialog.showOpenDialog({
        title: 'Import Payments from Excel', properties: ['openFile'],
        filters: [{ name: 'Excel and CSV files', extensions: ['xlsx', 'xls', 'csv'] }]
    });
    if (selected.canceled || !selected.filePaths[0]) return { canceled: true };
    assertImportFileSafe(selected.filePaths[0]);
    const workbook = XLSX.readFile(selected.filePaths[0], { cellDates: true });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    if (!sheet) throw new Error('The selected workbook has no worksheets.');
    const rows = assertImportRowsSafe(XLSX.utils.sheet_to_json(sheet, { defval: '', raw: true }));
    if (!rows.length) throw new Error('The selected worksheet contains no payment rows.');
    const mapped=mapPaymentRows(rows);
    if(session){let imported=0,skipped=0,skippedDuplicates=0;const workspace=await cloudWorkspace(event),bookingCodes=new Map(workspace.bookings.map(booking=>[String(booking.id),booking.booking_code||booking.bookingCode||''])),knownKeys=new Set(workspace.payments.map(payment=>paymentImportKey(payment,bookingCodes.get(String(payment.booking_id||payment.bookingId))||'')));for(const payment of mapped){const key=paymentImportKey(payment);if(knownKeys.has(key)){skipped++;skippedDuplicates++;continue;}try{await withCloudAuth(session,token=>cloudApi.addPayment(token,payment));knownKeys.add(key);imported++;}catch{skipped++;}}if(!imported&&skippedDuplicates!==mapped.length)throw new Error('No valid payment rows were imported.');return{canceled:false,fileName:path.basename(selected.filePaths[0]),imported,skipped,skippedDuplicates,workspace:await cloudWorkspace(event)};}
    return { canceled: false, fileName: path.basename(selected.filePaths[0]), ...importPayments(mapped) };
});

ipcMain.handle('export-leads-file', async (event, leads) => {
    requireDepartmentRead(event, 'sales');
    const rows = (Array.isArray(leads) ? leads : []).map(lead => ({
        Date: String(lead.created_at || '').slice(0, 10),
        'Client Name': lead.name || '',
        'Sales Person': lead.assigned_to || '',
        'Couple Name': lead.couple_name || '',
        'Mobile Number': lead.mobile || '',
        Event: lead.event_type || '',
        'Event Date': lead.event_date || '',
        Source: lead.source || '',
        Status: lead.status || '',
        'Referred By': lead.referred_by || '',
        'Referral Code': lead.referral_code || '',
        'Total Closing': Number(lead.total_closing || 0)
    }));
    if (!rows.length) throw new Error('There are no leads to export.');
    const today = new Date().toISOString().slice(0, 10);
    const saved = await dialog.showSaveDialog({
        title: 'Export Leads to Excel',
        defaultPath: `Lenspire-Leads-${today}.xlsx`,
        filters: [{ name: 'Excel Workbook', extensions: ['xlsx'] }]
    });
    if (saved.canceled || !saved.filePath) return { canceled: true };
    const worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet['!cols'] = [12, 24, 20, 24, 18, 18, 14, 16, 14, 16, 16, 16].map(width => ({ width }));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads');
    XLSX.writeFile(workbook, saved.filePath);
    return { canceled: false, fileName: path.basename(saved.filePath), exported: rows.length };
});
ipcMain.handle('export-monthly-report', async (event, payload) => {
    requireDepartmentRead(event, 'sales');
    if (!payload || !payload.month) throw new Error('A report month is required.');
    const month = payload.month;
    const summarySheet = XLSX.utils.json_to_sheet([
        { Metric: 'Report Month', Value: month },
        { Metric: 'New Leads', Value: payload.newLeads || 0 },
        { Metric: 'Confirmed', Value: payload.confirmed || 0 },
        { Metric: 'Lost', Value: payload.lost || 0 },
        { Metric: 'Total Closing', Value: Number(payload.totalClosing || 0) },
        { Metric: 'Collections', Value: Number(payload.collections || 0) },
        { Metric: 'Target Amount', Value: Number(payload.targetAmount || 0) },
        { Metric: 'Target Achieved', Value: (payload.targetPercent || 0) + '%' }
    ]);
    summarySheet['!cols'] = [22, 18].map(width => ({ width }));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
    const sourceRows = (payload.bySource || []).map(item => ({ Source: item.source, Leads: item.count }));
    if (sourceRows.length) {
        const sheet = XLSX.utils.json_to_sheet(sourceRows);
        sheet['!cols'] = [24, 10].map(width => ({ width }));
        XLSX.utils.book_append_sheet(workbook, sheet, 'By Source');
    }
    const personRows = (payload.bySalesperson || []).map(item => ({
        'Sales Person': item.name,
        Leads: item.leads,
        Confirmed: item.confirmed,
        'Total Closing': Number(item.sales || 0),
        'Target Amount': Number(item.target || 0),
        'Achievement %': item.percent || 0
    }));
    if (personRows.length) {
        const sheet = XLSX.utils.json_to_sheet(personRows);
        sheet['!cols'] = [20, 10, 10, 16, 16, 14].map(width => ({ width }));
        XLSX.utils.book_append_sheet(workbook, sheet, 'By Salesperson');
    }
    const statusRows = (payload.byStatus || []).map(item => ({ Status: item.status, Leads: item.count }));
    if (statusRows.length) {
        const sheet = XLSX.utils.json_to_sheet(statusRows);
        sheet['!cols'] = [18, 10].map(width => ({ width }));
        XLSX.utils.book_append_sheet(workbook, sheet, 'By Status');
    }
    const dealRows = (payload.topDeals || []).map((lead, index) => ({
        Rank: index + 1,
        'Client Name': lead.name || '',
        'Mobile Number': lead.mobile || '',
        Event: lead.event || '',
        'Event Date': lead.date || '',
        'Total Closing': Number(lead.closing || 0),
        'Sales Person': lead.assignedTo || ''
    }));
    if (dealRows.length) {
        const sheet = XLSX.utils.json_to_sheet(dealRows);
        sheet['!cols'] = [8, 24, 18, 18, 14, 16, 20].map(width => ({ width }));
        XLSX.utils.book_append_sheet(workbook, sheet, 'Top Deals');
    }
    const saved = await dialog.showSaveDialog({
        title: 'Export Monthly Sales Report',
        defaultPath: `Lenspire-Sales-Report-${month}.xlsx`,
        filters: [{ name: 'Excel Workbook', extensions: ['xlsx'] }]
    });
    if (saved.canceled || !saved.filePath) return { canceled: true };
    XLSX.writeFile(workbook, saved.filePath);
    return { canceled: false, fileName: path.basename(saved.filePath), exported: 'monthly report' };
});
// --- Accounts: payments, monthly reports ---
ipcMain.handle('export-accounts-monthly-report', async (event, payload) => {
    requireDepartmentRead(event, 'accounts');
    if (!payload || !payload.month) throw new Error('A report month is required.');
    const month = payload.month;
    const summarySheet = XLSX.utils.json_to_sheet([
        { Metric: 'Report Month', Value: month },
        { Metric: 'Collected', Value: Number(payload.collected || 0) },
        { Metric: 'Refunded', Value: Number(payload.refunded || 0) },
        { Metric: 'Pending', Value: Number(payload.pending || 0) },
        { Metric: 'Payments', Value: payload.paidCount || 0 },
        { Metric: 'Refunds', Value: payload.refundCount || 0 },
        { Metric: 'Target Amount', Value: Number(payload.targetTotal || 0) },
        { Metric: 'Target Achieved', Value: (payload.targetPercent || 0) + '%' }
    ]);
    summarySheet['!cols'] = [22, 18].map(width => ({ width }));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
    const modeRows = (payload.byMode || []).map(item => ({ Mode: item.mode, Collected: Number(item.total || 0) }));
    if (modeRows.length) {
        const sheet = XLSX.utils.json_to_sheet(modeRows);
        sheet['!cols'] = [20, 16].map(width => ({ width }));
        XLSX.utils.book_append_sheet(workbook, sheet, 'By Payment Mode');
    }
    const personRows = (payload.byPerson || []).map(item => ({
        'Sales Person': item.name,
        Collected: Number(item.collected || 0),
        Payments: item.count || 0,
        'Target Amount': Number(item.target || 0),
        'Achievement %': item.percent || 0
    }));
    if (personRows.length) {
        const sheet = XLSX.utils.json_to_sheet(personRows);
        sheet['!cols'] = [20, 16, 10, 16, 14].map(width => ({ width }));
        XLSX.utils.book_append_sheet(workbook, sheet, 'By Salesperson');
    }
    const statusRows = (payload.statusMix || []).map(item => ({ Status: item[0], Payments: item[1] }));
    if (statusRows.length) {
        const sheet = XLSX.utils.json_to_sheet(statusRows);
        sheet['!cols'] = [16, 10].map(width => ({ width }));
        XLSX.utils.book_append_sheet(workbook, sheet, 'By Status');
    }
    const paymentRows = (payload.topPayments || []).map((p, index) => ({
        Rank: index + 1,
        'Client Name': p.clientName || '',
        'Booking Code': p.bookingCode || '',
        Date: p.date || '',
        Amount: Number(p.amount || 0),
        Mode: p.mode || '',
        'Sales Person': p.salesperson || ''
    }));
    if (paymentRows.length) {
        const sheet = XLSX.utils.json_to_sheet(paymentRows);
        sheet['!cols'] = [8, 24, 16, 14, 16, 18, 20].map(width => ({ width }));
        XLSX.utils.book_append_sheet(workbook, sheet, 'Top Payments');
    }
    const saved = await dialog.showSaveDialog({
        title: 'Export Monthly Accounts Report',
        defaultPath: `Lenspire-Accounts-Report-${month}.xlsx`,
        filters: [{ name: 'Excel Workbook', extensions: ['xlsx'] }]
    });
    if (saved.canceled || !saved.filePath) return { canceled: true };
    XLSX.writeFile(workbook, saved.filePath);
    return { canceled: false, fileName: path.basename(saved.filePath), exported: 'accounts monthly report' };
});
// --- Operations: events, photographers ---
ipcMain.handle('import-photographers-file', async (event) => {
    requireDepartmentWrite(event,'operations');
    const session = cloudSession(event);
    const selected = await dialog.showOpenDialog({
        title: 'Import Photographers from Excel', properties: ['openFile'],
        filters: [{ name: 'Excel and CSV files', extensions: ['xlsx', 'xls', 'csv'] }]
    });
    if (selected.canceled || !selected.filePaths[0]) return { canceled: true };
    assertImportFileSafe(selected.filePaths[0]);
    const workbook = XLSX.readFile(selected.filePaths[0]);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    if (!sheet) throw new Error('The selected workbook has no worksheets.');
    const rows = mapPhotographerRows(assertImportRowsSafe(XLSX.utils.sheet_to_json(sheet, { defval: '', raw: true })));
    if (!rows.length) throw new Error('The selected worksheet contains no photographer rows.');
    const existingWorkspace = session ? await cloudWorkspace(event) : getWorkspaceData();
    const existingMobiles = new Set(existingWorkspace.photographerDetails.map(item => String(item.mobile).replace(/\D/g, '')).filter(Boolean));
    let imported = 0, skipped = 0, skippedDuplicates = 0;
    for (const row of rows) {
        const mobileKey = row.mobile.replace(/\D/g, '');
        if (!row.name || !row.mobile || !row.work || !['In-House', 'Outside'].includes(row.status) || (mobileKey && existingMobiles.has(mobileKey))) { skipped++; continue; }
        try { if(session)await retryTemporaryCloudFailure(()=>cloudMutation(session,token=>cloudApi.savePhotographer(token,null,row),backup=>{(backup.photographers||(backup.photographers=[])).push({id:randomCloudId(),name:row.name,mobile:row.mobile,living_in:row.livingIn??row.living_in,work:row.work,status:row.status,created_at:new Date().toISOString()});}));else savePhotographerDetail(null,row); imported++; if (mobileKey) existingMobiles.add(mobileKey); } catch { skipped++; }
    }
    if (!imported) throw new Error('No valid photographer rows were found. Required columns: Photographer Name, Mobile, Work and Status.');
    return { canceled: false, imported, skipped, workspace: session ? await cloudWorkspace(event) : getWorkspaceData() };
});
ipcMain.handle('export-photographers-file', async (event, photographers) => {
    requireDepartmentRead(event, 'operations');
    const rows = (Array.isArray(photographers) ? photographers : []).map((item, index) => ({
        'Sr. No.': index + 1, "Photographer's Name": item.name || '', Mobile: item.mobile || '', 'Living In': item.living_in || '', Work: item.work || '', Status: item.status || ''
    }));
    if (!rows.length) throw new Error('There are no photographers to export.');
    const today = new Date().toISOString().slice(0, 10);
    const saved = await dialog.showSaveDialog({ title: 'Export Photographers to Excel', defaultPath: `Lenspire-Photographers-${today}.xlsx`, filters: [{ name: 'Excel Workbook', extensions: ['xlsx'] }] });
    if (saved.canceled || !saved.filePath) return { canceled: true };
    const worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet['!cols'] = [9, 28, 18, 22, 38, 14].map(width => ({ width }));
    const workbook = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(workbook, worksheet, 'Photographers'); XLSX.writeFile(workbook, saved.filePath);
    return { canceled: false, fileName: path.basename(saved.filePath), exported: rows.length };
});
ipcMain.handle('import-events-file', async (ipcEvent, mode = 'upcoming') => {
    requireDepartmentWrite(ipcEvent,'operations');
    const session = cloudSession(ipcEvent);
    const completed = mode === 'completed';
    const selected = await showOwnedOpenDialog(ipcEvent,{
        title: `Import ${completed ? 'Completed' : 'Upcoming'} Events from Excel`, properties: ['openFile'],
        filters: [{ name: 'Excel and CSV files', extensions: ['xlsx', 'xls', 'csv'] }]
    });
    if (selected.canceled || !selected.filePaths[0]) return { canceled: true };
    assertImportFileSafe(selected.filePaths[0]);
    const workbook = XLSX.readFile(selected.filePaths[0], { cellDates: true });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    if (!sheet) throw new Error('The selected workbook has no worksheets.');
    const rows = mapEventRows(assertImportRowsSafe(XLSX.utils.sheet_to_json(sheet, { defval: '', raw: true })));
    if (!rows.length) throw new Error('The selected worksheet contains no event rows.');
    const knownEvents = (session ? await cloudWorkspace(ipcEvent) : getWorkspaceData()).events || [];
    let imported = 0, skipped = 0;
    const importErrors = [];
    let consecutiveCloudFailures = 0;
    const notifyProgress = processed => ipcEvent.sender.send('events-import-progress',{processed,total:rows.length,imported,skipped});
    for (const [rowIndex,row] of rows.entries()) {
        const invalidDate = completed ? !/^\d{4}-\d{2}-\d{2}$/.test(row.startDate) : (row.dateStatus === 'Confirmed' && !/^\d{4}-\d{2}-\d{2}$/.test(row.startDate));
        if (!row.clientName || !row.eventType || invalidDate) { skipped++; notifyProgress(rowIndex+1); continue; }
        if (!row.coupleName) row.coupleName = row.clientName;
        if (!row.contactNo) row.contactNo = 'Contact pending';
        row.title = `${row.clientName} · ${row.eventType}`;
        if (completed) { row.status = 'Completed'; row.dateStatus = 'Confirmed'; row.tbdMonth = ''; }
        if (knownEvents.some(item => (!row.eventId || !idMatches(item.id,row.eventId)) && areDuplicateImportedEvents(item,row))) { skipped++; skippedDuplicates++; notifyProgress(rowIndex+1); continue; }
        try {
            if(session)await retryTemporaryCloudFailure(()=>cloudMutation(session,token=>cloudApi.saveEvent(token,row.eventId||null,normalizeCloudEvent(row)),backup=>{const rows=backup.events||(backup.events=[]),data=normalizeEventData(row),index=rows.findIndex(item=>idMatches(item.id,row.eventId));if(index>=0)Object.assign(rows[index],data);else rows.push({id:randomCloudId(),...data,created_at:new Date().toISOString()});}));else saveCalendarEvent(row.eventId,row);
        } catch (error) {
            skipped++;
            if(importErrors.length<5)importErrors.push(`row ${rowIndex+2} (${row.clientName||'Unnamed client'}): ${error.message||'Cloud save failed'}`);
            consecutiveCloudFailures++;
            notifyProgress(rowIndex+1);
            if(session&&imported===0&&consecutiveCloudFailures>=3)throw new Error(`Cloud rejected the first ${consecutiveCloudFailures} valid events. ${importErrors[0]}`);
            continue;
        }
        consecutiveCloudFailures=0;
        knownEvents.push({id:row.eventId||`import-${imported}`, ...normalizeEventData(row)});
        imported++;
        notifyProgress(rowIndex+1);
    }
    if (!imported && skippedDuplicates === rows.length) return { canceled: false, fileName: path.basename(selected.filePaths[0]), imported, skipped, skippedDuplicates, importErrors, workspace: session ? await cloudWorkspace(ipcEvent) : getWorkspaceData() };
    if (!imported) throw new Error(importErrors.length?`No events were imported. ${importErrors[0]}`:'No valid event rows were found. Check the client, event and confirmed-date columns.');
    return { canceled: false, fileName: path.basename(selected.filePaths[0]), imported, skipped, skippedDuplicates, importErrors, workspace: session ? await cloudWorkspace(ipcEvent) : getWorkspaceData() };
});
ipcMain.handle('export-events-file', async (event, payload) => {
    requireDepartmentRead(event, 'operations');
    const events = payload?.events, completed = payload?.mode === 'completed', label = completed ? 'Completed' : 'Upcoming';
    const rows = (Array.isArray(events) ? events : []).map((item, index) => ({
        'Sr. No.': index + 1, 'Event ID': item.id || '', 'Date Status': item.date_status || 'Confirmed', 'Event Date': item.date_status === 'TBD Month' ? '' : item.start_date || '',
        'TBD Month': item.tbd_month || '', 'Client Name': item.client_name || item.customerName || '', 'Handled By': item.handled_by || '',
        'Couple Name': item.couple_name || '', 'Contact No.': item.contact_no || '', Event: item.event_type || '', Photo: item.photo || '', Video: item.video || '',
        Candid: item.candid || '', Cinematic: item.cinematic || '', Drone: item.drone || '', Assistant: item.assistant || '', BTS: item.bts || '',
        Venue: item.city || '', Time: item.start_time || '', Notes: item.notes || '', Status: item.status || 'Scheduled'
    }));
    if (!rows.length) throw new Error(`There are no ${label.toLowerCase()} events to export.`);
    const now = new Date(), stamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const saved = await dialog.showSaveDialog({ title: `Export ${label} Events to Excel`, defaultPath: `Lenspire-${label}-Events-${stamp}.xlsx`, filters: [{ name: 'Excel Workbook', extensions: ['xlsx'] }] });
    if (saved.canceled || !saved.filePath) return { canceled: true };
    const worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet['!cols'] = [9,10,14,13,13,24,18,24,17,18,28,28,28,28,28,28,28,36,12,40,14].map(width => ({ width }));
    const workbook = XLSX.utils.book_new();XLSX.utils.book_append_sheet(workbook, worksheet, `${label} Events`);XLSX.writeFile(workbook, saved.filePath);
    return { canceled: false, fileName: path.basename(saved.filePath), exported: rows.length };
});
// --- Backup & restore ---
function quotationAttachments(){
    const folder=path.join(app.getPath('userData'),'quotation-attachments');
    return fs.existsSync(folder)?fs.readdirSync(folder,{withFileTypes:true}).filter(entry=>entry.isFile()).map(entry=>({name:entry.name,data:fs.readFileSync(path.join(folder,entry.name)).toString('base64')})):[];
}
function restoreQuotationAttachments(attachments){
    const folder=path.join(app.getPath('userData'),'quotation-attachments'),staged=`${folder}.restore-staged`,rollback=`${folder}.restore-rollback`;
    fs.rmSync(staged,{recursive:true,force:true});fs.rmSync(rollback,{recursive:true,force:true});fs.mkdirSync(staged,{recursive:true});
    try{
        for(const attachment of attachments)fs.writeFileSync(path.join(staged,attachment.name),Buffer.from(attachment.data,'base64'));
        if(fs.existsSync(folder))fs.renameSync(folder,rollback);
        try{fs.renameSync(staged,folder);fs.rmSync(rollback,{recursive:true,force:true});}catch(error){if(fs.existsSync(folder))fs.rmSync(folder,{recursive:true,force:true});if(fs.existsSync(rollback))fs.renameSync(rollback,folder);throw error;}
    }finally{fs.rmSync(staged,{recursive:true,force:true});}
}
function backupModuleCounts(workspace={}){
    return {salesMarketing:{leads:(workspace.leads||[]).length,customers:(workspace.customers||[]).length,bookings:(workspace.bookings||[]).length,activities:(workspace.activities||[]).length,salesTargets:(workspace.salesTargets||[]).length},operations:{events:(workspace.events||[]).length,photographers:(workspace.photographers||[]).length},accounts:{payments:(workspace.payments||[]).length,bookings:(workspace.bookings||[]).length},postProduction:{jobs:(workspace.production||[]).length,activities:(workspace.productionActivities||[]).length,portalAccess:(workspace.clientPortalAccess||[]).length,portalAudit:(workspace.clientPortalAccessLog||[]).length},teamManagement:{users:(workspace.users||[]).length}};
}
function backupSummaryText(payload){
    const counts=payload?.moduleCounts||{},sales=counts.salesMarketing||{},operations=counts.operations||{},accounts=counts.accounts||{},production=counts.postProduction||{};
    return `Leads: ${sales.leads??'database copy'}\nCustomers: ${sales.customers??'database copy'}\nBookings: ${sales.bookings??'database copy'}\nEvents: ${operations.events??'database copy'}\nPayments: ${accounts.payments??'database copy'}\nProduction jobs: ${production.jobs??'database copy'}\nProduction history: ${production.activities??'database copy'}\nClient Portal links: ${production.portalAccess??0}\nClient Portal audit entries: ${production.portalAudit??0}\nQuotation attachments: ${(payload?.attachments||[]).length}`;
}
async function createRestoreSafetyBackup(password){
    const folder=path.join(app.getPath('userData'),'restore-safety-backups');
    fs.mkdirSync(folder,{recursive:true});
    const stamp=new Date().toISOString().replace(/[:.]/g,'-');
    const filePath=path.join(folder,`Before-Restore-${stamp}.lenspirebackup`);
    const result=await createBackupFile({filePath,password});
    if(result.canceled)throw new Error('Could not create the automatic safety backup. Restore was cancelled.');
    return filePath;
}
async function createBackupFile(options = {}) {
    const password = options?.password ? String(options.password) : '';
    if (!/^\d{4}$/.test(password)) throw new Error('Backup password must be a 4-digit PIN (e.g. 1234).');
    const filePath = options?.filePath ? String(options.filePath) : null;
    const now = new Date();
    const padDatePart = value => String(value).padStart(2, '0');
    const backupTimestamp = `${now.getFullYear()}-${padDatePart(now.getMonth() + 1)}-${padDatePart(now.getDate())}_${padDatePart(now.getHours())}-${padDatePart(now.getMinutes())}-${padDatePart(now.getSeconds())}`;
    const savedPath = filePath || (await dialog.showSaveDialog({
        title: 'Back Up LenspireCRM Pro',
        defaultPath: `LenspireCRM-Backup-${backupTimestamp}.lenspirebackup`,
        filters: [{ name: 'LenspireCRM Backup', extensions: ['lenspirebackup'] }]
    })).filePath;
    if (!savedPath) return { canceled: true };
    const session = cloudSession({ sender: { id: 0 } });
    if(session){const snapshot=await createCloudBackupSnapshot(session);snapshot.attachments=quotationAttachments();const payload=encryptPayload(snapshot,password);fs.writeFileSync(savedPath,JSON.stringify(payload,null,2));return{canceled:false,fileName:path.basename(savedPath),attachments:snapshot.attachments.length,cloud:true,moduleCounts:snapshot.moduleCounts,encrypted:true};}
    const tempDatabase = path.join(app.getPath('temp'), `lenspire-backup-${process.pid}-${Date.now()}.db`);
    try {
        await backupDatabase(tempDatabase);
        const attachments=quotationAttachments();
        const payloadObj = { format: 'LenspireCRM-Pro-Backup', version: 1, createdAt: new Date().toISOString(), database: fs.readFileSync(tempDatabase).toString('base64'), attachments, moduleCounts:backupModuleCounts(getWorkspaceData()) };
        const payload = encryptPayload(payloadObj, password);
        fs.writeFileSync(savedPath, JSON.stringify(payload));
        return { canceled: false, fileName: path.basename(savedPath), attachments: attachments.length, encrypted: true };
    } finally {
        fs.rmSync(tempDatabase, { force: true });
    }
}
ipcMain.handle('create-crm-backup', async (event, options = {}) => {
    requireAdministrator(event);
    event.sender.send('backup-progress', { phase:'backup', message:'Starting encrypted backup…', percent:20 });
    const result = await createBackupFile(options);
    event.sender.send('backup-progress', { phase:'backup', message:'Backup completed', percent:100 });
    return result;
});
ipcMain.handle('restore-crm-backup', async (event) => {
    requireAdministrator(event);
    const session = cloudSession(event);
    event.sender.send('backup-progress', { phase:'restore', message:'Select a backup file…', percent:10 });
    const selected = await dialog.showOpenDialog({
        title: 'Restore LenspireCRM Pro', properties: ['openFile'],
        filters: [{ name: 'LenspireCRM Backup', extensions: ['lenspirebackup'] }]
    });
    if (selected.canceled || !selected.filePaths[0]) return { canceled: true };
    event.sender.send('backup-progress', { phase:'restore', message:'Reading backup file…', percent:30 });
    const raw = JSON.parse(fs.readFileSync(selected.filePaths[0], 'utf8'));
    if (!isEncryptedPayload(raw)) throw new Error('Unencrypted legacy backups cannot be restored directly. Re-encrypt this file with the migration utility first.');
    let payload = raw;
    let restorePassword = '';
    if (isEncryptedPayload(raw)) {
      event.sender.send('backup-progress', { phase:'restore', message:'Decrypting backup…', percent:50 });
      const requestId = crypto.randomUUID();
      event.sender.send('request-backup-password', { requestId });
      const password = await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          ipcMain.removeListener('backup-password-response', handler);
          reject(new Error('Backup password prompt timed out or was dismissed.'));
        }, 300000);
        const handler = (_, response) => {
          if (response?.requestId !== requestId) return;
          clearTimeout(timeout);
          ipcMain.removeListener('backup-password-response', handler);
          resolve(response.password);
        };
        ipcMain.on('backup-password-response', handler);
      });
      if (!password) throw new Error('Backup restore cancelled.');
      restorePassword = password;
      try {
        payload = decryptPayload(raw, password);
      } catch (error) {
        throw new Error('Incorrect backup password or corrupted backup file.');
      }
    }
    if(payload?.kind==='lenspirecrm-cloud-backup'&&payload.attachments===undefined)payload.attachments=[];
    if (!Array.isArray(payload?.attachments) || payload.attachments.some(item => !item || path.basename(String(item.name || '')) !== item.name || typeof item.data !== 'string')) throw new Error('The backup contains invalid attachment data.');
    const summary=await dialog.showMessageBox(BrowserWindow.fromWebContents(event.sender),{type:'warning',buttons:['Cancel Restore','Create Safety Backup & Restore'],defaultId:0,cancelId:0,title:'Confirm Backup Restore',message:'The current workspace will be replaced.',detail:`Backup contents:\n${backupSummaryText(payload)}\n\nA safety backup of the current workspace will be created automatically before this restore.`});
    if(summary.response!==1)return{canceled:true};
    const safetyBackupPath=await createRestoreSafetyBackup(restorePassword);
    event.sender.send('backup-progress', { phase:'restore', message:'Restoring to cloud…', percent:80 });
    if(session){
        if(payload?.kind==='lenspirecrm-cloud-backup'){
            const collections=['leads','customers','bookings','production','events','payments','activities','salesTargets','photographers'];
            for(const name of collections)if(!Array.isArray(payload[name]))throw new Error(`This is an incomplete backup: ${name} data is missing or invalid.`);
            const restorable={kind:'lenspirecrm-cloud-backup'};
            for(const name of collections)restorable[name]=Array.isArray(payload[name])?payload[name]:[];
            restorable.productionActivities=Array.isArray(payload.productionActivities)?payload.productionActivities:[];
            restorable.clientPortalAccess=Array.isArray(payload.clientPortalAccess)?payload.clientPortalAccess:[];
            restorable.clientPortalAccessLog=Array.isArray(payload.clientPortalAccessLog)?payload.clientPortalAccessLog:[];
            try{
                await withCloudAuth(session,token=>cloudApi.restoreBackup(token,restorable));
                restoreQuotationAttachments(payload.attachments);
                event.sender.send('backup-progress', { phase:'restore', message:'Restore complete', percent:100 });
                return{canceled:false,fileName:path.basename(selected.filePaths[0]),cloud:true,workspace:await cloudWorkspace(event)};
            }catch(error){
                if([404,405,500].includes(error.status))throw new Error(`This Cloud server cannot perform a complete restore, so no data was changed. Your automatic safety backup is saved at ${safetyBackupPath}. Please update the Cloud server before restoring this backup.`);
                throw error;
            }
        }
        if(payload?.format==='LenspireCRM-Pro-Backup'){/* fall through to local restore below */}else{throw new Error('Cloud accounts require a LenspireCRM cloud backup file.');}
    }
    if (payload?.format !== 'LenspireCRM-Pro-Backup' || payload?.version !== 1 || typeof payload.database !== 'string') throw new Error('This is not a valid LenspireCRM backup file.');
    const tempDatabase = path.join(app.getPath('temp'), `lenspire-restore-${process.pid}-${Date.now()}.db`);
    const attachmentFolder = path.join(app.getPath('userData'), 'quotation-attachments');
    const stagedAttachments = path.join(app.getPath('temp'), `lenspire-attachments-${process.pid}-${Date.now()}`);
    const rollbackAttachments = `${attachmentFolder}.restore-rollback`;
    let attachmentsRolledBack = false;
    try {
        fs.writeFileSync(tempDatabase, Buffer.from(payload.database, 'base64'));
        validateDatabaseBackup(tempDatabase);
        fs.mkdirSync(stagedAttachments, { recursive: true });
        for (const attachment of payload.attachments) fs.writeFileSync(path.join(stagedAttachments, attachment.name), Buffer.from(attachment.data, 'base64'));
        if (fs.existsSync(attachmentFolder)) {
            if (fs.existsSync(rollbackAttachments)) fs.rmSync(rollbackAttachments, { recursive: true, force: true });
            fs.renameSync(attachmentFolder, rollbackAttachments);
            attachmentsRolledBack = true;
        }
        try {
            fs.renameSync(stagedAttachments, attachmentFolder);
            replaceDatabaseFromBackup(tempDatabase);
            fs.rmSync(rollbackAttachments, { recursive: true, force: true });
        } catch (error) {
            if (attachmentsRolledBack) {
                if (fs.existsSync(attachmentFolder)) fs.rmSync(attachmentFolder, { recursive: true, force: true });
                if (fs.existsSync(rollbackAttachments)) fs.renameSync(rollbackAttachments, attachmentFolder);
            }
            throw error;
        }
        setTimeout(() => { app.relaunch(); app.exit(0); }, 700);
        return { canceled: false, fileName: path.basename(selected.filePaths[0]) };
    } finally {
        fs.rmSync(tempDatabase, { force: true });
        fs.rmSync(stagedAttachments, { recursive: true, force: true });
    }
});
ipcMain.handle('update-lead', async (event, payload) => {
    requireDepartmentWrite(event,'sales');
    const session=cloudSession(event);
    if(!session)throw new Error('Cloud is offline. Lead edits need Cloud access; your calendar event changes can still be queued safely.');
    let cloudId=cloudLeadUuid(session,payload?.leadId),updated;
    try{updated=await withCloudAuth(session,token=>cloudApi.updateLead(token,cloudId,payload?.lead));}
    catch(error){
        if(error?.status!==404)throw error;
        await refreshCloudLeadMap(session);
        cloudId=cloudLeadUuid(session,payload?.leadId);
        try{updated=await withCloudAuth(session,token=>cloudApi.updateLead(token,cloudId,payload?.lead));}
        catch(retryError){if(retryError?.status===404)throw new Error('This lead no longer exists in Cloud. Refresh the workspace before editing it again.');throw retryError;}
    }
    if(String(updated?.lead?.status||payload?.lead?.status)==='Confirmed')return ensureConfirmedCloudWorkflow(event,session,{...payload?.lead,...updated?.lead,id:cloudId},payload?.lead?.performedBy);
    return cloudWorkspace(event);
});
ipcMain.handle('upload-quotation-drive', async (event, payload) => {
  requireDepartmentWrite(event, 'sales');
  const session = cloudSession(event);
  if (!session) return { uploaded: false, reason: 'offline' };
  const cloudId = payload?.cloudId || (payload?.leadId ? cloudLeadUuid(session, payload?.leadId) : '');
  return uploadQuotationToDrive(session, cloudId, payload?.filePath, payload?.name);
});
ipcMain.handle('update-lead-attachment', async (event, payload) => {requireDepartmentWrite(event,'sales');const session=cloudSession(event);if(!session)return updateLeadAttachment(payload?.leadId, payload?.attachment, payload?.performedBy);const uuid=cloudLeadUuid(session,payload?.leadId);await withCloudAuth(session,token=>cloudApi.updateLeadAttachment(token,uuid,{path:payload?.attachment?.path||'',name:payload?.attachment?.name||''}));await withCloudAuth(session,token=>cloudApi.createLeadActivity(token,uuid,{type:'Quotation',description:`Quotation attached: ${payload?.attachment?.name||'Attachment'}.`}));return cloudWorkspace(event);});
ipcMain.handle('add-lead-activity', async (event, payload) => {requireDepartmentWrite(event,'sales');const session=cloudSession(event);if(!session)return addLeadActivity(payload?.leadId,payload?.activity);await withCloudAuth(session,token=>cloudApi.createLeadActivity(token,cloudLeadUuid(session,payload?.leadId),payload?.activity));return cloudWorkspace(event);});
ipcMain.handle('save-sales-target', async (event, target) => {requireDepartmentWrite(event,'sales');const session=cloudSession(event);if(!session)return saveSalesTarget(target);await cloudMutation(session,token=>cloudApi.saveSalesTarget(token,target),backup=>{const rows=backup.salesTargets||(backup.salesTargets=[]),index=rows.findIndex(row=>row.salesperson===target?.salesperson&&row.target_month===(target?.month||target?.targetMonth));const row={id:index>=0?rows[index].id:randomCloudId(),salesperson:target?.salesperson,target_month:target?.month||target?.targetMonth,target_amount:Number(target?.targetAmount||0),target_bookings:Number(target?.targetBookings||0),updated_at:new Date().toISOString()};if(index>=0)rows[index]=row;else rows.push(row);});return cloudWorkspace(event);});
ipcMain.handle('check-duplicate-mobile', async (event, payload) => {requireDepartmentRead(event,'sales');const session=cloudSession(event);if(!session)return checkDuplicateMobile(payload?.mobile,payload?.excludeId);const leads=(await cloudWorkspace(event)).leads,digits=value=>String(value||'').replace(/\D/g,'').slice(-10),match=leads.find(lead=>String(lead.id)!==String(payload?.excludeId)&&digits(lead.mobile)===digits(payload?.mobile));return match?{duplicate:true,lead:{id:match.id,code:match.lead_code,name:match.name}}:{duplicate:false};});
ipcMain.handle('delete-lead', async (event, request) => {
    requireDepartmentWrite(event,'sales');
    const session=cloudSession(event);
    const leadId=typeof request==='object'?request?.leadId:request;
    if(!session)return deleteLead(leadId);
    let uuid=String((typeof request==='object'&&request?.cloudId)||cloudLeadUuid(session,leadId));
    try{await cloudMutation(session,token=>cloudApi.deleteLead(token,uuid),backup=>removeLeadFromCloudBackup(backup,uuid,leadId));}catch(error){
        // Confirmed leads have linked bookings.  Older Worker revisions reject
        // their direct DELETE with a foreign-key error, so remove the complete
        // connected record set through the authoritative backup transaction.
        if(error.status===500){
            try{
                await withCloudAuth(session,token=>cloudApi.mutateWorkspace(token,backup=>removeLeadFromCloudBackup(backup,uuid,leadId)));
            }catch(backupError){
                // Some deployments do not expose backup restore. Their PUT
                // route is available, so use the deletion marker as the
                // durable compatibility path rather than reporting success
                // for a lead that remains visible in the CRM.
                const result=await withCloudAuth(session,token=>cloudApi.listLeads(token)),rows=Array.isArray(result)?result:(result?.leads||[]),row=rows.find(item=>idMatches(item.id,uuid)||idMatches(item.id,leadId));
                if(!row)throw backupError;
                uuid=String(row.id);
                const softDeleted={...cloudBackupLeadInput(row,0,'DELETE'),notes:`${DELETED_LEAD_MARKER} ${String(row.notes||'').replace(DELETED_LEAD_MARKER,'').trim()}`.trim()};
                await withCloudAuth(session,token=>cloudApi.updateLead(token,uuid,softDeleted));
            }
        }else{
        if(![404,405,500].includes(error.status))throw error;
        const result=await withCloudAuth(session,token=>cloudApi.listLeads(token)),rows=Array.isArray(result)?result:(result?.leads||[]),digits=value=>String(value||'').replace(/\D/g,'').slice(-10),row=rows.find(item=>idMatches(item.id,uuid)||idMatches(item.id,leadId)||(request?.leadCode&&String(item.lead_code||'')===String(request.leadCode))||(request?.mobile&&digits(item.mobile)===digits(request.mobile)));
        if(!row){
            // The record has already disappeared from Cloud. Treat this as a
            // successful cleanup so the cached desktop row stops reappearing.
            session.clearedLeadIds.add(uuid);
            session.leadIds.delete(uuid);
            return cloudWorkspace(event);
        }
        uuid=String(row.id);
        const softDeleted={...cloudBackupLeadInput(row,0,'DELETE'),notes:`${DELETED_LEAD_MARKER} ${String(row.notes||'').replace(DELETED_LEAD_MARKER,'').trim()}`.trim()};
        await withCloudAuth(session,token=>cloudApi.updateLead(token,uuid,softDeleted));
        }
    }
    // A few Worker revisions acknowledge DELETE even though a dependent lead
    // row remains in the response. Verify the result and use the supported
    // update route to hide that exact Cloud row when necessary.
    const verification=await withCloudAuth(session,token=>cloudApi.listLeads(token));
    const verificationRows=Array.isArray(verification)?verification:(verification?.leads||[]);
    const stillVisible=verificationRows.find(row=>idMatches(row.id,uuid)||idMatches(row.id,leadId));
    if(stillVisible&&!String(stillVisible.notes||'').includes(DELETED_LEAD_MARKER)){
        uuid=String(stillVisible.id);
        const softDeleted={...cloudBackupLeadInput(stillVisible,0,'DELETE'),notes:`${DELETED_LEAD_MARKER} ${String(stillVisible.notes||'').replace(DELETED_LEAD_MARKER,'').trim()}`.trim()};
        try{await withCloudAuth(session,token=>cloudApi.updateLead(token,uuid,softDeleted));}
        catch(error){if(error.status!==404)throw error;}
    }
    // Some Cloud deployments briefly return the pre-delete list. Hide the
    // deleted Cloud ID before refreshing so the UI cannot show a stale row.
    session.clearedLeadIds.add(uuid);
    session.leadIds.delete(uuid);
    const workspace=await cloudWorkspace(event);
    workspace.leads=(workspace.leads||[]).filter(row=>!idMatches(row.cloud_id??row.id,uuid)&&!idMatches(row.id,leadId));
    saveCloudWorkspaceCache(session.user?.username,workspace);
    return workspace;
});
ipcMain.handle('reset-business-data', async (event, requesterId) => {
    const admin = requireAdministrator(event);
    const session = cloudSession(event);
    // Map cloud UUID to local user ID if needed
    const localAdmin = session ? getSessionUserByUsername(admin.username) : getSessionUser(admin.id || requesterId);
    if (!localAdmin || localAdmin.role !== 'Administrator') throw new Error('The matching local administrator account could not be found.');
    const localRequesterId = localAdmin.id;
    if (session) await resetCloudBusinessData(session);
    const workspace = resetBusinessData(localRequesterId);
    fs.rmSync(path.join(app.getPath('userData'), 'quotation-attachments'), { recursive: true, force: true });
    return workspace;
});
ipcMain.handle('authenticate-user', authenticateCloudUser);
ipcMain.handle('logout-user', event => {const userId=rendererSessions.get(event.sender.id);rendererSessions.delete(event.sender.id);if(userId){cloudUsers.delete(String(userId));offlineUsers.delete(String(userId));offlineWorkspaces.delete(String(userId));offlineQueues.delete(String(userId));}return{success:true};});
const validateAccountPassword = value => {const password=String(value||'');if(!/^\d{4}$/.test(password))throw new Error('Password must be a 4-digit number (e.g. 1234).');return password;};
ipcMain.handle('change-cloud-password', async (event,payload) => {const user=requireAuthenticated(event);const session=cloudSession(event);if(!session)throw new Error('Your cloud session has expired. Please sign in again.');const newPassword=validateAccountPassword(payload?.newPassword,user.role);return withCloudAuth(session,token=>cloudApi.changePassword(token,payload?.currentPassword,newPassword));});
function requirePlatformOwner(event){
    const session=cloudSession(event);
    if(!session?.user?.isPlatformOwner)throw new Error('LenspireCRM Owner access is required.');
    return session;
}
ipcMain.handle('list-platform-organizations', async event => {
    const session=requirePlatformOwner(event);
    return withCloudAuth(session,token=>cloudApi.listPlatformOrganizations(token));
});
ipcMain.handle('create-platform-organization', async (event,payload) => {
    const session=requirePlatformOwner(event);
    return withCloudAuth(session,token=>cloudApi.createPlatformOrganization(token,payload));
});
ipcMain.handle('set-platform-organization-status', async (event,payload) => {
    const session=requirePlatformOwner(event);
    return withCloudAuth(session,token=>cloudApi.setPlatformOrganizationStatus(token,payload?.organizationId,payload?.status));
});
ipcMain.handle('update-platform-organization-subscription', async (event,payload) => {
    const session=requirePlatformOwner(event);
    return withCloudAuth(session,token=>cloudApi.updatePlatformOrganizationSubscription(token,payload?.organizationId,{plan:payload?.plan,subscriptionExpiresAt:payload?.subscriptionExpiresAt,licenseCode:payload?.licenseCode}));
});
ipcMain.handle('update-platform-organization-branding', async (event,payload) => {
    const session=requirePlatformOwner(event);
    return withCloudAuth(session,token=>cloudApi.updatePlatformOrganizationBranding(token,payload?.organizationId,{logoUrl:payload?.logoUrl,contactPhone:payload?.contactPhone,whatsappNumber:payload?.whatsappNumber,contactEmail:payload?.contactEmail,studioAddress:payload?.studioAddress,documentHeader:payload?.documentHeader,documentFooter:payload?.documentFooter,studioSlug:payload?.studioSlug}));
});
ipcMain.handle('upload-platform-organization-logo', async (event,payload) => {
    const session=requirePlatformOwner(event);
    const selected=await showOwnedOpenDialog(event,{title:'Upload Studio Logo',properties:['openFile'],filters:[{name:'PNG logo files',extensions:['png']}]});
    if(selected.canceled||!selected.filePaths[0])return{canceled:true};
    const source=selected.filePaths[0],size=fs.statSync(source).size;
    if(size<=0||size>2*1024*1024)throw new Error('Logo image must be 2 MB or smaller.');
    const extension=path.extname(source).toLowerCase(),mimeType={'.png':'image/png'}[extension];
    if(!mimeType)throw new Error('Choose a PNG logo file.');
    return withCloudAuth(session,token=>cloudApi.uploadPlatformOrganizationLogo(token,payload?.organizationId,{name:path.basename(source),mimeType,buffer:fs.readFileSync(source)}));
});
ipcMain.handle('connect-google-drive', async event => {const session=cloudSession(event);if(!session)throw new Error('Your cloud session has expired. Please sign in again.');const result=await withCloudAuth(session,token=>cloudApi.googleConnect(token));const authorizationUrl=new URL(result.authorizationUrl);if(authorizationUrl.protocol!=='https:')throw new Error('Cloud service returned an invalid authorization URL.');await shell.openExternal(authorizationUrl.toString());return{success:true};});
// --- Users & roles ---
ipcMain.handle('list-users', async (event, requesterId) => {const session=cloudSession(event);requireAdministrator(event);if(!session)return listUsers(requesterId);const result=await withCloudAuth(session,token=>cloudApi.listUsers(token));return Array.isArray(result)?result:(result?.users||[]);});
ipcMain.handle('list-post-production-users', async event => {const currentUser=requireDepartmentRead(event,'postProduction');const session=cloudSession(event);if(!session)return listPostProductionUsers();try{const result=await withCloudAuth(session,token=>cloudApi.listUsers(token)),users=Array.isArray(result)?result:(result?.users||[]);return users.filter(user=>user.active!==false&&(['Post Production','Editor'].includes(user.role)||String(user.displayName||'').trim().toLowerCase()==='anuj singh'));}catch(error){if([401,403].includes(error.status)&&['Post Production','Editor'].includes(currentUser.role))return[{id:currentUser.id,displayName:currentUser.displayName,role:currentUser.role,active:true}];throw error;}});
ipcMain.handle('create-user', async (event, payload) => {const admin=requireAdministrator(event);const session=cloudSession(event);const user={...(payload?.user||{}),password:validateAccountPassword(payload?.user?.password,payload?.user?.role)};return session?withCloudAuth(session,token=>cloudApi.createUser(token,user)):createUser(payload?.requesterId,user,admin.role);});
ipcMain.handle('set-user-department-access', async (event, payload) => {requireAdministrator(event);const session=cloudSession(event);return session?withCloudAuth(session,token=>cloudApi.setUserDepartmentAccess(token,payload?.userId,payload?.access)):setUserDepartmentAccess(payload?.requesterId,payload?.userId,payload?.access);});
ipcMain.handle('set-user-role', async (event,payload)=>{requireAdministrator(event);const session=cloudSession(event),role=String(payload?.role||'');const allowed=['Sales','Management','Accounts','Post Production','Editor','Sales Executive','Photographer','Cinematographer'];if(!allowed.includes(role))throw new Error('Select a valid role.');if(!session)return setUserRole(payload?.requesterId,payload?.userId,role);await withCloudAuth(session,token=>cloudApi.setUserRole(token,payload?.userId,role));if(role==='Editor')await withCloudAuth(session,token=>cloudApi.setUserDepartmentAccess(token,payload?.userId,{sales:'none',operations:'none',accounts:'none',postProduction:'full'}));return withCloudAuth(session,token=>cloudApi.listUsers(token));});
ipcMain.handle('set-user-active', async (event, payload) => {requireAdministrator(event);const session=cloudSession(event);return session?withCloudAuth(session,token=>cloudApi.setUserActive(token,payload?.userId,payload?.active)):setUserActive(payload?.requesterId,payload?.userId,payload?.active);});
ipcMain.handle('reset-user-password', async (event, payload) => {requireAdministrator(event);const session=cloudSession(event);if(!session)return resetUserPassword(payload?.requesterId,payload?.userId,payload?.password);const result=await withCloudAuth(session,token=>cloudApi.listUsers(token)),users=Array.isArray(result)?result:(result?.users||[]),target=users.find(user=>String(user.id)===String(payload?.userId));if(!target)throw new Error('User account not found.');const password=validateAccountPassword(payload?.password,target.role);return withCloudAuth(session,token=>cloudApi.resetUserPassword(token,payload?.userId,password));});
ipcMain.handle('get-workspace-data', event => {requireAuthenticated(event);return cloudWorkspace(event);});
ipcMain.handle('convert-lead', async (event, payload) => {requireDepartmentWrite(event,'sales');const session=cloudSession(event);if(!session)return convertLeadToCustomer(payload?.leadId,payload?.options);const result=await withCloudAuth(session,token=>cloudApi.convertLead(token,cloudLeadUuid(session,payload?.leadId),payload?.options));return{...result,workspace:await cloudWorkspace(event)};});
// --- Production & calendar ---
ipcMain.handle('update-production-stage', async (event, payload) => {requireDepartmentWrite(event,'postProduction');const session=cloudSession(event);if(!session)return updateProductionStage(payload?.jobId,payload?.stage);await cloudMutation(session,token=>cloudApi.updateProduction(token,payload?.jobId,{stage:payload?.stage}),backup=>{const row=(backup.production||[]).find(item=>idMatches(item.id,payload?.jobId));if(!row)throw new Error('Production job not found.');row.stage=payload?.stage;});return cloudWorkspace(event);});
ipcMain.handle('update-production-job', async (event, payload) => {requireDepartmentWrite(event,'postProduction');const session=cloudSession(event),data=normalizeProductionData(payload?.data);if(!session)return updateProductionJob(payload?.jobId,payload?.data);const saved=await cloudMutation(session,token=>cloudApi.updateProduction(token,payload?.jobId,{...payload?.data,...data}),backup=>{const row=(backup.production||[]).find(item=>idMatches(item.id,payload?.jobId));if(!row)throw new Error('Production job not found.');Object.assign(row,Object.fromEntries(Object.entries(data).filter(([,value])=>value!==undefined)));});const workspace=await cloudWorkspace(event),savedJob=saved?.job||saved,index=(workspace.production||[]).findIndex(row=>idMatches(row.id,payload?.jobId));if(index>=0)workspace.production[index]={...workspace.production[index],...data,...savedJob};saveCloudWorkspaceCache(session.user?.username,workspace);return workspace;});
ipcMain.handle('save-calendar-event', async (event, payload) => {
    requireDepartmentWrite(event,'operations');
    const session=cloudSession(event),normalized=normalizeEventData(payload?.event),syntheticAwaitingEvent=String(payload?.eventId||'').startsWith('awaiting-booking-'),cloudEventId=syntheticAwaitingEvent?null:(payload?.eventId||null);
    if(!session)return queueOfflineEventChange(event,{type:'save-event',eventId:cloudEventId,event:normalized});
    try{
        const saved=await cloudMutation(session,token=>cloudApi.saveEvent(token,cloudEventId,normalized),backup=>{const rows=backup.events||(backup.events=[]),data=normalizeEventData(payload?.event),index=rows.findIndex(row=>idMatches(row.id,cloudEventId));if(index>=0)Object.assign(rows[index],data);else rows.push({id:randomCloudId(),...data,created_at:new Date().toISOString()});});
        const workspace=await cloudWorkspace(event),savedEvent=saved?.event||saved,eventId=payload?.eventId||savedEvent?.id;
        // A Worker save is authoritative, but the following workspace read can
        // briefly return its previous snapshot. Keep the just-saved event in
        // the returned workspace so a TBD → confirmed-date change stays visible.
        if(savedEvent&&eventId){
            const events=workspace.events||(workspace.events=[]),index=events.findIndex(row=>idMatches(row.id,eventId)),persisted={...normalized,...savedEvent,id:eventId};
            if(index>=0)events[index]={...events[index],...persisted};
            else events.push(persisted);
        }
        saveCloudWorkspaceCache(session.user?.username,workspace);
        return workspace;
    }
    catch(error){if(isCloudUnavailable(error))return queueOfflineEventChange(event,{type:'save-event',eventId:payload?.eventId||null,event:normalized});throw error;}
});
ipcMain.handle('delete-calendar-event', async (event, eventId) => {
    requireDepartmentWrite(event,'operations');
    const session=cloudSession(event);
    if(!session)return queueOfflineEventChange(event,{type:'delete-event',eventId});
    try{await cloudMutation(session,token=>cloudApi.deleteEvent(token,eventId),backup=>{backup.events=(backup.events||[]).filter(row=>!idMatches(row.id,eventId));});return cloudWorkspace(event);}
    catch(error){if(isCloudUnavailable(error))return queueOfflineEventChange(event,{type:'delete-event',eventId});throw error;}
});
ipcMain.handle('mark-events-slotted', async (event, eventIds=[]) => {requireDepartmentWrite(event,'operations');const session=cloudSession(event);if(!session){const db=getDB(),placeholders=eventIds.map(()=>'?').join(',');db.prepare(`UPDATE calendar_events SET slotted=1 WHERE id IN (${placeholders})`).run(...eventIds);return getWorkspaceFromDB();}try{await cloudMutation(session,token=>cloudApi.bulkUpdateEvents(token,eventIds,{slotted:1}),backup=>{(backup.events||[]).forEach(row=>{if(eventIds.some(id=>idMatches(id,row.id)))row.slotted=1;});});return cloudWorkspace(event);}catch(error){if(isCloudUnavailable(error)){const db=getDB(),placeholders=eventIds.map(()=>'?').join(',');db.prepare(`UPDATE calendar_events SET slotted=1 WHERE id IN (${placeholders})`).run(...eventIds);return getWorkspaceFromDB();}throw error;}
});
ipcMain.handle('save-photographer-detail', async (event, payload) => {requireDepartmentWrite(event,'operations');const session=cloudSession(event);if(!session)return savePhotographerDetail(payload?.detailId,payload?.detail);await cloudMutation(session,token=>cloudApi.savePhotographer(token,payload?.detailId,payload?.detail),backup=>{const rows=backup.photographers||(backup.photographers=[]),data={name:payload?.detail?.name,mobile:payload?.detail?.mobile,living_in:payload?.detail?.livingIn??payload?.detail?.living_in,work:payload?.detail?.work,status:payload?.detail?.status},index=rows.findIndex(row=>idMatches(row.id,payload?.detailId));if(index>=0)Object.assign(rows[index],data);else rows.push({id:randomCloudId(),...data,created_at:new Date().toISOString()});});return cloudWorkspace(event);});
ipcMain.handle('delete-photographer-detail', async (event, detailId) => {requireDepartmentWrite(event,'operations');const session=cloudSession(event);if(!session)return deletePhotographerDetail(detailId);await cloudMutation(session,token=>cloudApi.deletePhotographer(token,detailId),backup=>{backup.photographers=(backup.photographers||[]).filter(row=>!idMatches(row.id,detailId));});return cloudWorkspace(event);});
ipcMain.handle('get-accounts-data', async event => {requireDepartmentRead(event,'accounts');const session=cloudSession(event);if(!session)return getAccountsData();const workspace=await cloudWorkspace(event);return{payments:workspace.payments||[],bookings:workspace.bookings||[],salesTargets:workspace.salesTargets||[],asOf:workspace.asOf||new Date().toISOString(),todayKey:new Date().toISOString().slice(0,10)};});
ipcMain.handle('create-client-portal-link', async (event, payload) => {requireDepartmentWrite(event,'accounts');const session=cloudSession(event);if(!session)throw new Error('Client Portal links require Cloud access.');const bookingId=payload?.bookingId||payload;return withCloudAuth(session,token=>cloudApi.createClientPortalLink(token,bookingId,{expiryDays:payload?.expiryDays,mode:payload?.mode}));});
ipcMain.handle('get-client-portal-access', async (event, bookingId) => {requireDepartmentRead(event,'accounts');const session=cloudSession(event);if(!session)throw new Error('Client Portal access details require Cloud access.');return withCloudAuth(session,token=>cloudApi.getClientPortalAccess(token,bookingId));});
ipcMain.handle('revoke-client-portal-access', async (event, bookingId) => {requireDepartmentWrite(event,'accounts');const session=cloudSession(event);if(!session)throw new Error('Client Portal access changes require Cloud access.');return withCloudAuth(session,token=>cloudApi.revokeClientPortalAccess(token,bookingId));});
ipcMain.handle('portal-invite', async (event, payload) => {requireDepartmentWrite(event,'accounts');const session=cloudSession(event);if(!session)throw new Error('Client Portal invites require Cloud access.');return withCloudAuth(session,token=>cloudApi.portalInvite(token,payload?.bookingId||payload,{name:payload?.name,email:payload?.email,phone:payload?.phone}));});
ipcMain.handle('add-payment', async (event, payload) => {requireDepartmentWrite(event,'accounts');const session=cloudSession(event);if(!session)return addPayment(payload);await cloudMutation(session,token=>cloudApi.addPayment(token,payload),backup=>{const data=normalizePaymentData(payload),booking=(backup.bookings||[]).find(row=>idMatches(row.id,data.booking_id));(backup.payments||(backup.payments=[])).push({id:randomCloudId(),...data,customer_id:data.customer_id||booking?.customer_id||null,created_at:new Date().toISOString()});});return cloudWorkspace(event);});
ipcMain.handle('update-payment', async (event, payload) => {requireDepartmentWrite(event,'accounts');const session=cloudSession(event);if(!session)return updatePayment(payload?.paymentId,payload?.data);await cloudMutation(session,token=>cloudApi.updatePayment(token,payload?.paymentId,payload?.data),backup=>{const row=(backup.payments||[]).find(item=>idMatches(item.id,payload?.paymentId));if(!row)throw new Error('Payment not found.');Object.assign(row,normalizePaymentData(payload?.data));});return cloudWorkspace(event);});
ipcMain.handle('delete-payment', async (event, paymentId) => {requireDepartmentWrite(event,'accounts');const session=cloudSession(event);if(!session)return deletePayment(paymentId);await cloudMutation(session,token=>cloudApi.deletePayment(token,paymentId),backup=>{backup.payments=(backup.payments||[]).filter(row=>!idMatches(row.id,paymentId));});return cloudWorkspace(event);});
ipcMain.handle('export-payments-file', async (event, payments) => {
    requireDepartmentRead(event, 'accounts');
    const rows = (Array.isArray(payments) ? payments : []).map(payment => ({
        Date: String(payment.created_at || '').slice(0, 10),
        'Booking Code': payment.booking_code || '',
        'Client Name': payment.clientName || '',
        'Payment Type': payment.payment_type || '',
        Amount: Number(payment.amount || 0),
        Mode: payment.payment_mode || '',
        Status: payment.status || '',
        'Due Date': payment.due_date || '',
        'Paid At': payment.paid_at || '',
        'Received By': payment.received_by || '',
        Salesperson: payment.salesperson || ''
    }));
    if (!rows.length) throw new Error('There are no payments to export.');
    const today = new Date().toISOString().slice(0, 10);
    const saved = await dialog.showSaveDialog({ title: 'Export Payments to Excel', defaultPath: `Lenspire-Payments-${today}.xlsx`, filters: [{ name: 'Excel Workbook', extensions: ['xlsx'] }] });
    if (saved.canceled || !saved.filePath) return { canceled: true };
    const worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet['!cols'] = [12, 16, 24, 14, 14, 14, 12, 12, 20, 16, 16].map(width => ({ width }));
    const workbook = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(workbook, worksheet, 'Payments'); XLSX.writeFile(workbook, saved.filePath);
    return { canceled: false, fileName: path.basename(saved.filePath), exported: rows.length };
});
ipcMain.handle('export-production-file', async (event, jobs) => {
    requireDepartmentRead(event, 'postProduction');
    const rows = (Array.isArray(jobs) ? jobs : []).map(job => ({
        'Booking Code': job.bookingCode || '',
        'Client Name': job.customerName || '',
        'Event Type': job.eventType || '',
        'Event Date': String(job.eventDate || '').slice(0, 10),
        Stage: job.stage || '',
        'RAW Status': job.raw_status || '',
        'Editing Status': job.editing_status || '',
        'Album Status': job.album_status || '',
        'Video Status': job.video_status || '',
        'Delivery Status': job.delivery_status || '',
        Editor: job.editor || '',
        'Due Date': String(job.due_date || '').slice(0, 10),
        'Delivered At': String(job.delivered_at || '').slice(0, 10),
        Photos: Number(job.photo_count || 0),
        Videos: Number(job.video_count || 0),
        Albums: Number(job.album_count || 0),
        'Quoted Amount': Number(job.quotedAmount || 0)
    }));
    if (!rows.length) throw new Error('There are no production jobs to export.');
    const today = new Date().toISOString().slice(0, 10);
    const saved = await dialog.showSaveDialog({ title: 'Export Production Jobs to Excel', defaultPath: `Lenspire-Production-${today}.xlsx`, filters: [{ name: 'Excel Workbook', extensions: ['xlsx'] }] });
    if (saved.canceled || !saved.filePath) return { canceled: true };
    const worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet['!cols'] = [16, 24, 16, 14, 18, 14, 16, 14, 14, 16, 18, 14, 14, 10, 10, 10, 14].map(width => ({ width }));
    const workbook = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(workbook, worksheet, 'Production'); XLSX.writeFile(workbook, saved.filePath);
    return { canceled: false, fileName: path.basename(saved.filePath), exported: rows.length };
});
// --- Quotations & misc ---
ipcMain.handle('select-quotation-file', async (event) => {
    requireDepartmentWrite(event,'sales');
    const selected = await dialog.showOpenDialog({
        title: 'Upload Client Quotation', properties: ['openFile'],
        filters: [{ name: 'Quotation documents', extensions: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png'] }]
    });
    if (selected.canceled || !selected.filePaths[0]) return { canceled: true };
    const source = selected.filePaths[0];
    const folder = path.join(app.getPath('userData'), 'quotation-attachments');
    fs.mkdirSync(folder, { recursive: true });
    const originalName = path.basename(source);
    const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const destination = path.join(folder, `${Date.now()}-${safeName}`);
    fs.copyFileSync(source, destination);
    return { canceled: false, path: destination, name: originalName };
});
ipcMain.handle('open-quotation-attachment', async (event, attachment) => {
    requireDepartmentRead(event, 'sales');
    const filePath = String(attachment?.path || '');
    const attachmentFolder = path.resolve(app.getPath('userData'), 'quotation-attachments');
    const resolvedPath = path.resolve(filePath);
    let usablePath=resolvedPath,localFileExists=Boolean(filePath && resolvedPath.startsWith(attachmentFolder + path.sep) && fs.existsSync(resolvedPath));
    if(!localFileExists&&fs.existsSync(attachmentFolder)){const wanted=String(attachment?.name||path.basename(filePath)).replace(/[^a-zA-Z0-9._-]/g,'_').toLowerCase(),match=fs.readdirSync(attachmentFolder,{withFileTypes:true}).filter(entry=>entry.isFile()).map(entry=>entry.name).find(name=>name.toLowerCase()===wanted||name.toLowerCase().endsWith(`-${wanted}`));if(match){usablePath=path.join(attachmentFolder,match);localFileExists=true;}}
    if (localFileExists && attachment?.action === 'view') {
        const error = await shell.openPath(usablePath);
        if (error) throw new Error(error);
        return { action: 'viewed' };
    }
    if (localFileExists && attachment?.action === 'download') {
        const saved = await dialog.showSaveDialog({ title: 'Download Quotation', defaultPath: attachment?.name || path.basename(filePath) });
        if (!saved.canceled && saved.filePath) { fs.copyFileSync(usablePath, saved.filePath); return { action: 'downloaded' }; }
        return { action: 'canceled' };
    }
    const session=cloudSession(event);
    if(!session)throw new Error('This quotation was saved on another PC and no cloud session is available. Upload it again from the original PC.');
    const cloudLeadId=cloudLeadUuid(session,attachment?.leadId),normalizeFileName=value=>path.basename(String(value||'')).replace(/\s+/g,' ').trim().toLowerCase(),wanted=normalizeFileName(attachment?.name);
    const leadResult=await withCloudAuth(session,token=>cloudApi.listDriveFiles(token,cloudLeadId)),leadFiles=Array.isArray(leadResult)?leadResult:(leadResult?.files||[]);
    let cloudFile=leadFiles.find(item=>normalizeFileName(item.name||item.fileName)===wanted);
    if(!cloudFile){const allResult=await withCloudAuth(session,token=>cloudApi.listDriveFiles(token,'')),allFiles=Array.isArray(allResult)?allResult:(allResult?.files||[]);cloudFile=allFiles.find(item=>normalizeFileName(item.name||item.fileName)===wanted);}
    if(!cloudFile)throw new Error('The local quotation is missing and no Google Drive backup was found. Please upload the quotation again.');
    const fileId=cloudFile.id||cloudFile.fileId,url=cloudFile.webViewLink||cloudFile.web_view_link||cloudFile.viewUrl||cloudFile.url||(fileId?`https://drive.google.com/file/d/${encodeURIComponent(fileId)}/view`:'');
    let parsed;try{parsed=new URL(url);}catch{throw new Error('The Google Drive attachment link is invalid. Please upload the quotation again.');}
    if(parsed.protocol!=='https:'||!/(^|\.)google\.com$/.test(parsed.hostname))throw new Error('The quotation link is not a trusted Google Drive address.');
    await shell.openExternal(parsed.toString());
    return { action: 'viewed', source: 'cloud' };
});

const autoBackupDirPath = path.join(app.getPath('userData'), 'auto-backups');
const autoBackupSettingsPath = path.join(app.getPath('userData'), 'autobackup-settings.bin');
const legacyAutoBackupSettingsPath = path.join(app.getPath('userData'), 'autobackup-settings.json');
function loadAutoBackupSettings(){
    try{return JSON.parse(safeStorage.decryptString(fs.readFileSync(autoBackupSettingsPath)));}catch{}
    try{
        const legacy=JSON.parse(fs.readFileSync(legacyAutoBackupSettingsPath,'utf8'));
        saveAutoBackupSettings(legacy);
        fs.rmSync(legacyAutoBackupSettingsPath,{force:true});
        return legacy;
    }catch{return{enabled:false,time:'02:00',password:'',lastBackup:null,retentionCount:7};}
}
function saveAutoBackupSettings(settings){
    if(!safeStorage.isEncryptionAvailable())throw new Error('Windows credential encryption is unavailable; auto-backup settings cannot be saved safely.');
    const normalized={enabled:settings?.enabled===true,time:/^([01]\d|2[0-3]):[0-5]\d$/.test(String(settings?.time||''))?settings.time:'02:00',password:String(settings?.password||''),lastBackup:settings?.lastBackup||null,retentionCount:Math.max(1,Math.min(30,Number(settings?.retentionCount)||settings?.retention_count||7))};
    if(normalized.enabled&&!/^\d{4}$/.test(normalized.password))throw new Error('Auto-backup password must be a 4-digit PIN (e.g. 1234).');
    fs.writeFileSync(autoBackupSettingsPath,safeStorage.encryptString(JSON.stringify(normalized)));
}
function pruneAutoBackupsLocal(){
    if(!fs.existsSync(autoBackupDirPath))return;
    const settings=loadAutoBackupSettings();
    const retention=settings.retentionCount||7;
    const files=fs.readdirSync(autoBackupDirPath).filter(f=>f.endsWith('.lenspirebackup')).map(f=>({name:f,path:path.join(autoBackupDirPath,f),mtime:fs.statSync(path.join(autoBackupDirPath,f)).mtimeMs})).sort((a,b)=>b.mtime-a.mtime);
    for(const stale of files.slice(retention)){fs.rmSync(stale.path,{force:true});const keyFile=stale.path+'.key';fs.rmSync(keyFile,{force:true});}
}
async function runAutoBackup(){
    const settings=loadAutoBackupSettings();
    if(!settings.enabled||!settings.password)return;
    const session=cloudSession({sender:{id:0}});
    if(session){
        try{
            await withCloudAuth(session,token=>cloudApi.triggerAutoBackup(token));
            const latest=await withCloudAuth(session,token=>cloudApi.getLatestAutoBackup(token));
            if(latest?.backup){saveAutoBackupSettings({...settings,lastBackup:new Date().toISOString()});const wins=BrowserWindow.getAllWindows();for(const win of wins){if(!win.isDestroyed())win.webContents.send('show-toast','Auto backup completed successfully (cloud)');}return;}
        }catch(error){
            if(!isCloudUnavailable(error))console.error('Cloud auto-backup failed:',error.message||error);
        }
    }
    fs.mkdirSync(autoBackupDirPath,{recursive:true});
    const now=new Date();
    const datePart=now.toISOString().slice(0,10).replace(/-/g,'');
    const filePath=path.join(autoBackupDirPath,`AutoBackup-${datePart}.lenspirebackup`);
    try{
        const result=await createBackupFile({password:settings.password,filePath});
        if(result.canceled)return;
        pruneAutoBackupsLocal();
        saveAutoBackupSettings({...settings,lastBackup:now.toISOString()});
        const wins=BrowserWindow.getAllWindows();
        for(const win of wins){if(!win.isDestroyed())win.webContents.send('show-toast','Auto backup completed successfully');}
    }catch(error){
        console.error('Auto backup failed:',error);
        const wins=BrowserWindow.getAllWindows();
        for(const win of wins){if(!win.isDestroyed())win.webContents.send('show-toast','Auto backup failed: '+(error.message||'Unknown error'));}
    }
}
function startAutoBackupScheduler(){
    if(autoBackupTimer)clearInterval(autoBackupTimer);
    autoBackupTimer=setInterval(()=>{const settings=loadAutoBackupSettings();if(!settings.enabled||!settings.time||!settings.password)return;const now=new Date();const currentTime=`${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;if(currentTime===settings.time){const lastBackup=settings.lastBackup?new Date(settings.lastBackup):null;const today=new Date().toISOString().slice(0,10);const lastBackupDate=lastBackup?lastBackup.toISOString().slice(0,10):null;if(lastBackupDate!==today){runAutoBackup();}}},60000);
}
let autoBackupTimer=null;
ipcMain.handle('get-autobackup-settings',async()=>{requireAdministrator(event);return loadAutoBackupSettings();});
ipcMain.handle('set-autobackup-settings',async(event,settings)=>{requireAdministrator(event);saveAutoBackupSettings(settings);startAutoBackupScheduler();return loadAutoBackupSettings();});
ipcMain.handle('run-autobackup',async(event)=>{requireAdministrator(event);await runAutoBackup();return{success:true};});
ipcMain.handle('auto-backup-list',async(event)=>{requireAdministrator(event);const localFiles=fs.existsSync(autoBackupDirPath)?fs.readdirSync(autoBackupDirPath).filter(f=>f.endsWith('.lenspirebackup')).map(f=>({id:f,name:f,type:'local',createdAt:new Date(fs.statSync(path.join(autoBackupDirPath,f)).mtimeMs).toISOString(),size:fs.statSync(path.join(autoBackupDirPath,f)).size})):[];const cloudBackups=[];const session=cloudSession(event);if(session){try{const result=await withCloudAuth(session,token=>cloudApi.listAutoBackups(token));result?.backups?.forEach(b=>cloudBackups.push({...b,type:'cloud'}));}catch(error){if(!isCloudUnavailable(error))throw error;}}return{local:localFiles,cloud:cloudBackups};});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
