(() => {
  'use strict';
  window.LENSPIRE_WEB = true;

  const STORAGE = {
    token: 'lp_token', refresh: 'lp_refresh', user: 'lp_user',
    leadMap: 'lenspire-web-lead-map', autoBackup: 'lenspire-web-autobackup'
  };
  const listeners = new Map();
  const selectedFiles = new Map();
  // Authentication secrets are memory-only. Reloading or closing the tab signs
  // the user out, preventing copied browser storage from becoming a live session.
  localStorage.removeItem(STORAGE.token);
  localStorage.removeItem(STORAGE.refresh);
  localStorage.removeItem(STORAGE.user);
  let currentUser = null;
  let leadMap = new Map(Object.entries(readJson(sessionStorage.getItem(STORAGE.leadMap), {})));
  let nextLeadId = -1;

  function readJson(value, fallback) { try { return JSON.parse(value) ?? fallback; } catch { return fallback; } }
  function emit(channel, ...args) { for (const callback of listeners.get(channel) || []) callback(null, ...args); }
  function errorFrom(data, status) { const error = new Error(data?.error || `Cloud service returned HTTP ${status}`); error.status = status; error.diagnostic = data?.diagnostic; return error; }
  function saveSession() {}
  async function refreshSession() {
    const response = await fetch('/api/auth/refresh', { method:'POST', headers:{'content-type':'application/json','x-lenspire-web':'1'}, body:'{}' });
    const result = await response.json().catch(() => ({}));
    return response.ok;
  }
  async function api(path, options = {}, retried = false) {
    const headers = new Headers(options.headers || {});
    if (!(options.body instanceof FormData) && options.body != null && !headers.has('content-type')) headers.set('content-type','application/json');
    if (!['GET','HEAD'].includes(String(options.method||'GET').toUpperCase())) headers.set('x-lenspire-web','1');
    const response = await fetch(path, { ...options, headers });
    const contentType = response.headers.get('content-type') || '';
    const result = contentType.includes('application/json') ? await response.json().catch(() => ({})) : await response.text();
    if (response.status === 401 && !retried && await refreshSession()) return api(path, options, true);
    if (!response.ok) {
      if (response.status === 401) {
        currentUser = null;
        leadMap = new Map();
        sessionStorage.removeItem(STORAGE.leadMap);
      }
      throw errorFrom(result, response.status);
    }
    return result;
  }
  const body = value => ({ method:'POST', body:JSON.stringify(value || {}) });
  const put = value => ({ method:'PUT', body:JSON.stringify(value || {}) });
  const patch = value => ({ method:'PATCH', body:JSON.stringify(value || {}) });
  const sameId = (a,b) => String(a ?? '') === String(b ?? '');
  const leadUuid = id => [...leadMap.entries()].find(([, local]) => sameId(local,id))?.[0] || String(id || '');
  function mapLeads(rows) {
    const used = new Set([...leadMap.values()].map(Number));
    nextLeadId = Math.min(-1, ...used) - 1;
    const mapped = (rows || []).filter(row => !String(row.notes || '').includes('[LENSPIRE_DELETED_LEAD]')).map(row => {
      const uuid = String(row.id);
      if (!leadMap.has(uuid)) leadMap.set(uuid, nextLeadId--);
      return { ...row, cloud_id:uuid, id:Number(leadMap.get(uuid)) };
    });
    sessionStorage.setItem(STORAGE.leadMap, JSON.stringify(Object.fromEntries(leadMap)));
    return mapped;
  }
  function awaitingDetailsEventForBooking(booking, lead, customer) {
    const bookingId=booking?.id,clientName=booking?.client_name||booking?.clientName||customer?.name||lead?.name||'Client',eventType=booking?.event_type||booking?.eventType||lead?.event_type||lead?.eventType||'Event',eventDate=booking?.event_date||booking?.eventDate||lead?.event_date||lead?.eventDate||null;
    return {id:`awaiting-booking-${bookingId}`,awaiting_booking_event:true,booking_id:bookingId,customer_id:booking?.customer_id??booking?.customerId??customer?.id??null,title:`${clientName} · ${eventType}`,event_type:eventType,start_date:eventDate,start_time:null,end_time:null,city:booking?.city||lead?.city||null,status:'Scheduled',notes:null,client_name:clientName,handled_by:lead?.assigned_to||lead?.assignedTo||null,couple_name:lead?.couple_name||lead?.coupleName||clientName,contact_no:lead?.mobile||customer?.phone||null,slotted:false,date_status:eventDate?'Confirmed':'TBD Month',tbd_month:null};
  }
  async function workspace() {
    const [leadResult, activityResult, data] = await Promise.all([
      api('/api/leads'), api('/api/lead-activities').catch(() => ({activities:[]})), api('/api/workspace')
    ]);
    const cloudLeads=leadResult.leads||[],leads = mapLeads(cloudLeads);
    const activities = (activityResult.activities || []).map(item => ({ ...item, lead_id:leadMap.get(String(item.lead_id)) ?? item.lead_id }));
    const events=data.events||[],bookings=data.bookings||[],customers=data.customers||[],leadByCloudId=new Map(cloudLeads.map(row=>[String(row.id),row])),customerById=new Map(customers.map(row=>[String(row.id),row])),eventBookingIds=new Set(events.map(row=>String(row.booking_id??row.bookingId??'')).filter(Boolean));
    const awaitingEvents=bookings.flatMap(booking=>{const lead=leadByCloudId.get(String(booking.lead_id??booking.leadId??''));if(!lead||String(lead.status).toLowerCase()!=='confirmed'||eventBookingIds.has(String(booking.id)))return[];return[awaitingDetailsEventForBooking(booking,lead,customerById.get(String(booking.customer_id??booking.customerId??'')))];});
    return { ...data, events:[...events,...awaitingEvents], leads, activities, cloudStatus:'connected', pendingSync:0 };
  }
  async function mutateThenWorkspace(path, options) { await api(path, options); return workspace(); }
  async function distributeConfirmedLead(result, submitted, performedBy) {
    const lead=result?.lead||result||{},status=String(lead.status||submitted?.status||'').trim().toLowerCase();
    if(status!=='confirmed')return false;
    const cloudId=String(lead.id||'').trim();
    if(!cloudId)throw new Error('Confirmed lead was saved, but its Cloud record could not be identified.');
    try{
      await api(`/api/leads/${encodeURIComponent(cloudId)}/convert`,body({performedBy:performedBy||submitted?.performedBy||currentUser?.displayName||'Web CRM'}));
      return true;
    }catch(error){
      throw new Error(`Confirmed lead was saved, but Management, Operations, Accounts and Post Production sync failed: ${error.message||'Cloud conversion failed'}`);
    }
  }
  async function createLead(value){const result=await api('/api/leads',body(value));await distributeConfirmedLead(result,value);return workspace();}
  async function updateLead(value){const cloudId=leadUuid(value?.leadId),result=await api(`/api/leads/${encodeURIComponent(cloudId)}`,put(value?.lead));await distributeConfirmedLead(result,value?.lead);return workspace();}
  async function login(credentials) {
    try {
      const result = await api('/api/auth/login', body(credentials));
      const organization = result.organization || {};
      currentUser = { ...result.user, organizationName:organization.name || result.user?.organization_name || 'LenspireCRM', organizationBranding:organization, authSource:'cloud' };
      leadMap = new Map(); nextLeadId = -1; saveSession();
      return { success:true, user:currentUser, migration:{ imported:0, activitiesImported:0, deferred:true, synced:0 } };
    } catch (error) { return { success:false, message:error.message || 'Unable to sign in to LenspireCRM Cloud.' }; }
  }
  async function logout() { await fetch('/api/auth/logout',{method:'POST',headers:{'x-lenspire-web':'1'}}).catch(()=>{});currentUser=null;leadMap=new Map();saveSession();sessionStorage.removeItem(STORAGE.leadMap);return{success:true}; }

  function chooseFile({accept='', multiple=false}={}) {
    return new Promise(resolve => {
      const input=document.createElement('input'); input.type='file'; input.accept=accept; input.multiple=multiple;
      input.onchange=()=>resolve(multiple?[...input.files]:(input.files?.[0]||null));
      input.addEventListener('cancel',()=>resolve(multiple?[]:null),{once:true}); input.click();
    });
  }
  function downloadBlob(blob, name) {
    const url=URL.createObjectURL(blob), anchor=document.createElement('a'); anchor.href=url; anchor.download=name; document.body.appendChild(anchor); anchor.click(); anchor.remove(); setTimeout(()=>URL.revokeObjectURL(url),1500);
  }
  function downloadJson(data,name){downloadBlob(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),name);}
  function dateStamp(){return new Date().toISOString().replace(/[:.]/g,'-').slice(0,19);}
  function exportWorkbook(sheets,name){
    if(!window.XLSX)throw new Error('Excel tools did not load. Refresh the web app and try again.');
    const workbook=XLSX.utils.book_new();
    for(const [sheetName,rows] of Object.entries(sheets)){const sheet=XLSX.utils.json_to_sheet(rows||[]);XLSX.utils.book_append_sheet(workbook,sheet,sheetName.slice(0,31));}
    XLSX.writeFile(workbook,name); return name;
  }
  async function spreadsheetRows(){const file=await chooseFile({accept:'.xlsx,.xls,.csv'});if(!file)return null;const bytes=await file.arrayBuffer(),book=XLSX.read(bytes,{type:'array',cellDates:true});return XLSX.utils.sheet_to_json(book.Sheets[book.SheetNames[0]],{defval:'',raw:true});}
  const normalizedRow=row=>Object.fromEntries(Object.entries(row).map(([key,value])=>[key.toLowerCase().replace(/[^a-z0-9]/g,''),value]));
  const readAlias=(row,keys)=>keys.map(key=>row[key]).find(value=>value!==undefined&&value!==null)??'';
  function isoDate(value){if(value instanceof Date&&!Number.isNaN(value.getTime()))return value.toISOString().slice(0,10);if(typeof value==='number'&&XLSX?.SSF){const d=XLSX.SSF.parse_date_code(value);if(d)return `${d.y}-${String(d.m).padStart(2,'0')}-${String(d.d).padStart(2,'0')}`;}const text=String(value||'').trim(),dmy=text.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);if(dmy)return `${dmy[3]}-${dmy[2].padStart(2,'0')}-${dmy[1].padStart(2,'0')}`;const parsed=new Date(text);return text&&!Number.isNaN(parsed.getTime())?parsed.toISOString().slice(0,10):text;}
  const duplicateText=value=>String(value??'').trim().toLowerCase().replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();
  const duplicatePhone=value=>{const digits=String(value??'').replace(/\D/g,'');return digits.length>=7?digits.slice(-10):'';};
  function eventDuplicateParts(data){const read=(camel,snake)=>data?.[camel]??data?.[snake]??'',dateStatus=duplicateText(read('dateStatus','date_status'))||'confirmed',rawTime=String(read('startTime','start_time')).trim(),timeMatch=rawTime.match(/^(\d{1,2}):(\d{2})/);return{phone:duplicatePhone(read('contactNo','contact_no')),client:duplicateText(read('clientName','client_name')),couple:duplicateText(read('coupleName','couple_name')),eventType:duplicateText(read('eventType','event_type')),date:dateStatus.includes('tbd')?`tbd:${String(read('tbdMonth','tbd_month')).slice(0,7)}`:String(read('startDate','start_date')).slice(0,10),venue:duplicateText(data?.venue??data?.city??''),time:timeMatch?`${String(Number(timeMatch[1])).padStart(2,'0')}:${timeMatch[2]}`:duplicateText(rawTime)};}
  function areDuplicateImportedEvents(left,right){const a=eventDuplicateParts(left),b=eventDuplicateParts(right),sameClient=(a.phone&&b.phone&&a.phone===b.phone)||(a.client&&b.client&&a.client===b.client)||(a.couple&&b.couple&&a.couple===b.couple);return Boolean(sameClient&&a.eventType&&a.eventType===b.eventType&&a.date&&a.date===b.date&&(!a.venue||!b.venue||a.venue===b.venue)&&(!a.time||!b.time||a.time===b.time));}
  async function importLeads(){
    const source=await spreadsheetRows();if(!source)return{canceled:true};
    const leads=source.map(normalizedRow).map(row=>({
      name:String(readAlias(row,['name','lead','customername','customercouplename','clientname'])).trim(),
      mobile:String(readAlias(row,['mobile','mobilenumber','phone','phonenumber','contactnumber'])).trim(),
      eventType:String(readAlias(row,['eventtype','event','typeofevent'])).trim()||'Wedding',eventDate:isoDate(readAlias(row,['eventdate','date','shootdate'])),
      city:String(readAlias(row,['city','location'])).trim(),source:String(readAlias(row,['source','leadsource'])).trim()||'Excel Import',status:String(readAlias(row,['status','leadstatus'])).trim()||'New',
      budget:String(readAlias(row,['budget','amount','expectedbudget'])).trim(),priority:String(readAlias(row,['priority'])).trim()||'Medium',assignedTo:String(readAlias(row,['assignedto','salesperson','salesexecutive','owner','assigned'])).trim(),
      notes:String(readAlias(row,['notes','note','remarks','comments'])).trim(),coupleName:String(readAlias(row,['couplename','couple','bridegroom'])).trim(),
      totalClosing:Number(String(readAlias(row,['totalclosing','closingamount','finalamount','dealvalue'])).replace(/[^0-9.-]/g,''))||0,
      nextFollowupAt:String(readAlias(row,['nextfollowup','nextfollowupdate','followup','followupdatetime'])).trim(),lostReason:String(readAlias(row,['lostreason','reasonlost'])).trim(),
      weddingDates:String(readAlias(row,['weddingdates','weddingdate','eventdates'])).trim(),paymentMode:String(readAlias(row,['paymentmode','modeofpayment'])).trim(),
      advanceReceived:Number(String(readAlias(row,['advancereceived','advance','advanceamount'])).replace(/[^0-9.-]/g,''))||0,receivedBy:String(readAlias(row,['receivedby','paymentreceivedby'])).trim(),paymentReceivedDate:isoDate(readAlias(row,['paymentreceiveddate','paymentdate','advancereceiveddate']))
    })).filter(item=>item.name);
    const result=await api('/api/leads/import',body({leads}));let converted=0,conversionSkipped=0;
    for(const cloudId of result.confirmedLeadIds||[]){try{await api(`/api/leads/${encodeURIComponent(cloudId)}/convert`,body({performedBy:currentUser?.displayName||'Excel Import'}));converted++;}catch{conversionSkipped++;}}
    return{...result,imported:Number(result.imported??leads.length),skipped:Number(result.skipped||source.length-leads.length),converted,conversionSkipped,workspace:await workspace()};
  }
  async function importPhotographers(){
    const source=await spreadsheetRows();if(!source)return{canceled:true};const current=await workspace(),knownMobiles=new Set((current.photographerDetails||[]).map(item=>duplicatePhone(item.mobile)).filter(Boolean));let imported=0,skipped=0,skippedDuplicates=0;
    for(const raw of source){const row=normalizedRow(raw),data={name:String(readAlias(row,['photographersname','photographername','name'])).trim(),mobile:String(readAlias(row,['mobile','mobilenumber','phone','contactnumber'])).trim(),livingIn:String(readAlias(row,['livingin','city','location','area'])).trim(),work:String(readAlias(row,['work','worktype','skills'])).trim(),status:/house/i.test(String(readAlias(row,['status','type'])))?'In-House':'Outside'},mobileKey=duplicatePhone(data.mobile);if(!data.name||!data.mobile||!data.work){skipped++;continue;}if(mobileKey&&knownMobiles.has(mobileKey)){skipped++;skippedDuplicates++;continue;}try{await api('/api/photographers',body(data));if(mobileKey)knownMobiles.add(mobileKey);imported++;}catch{skipped++;}}
    if(!imported&&skippedDuplicates!==source.length)throw new Error('No valid photographer rows were imported.');return{imported,skipped,skippedDuplicates,workspace:await workspace()};
  }
  async function importEvents(mode){
    const source=await spreadsheetRows();if(!source)return{canceled:true};const current=await workspace(),knownEvents=[...(current.events||[])];let imported=0,skipped=0,skippedDuplicates=0,consecutiveFailures=0;const importErrors=[];
    for(const [rowIndex,raw] of source.entries()){const row=normalizedRow(raw),dateValue=readAlias(row,['eventdate','date']),tbdMonth=String(readAlias(row,['tbdmonth','expectedmonth'])).slice(0,7),dateStatus=/tbd/i.test(String(readAlias(row,['datestatus'])))||tbdMonth?'TBD Month':'Confirmed',data={clientName:String(readAlias(row,['clientname','customername'])).trim(),coupleName:String(readAlias(row,['couplename'])).trim(),contactNo:String(readAlias(row,['contactno','contactnumber','mobile'])).trim(),eventType:String(readAlias(row,['event','eventtype'])).trim()||'Shoot',startDate:dateStatus==='TBD Month'?(tbdMonth?`${tbdMonth}-01`:''):isoDate(dateValue),dateStatus,tbdMonth,city:String(readAlias(row,['venue','location','city'])).trim(),startTime:String(readAlias(row,['time','starttime'])).trim(),status:mode==='completed'?'Completed':String(readAlias(row,['status'])).trim()||'Scheduled',photo:String(readAlias(row,['photo'])).trim(),video:String(readAlias(row,['video'])).trim(),candid:String(readAlias(row,['candid'])).trim(),cinematic:String(readAlias(row,['cinematic'])).trim(),drone:String(readAlias(row,['drone'])).trim(),assistant:String(readAlias(row,['assistant'])).trim(),bts:String(readAlias(row,['bts'])).trim(),slotted:true};data.title=`${data.clientName||data.coupleName} · ${data.eventType}`;if(!data.clientName&&!data.coupleName||!data.eventType||!data.startDate){skipped++;emit('events-import-progress',{processed:rowIndex+1,total:source.length,imported,skipped});continue;}if(!data.coupleName)data.coupleName=data.clientName;if(!data.contactNo)data.contactNo='Contact pending';if(knownEvents.some(item=>areDuplicateImportedEvents(item,data))){skipped++;skippedDuplicates++;emit('events-import-progress',{processed:rowIndex+1,total:source.length,imported,skipped});continue;}try{await api('/api/events',body(data));knownEvents.push(data);imported++;consecutiveFailures=0;}catch(error){skipped++;consecutiveFailures++;if(importErrors.length<5)importErrors.push(`row ${rowIndex+2} (${data.clientName||data.coupleName}): ${error.message||'Cloud save failed'}`);if(imported===0&&consecutiveFailures>=3)throw new Error(`Cloud rejected the first ${consecutiveFailures} valid events. ${importErrors[0]}`);}emit('events-import-progress',{processed:rowIndex+1,total:source.length,imported,skipped});}
    if(!imported&&skippedDuplicates!==source.length)throw new Error(importErrors.length?`No events were imported. ${importErrors[0]}`:'No valid event rows were found. Check the client, event and confirmed-date columns.');return{imported,skipped,skippedDuplicates,importErrors,workspace:await workspace()};
  }
  async function importPayments(){
    const source=await spreadsheetRows();if(!source)return{canceled:true};const data=await workspace(),byCode=new Map((data.bookings||[]).map(row=>[String(row.booking_code||row.bookingCode||'').toLowerCase(),row]));let imported=0,skipped=0;
    for(const raw of source){const row=normalizedRow(raw),booking=byCode.get(String(readAlias(row,['bookingcode','booking','bookingid','bookingno','code'])).trim().toLowerCase());if(!booking){skipped++;continue;}await api('/api/payments',body({bookingId:booking.id,amount:Number(readAlias(row,['amount','paidamount','paymentamount','receivedamount']))||0,paymentType:String(readAlias(row,['paymenttype','type','payment'])).trim()||'Advance',status:String(readAlias(row,['status','paymentstatus'])).trim()||'Paid',paymentMode:String(readAlias(row,['paymentmode','mode','method'])).trim()||'Other',receivedBy:String(readAlias(row,['receivedby','received','collectedby','paymentby'])).trim(),notes:String(readAlias(row,['notes','remark','remarks','comment','comments'])).trim(),paidAt:isoDate(readAlias(row,['paidat','paymentdate','date','receiveddate','paiddate']))}));imported++;}
    return{imported,skipped,workspace:await workspace()};
  }
  async function selectQuotation(){const file=await chooseFile({accept:'.pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png'});if(!file)return{canceled:true};const key=`webfile:${crypto.randomUUID()}`;selectedFiles.set(key,file);return{canceled:false,path:key,name:file.name};}
  async function uploadQuotation(payload){const file=selectedFiles.get(payload?.filePath);if(!file)return{uploaded:false,reason:'missing-file',message:'Please select the quotation again in this browser.'};const form=new FormData();form.append('leadId',String(payload?.cloudId||leadUuid(payload?.leadId)||''));form.append('name',payload?.name||file.name);form.append('file',file,payload?.name||file.name);return api('/api/drive/upload',{method:'POST',body:form});}
  async function uploadLogo(payload){const file=await chooseFile({accept:'.png,image/png'});if(!file)return{canceled:true};if(file.type!=='image/png'&&!/\.png$/i.test(file.name))throw new Error('Choose a PNG logo file.');if(file.size>2*1024*1024)throw new Error('Logo image must be 2 MB or smaller.');const form=new FormData();form.append('file',file,file.name);return api(`/api/platform/organizations/${encodeURIComponent(payload.organizationId)}/logo`,{method:'POST',body:form});}
  async function createBackup(){throw new Error('Web backup download is temporarily disabled until browser-side encrypted backup support is available. Use the desktop app to create an encrypted backup.');}
  async function restoreBackup(){throw new Error('Web restore is temporarily disabled to prevent unencrypted backup handling. Use the desktop app with an encrypted .lenspirebackup file.');}

  async function invoke(channel, ...args) {
    const value=args[0];
    switch(channel){
      case 'authenticate-user': return login(value);
      case 'logout-user': return logout();
      case 'get-session-user': if(!currentUser){const error=new Error('Your cloud session has expired. Please sign in again.');error.status=401;throw error;}return currentUser;
      case 'get-workspace-data': return workspace();
      case 'change-cloud-password': return api('/api/auth/change-password',body(value));
      case 'add-lead': return createLead(value);
      case 'update-lead': return updateLead(value);
      case 'delete-lead': await api(`/api/leads/${encodeURIComponent(leadUuid(value?.cloudId||value?.leadId))}`,{method:'DELETE'});return workspace();
      case 'convert-lead': {const result=await api(`/api/leads/${encodeURIComponent(leadUuid(value?.leadId))}/convert`,body(value?.options||{}));return{...result,workspace:await workspace()};}
      case 'add-lead-activity': return mutateThenWorkspace(`/api/leads/${encodeURIComponent(leadUuid(value?.leadId))}/activities`,body(value?.activity));
      case 'update-lead-attachment': return mutateThenWorkspace(`/api/leads/${encodeURIComponent(leadUuid(value?.leadId))}/attachment`,put(value?.attachment));
      case 'check-duplicate-mobile': {const rows=(await workspace()).leads,digits=x=>String(x||'').replace(/\D/g,'').slice(-10),found=rows.find(row=>!sameId(row.id,value?.excludeId)&&digits(row.mobile)===digits(value?.mobile));return found?{duplicate:true,lead:{id:found.id,code:found.lead_code,name:found.name}}:{duplicate:false};}
      case 'save-sales-target': return mutateThenWorkspace('/api/sales-targets',body(value));
      case 'save-calendar-event': {const synthetic=String(value?.eventId||'').startsWith('awaiting-booking-'),id=synthetic?'':value?.eventId;return mutateThenWorkspace(id?`/api/events/${encodeURIComponent(id)}`:'/api/events',id?put(value?.event):body(value?.event));}
      case 'delete-calendar-event': return mutateThenWorkspace(`/api/events/${encodeURIComponent(value)}`,{method:'DELETE'});
      case 'save-photographer-detail': return mutateThenWorkspace(value?.detailId?`/api/photographers/${encodeURIComponent(value.detailId)}`:'/api/photographers',value?.detailId?put(value.detail):body(value.detail));
      case 'delete-photographer-detail': return mutateThenWorkspace(`/api/photographers/${encodeURIComponent(value)}`,{method:'DELETE'});
      case 'get-accounts-data': {const data=await workspace();return{bookings:data.bookings,payments:data.payments};}
      case 'add-payment': return mutateThenWorkspace('/api/payments',body(value));
      case 'update-payment': return mutateThenWorkspace(`/api/payments/${encodeURIComponent(value?.paymentId)}`,put(value?.data));
      case 'delete-payment': return mutateThenWorkspace(`/api/payments/${encodeURIComponent(value)}`,{method:'DELETE'});
      case 'update-production-stage': return mutateThenWorkspace(`/api/production/${encodeURIComponent(value?.jobId)}`,put({stage:value?.stage}));
      case 'update-production-job': return mutateThenWorkspace(`/api/production/${encodeURIComponent(value?.jobId)}`,put(value?.data));
      case 'create-client-portal-link': return api('/api/client-portal/link',body(value));
      case 'get-client-portal-access': return api(`/api/client-portal/link?bookingId=${encodeURIComponent(value)}`);
      case 'revoke-client-portal-access': return api('/api/client-portal/link',{method:'DELETE',body:JSON.stringify({bookingId:value})});
      case 'list-users': {const result=await api('/api/users');return Array.isArray(result)?result:(result.users||[]);}
      case 'list-post-production-users': {const result=await api('/api/users'),users=Array.isArray(result)?result:(result.users||[]);return users.filter(user=>user.active!==false&&['Post Production','Editor'].includes(user.role));}
      case 'create-user': return api('/api/users',body(value?.user));
      case 'set-user-department-access': return api(`/api/users/${encodeURIComponent(value?.userId)}/access`,patch({access:value?.access}));
      case 'set-user-role': return api(`/api/users/${encodeURIComponent(value?.userId)}/role`,patch({role:value?.role}));
      case 'set-user-active': return api(`/api/users/${encodeURIComponent(value?.userId)}/active`,patch({active:value?.active}));
      case 'reset-user-password': return api(`/api/users/${encodeURIComponent(value?.userId)}/reset-password`,body({password:value?.password}));
      case 'list-platform-organizations': return api('/api/platform/organizations');
      case 'run-cloud-migrations': return api('/api/platform/migrations',body({}));
      case 'create-platform-organization': return api('/api/platform/organizations',body(value));
      case 'set-platform-organization-status': return api(`/api/platform/organizations/${encodeURIComponent(value?.organizationId)}/status`,patch({status:value?.status}));
      case 'update-platform-organization-subscription': return api(`/api/platform/organizations/${encodeURIComponent(value?.organizationId)}/subscription`,patch(value));
      case 'update-platform-organization-branding': return api(`/api/platform/organizations/${encodeURIComponent(value?.organizationId)}/branding`,patch(value));
      case 'upload-platform-organization-logo': return uploadLogo(value);
      case 'connect-google-drive': {const result=await api('/api/google/connect');window.open(result.authorizationUrl,'_blank','noopener');return{success:true};}
      case 'upload-quotation-drive': return uploadQuotation(value);
      case 'select-quotation-file': return selectQuotation();
      case 'open-quotation-attachment': {const file=selectedFiles.get(value?.path);if(file){const url=URL.createObjectURL(file);if(value?.action==='download')downloadBlob(file,value?.name||file.name);else window.open(url,'_blank','noopener');return{action:value?.action==='download'?'downloaded':'opened',source:'browser'};}const files=await api(`/api/drive/files?leadId=${encodeURIComponent(leadUuid(value?.leadId))}`),row=(files.files||[]).find(item=>item.name===value?.name)||files.files?.[0];if(!row?.webViewLink&&!row?.webContentLink)throw new Error('The quotation is unavailable. Please upload the quotation again.');window.open(value?.action==='download'?(row.webContentLink||row.webViewLink):(row.webViewLink||row.webContentLink),'_blank','noopener');return{action:value?.action==='download'?'downloaded':'opened',source:'cloud'};}
      case 'copy-to-clipboard': if(!String(value||'').trim())throw new Error('There is no message to copy.');await navigator.clipboard.writeText(String(value));return{success:true};
      case 'import-leads-file': return importLeads();
      case 'import-photographers-file': return importPhotographers();
      case 'import-events-file': return importEvents(value||'upcoming');
      case 'import-payments-file': return importPayments();
      case 'export-leads-file': {const fileName=`LenspireCRM-Leads-${dateStamp()}.xlsx`;exportWorkbook({Leads:value||[]},fileName);return{canceled:false,exported:(value||[]).length,fileName};}
      case 'export-photographers-file': {const fileName=`Photographers-${dateStamp()}.xlsx`;exportWorkbook({Photographers:value||[]},fileName);return{canceled:false,exported:(value||[]).length,fileName};}
      case 'export-events-file': {const rows=value?.events||[],fileName=`${value?.mode==='completed'?'Completed':'Upcoming'}-Events-${dateStamp()}.xlsx`;exportWorkbook({Events:rows},fileName);return{canceled:false,exported:rows.length,fileName};}
      case 'export-payments-file': {const fileName=`Payments-${dateStamp()}.xlsx`;exportWorkbook({Payments:value||[]},fileName);return{canceled:false,exported:(value||[]).length,fileName};}
      case 'export-production-file': {const fileName=`Post-Production-${dateStamp()}.xlsx`;exportWorkbook({Production:value||[]},fileName);return{canceled:false,exported:(value||[]).length,fileName};}
      case 'export-monthly-report': {const fileName=`Sales-Report-${value?.month||dateStamp()}.xlsx`;exportWorkbook({Summary:[value],Sources:value?.bySource||[],Salespeople:value?.bySalesperson||[],Statuses:value?.byStatus||[],Deals:value?.topDeals||[]},fileName);return{canceled:false,fileName};}
      case 'export-accounts-monthly-report': {const fileName=`Accounts-Report-${value?.month||dateStamp()}.xlsx`;exportWorkbook({Summary:[value],Payments:value?.payments||[],Receivables:value?.receivables||[]},fileName);return{canceled:false,fileName};}
      case 'create-crm-backup': return createBackup(value);
      case 'restore-crm-backup': return restoreBackup();
      case 'reset-business-data': {const backup=await api('/api/backup'),empty={...backup,leads:[],customers:[],bookings:[],production:[],productionActivities:[],clientPortalAccess:[],clientPortalAccessLog:[],events:[],payments:[],activities:[],salesTargets:[]};await api('/api/backup/restore',{method:'POST',body:JSON.stringify(empty)});leadMap=new Map();return workspace();}
      case 'get-autobackup-settings': localStorage.removeItem(STORAGE.autoBackup);return{enabled:false,time:'02:00',password:''};
      case 'set-autobackup-settings': throw new Error('Automatic encrypted backups are currently available in the desktop app only.');
      case 'run-autobackup': throw new Error('Automatic encrypted backups are currently available in the desktop app only.');
      case 'backup-password-response': return{success:true};
      default: throw new Error(`Web action is not connected yet: ${channel}`);
    }
  }

  window.electronAPI = {
    invoke,
    send:(channel,...args)=>emit(channel,...args),
    on:(channel,callback)=>{if(!listeners.has(channel))listeners.set(channel,new Set());listeners.get(channel).add(callback);},
    removeListener:(channel,callback)=>listeners.get(channel)?.delete(callback),
    clipboard:{writeText:text=>navigator.clipboard.writeText(String(text||''))}
  };
  if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
})();
