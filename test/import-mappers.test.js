const test = require('node:test');
const assert = require('node:assert/strict');
const XLSX = require('xlsx');
const { leadRowsFromSheet, mapLeadRows, mapEventRows, areDuplicateImportedEvents } = require('../src/main/import-mappers');

test('finds lead headings below template title and instruction rows', () => {
  const sheet = XLSX.utils.aoa_to_sheet([
    ['ANKIT STUDIOS — CLIENT IMPORT TEMPLATE'],
    ['Enter one client per row.'],
    [],
    ['Date', 'Client Name', 'Mobile Number', 'Event'],
    ['2026-08-12', 'Aarav Mehta', '9876543210', 'Wedding']
  ]);
  assert.deepEqual(leadRowsFromSheet(sheet), [{Date:'2026-08-12','Client Name':'Aarav Mehta','Mobile Number':'9876543210',Event:'Wedding'}]);
});

test('maps every column in the Ankit Studio client workbook', () => {
  const [lead] = mapLeadRows([{
    Date: 46246,
    'Client Name': 'Darshana & Arnav',
    'Sales Person': 'Ankit Singh',
    'Couple Name': 'Darshana & Arnav',
    'Mobile Number': '90299 99307',
    Event: 'Wedding',
    'Event Date': '14/08/2026',
    Source: 'Instagram',
    Status: 'Confirmed',
    'Referred By': 'Studio Partner',
    'Referral Code': 'REF-01',
    'Total Closing': 42000
  }]);
  assert.deepEqual(lead, {
    name:'Darshana & Arnav', mobile:'90299 99307', eventType:'Wedding', eventDate:'2026-08-14', createdAt:'2026-08-12',
    city:'', source:'Instagram', status:'Confirmed', budget:'', priority:'', assignedTo:'Ankit Singh', notes:'',
    coupleName:'Darshana & Arnav', totalClosing:42000, nextFollowupAt:'', lostReason:'', referredBy:'Studio Partner', referralCode:'REF-01',
    weddingDates:'', paymentMode:'', advanceReceived:null, receivedBy:'', paymentReceivedDate:''
  });
});

test('maps blank optional workbook cells without losing the client', () => {
  const [lead] = mapLeadRows([{'Date':'12/08/2026','Client Name':'Sana Modak','Sales Person':'Varun Sharma','Couple Name':'Adnan & Sana','Mobile Number':'','Event':'Wedding','Event Date':'16/08/2026','Source':'Instagram','Status':'Confirmed','Referred By':'','Referral Code':'','Total Closing':'₹1,40,000'}]);
  assert.equal(lead.name, 'Sana Modak');
  assert.equal(lead.mobile, '');
  assert.equal(lead.totalClosing, 140000);
  assert.equal(lead.referredBy, '');
  assert.equal(lead.referralCode, '');
});

test('maps TBD event dates and month names without rejecting the event', () => {
  const [withMonth, withoutMonth] = mapEventRows([
    {'Event Date':'TBD - December','Client Name':'Akshay','Couple Name':'Akshay & Riya','Contact No.':'9999999999',Event:'Wedding'},
    {'Event Date':'TBD','Client Name':'Kajal','Couple Name':'Kajal & Raj','Contact No.':'8888888888',Event:'Engagement'}
  ]);
  assert.equal(withMonth.dateStatus, 'TBD Month');
  assert.match(withMonth.tbdMonth, /^20\d{2}-12$/);
  assert.equal(withMonth.startDate, '');
  assert.equal(withoutMonth.dateStatus, 'TBD Month');
  assert.equal(withoutMonth.tbdMonth, '');
});

test('event duplicates ignore mutable columns but retain distinct client events', () => {
  const wedding = { clientName:'Asha & Ravi', contactNo:'+91 98765 43210', eventType:'Wedding', startDate:'2026-11-20', venue:'Royal Palace', startTime:'19:30', notes:'old note', photo:'Team A' };
  assert.equal(areDuplicateImportedEvents(wedding, {...wedding, notes:'updated note', photo:'Team B'}), true);
  assert.equal(areDuplicateImportedEvents(wedding, {...wedding, eventType:'Mehendi'}), false);
  assert.equal(areDuplicateImportedEvents(wedding, {...wedding, startDate:'2026-11-19'}), false);
  assert.equal(areDuplicateImportedEvents(wedding, {...wedding, venue:'Garden Lawn'}), false);
  assert.equal(areDuplicateImportedEvents(wedding, {...wedding, startTime:'10:00'}), false);
});

test('event duplicates normalize formatting and tolerate missing optional details', () => {
  const existing = { client_name:'Asha & Ravi', contact_no:'9876543210', event_type:'Haldi', start_date:'2026-11-18', city:'The Grand Hall', start_time:'09:00:00' };
  assert.equal(areDuplicateImportedEvents(existing, {clientName:'Asha & Ravi', contactNo:'09876543210', eventType:'HALDI', startDate:'2026-11-18', venue:'the grand hall', startTime:'9:00'}), true);
  assert.equal(areDuplicateImportedEvents(existing, {clientName:'Asha & Ravi', contactNo:'9876543210', eventType:'Haldi', startDate:'2026-11-18', venue:'', startTime:''}), true);
});
