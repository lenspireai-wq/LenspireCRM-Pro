// Excel row-mappers used by the Electron main process.
const XLSX = require('xlsx');

function importDate(value) {
    const localDate = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    if (value instanceof Date && !Number.isNaN(value.getTime())) return localDate(value);
    if (typeof value === 'number') {
        const parsed = XLSX.SSF.parse_date_code(value);
        if (parsed) return `${parsed.y}-${String(parsed.m).padStart(2, '0')}-${String(parsed.d).padStart(2, '0')}`;
    }
    const text = String(value || '').trim();
    const dayFirst = text.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
    if (dayFirst) return `${dayFirst[3]}-${dayFirst[2].padStart(2, '0')}-${dayFirst[1].padStart(2, '0')}`;
    const parsed = new Date(text);
    return text && !Number.isNaN(parsed.getTime()) ? localDate(parsed) : text;
}

function leadRowsFromSheet(sheet) {
    const matrix = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '', raw: true });
    const normalize = value => String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const recognizedHeaders = new Set([
        'name', 'lead', 'customername', 'customercouplename', 'clientname',
        'mobile', 'mobilenumber', 'phone', 'phonenumber', 'contactnumber',
        'event', 'eventtype', 'typeofevent', 'eventdate', 'date', 'shootdate',
        'salesperson', 'salesexecutive', 'assignedto', 'owner', 'assigned'
    ]);
    const headerRow = matrix.findIndex(row => {
        const normalized = row.map(normalize).filter(Boolean);
        const hasName = normalized.some(value => ['name', 'lead', 'customername', 'customercouplename', 'clientname'].includes(value));
        const matches = normalized.filter(value => recognizedHeaders.has(value)).length;
        return hasName && matches >= 2;
    });
    if (headerRow < 0) throw new Error('Could not find a lead header row. Include a Client Name or Name column.');
    return XLSX.utils.sheet_to_json(sheet, { range: headerRow, defval: '', raw: true });
}

function mapLeadRows(rows) {
    const aliases = {
        name: ['name', 'lead', 'customername', 'customercouplename', 'clientname'],
        mobile: ['mobile', 'mobilenumber', 'phone', 'phonenumber', 'contactnumber'],
        eventType: ['eventtype', 'event', 'typeofevent'],
        eventDate: ['eventdate', 'date', 'shootdate'],
        createdAt: ['createdat', 'createddate', 'leaddate', 'inquirydate', 'date'],
        city: ['city', 'location'], source: ['source', 'leadsource'], status: ['status', 'leadstatus'],
        budget: ['budget', 'amount', 'expectedbudget'], priority: ['priority'],
        assignedTo: ['assignedto', 'salesperson', 'salesexecutive', 'owner', 'assigned'], notes: ['notes', 'note', 'remarks', 'comments'],
        coupleName: ['couplename', 'couple', 'bridegroom'],
        totalClosing: ['totalclosing', 'closingamount', 'finalamount', 'dealvalue'],
        nextFollowupAt: ['nextfollowup', 'nextfollowupdate', 'followup', 'followupdatetime'],
        lostReason: ['lostreason', 'reasonlost'],
        referredBy: ['referredby', 'referredbyname', 'referrername'],
        referralCode: ['referralcode', 'referral', 'refcode'],
        weddingDates: ['weddingdates', 'weddingdate', 'eventdates'],
        paymentMode: ['paymentmode', 'modeofpayment'],
        advanceReceived: ['advancereceived', 'advance', 'advanceamount'],
        receivedBy: ['receivedby', 'paymentreceivedby'],
        paymentReceivedDate: ['paymentreceiveddate', 'paymentdate', 'advancereceiveddate']
    };
    return rows.map(row => {
        const normalized = Object.fromEntries(Object.entries(row).map(([key, value]) => [key.toLowerCase().replace(/[^a-z0-9]/g, ''), value]));
        const read = field => aliases[field].map(key => normalized[key]).find(value => value !== undefined && value !== null) ?? '';
        return {
            name: String(read('name')).trim(), mobile: String(read('mobile')).trim(), eventType: String(read('eventType')).trim(),
            eventDate: importDate(read('eventDate')), createdAt: importDate(read('createdAt')), city: String(read('city')).trim(), source: String(read('source')).trim(),
            status: String(read('status')).trim(), budget: String(read('budget')).trim(), priority: String(read('priority')).trim(),
            assignedTo: String(read('assignedTo')).trim(), notes: String(read('notes')).trim(), coupleName: String(read('coupleName')).trim(),
            totalClosing: Number(String(read('totalClosing')).replace(/[^0-9.-]/g, '')) || null,
            nextFollowupAt: String(read('nextFollowupAt')).trim(), lostReason: String(read('lostReason')).trim(),
            referredBy: String(read('referredBy')).trim(), referralCode: String(read('referralCode')).trim(),
            weddingDates: String(read('weddingDates')).split(/[,;|]/).map(value => importDate(value)).filter(Boolean).join(','),
            paymentMode: String(read('paymentMode')).trim(),
            advanceReceived: Number(String(read('advanceReceived')).replace(/[^0-9.-]/g, '')) || null,
            receivedBy: String(read('receivedBy')).trim(),
            paymentReceivedDate: importDate(read('paymentReceivedDate'))
        };
    });
}

function mapEventRows(rows) {
    const aliases = {
        eventId: ['eventid', 'id'], dateStatus: ['datestatus'], eventDate: ['eventdate', 'date'], tbdMonth: ['tbdmonth', 'expectedmonth'],
        clientName: ['clientname', 'customername'], handledBy: ['handledby'], coupleName: ['couplename'], contactNo: ['contactno', 'contactnumber', 'mobile'],
        eventType: ['event', 'eventtype'], photo: ['photo'], video: ['video'], candid: ['candid'], cinematic: ['cinematic'], drone: ['drone'],
        assistant: ['assistant'], bts: ['bts'], venue: ['venue', 'location', 'city'], startTime: ['time', 'starttime'], notes: ['notes'], status: ['status']
    };
    return rows.map(row => {
        const normalized = Object.fromEntries(Object.entries(row).map(([key, value]) => [key.toLowerCase().replace(/[^a-z0-9]/g, ''), value]));
        const read = field => aliases[field].map(key => normalized[key]).find(value => value !== undefined && value !== null) ?? '';
        const rawEventDate = read('eventDate'), rawTbdMonth = String(read('tbdMonth')).trim();
        const tbdText = `${String(read('dateStatus'))} ${String(rawEventDate)} ${rawTbdMonth}`;
        const dateStatus = /\btbd\b/i.test(tbdText) || rawTbdMonth ? 'TBD Month' : 'Confirmed';
        let tbdMonth = rawTbdMonth, eventDate = dateStatus === 'TBD Month' ? '' : importDate(rawEventDate);
        if (dateStatus === 'TBD Month') {
            const monthText = `${rawTbdMonth} ${String(rawEventDate)}`;
            const numericMonth = monthText.match(/\b(20\d{2})[-\/]([01]?\d)\b/);
            if (numericMonth) tbdMonth = `${numericMonth[1]}-${String(Number(numericMonth[2])).padStart(2, '0')}`;
            else {
                const monthNames = ['january','february','march','april','may','june','july','august','september','october','november','december'];
                const monthIndex = monthNames.findIndex(name => new RegExp(`\\b${name.slice(0,3)}(?:${name.slice(3)})?\\b`, 'i').test(monthText));
                if (monthIndex >= 0) {
                    const now = new Date(), explicitYear = monthText.match(/\b(20\d{2})\b/);
                    const year = explicitYear ? Number(explicitYear[1]) : now.getFullYear() + (monthIndex < now.getMonth() ? 1 : 0);
                    tbdMonth = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
                } else tbdMonth = '';
            }
        }
        const timeValue = read('startTime');
        let startTime = timeValue instanceof Date ? `${String(timeValue.getHours()).padStart(2, '0')}:${String(timeValue.getMinutes()).padStart(2, '0')}` : String(timeValue || '').trim();
        const twelveHour = startTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
        if (twelveHour) {
            let hour = Number(twelveHour[1]) % 12;
            if (twelveHour[3].toUpperCase() === 'PM') hour += 12;
            startTime = `${String(hour).padStart(2, '0')}:${twelveHour[2]}`;
        }
        return {
            eventId: Number(read('eventId')) || null, dateStatus, startDate: eventDate, tbdMonth, clientName: String(read('clientName')).trim(),
            handledBy: String(read('handledBy')).trim(), coupleName: String(read('coupleName')).trim(), contactNo: String(read('contactNo')).trim(),
            eventType: String(read('eventType')).trim(), photo: String(read('photo')).trim(), video: String(read('video')).trim(), candid: String(read('candid')).trim(),
            cinematic: String(read('cinematic')).trim(), drone: String(read('drone')).trim(), assistant: String(read('assistant')).trim(), bts: String(read('bts')).trim(),
            venue: String(read('venue')).trim(), startTime, notes: String(read('notes')).trim(), status: String(read('status')).trim() || 'Scheduled', slotted: 1
        };
    });
}

function mapPhotographerRows(rows) {
    const aliases = {
        name: ['photographersname', 'photographername', 'name'], mobile: ['mobile', 'mobilenumber', 'phone', 'contactnumber'],
        livingIn: ['livingin', 'city', 'location', 'area'], work: ['work', 'worktype', 'skills'], status: ['status', 'type']
    };
    return rows.map(row => {
        const normalized = Object.fromEntries(Object.entries(row).map(([key, value]) => [key.toLowerCase().replace(/[^a-z0-9]/g, ''), value]));
        const read = field => aliases[field].map(key => normalized[key]).find(value => value !== undefined && value !== null) ?? '';
        const work = String(read('work')).split(/[,;|]/).map(value => value.trim()).filter(Boolean).join('; ');
        const statusText = String(read('status')).trim().toLowerCase();
        return { name: String(read('name')).trim(), mobile: String(read('mobile')).trim(), livingIn: String(read('livingIn')).trim(), work, status: statusText.includes('house') ? 'In-House' : statusText === 'outside' || statusText === 'outsource' ? 'Outside' : String(read('status')).trim() };
    });
}

function mapPaymentRows(rows) {
    const aliases = {
        bookingCode: ['bookingcode', 'booking', 'bookingid', 'bookingno', 'code'],
        amount: ['amount', 'paidamount', 'paymentamount', 'receivedamount'],
        paymentType: ['paymenttype', 'type', 'payment'],
        status: ['status', 'paymentstatus'],
        paymentMode: ['paymentmode', 'mode', 'method'],
        receivedBy: ['receivedby', 'received', 'collectedby', 'paymentby'],
        notes: ['notes', 'remark', 'remarks', 'comment', 'comments'],
        dueDate: ['duedate', 'due'],
        paidAt: ['paidat', 'paymentdate', 'date', 'receiveddate', 'paiddate']
    };
    return rows.map(row => {
        const normalized = Object.fromEntries(Object.entries(row).map(([key, value]) => [key.toLowerCase().replace(/[^a-z0-9]/g, ''), value]));
        const read = field => aliases[field].map(key => normalized[key]).find(value => value !== undefined && value !== null) ?? '';
        const statusText = String(read('status')).trim().toLowerCase();
        return {
            bookingCode: String(read('bookingCode')).trim(),
            amount: Number(read('amount')) || 0,
            paymentType: String(read('paymentType')).trim(),
            status: statusText === 'pending' ? 'Pending' : statusText === 'overdue' ? 'Overdue' : 'Paid',
            paymentMode: String(read('paymentMode')).trim(),
            receivedBy: String(read('receivedBy')).trim(),
            notes: String(read('notes')).trim(),
            dueDate: importDate(read('dueDate')),
            paidAt: importDate(read('paidAt'))
        };
    });
}

function duplicateText(value) {
    return String(value ?? '').trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function duplicatePhone(value) {
    const digits = String(value ?? '').replace(/\D/g, '');
    return digits.length >= 7 ? digits.slice(-10) : '';
}

function eventDuplicateParts(data) {
    const read = (camel, snake) => data?.[camel] ?? data?.[snake] ?? '';
    const dateStatus = duplicateText(read('dateStatus', 'date_status')) || 'confirmed';
    const rawTime = String(read('startTime', 'start_time')).trim();
    const timeMatch = rawTime.match(/^(\d{1,2}):(\d{2})/);
    return {
        phone: duplicatePhone(read('contactNo', 'contact_no')),
        client: duplicateText(read('clientName', 'client_name')),
        couple: duplicateText(read('coupleName', 'couple_name')),
        eventType: duplicateText(read('eventType', 'event_type')),
        date: dateStatus.includes('tbd') ? `tbd:${String(read('tbdMonth', 'tbd_month')).slice(0, 7)}` : String(read('startDate', 'start_date')).slice(0, 10),
        venue: duplicateText(data?.venue ?? data?.city ?? ''),
        time: timeMatch ? `${String(Number(timeMatch[1])).padStart(2, '0')}:${timeMatch[2]}` : duplicateText(rawTime)
    };
}

// Mutable details such as notes and crew allocation are deliberately excluded.
// When both rows specify venue/time, a difference identifies a separate event.
function areDuplicateImportedEvents(left, right) {
    const a = eventDuplicateParts(left), b = eventDuplicateParts(right);
    const sameClient = (a.phone && b.phone && a.phone === b.phone)
        || (a.client && b.client && a.client === b.client)
        || (a.couple && b.couple && a.couple === b.couple);
    return Boolean(sameClient && a.eventType && a.eventType === b.eventType && a.date && a.date === b.date
        && (!a.venue || !b.venue || a.venue === b.venue)
        && (!a.time || !b.time || a.time === b.time));
}

module.exports = { importDate, leadRowsFromSheet, mapLeadRows, mapEventRows, mapPhotographerRows, mapPaymentRows, areDuplicateImportedEvents };
