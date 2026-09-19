(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/OperationsWorkspace.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>OperationsWorkspace
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$query$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/query.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CalendarWorkspace$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/CalendarWorkspace.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$stores$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/stores/auth.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-format.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$download$2d$filename$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/download-filename.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
const views = [
    "Dashboard",
    "Calendar",
    "Upcoming Events",
    "Completed Events",
    "Photographers Details"
];
const mobileViewLabels = {
    Dashboard: "Dashboard",
    Calendar: "Calendar",
    "Upcoming Events": "Upcoming",
    "Completed Events": "Completed",
    "Photographers Details": "Photographers"
};
const upcomingStatuses = new Set([
    "Scheduled",
    "Confirmed",
    "In Progress"
]);
const blankEvent = {
    title: "",
    client_name: "",
    event_type: "Wedding",
    start_date: "",
    start_time: "",
    end_time: "",
    city: "",
    status: "Scheduled",
    handled_by: "",
    couple_name: "",
    contact_no: "",
    photo: "",
    video: "",
    candid: "",
    cinematic: "",
    drone: "",
    assistant: "",
    bts: "",
    notes: "",
    slotted: true,
    date_status: "Confirmed",
    tbd_month: ""
};
const blankPhotographer = {
    name: "",
    mobile: "",
    living_in: "",
    work: "",
    status: "Available"
};
const rows = (value)=>Array.isArray(value) ? value : value?.results || [];
const dateLabel = (value)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(value, "TBD");
const eventDateLabel = (event)=>{
    if (event.date_status === "TBD Month" && event.tbd_month) {
        return `TBD · ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(`${event.tbd_month}-01`)}`;
    }
    return dateLabel(event.start_date);
};
const crewMessageValue = (value)=>String(value || "").split("; ").map((item)=>item.replace(/ · /g, " ")).join(" + ");
const crewDisplayValue = (value)=>String(value || "").replace(/\+?(?:91[\s()-]*)?[6-9](?:[\s()-]*\d){9}\b/g, "").replace(/\s*[·|,-]\s*$/g, "").replace(/\s{2,}/g, " ").trim();
function eventMessage(event) {
    const eventDate = event.start_date ? new Date(`${event.start_date}T00:00:00`) : null;
    const shortDate = eventDate ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(event.start_date) : "Date TBD";
    const fullDate = eventDate ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(event.start_date) : "Date to be confirmed";
    const day = eventDate ? eventDate.toLocaleDateString("en-IN", {
        weekday: "long"
    }) : "Day to be confirmed";
    const eventTime = event.start_time ? new Date(`2000-01-01T${event.start_time}`).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit"
    }) : "Time to be confirmed";
    const roles = [
        [
            "📸",
            "Traditional Photographer",
            event.photo
        ],
        [
            "🎥",
            "Traditional Videographer",
            event.video
        ],
        [
            "📷",
            "Candid Photographer",
            event.candid
        ],
        [
            "🎬",
            "Cinematographer",
            event.cinematic
        ],
        [
            "🚁",
            "Drone",
            event.drone
        ],
        [
            "🧑‍🤝‍🧑",
            "Assistant",
            event.assistant
        ],
        [
            "🎞",
            "BTS",
            event.bts
        ]
    ].filter(([, , value])=>value && value !== "NA");
    const team = roles.map(([icon, label, value])=>`${icon} ${label}: ${crewMessageValue(value)}`).join("\n") || "Team assignment pending";
    return `${shortDate} - ${event.event_type || "Event"} – ${event.couple_name || event.client_name || event.title}

📞 Client / Contact: ${event.contact_no || "Contact to be confirmed"}
📍 Location & Venue:
${event.city || "Location to be confirmed"}
📅 Date: ${fullDate}
🗓 Day: ${day}
⏰ Time: ${eventTime}

👥 Team Members:
${team}

💡 Notes:
${event.notes || "No additional notes."}

🎯 Team Coordinators:
Govind Tiwari - 7757870959 - https://wa.me/7757870959
Sandeep Jadhav - 8976480490 - https://wa.me/8976480490
Pratiksha Pathak - 7709177580 - https://wa.me/7709177580
Aarzoo Singh - 9307846897 - https://wa.me/9307846897

📸 Guidelines for Photographers:
• Always wear black colored plain outfits (T-shirt/Shirt and Jeans/Trousers).
• Avoid flashy colors, printed designs, or casual wear like shorts or slippers.
• Keep your attire clean and well-ironed.
• Arrive at least 30 minutes before event start time.
• Maintain respectful communication with clients and team.
• Do not argue with clients — report issues to coordinator.
• Avoid using mobile phones for personal use.
• Do not eat, smoke, or chew gum during the shoot.
• Follow Team Leader / Coordinator instructions.
• Support other team members.
• Do not share client photos/videos without permission.`;
}
function OperationsWorkspace({ searchTerm = "", readOnly = false, view = "Dashboard", setView }) {
    _s();
    const setViewSafe = setView ?? (()=>{});
    const [photographers, setPhotographers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [eventDraft, setEventDraft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [crewDraft, setCrewDraft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [messageEvent, setMessageEvent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OperationsWorkspace.useEffect": ()=>{
            setError("");
        }
    }["OperationsWorkspace.useEffect"], [
        view
    ]);
    const [importSummary, setImportSummary] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [month, setMonth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "OperationsWorkspace.useState": ()=>new Date()
    }["OperationsWorkspace.useState"]);
    const [importing, setImporting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [dashboardControlsHeight, setDashboardControlsHeight] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(96);
    const dashboardControlsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const eventFileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null)[0];
    const photographerFileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null)[0];
    const eventsQuery = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$query$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApiQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$query$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["queryKeys"].events(), "/events/?page_size=5000&ordering=start_date,start_time,id");
    const crewQuery = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$query$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApiQuery"])([
        "photographers"
    ], "/photographers/?page_size=500");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OperationsWorkspace.useEffect": ()=>{
            if (crewQuery.data) {
                setPhotographers(Array.isArray(crewQuery.data) ? crewQuery.data : crewQuery.data.results || []);
            }
        }
    }["OperationsWorkspace.useEffect"], [
        crewQuery.data
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OperationsWorkspace.useEffect": ()=>{
            if (view !== "Dashboard" && view !== "Photographers Details" || !dashboardControlsRef.current) return;
            const controls = dashboardControlsRef.current;
            const updateHeight = {
                "OperationsWorkspace.useEffect.updateHeight": ()=>setDashboardControlsHeight(controls.getBoundingClientRect().height)
            }["OperationsWorkspace.useEffect.updateHeight"];
            updateHeight();
            const observer = new ResizeObserver(updateHeight);
            observer.observe(controls);
            return ({
                "OperationsWorkspace.useEffect": ()=>observer.disconnect()
            })["OperationsWorkspace.useEffect"];
        }
    }["OperationsWorkspace.useEffect"], [
        view,
        eventsQuery.isPending
    ]);
    const events = Array.isArray(eventsQuery.data) ? eventsQuery.data : eventsQuery.data?.results || [];
    const saveEventMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$query$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApiMutation"])({
        mutationFn: {
            "OperationsWorkspace.useApiMutation[saveEventMutation]": async ({ url, payload })=>(await (url ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].patch(url, payload) : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post("/events/", payload))).data
        }["OperationsWorkspace.useApiMutation[saveEventMutation]"]
    });
    const saveCrewMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$query$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApiMutation"])({
        mutationFn: {
            "OperationsWorkspace.useApiMutation[saveCrewMutation]": async ({ url, payload })=>(await (url ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].patch(url, payload) : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post("/photographers/", payload))).data
        }["OperationsWorkspace.useApiMutation[saveCrewMutation]"]
    });
    const invalidateEvents = ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$query$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["queryClient"].invalidateQueries({
            queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$query$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["queryKeys"].events()
        });
    const matchingEvents = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "OperationsWorkspace.useMemo[matchingEvents]": ()=>{
            const terms = searchTerm.trim().toLowerCase().split(/\s+/).filter(Boolean);
            return events.filter({
                "OperationsWorkspace.useMemo[matchingEvents]": (event)=>{
                    const text = [
                        event.title,
                        event.client_name,
                        event.handled_by,
                        event.couple_name,
                        event.contact_no,
                        event.event_type,
                        event.city,
                        event.start_date,
                        dateLabel(event.start_date),
                        event.start_time,
                        event.notes,
                        event.photo,
                        event.video,
                        event.candid,
                        event.cinematic,
                        event.drone,
                        event.assistant,
                        event.bts
                    ].filter({
                        "OperationsWorkspace.useMemo[matchingEvents].text": (value)=>value != null
                    }["OperationsWorkspace.useMemo[matchingEvents].text"]).join(" ").toLowerCase();
                    return terms.every({
                        "OperationsWorkspace.useMemo[matchingEvents]": (term)=>text.includes(term)
                    }["OperationsWorkspace.useMemo[matchingEvents]"]);
                }
            }["OperationsWorkspace.useMemo[matchingEvents]"]);
        }
    }["OperationsWorkspace.useMemo[matchingEvents]"], [
        events,
        searchTerm
    ]);
    const upcoming = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "OperationsWorkspace.useMemo[upcoming]": ()=>matchingEvents.filter({
                "OperationsWorkspace.useMemo[upcoming]": (e)=>upcomingStatuses.has(e.status)
            }["OperationsWorkspace.useMemo[upcoming]"])
    }["OperationsWorkspace.useMemo[upcoming]"], [
        matchingEvents
    ]);
    const completed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "OperationsWorkspace.useMemo[completed]": ()=>matchingEvents.filter({
                "OperationsWorkspace.useMemo[completed]": (e)=>e.status === "Completed"
            }["OperationsWorkspace.useMemo[completed]"]).sort({
                "OperationsWorkspace.useMemo[completed]": (a, b)=>{
                    const dateOrder = String(b.start_date || "").localeCompare(String(a.start_date || ""));
                    if (dateOrder) return dateOrder;
                    const timeOrder = String(b.start_time || "").localeCompare(String(a.start_time || ""));
                    return timeOrder || Number(b.id) - Number(a.id);
                }
            }["OperationsWorkspace.useMemo[completed]"])
    }["OperationsWorkspace.useMemo[completed]"], [
        matchingEvents
    ]);
    const saveEvent = async (e)=>{
        e.preventDefault();
        setError("");
        const data = Object.fromEntries(new FormData(e.currentTarget));
        const payload = {
            ...eventDraft,
            ...data,
            title: `${data.client_name} · ${data.event_type}`,
            slotted: true,
            start_date: data.date_status === "TBD Month" ? null : data.start_date || null,
            start_time: data.start_time || null,
            end_time: null
        };
        try {
            await saveEventMutation.mutateAsync({
                url: eventDraft?.id ? `/events/${eventDraft.id}/` : "",
                payload
            });
            setEventDraft(null);
        } catch (err) {
            setError(JSON.stringify(err.response?.data || "Could not save event"));
        }
    };
    const saveCrew = async (e)=>{
        e.preventDefault();
        setError("");
        const payload = Object.fromEntries(new FormData(e.currentTarget));
        if (!payload.work) {
            setError("Select at least one work type.");
            return;
        }
        try {
            await saveCrewMutation.mutateAsync({
                url: crewDraft?.id ? `/photographers/${crewDraft.id}/` : "",
                payload
            });
            setCrewDraft(null);
        } catch (err) {
            setError(JSON.stringify(err.response?.data || "Could not save photographer"));
        }
    };
    const remove = async (path, refresh)=>{
        if (!confirm("Delete this record?")) return;
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].delete(path);
        await refresh();
    };
    const duplicateEvent = (event)=>{
        const { id: _id, ...copy } = event;
        setError("");
        setEventDraft({
            ...copy
        });
    };
    const exportEvents = async ()=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get("/events/export/", {
                responseType: "blob"
            });
            const url = URL.createObjectURL(response.data);
            const link = document.createElement("a");
            link.href = url;
            link.download = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$download$2d$filename$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["exportFilename"])(view === "Completed Events" ? "Completed_Events" : "Upcoming_Events", "xlsx");
            link.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            setError(err.response?.data?.detail || "Could not export events.");
        }
    };
    const importEvents = async (file)=>{
        if (!file) return;
        setImporting(true);
        setError("");
        setImportSummary("");
        try {
            // Send the workbook directly instead of multipart. This avoids reverse
            // proxies that discard multipart boundaries and empty Django's FILES map.
            const upload = (token)=>fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].defaults.baseURL}/events/import/`, {
                    method: "POST",
                    headers: {
                        ...token ? {
                            Authorization: `Bearer ${token}`
                        } : {},
                        "Content-Type": file.type || "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    },
                    body: file
                });
            let auth = __TURBOPACK__imported__module__$5b$project$5d2f$stores$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"].getState();
            let response = await upload(auth.access);
            // This direct file upload does not pass through Axios's normal token
            // refresh interceptor. Refresh once and retry so a stale access token
            // does not turn a valid Excel import into a login error.
            if (response.status === 401 && auth.refresh) {
                const refreshResponse = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].defaults.baseURL}/auth/refresh/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        refresh: auth.refresh
                    })
                });
                if (refreshResponse.ok) {
                    const refreshed = await refreshResponse.json();
                    __TURBOPACK__imported__module__$5b$project$5d2f$stores$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"].getState().setTokens(refreshed.access, refreshed.refresh || auth.refresh);
                    response = await upload(refreshed.access);
                }
            }
            const responseText = await response.text();
            let data = {};
            try {
                data = responseText ? JSON.parse(responseText) : {};
            } catch  {
                // Reverse proxies can return an HTML error document. Keep a short
                // plain-text excerpt so the user is not shown an unhelpful `{}`.
                data = {
                    detail: responseText.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 300)
                };
            }
            if (!response.ok) {
                const detail = data.detail || `Import failed (HTTP ${response.status}).`;
                throw {
                    response: {
                        data: {
                            ...data,
                            detail
                        }
                    }
                };
            }
            await invalidateEvents();
            setImportSummary(`${data.updated || 0} event(s) updated, ${data.created || 0} event(s) created, ${data.skipped || 0} duplicate event(s) skipped.`);
        } catch (err) {
            setError(err.response?.data?.detail || JSON.stringify(err.response?.data || "Could not import events."));
        } finally{
            setImporting(false);
        }
    };
    const exportPhotographers = async ()=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get("/photographers/export/", {
                responseType: "blob"
            });
            const url = URL.createObjectURL(response.data);
            const link = document.createElement("a");
            link.href = url;
            link.download = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$download$2d$filename$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["exportFilename"])("Photographers", "xlsx");
            link.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            setError(err.response?.data?.detail || "Could not export photographers.");
        }
    };
    const importPhotographers = async (file)=>{
        if (!file) return;
        setImporting(true);
        setError("");
        const form = new FormData();
        form.append("file", file);
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post("/photographers/import/", form);
            await crewQuery.refetch();
        } catch (err) {
            setError(err.response?.data?.detail || JSON.stringify(err.response?.data || "Could not import photographers."));
        } finally{
            setImporting(false);
        }
    };
    if (view !== "Photographers Details" && eventsQuery.isPending) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "operationsWorkspace",
            role: "status",
            children: "Loading events…"
        }, void 0, false, {
            fileName: "[project]/components/OperationsWorkspace.tsx",
            lineNumber: 407,
            columnNumber: 12
        }, this);
    }
    if (view !== "Photographers Details" && eventsQuery.isError) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "operationsWorkspace",
            role: "alert",
            children: [
                "Could not load events. ",
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>eventsQuery.refetch(),
                    children: "Retry"
                }, void 0, false, {
                    fileName: "[project]/components/OperationsWorkspace.tsx",
                    lineNumber: 410,
                    columnNumber: 85
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/OperationsWorkspace.tsx",
            lineNumber: 410,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `operationsWorkspace${view === "Dashboard" ? " operationsDashboardView" : view === "Photographers Details" ? " photographersDetailsView" : ""}`,
        style: view === "Dashboard" || view === "Photographers Details" ? {
            "--operations-controls-height": `${dashboardControlsHeight}px`
        } : undefined,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: dashboardControlsRef,
                className: "operationsDashboardControls",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        className: "operationsTabs",
                        children: views.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: view === item ? "active" : "",
                                onClick: ()=>setViewSafe(item),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "desktopOperationsTabLabel",
                                        children: item === "Photographers Details" ? "Photographers" : item
                                    }, void 0, false, {
                                        fileName: "[project]/components/OperationsWorkspace.tsx",
                                        lineNumber: 426,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "mobileOperationsTabLabel",
                                        children: mobileViewLabels[item]
                                    }, void 0, false, {
                                        fileName: "[project]/components/OperationsWorkspace.tsx",
                                        lineNumber: 427,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, item, true, {
                                fileName: "[project]/components/OperationsWorkspace.tsx",
                                lineNumber: 421,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/OperationsWorkspace.tsx",
                        lineNumber: 419,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "operationsActions",
                        children: [
                            (view === "Upcoming Events" || view === "Completed Events") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: "operationsActionButton",
                                        onClick: exportEvents,
                                        title: "Export events to Excel",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Export"
                                            }, void 0, false, {
                                                fileName: "[project]/components/OperationsWorkspace.tsx",
                                                lineNumber: 435,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "operationsActionIcon",
                                                "aria-hidden": "true",
                                                children: "↗"
                                            }, void 0, false, {
                                                fileName: "[project]/components/OperationsWorkspace.tsx",
                                                lineNumber: 435,
                                                columnNumber: 34
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/OperationsWorkspace.tsx",
                                        lineNumber: 434,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "fileLabel operationsActionButton",
                                        title: "Import events from Excel",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Import"
                                            }, void 0, false, {
                                                fileName: "[project]/components/OperationsWorkspace.tsx",
                                                lineNumber: 438,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "operationsActionIcon",
                                                "aria-hidden": "true",
                                                children: "↥"
                                            }, void 0, false, {
                                                fileName: "[project]/components/OperationsWorkspace.tsx",
                                                lineNumber: 438,
                                                columnNumber: 34
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "file",
                                                accept: ".xlsx,.xls",
                                                className: "hiddenInput",
                                                onChange: (event)=>{
                                                    const file = event.target.files?.[0];
                                                    if (file) importEvents(file);
                                                    event.target.value = "";
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/components/OperationsWorkspace.tsx",
                                                lineNumber: 439,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/OperationsWorkspace.tsx",
                                        lineNumber: 437,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/OperationsWorkspace.tsx",
                                lineNumber: 433,
                                columnNumber: 11
                            }, this),
                            view === "Photographers Details" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: "operationsActionButton",
                                        onClick: exportPhotographers,
                                        title: "Export photographers to Excel",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Export"
                                            }, void 0, false, {
                                                fileName: "[project]/components/OperationsWorkspace.tsx",
                                                lineNumber: 455,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "operationsActionIcon",
                                                "aria-hidden": "true",
                                                children: "↗"
                                            }, void 0, false, {
                                                fileName: "[project]/components/OperationsWorkspace.tsx",
                                                lineNumber: 455,
                                                columnNumber: 34
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/OperationsWorkspace.tsx",
                                        lineNumber: 454,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "fileLabel operationsActionButton",
                                        title: "Import photographers from Excel",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Import"
                                            }, void 0, false, {
                                                fileName: "[project]/components/OperationsWorkspace.tsx",
                                                lineNumber: 458,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "operationsActionIcon",
                                                "aria-hidden": "true",
                                                children: "↥"
                                            }, void 0, false, {
                                                fileName: "[project]/components/OperationsWorkspace.tsx",
                                                lineNumber: 458,
                                                columnNumber: 34
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "file",
                                                accept: ".xlsx,.xls",
                                                className: "hiddenInput",
                                                onChange: (event)=>{
                                                    const file = event.target.files?.[0];
                                                    if (file) importPhotographers(file);
                                                    event.target.value = "";
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/components/OperationsWorkspace.tsx",
                                                lineNumber: 459,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/OperationsWorkspace.tsx",
                                        lineNumber: 457,
                                        columnNumber: 13
                                    }, this),
                                    !readOnly && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "primary operationsActionButton",
                                        onClick: ()=>setCrewDraft({
                                                ...blankPhotographer
                                            }),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Add Photographer"
                                            }, void 0, false, {
                                                fileName: "[project]/components/OperationsWorkspace.tsx",
                                                lineNumber: 475,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "operationsActionIcon",
                                                "aria-hidden": "true",
                                                children: "＋"
                                            }, void 0, false, {
                                                fileName: "[project]/components/OperationsWorkspace.tsx",
                                                lineNumber: 475,
                                                columnNumber: 46
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/OperationsWorkspace.tsx",
                                        lineNumber: 471,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/OperationsWorkspace.tsx",
                                lineNumber: 453,
                                columnNumber: 11
                            }, this),
                            view === "Upcoming Events" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: !readOnly && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "primary operationsActionButton",
                                    onClick: ()=>setEventDraft({
                                            ...blankEvent
                                        }),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Add Event"
                                        }, void 0, false, {
                                            fileName: "[project]/components/OperationsWorkspace.tsx",
                                            lineNumber: 487,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "operationsActionIcon",
                                            "aria-hidden": "true",
                                            children: "＋"
                                        }, void 0, false, {
                                            fileName: "[project]/components/OperationsWorkspace.tsx",
                                            lineNumber: 487,
                                            columnNumber: 39
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                    lineNumber: 483,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/OperationsWorkspace.tsx",
                                lineNumber: 481,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/OperationsWorkspace.tsx",
                        lineNumber: 431,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/OperationsWorkspace.tsx",
                lineNumber: 418,
                columnNumber: 7
            }, this),
            error && !eventDraft && !crewDraft && !messageEvent && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "formError",
                role: "alert",
                children: error
            }, void 0, false, {
                fileName: "[project]/components/OperationsWorkspace.tsx",
                lineNumber: 495,
                columnNumber: 9
            }, this),
            importSummary && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "operationsImportSummary",
                role: "status",
                children: importSummary
            }, void 0, false, {
                fileName: "[project]/components/OperationsWorkspace.tsx",
                lineNumber: 499,
                columnNumber: 25
            }, this),
            view === "Dashboard" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Dashboard, {
                events: events,
                photographers: photographers,
                open: setViewSafe
            }, void 0, false, {
                fileName: "[project]/components/OperationsWorkspace.tsx",
                lineNumber: 501,
                columnNumber: 9
            }, this),
            view === "Calendar" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CalendarWorkspace$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/components/OperationsWorkspace.tsx",
                lineNumber: 507,
                columnNumber: 31
            }, this),
            view === "Upcoming Events" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EventTable, {
                events: upcoming,
                fitColumns: true,
                edit: readOnly ? undefined : setEventDraft,
                onMessage: setMessageEvent,
                onDuplicate: readOnly ? undefined : duplicateEvent,
                remove: readOnly ? undefined : (id)=>remove(`/events/${id}/`, invalidateEvents)
            }, void 0, false, {
                fileName: "[project]/components/OperationsWorkspace.tsx",
                lineNumber: 509,
                columnNumber: 9
            }, this),
            view === "Completed Events" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EventTable, {
                events: completed,
                fitColumns: true,
                edit: readOnly ? undefined : setEventDraft,
                onMessage: setMessageEvent,
                onDuplicate: readOnly ? undefined : duplicateEvent,
                remove: readOnly ? undefined : (id)=>remove(`/events/${id}/`, invalidateEvents)
            }, void 0, false, {
                fileName: "[project]/components/OperationsWorkspace.tsx",
                lineNumber: 521,
                columnNumber: 9
            }, this),
            view === "Photographers Details" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CrewTable, {
                rows: photographers,
                edit: readOnly ? undefined : setCrewDraft,
                remove: readOnly ? undefined : (id)=>remove(`/photographers/${id}/`, ()=>crewQuery.refetch())
            }, void 0, false, {
                fileName: "[project]/components/OperationsWorkspace.tsx",
                lineNumber: 533,
                columnNumber: 9
            }, this),
            eventDraft && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EventModal, {
                draft: eventDraft,
                photographers: photographers,
                close: ()=>setEventDraft(null),
                save: saveEvent,
                error: error
            }, void 0, false, {
                fileName: "[project]/components/OperationsWorkspace.tsx",
                lineNumber: 544,
                columnNumber: 9
            }, this),
            crewDraft && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CrewModal, {
                draft: crewDraft,
                close: ()=>setCrewDraft(null),
                save: saveCrew,
                error: error
            }, void 0, false, {
                fileName: "[project]/components/OperationsWorkspace.tsx",
                lineNumber: 553,
                columnNumber: 9
            }, this),
            messageEvent && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EventMessageModal, {
                event: messageEvent,
                close: ()=>setMessageEvent(null)
            }, void 0, false, {
                fileName: "[project]/components/OperationsWorkspace.tsx",
                lineNumber: 561,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/OperationsWorkspace.tsx",
        lineNumber: 414,
        columnNumber: 5
    }, this);
}
_s(OperationsWorkspace, "LvZXAmEYs8hKduO7tJAwypmd8Pw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$query$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApiQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$query$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApiQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$query$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApiMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$query$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApiMutation"]
    ];
});
_c = OperationsWorkspace;
function Dashboard({ events, photographers, open }) {
    const today = new Date().toISOString().slice(0, 10), upcoming = events.filter((e)=>upcomingStatuses.has(e.status));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "salesKpis",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                        className: "operationsKpiLink",
                        role: "button",
                        tabIndex: 0,
                        onClick: ()=>open("Upcoming Events"),
                        onKeyDown: (event)=>{
                            if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                open("Upcoming Events");
                            }
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Upcoming Events"
                            }, void 0, false, {
                                fileName: "[project]/components/OperationsWorkspace.tsx",
                                lineNumber: 596,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                children: upcoming.length
                            }, void 0, false, {
                                fileName: "[project]/components/OperationsWorkspace.tsx",
                                lineNumber: 597,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                children: "awaiting completion"
                            }, void 0, false, {
                                fileName: "[project]/components/OperationsWorkspace.tsx",
                                lineNumber: 598,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/OperationsWorkspace.tsx",
                        lineNumber: 584,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Shooting Today"
                            }, void 0, false, {
                                fileName: "[project]/components/OperationsWorkspace.tsx",
                                lineNumber: 601,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                children: events.filter((e)=>e.start_date === today && e.status === "In Progress").length
                            }, void 0, false, {
                                fileName: "[project]/components/OperationsWorkspace.tsx",
                                lineNumber: 602,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                children: "events today"
                            }, void 0, false, {
                                fileName: "[project]/components/OperationsWorkspace.tsx",
                                lineNumber: 609,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/OperationsWorkspace.tsx",
                        lineNumber: 600,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                        className: "operationsKpiLink",
                        role: "button",
                        tabIndex: 0,
                        onClick: ()=>open("Completed Events"),
                        onKeyDown: (event)=>{
                            if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                open("Completed Events");
                            }
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Completed"
                            }, void 0, false, {
                                fileName: "[project]/components/OperationsWorkspace.tsx",
                                lineNumber: 623,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                children: events.filter((e)=>e.status === "Completed").length
                            }, void 0, false, {
                                fileName: "[project]/components/OperationsWorkspace.tsx",
                                lineNumber: 624,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                children: "finished shoots"
                            }, void 0, false, {
                                fileName: "[project]/components/OperationsWorkspace.tsx",
                                lineNumber: 625,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/OperationsWorkspace.tsx",
                        lineNumber: 611,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                        className: "operationsKpiLink",
                        role: "button",
                        tabIndex: 0,
                        onClick: ()=>open("Photographers Details"),
                        onKeyDown: (event)=>{
                            if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                open("Photographers Details");
                            }
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Crew"
                            }, void 0, false, {
                                fileName: "[project]/components/OperationsWorkspace.tsx",
                                lineNumber: 639,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                children: photographers.length
                            }, void 0, false, {
                                fileName: "[project]/components/OperationsWorkspace.tsx",
                                lineNumber: 640,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                children: "photographers"
                            }, void 0, false, {
                                fileName: "[project]/components/OperationsWorkspace.tsx",
                                lineNumber: 641,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/OperationsWorkspace.tsx",
                        lineNumber: 627,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/OperationsWorkspace.tsx",
                lineNumber: 583,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "panel",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "panelHead",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                children: "Next Shoots"
                            }, void 0, false, {
                                fileName: "[project]/components/OperationsWorkspace.tsx",
                                lineNumber: 646,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "iconOnlyAction viewAction",
                                title: "View all upcoming events",
                                "aria-label": "View all upcoming events",
                                onClick: ()=>open("Upcoming Events"),
                                children: "◉"
                            }, void 0, false, {
                                fileName: "[project]/components/OperationsWorkspace.tsx",
                                lineNumber: 647,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/OperationsWorkspace.tsx",
                        lineNumber: 645,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EventTable, {
                        events: upcoming.slice(0, 8),
                        compact: true
                    }, void 0, false, {
                        fileName: "[project]/components/OperationsWorkspace.tsx",
                        lineNumber: 656,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/OperationsWorkspace.tsx",
                lineNumber: 644,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/OperationsWorkspace.tsx",
        lineNumber: 582,
        columnNumber: 5
    }, this);
}
_c1 = Dashboard;
function EventTable({ events, edit, remove, onMessage, onDuplicate, compact = false, fitColumns = false }) {
    const labels = [
        "Sr. No.",
        "Date",
        "Client Name",
        "Handled By",
        "Couple Name",
        "Contact No.",
        "Event",
        "Photo",
        "Video",
        "Candid",
        "Cinematic",
        "Drone",
        "Assistant",
        "BTS",
        "Venue",
        "Time",
        "Notes",
        "Action"
    ];
    const crew = (value)=>{
        const assignments = String(value || "").split(/\s*;\s*|\s*\+(?!\s*\d)\s*/).map((assignment)=>assignment.trim()).filter(Boolean);
        const namedAssignments = assignments.filter((assignment)=>![
                "X",
                "XX",
                "NA"
            ].includes(assignment.toUpperCase()));
        const multipleNames = namedAssignments.length > 1;
        return assignments.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `crewAssignments ${multipleNames ? "multipleCrew" : ""}`,
            children: assignments.map((assignment)=>{
                const marker = assignment.toUpperCase();
                const displayAssignment = crewDisplayValue(assignment) || assignment;
                const colorClass = marker === "NA" ? "crewNA" : marker === "XX" ? "crewXX" : marker === "X" ? "crewX" : multipleNames ? "crewAssignedMultiple" : "crewAssigned";
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: colorClass,
                    children: displayAssignment
                }, assignment, false, {
                    fileName: "[project]/components/OperationsWorkspace.tsx",
                    lineNumber: 705,
                    columnNumber: 13
                }, this);
            })
        }, void 0, false, {
            fileName: "[project]/components/OperationsWorkspace.tsx",
            lineNumber: 690,
            columnNumber: 7
        }, this) : "—";
    };
    if (compact) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "table",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                    children: "Date"
                                }, void 0, false, {
                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                    lineNumber: 721,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                    children: "Client"
                                }, void 0, false, {
                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                    lineNumber: 722,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                    children: "Event"
                                }, void 0, false, {
                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                    lineNumber: 723,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                    children: "Venue"
                                }, void 0, false, {
                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                    lineNumber: 724,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                    children: "Crew Coverage"
                                }, void 0, false, {
                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                    lineNumber: 725,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                    children: "Status"
                                }, void 0, false, {
                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                    lineNumber: 726,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/OperationsWorkspace.tsx",
                            lineNumber: 720,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/OperationsWorkspace.tsx",
                        lineNumber: 719,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                        children: events.map((row)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        children: dateLabel(row.start_date)
                                    }, void 0, false, {
                                        fileName: "[project]/components/OperationsWorkspace.tsx",
                                        lineNumber: 732,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                            children: row.client_name || row.title
                                        }, void 0, false, {
                                            fileName: "[project]/components/OperationsWorkspace.tsx",
                                            lineNumber: 734,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/OperationsWorkspace.tsx",
                                        lineNumber: 733,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        children: row.event_type
                                    }, void 0, false, {
                                        fileName: "[project]/components/OperationsWorkspace.tsx",
                                        lineNumber: 736,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        children: row.city || "—"
                                    }, void 0, false, {
                                        fileName: "[project]/components/OperationsWorkspace.tsx",
                                        lineNumber: 737,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        children: [
                                            row.photo,
                                            row.video,
                                            row.candid,
                                            row.cinematic,
                                            row.drone,
                                            row.assistant,
                                            row.bts
                                        ].filter(Boolean).map(crewDisplayValue).filter(Boolean).join(" · ") || "—"
                                    }, void 0, false, {
                                        fileName: "[project]/components/OperationsWorkspace.tsx",
                                        lineNumber: 738,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: `statusPill status-${String(row.status || "").toLowerCase().replaceAll(" ", "-")}`,
                                            children: row.status
                                        }, void 0, false, {
                                            fileName: "[project]/components/OperationsWorkspace.tsx",
                                            lineNumber: 754,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/OperationsWorkspace.tsx",
                                        lineNumber: 753,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, row.id, true, {
                                fileName: "[project]/components/OperationsWorkspace.tsx",
                                lineNumber: 731,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/OperationsWorkspace.tsx",
                        lineNumber: 729,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/OperationsWorkspace.tsx",
                lineNumber: 718,
                columnNumber: 9
            }, this),
            !events.length && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "empty",
                children: "No events found."
            }, void 0, false, {
                fileName: "[project]/components/OperationsWorkspace.tsx",
                lineNumber: 760,
                columnNumber: 28
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/OperationsWorkspace.tsx",
        lineNumber: 717,
        columnNumber: 7
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `table upcomingEventsTableWrap${fitColumns ? " fitUpcomingColumns" : ""}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                className: "upcomingEventsTable",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                            children: labels.map((label)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                    scope: "col",
                                    children: label
                                }, label, false, {
                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                    lineNumber: 768,
                                    columnNumber: 36
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/OperationsWorkspace.tsx",
                            lineNumber: 767,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/OperationsWorkspace.tsx",
                        lineNumber: 766,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                        children: events.map((row, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        className: "srNo",
                                        children: index + 1
                                    }, void 0, false, {
                                        fileName: "[project]/components/OperationsWorkspace.tsx",
                                        lineNumber: 774,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        className: row.date_status === "TBD Month" ? "tbdEventDate" : undefined,
                                        children: eventDateLabel(row)
                                    }, void 0, false, {
                                        fileName: "[project]/components/OperationsWorkspace.tsx",
                                        lineNumber: 775,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                            children: row.client_name || row.title
                                        }, void 0, false, {
                                            fileName: "[project]/components/OperationsWorkspace.tsx",
                                            lineNumber: 779,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/OperationsWorkspace.tsx",
                                        lineNumber: 778,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        children: row.handled_by || "—"
                                    }, void 0, false, {
                                        fileName: "[project]/components/OperationsWorkspace.tsx",
                                        lineNumber: 781,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        children: row.couple_name || "—"
                                    }, void 0, false, {
                                        fileName: "[project]/components/OperationsWorkspace.tsx",
                                        lineNumber: 782,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        children: row.contact_no || "—"
                                    }, void 0, false, {
                                        fileName: "[project]/components/OperationsWorkspace.tsx",
                                        lineNumber: 783,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        children: row.event_type
                                    }, void 0, false, {
                                        fileName: "[project]/components/OperationsWorkspace.tsx",
                                        lineNumber: 784,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        children: crew(row.photo)
                                    }, void 0, false, {
                                        fileName: "[project]/components/OperationsWorkspace.tsx",
                                        lineNumber: 785,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        children: crew(row.video)
                                    }, void 0, false, {
                                        fileName: "[project]/components/OperationsWorkspace.tsx",
                                        lineNumber: 786,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        children: crew(row.candid)
                                    }, void 0, false, {
                                        fileName: "[project]/components/OperationsWorkspace.tsx",
                                        lineNumber: 787,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        children: crew(row.cinematic)
                                    }, void 0, false, {
                                        fileName: "[project]/components/OperationsWorkspace.tsx",
                                        lineNumber: 788,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        children: crew(row.drone)
                                    }, void 0, false, {
                                        fileName: "[project]/components/OperationsWorkspace.tsx",
                                        lineNumber: 789,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        children: crew(row.assistant)
                                    }, void 0, false, {
                                        fileName: "[project]/components/OperationsWorkspace.tsx",
                                        lineNumber: 790,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        children: crew(row.bts)
                                    }, void 0, false, {
                                        fileName: "[project]/components/OperationsWorkspace.tsx",
                                        lineNumber: 791,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        title: row.city || "—",
                                        children: row.city || "—"
                                    }, void 0, false, {
                                        fileName: "[project]/components/OperationsWorkspace.tsx",
                                        lineNumber: 792,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        children: row.start_time?.slice(0, 5) || "—"
                                    }, void 0, false, {
                                        fileName: "[project]/components/OperationsWorkspace.tsx",
                                        lineNumber: 795,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        className: "eventNotes",
                                        title: row.notes || "—",
                                        children: row.notes || "—"
                                    }, void 0, false, {
                                        fileName: "[project]/components/OperationsWorkspace.tsx",
                                        lineNumber: 796,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "eventRowActions",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "message",
                                                    title: "Generate event message",
                                                    onClick: ()=>onMessage?.(row),
                                                    children: "✉"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                                    lineNumber: 801,
                                                    columnNumber: 19
                                                }, this),
                                                onDuplicate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "duplicate",
                                                    title: "Duplicate event",
                                                    onClick: ()=>onDuplicate(row),
                                                    children: "⧉"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                                    lineNumber: 809,
                                                    columnNumber: 21
                                                }, this),
                                                edit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    title: "Edit event and assign photographers",
                                                    onClick: ()=>edit({
                                                            ...row
                                                        }),
                                                    children: "✎"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                                    lineNumber: 818,
                                                    columnNumber: 21
                                                }, this),
                                                remove && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "delete",
                                                    title: "Delete event",
                                                    onClick: ()=>remove(row.id),
                                                    children: "×"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                                    lineNumber: 826,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/OperationsWorkspace.tsx",
                                            lineNumber: 800,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/OperationsWorkspace.tsx",
                                        lineNumber: 799,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, row.id, true, {
                                fileName: "[project]/components/OperationsWorkspace.tsx",
                                lineNumber: 773,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/OperationsWorkspace.tsx",
                        lineNumber: 771,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/OperationsWorkspace.tsx",
                lineNumber: 765,
                columnNumber: 7
            }, this),
            !events.length && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "empty",
                children: "No events found."
            }, void 0, false, {
                fileName: "[project]/components/OperationsWorkspace.tsx",
                lineNumber: 840,
                columnNumber: 26
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/OperationsWorkspace.tsx",
        lineNumber: 764,
        columnNumber: 5
    }, this);
}
_c2 = EventTable;
function Calendar({ events, month, setMonth, edit }) {
    const year = month.getFullYear(), index = month.getMonth(), first = new Date(year, index, 1), count = new Date(year, index + 1, 0).getDate(), offset = (first.getDay() + 6) % 7;
    const days = Array(offset).fill(null).concat(Array.from({
        length: count
    }, (_, i)=>i + 1));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "panel operationsCalendar",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "panelHead",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setMonth(new Date(year, index - 1, 1)),
                        children: "‹"
                    }, void 0, false, {
                        fileName: "[project]/components/OperationsWorkspace.tsx",
                        lineNumber: 867,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        children: month.toLocaleDateString("en-IN", {
                            month: "long",
                            year: "numeric"
                        })
                    }, void 0, false, {
                        fileName: "[project]/components/OperationsWorkspace.tsx",
                        lineNumber: 870,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setMonth(new Date(year, index + 1, 1)),
                        children: "›"
                    }, void 0, false, {
                        fileName: "[project]/components/OperationsWorkspace.tsx",
                        lineNumber: 876,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/OperationsWorkspace.tsx",
                lineNumber: 866,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "calendarGrid",
                children: [
                    [
                        "Mon",
                        "Tue",
                        "Wed",
                        "Thu",
                        "Fri",
                        "Sat",
                        "Sun"
                    ].map((d)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                            children: d
                        }, d, false, {
                            fileName: "[project]/components/OperationsWorkspace.tsx",
                            lineNumber: 882,
                            columnNumber: 11
                        }, this)),
                    days.map((day, i)=>{
                        const key = day ? `${year}-${String(index + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}` : "";
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: !day ? "muted" : "",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: day
                                }, void 0, false, {
                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                    lineNumber: 890,
                                    columnNumber: 15
                                }, this),
                                events.filter((e)=>e.start_date === key).map((e)=>edit ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>edit({
                                                ...e
                                            }),
                                        children: [
                                            e.start_time?.slice(0, 5),
                                            " ",
                                            e.client_name || e.title
                                        ]
                                    }, e.id, true, {
                                        fileName: "[project]/components/OperationsWorkspace.tsx",
                                        lineNumber: 895,
                                        columnNumber: 21
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                        className: "calendarReadOnlyEvent",
                                        children: [
                                            e.start_time?.slice(0, 5),
                                            " ",
                                            e.client_name || e.title
                                        ]
                                    }, e.id, true, {
                                        fileName: "[project]/components/OperationsWorkspace.tsx",
                                        lineNumber: 899,
                                        columnNumber: 21
                                    }, this))
                            ]
                        }, i, true, {
                            fileName: "[project]/components/OperationsWorkspace.tsx",
                            lineNumber: 889,
                            columnNumber: 13
                        }, this);
                    })
                ]
            }, void 0, true, {
                fileName: "[project]/components/OperationsWorkspace.tsx",
                lineNumber: 880,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/OperationsWorkspace.tsx",
        lineNumber: 865,
        columnNumber: 5
    }, this);
}
_c3 = Calendar;
function CrewTable({ rows, edit, remove }) {
    // Older imports could create an identical photographer twice.  Keep the
    // earliest record visible while the backend migration removes those legacy
    // copies.  Mobile number is the stable identity when it is available.
    const visibleRows = Array.from(rows.reduce((unique, row)=>{
        const mobile = String(row.mobile || "").replace(/\D/g, "").slice(-10);
        const identity = mobile ? `mobile:${mobile}` : `record:${String(row.name || "").trim().toLocaleLowerCase()}|${String(row.living_in || "").trim().toLocaleLowerCase()}|${String(row.work || "").trim().toLocaleLowerCase()}|${String(row.status || "").trim().toLocaleLowerCase()}`;
        const existing = unique.get(identity);
        if (!existing || Number(row.id) < Number(existing.id)) unique.set(identity, row);
        return unique;
    }, new Map()).values());
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "panel photographerTablePanel",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "table photographerTableWrap",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        children: "Name"
                                    }, void 0, false, {
                                        fileName: "[project]/components/OperationsWorkspace.tsx",
                                        lineNumber: 942,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        children: "Mobile"
                                    }, void 0, false, {
                                        fileName: "[project]/components/OperationsWorkspace.tsx",
                                        lineNumber: 943,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        children: "Based In"
                                    }, void 0, false, {
                                        fileName: "[project]/components/OperationsWorkspace.tsx",
                                        lineNumber: 944,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        children: "Work"
                                    }, void 0, false, {
                                        fileName: "[project]/components/OperationsWorkspace.tsx",
                                        lineNumber: 945,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        children: "Status"
                                    }, void 0, false, {
                                        fileName: "[project]/components/OperationsWorkspace.tsx",
                                        lineNumber: 946,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        children: "Actions"
                                    }, void 0, false, {
                                        fileName: "[project]/components/OperationsWorkspace.tsx",
                                        lineNumber: 947,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/OperationsWorkspace.tsx",
                                lineNumber: 941,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/OperationsWorkspace.tsx",
                            lineNumber: 940,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                            children: visibleRows.map((row)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                children: row.name
                                            }, void 0, false, {
                                                fileName: "[project]/components/OperationsWorkspace.tsx",
                                                lineNumber: 954,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/OperationsWorkspace.tsx",
                                            lineNumber: 953,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            children: row.mobile || "—"
                                        }, void 0, false, {
                                            fileName: "[project]/components/OperationsWorkspace.tsx",
                                            lineNumber: 956,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            children: row.living_in || "—"
                                        }, void 0, false, {
                                            fileName: "[project]/components/OperationsWorkspace.tsx",
                                            lineNumber: 957,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            children: row.work || "—"
                                        }, void 0, false, {
                                            fileName: "[project]/components/OperationsWorkspace.tsx",
                                            lineNumber: 958,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `statusPill status-${String(row.status || "").toLowerCase().replaceAll(" ", "-")}`,
                                                children: row.status
                                            }, void 0, false, {
                                                fileName: "[project]/components/OperationsWorkspace.tsx",
                                                lineNumber: 960,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/OperationsWorkspace.tsx",
                                            lineNumber: 959,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "rowActions",
                                                children: [
                                                    edit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: "editAction",
                                                        title: "Edit photographer",
                                                        "aria-label": "Edit photographer",
                                                        onClick: ()=>edit({
                                                                ...row
                                                            }),
                                                        children: "✎"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/OperationsWorkspace.tsx",
                                                        lineNumber: 965,
                                                        columnNumber: 23
                                                    }, this),
                                                    remove && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: "deleteAction",
                                                        title: "Delete photographer",
                                                        "aria-label": "Delete photographer",
                                                        onClick: ()=>remove(row.id),
                                                        children: "×"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/OperationsWorkspace.tsx",
                                                        lineNumber: 975,
                                                        columnNumber: 23
                                                    }, this),
                                                    !edit && !remove && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                        children: "View only"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/OperationsWorkspace.tsx",
                                                        lineNumber: 984,
                                                        columnNumber: 42
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/OperationsWorkspace.tsx",
                                                lineNumber: 963,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/OperationsWorkspace.tsx",
                                            lineNumber: 962,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, row.id, true, {
                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                    lineNumber: 952,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/OperationsWorkspace.tsx",
                            lineNumber: 950,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/OperationsWorkspace.tsx",
                    lineNumber: 939,
                    columnNumber: 9
                }, this),
                !visibleRows.length && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "empty",
                    children: "No photographers yet."
                }, void 0, false, {
                    fileName: "[project]/components/OperationsWorkspace.tsx",
                    lineNumber: 991,
                    columnNumber: 33
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/OperationsWorkspace.tsx",
            lineNumber: 938,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/OperationsWorkspace.tsx",
        lineNumber: 937,
        columnNumber: 5
    }, this);
}
_c4 = CrewTable;
function LegacyEventModal({ draft, close, save, error }) {
    const fields = [
        [
            "client_name",
            "Client Name"
        ],
        [
            "handled_by",
            "Handled By"
        ],
        [
            "couple_name",
            "Couple Name"
        ],
        [
            "contact_no",
            "Contact No"
        ],
        [
            "title",
            "Event Title"
        ],
        [
            "event_type",
            "Event Type"
        ],
        [
            "start_date",
            "Event Date",
            "date"
        ],
        [
            "start_time",
            "Start Time",
            "time"
        ],
        [
            "end_time",
            "End Time",
            "time"
        ],
        [
            "city",
            "City"
        ],
        [
            "photo",
            "Photo"
        ],
        [
            "video",
            "Video"
        ],
        [
            "candid",
            "Candid"
        ],
        [
            "cinematic",
            "Cinematic"
        ],
        [
            "drone",
            "Drone"
        ],
        [
            "assistant",
            "Assistant"
        ],
        [
            "bts",
            "BTS"
        ]
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "modalBackdrop",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
            className: "modalCard operationModal",
            onSubmit: save,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "modalHeader",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                    children: "OPERATIONS · UPCOMING EVENTS"
                                }, void 0, false, {
                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                    lineNumber: 1022,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    children: draft.id ? "Update Event" : "Add Event"
                                }, void 0, false, {
                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                    lineNumber: 1023,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "Client, event, and photographer assignment details."
                                }, void 0, false, {
                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                    lineNumber: 1024,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/OperationsWorkspace.tsx",
                            lineNumber: 1021,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: close,
                            children: "×"
                        }, void 0, false, {
                            fileName: "[project]/components/OperationsWorkspace.tsx",
                            lineNumber: 1026,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/OperationsWorkspace.tsx",
                    lineNumber: 1020,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "leadFormGrid",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            children: [
                                "Date Status",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    name: "date_status",
                                    defaultValue: draft.date_status || "Confirmed",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            children: "Confirmed"
                                        }, void 0, false, {
                                            fileName: "[project]/components/OperationsWorkspace.tsx",
                                            lineNumber: 1037,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            children: "TBD Month"
                                        }, void 0, false, {
                                            fileName: "[project]/components/OperationsWorkspace.tsx",
                                            lineNumber: 1038,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                    lineNumber: 1033,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/OperationsWorkspace.tsx",
                            lineNumber: 1031,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            children: [
                                "TBD Month",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    name: "tbd_month",
                                    type: "month",
                                    defaultValue: draft.tbd_month || ""
                                }, void 0, false, {
                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                    lineNumber: 1043,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/OperationsWorkspace.tsx",
                            lineNumber: 1041,
                            columnNumber: 11
                        }, this),
                        fields.map(([name, label, type])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                children: [
                                    label,
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        name: name,
                                        type: type || "text",
                                        required: [
                                            "client_name",
                                            "title",
                                            "event_type"
                                        ].includes(name),
                                        defaultValue: (draft[name] || "").toString().slice(0, type === "time" ? 5 : undefined)
                                    }, void 0, false, {
                                        fileName: "[project]/components/OperationsWorkspace.tsx",
                                        lineNumber: 1052,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, name, true, {
                                fileName: "[project]/components/OperationsWorkspace.tsx",
                                lineNumber: 1050,
                                columnNumber: 13
                            }, this)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            children: [
                                "Status",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    name: "status",
                                    defaultValue: draft.status || "Scheduled",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            children: "Scheduled"
                                        }, void 0, false, {
                                            fileName: "[project]/components/OperationsWorkspace.tsx",
                                            lineNumber: 1065,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            children: "Confirmed"
                                        }, void 0, false, {
                                            fileName: "[project]/components/OperationsWorkspace.tsx",
                                            lineNumber: 1066,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            children: "In Progress"
                                        }, void 0, false, {
                                            fileName: "[project]/components/OperationsWorkspace.tsx",
                                            lineNumber: 1067,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            children: "Completed"
                                        }, void 0, false, {
                                            fileName: "[project]/components/OperationsWorkspace.tsx",
                                            lineNumber: 1068,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            children: "Cancelled"
                                        }, void 0, false, {
                                            fileName: "[project]/components/OperationsWorkspace.tsx",
                                            lineNumber: 1069,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                    lineNumber: 1064,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/OperationsWorkspace.tsx",
                            lineNumber: 1062,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "wide",
                            children: [
                                "Notes",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                    name: "notes",
                                    defaultValue: draft.notes || ""
                                }, void 0, false, {
                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                    lineNumber: 1074,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/OperationsWorkspace.tsx",
                            lineNumber: 1072,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/OperationsWorkspace.tsx",
                    lineNumber: 1030,
                    columnNumber: 9
                }, this),
                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "formError",
                    children: error
                }, void 0, false, {
                    fileName: "[project]/components/OperationsWorkspace.tsx",
                    lineNumber: 1077,
                    columnNumber: 19
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "modalFooter",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: close,
                            children: "Cancel"
                        }, void 0, false, {
                            fileName: "[project]/components/OperationsWorkspace.tsx",
                            lineNumber: 1079,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "primary",
                            children: "Save Event"
                        }, void 0, false, {
                            fileName: "[project]/components/OperationsWorkspace.tsx",
                            lineNumber: 1082,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/OperationsWorkspace.tsx",
                    lineNumber: 1078,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/OperationsWorkspace.tsx",
            lineNumber: 1019,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/OperationsWorkspace.tsx",
        lineNumber: 1018,
        columnNumber: 5
    }, this);
}
_c5 = LegacyEventModal;
function EventModal({ draft, photographers, close, save, error }) {
    _s1();
    const [dateStatus, setDateStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(draft.date_status || "Confirmed");
    const crewFields = [
        [
            "photo",
            "Photo"
        ],
        [
            "video",
            "Video"
        ],
        [
            "candid",
            "Candid"
        ],
        [
            "cinematic",
            "Cinematic"
        ],
        [
            "drone",
            "Drone"
        ],
        [
            "bts",
            "BTS"
        ],
        [
            "assistant",
            "Assistant"
        ]
    ];
    const crewOptions = [
        {
            value: "NA",
            label: "NA — Not Applicable"
        },
        {
            value: "X",
            label: "X — One person needs assignment"
        },
        {
            value: "XX",
            label: "XX — Two people need assignment"
        },
        ...photographers.map((person)=>({
                value: person.mobile ? `${person.name} · ${person.mobile}` : person.name,
                label: person.mobile ? `${person.name} · ${person.mobile}` : person.name
            }))
    ];
    const [crewSelections, setCrewSelections] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "EventModal.useState": ()=>Object.fromEntries(crewFields.map({
                "EventModal.useState": ([name])=>{
                    const existing = String(draft[name] || "").split(/\s*;\s*/).map({
                        "EventModal.useState.existing": (value)=>value.trim()
                    }["EventModal.useState.existing"]).filter(Boolean);
                    return [
                        name,
                        existing.length ? existing : [
                            ""
                        ]
                    ];
                }
            }["EventModal.useState"]))
    }["EventModal.useState"]);
    const updateCrewSelection = (field, index, value)=>setCrewSelections((current)=>({
                ...current,
                [field]: current[field].map((item, itemIndex)=>itemIndex === index ? value : item)
            }));
    const addCrewSelection = (field)=>setCrewSelections((current)=>({
                ...current,
                [field]: [
                    ...current[field],
                    ""
                ]
            }));
    const removeCrewSelection = (field, index)=>setCrewSelections((current)=>{
            const remaining = current[field].filter((_, itemIndex)=>itemIndex !== index);
            return {
                ...current,
                [field]: remaining.length ? remaining : [
                    ""
                ]
            };
        });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "modalBackdrop",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
            className: "modalCard operationModal eventEditorModal",
            onSubmit: save,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "modalHeader",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                    children: "OPERATIONS · UPCOMING EVENTS"
                                }, void 0, false, {
                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                    lineNumber: 1147,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    children: draft.id ? "Update Event" : "Add Event"
                                }, void 0, false, {
                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                    lineNumber: 1148,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "Complete the client, event, and photographer assignment details."
                                }, void 0, false, {
                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                    lineNumber: 1149,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/OperationsWorkspace.tsx",
                            lineNumber: 1146,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: close,
                            children: "×"
                        }, void 0, false, {
                            fileName: "[project]/components/OperationsWorkspace.tsx",
                            lineNumber: 1153,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/OperationsWorkspace.tsx",
                    lineNumber: 1145,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "operationForm",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            className: "operationFormSection",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "operationSectionTitle",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "PART 1"
                                        }, void 0, false, {
                                            fileName: "[project]/components/OperationsWorkspace.tsx",
                                            lineNumber: 1160,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                            children: "Client & Event Information"
                                        }, void 0, false, {
                                            fileName: "[project]/components/OperationsWorkspace.tsx",
                                            lineNumber: 1161,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                    lineNumber: 1159,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "operationFieldGrid",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            children: [
                                                "Date Status",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    name: "date_status",
                                                    value: dateStatus,
                                                    onChange: (e)=>setDateStatus(e.target.value),
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            children: "Confirmed"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/OperationsWorkspace.tsx",
                                                            lineNumber: 1171,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            children: "TBD Month"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/OperationsWorkspace.tsx",
                                                            lineNumber: 1172,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                                    lineNumber: 1166,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/OperationsWorkspace.tsx",
                                            lineNumber: 1164,
                                            columnNumber: 15
                                        }, this),
                                        dateStatus === "Confirmed" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            children: [
                                                "Event Date",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    name: "start_date",
                                                    type: "date",
                                                    required: true,
                                                    defaultValue: draft.start_date || ""
                                                }, void 0, false, {
                                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                                    lineNumber: 1178,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/OperationsWorkspace.tsx",
                                            lineNumber: 1176,
                                            columnNumber: 17
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            children: [
                                                "Event Date (Month & Year)",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    name: "tbd_month",
                                                    type: "month",
                                                    required: true,
                                                    defaultValue: draft.tbd_month || ""
                                                }, void 0, false, {
                                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                                    lineNumber: 1188,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/OperationsWorkspace.tsx",
                                            lineNumber: 1186,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            children: [
                                                "Client Name",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    name: "client_name",
                                                    required: true,
                                                    defaultValue: draft.client_name || ""
                                                }, void 0, false, {
                                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                                    lineNumber: 1198,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/OperationsWorkspace.tsx",
                                            lineNumber: 1196,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            children: [
                                                "Handled By",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    name: "handled_by",
                                                    required: true,
                                                    defaultValue: draft.handled_by || ""
                                                }, void 0, false, {
                                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                                    lineNumber: 1206,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/OperationsWorkspace.tsx",
                                            lineNumber: 1204,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            children: [
                                                "Couple Name",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    name: "couple_name",
                                                    required: true,
                                                    defaultValue: draft.couple_name || ""
                                                }, void 0, false, {
                                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                                    lineNumber: 1214,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/OperationsWorkspace.tsx",
                                            lineNumber: 1212,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            children: [
                                                "Contact No.",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    name: "contact_no",
                                                    type: "tel",
                                                    required: true,
                                                    defaultValue: draft.contact_no || ""
                                                }, void 0, false, {
                                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                                    lineNumber: 1222,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/OperationsWorkspace.tsx",
                                            lineNumber: 1220,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            children: [
                                                "Event",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    name: "event_type",
                                                    required: true,
                                                    defaultValue: draft.event_type || ""
                                                }, void 0, false, {
                                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                                    lineNumber: 1231,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/OperationsWorkspace.tsx",
                                            lineNumber: 1229,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            children: [
                                                "Status",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    name: "status",
                                                    defaultValue: draft.status || "Scheduled",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            children: "Scheduled"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/OperationsWorkspace.tsx",
                                                            lineNumber: 1243,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            children: "Confirmed"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/OperationsWorkspace.tsx",
                                                            lineNumber: 1244,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            children: "In Progress"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/OperationsWorkspace.tsx",
                                                            lineNumber: 1245,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            children: "Completed"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/OperationsWorkspace.tsx",
                                                            lineNumber: 1246,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            children: "Cancelled"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/OperationsWorkspace.tsx",
                                                            lineNumber: 1247,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                                    lineNumber: 1239,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/OperationsWorkspace.tsx",
                                            lineNumber: 1237,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                    lineNumber: 1163,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/OperationsWorkspace.tsx",
                            lineNumber: 1158,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            className: "operationFormSection",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "operationSectionTitle",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "PART 2"
                                        }, void 0, false, {
                                            fileName: "[project]/components/OperationsWorkspace.tsx",
                                            lineNumber: 1254,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                            children: "Photographer Assignment"
                                        }, void 0, false, {
                                            fileName: "[project]/components/OperationsWorkspace.tsx",
                                            lineNumber: 1255,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                    lineNumber: 1253,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "operationFieldGrid assignmentGrid",
                                    children: [
                                        crewFields.map(([name, label])=>{
                                            const selected = crewSelections[name] || [
                                                ""
                                            ];
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "crewMultiField",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                        children: label
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/OperationsWorkspace.tsx",
                                                        lineNumber: 1262,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "hidden",
                                                        name: name,
                                                        value: selected.filter(Boolean).join("; ")
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/OperationsWorkspace.tsx",
                                                        lineNumber: 1263,
                                                        columnNumber: 21
                                                    }, this),
                                                    selected.map((value, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "crewSelectionRow",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                    "aria-label": `${label} assignment ${index + 1}`,
                                                                    value: value,
                                                                    onChange: (event)=>updateCrewSelection(name, index, event.target.value),
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: "",
                                                                            children: "Select assignment"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/OperationsWorkspace.tsx",
                                                                            lineNumber: 1280,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        crewOptions.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                value: option.value,
                                                                                disabled: option.value !== value && selected.includes(option.value),
                                                                                children: option.label
                                                                            }, option.value, false, {
                                                                                fileName: "[project]/components/OperationsWorkspace.tsx",
                                                                                lineNumber: 1282,
                                                                                columnNumber: 29
                                                                            }, this))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                                                    lineNumber: 1273,
                                                                    columnNumber: 25
                                                                }, this),
                                                                selected.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    className: "removeCrewSelection",
                                                                    title: `Remove ${label} assignment`,
                                                                    "aria-label": `Remove ${label} assignment ${index + 1}`,
                                                                    onClick: ()=>removeCrewSelection(name, index),
                                                                    children: "×"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                                                    lineNumber: 1295,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, `${name}-${index}`, true, {
                                                            fileName: "[project]/components/OperationsWorkspace.tsx",
                                                            lineNumber: 1269,
                                                            columnNumber: 23
                                                        }, this)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        className: "addCrewSelection",
                                                        onClick: ()=>addCrewSelection(name),
                                                        children: "＋ Add Photographer"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/OperationsWorkspace.tsx",
                                                        lineNumber: 1307,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, name, true, {
                                                fileName: "[project]/components/OperationsWorkspace.tsx",
                                                lineNumber: 1261,
                                                columnNumber: 19
                                            }, this);
                                        }),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            children: [
                                                "Time",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    name: "start_time",
                                                    type: "time",
                                                    defaultValue: (draft.start_time || "").slice(0, 5)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                                    lineNumber: 1319,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/OperationsWorkspace.tsx",
                                            lineNumber: 1317,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            children: [
                                                "Venue",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    name: "city",
                                                    defaultValue: draft.city || ""
                                                }, void 0, false, {
                                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                                    lineNumber: 1327,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/OperationsWorkspace.tsx",
                                            lineNumber: 1325,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "wide",
                                            children: [
                                                "Notes",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                    name: "notes",
                                                    rows: 3,
                                                    defaultValue: draft.notes || ""
                                                }, void 0, false, {
                                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                                    lineNumber: 1331,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/OperationsWorkspace.tsx",
                                            lineNumber: 1329,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                    lineNumber: 1257,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/OperationsWorkspace.tsx",
                            lineNumber: 1252,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/OperationsWorkspace.tsx",
                    lineNumber: 1157,
                    columnNumber: 9
                }, this),
                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "formError",
                    children: error
                }, void 0, false, {
                    fileName: "[project]/components/OperationsWorkspace.tsx",
                    lineNumber: 1340,
                    columnNumber: 19
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "modalFooter",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: close,
                            children: "Cancel"
                        }, void 0, false, {
                            fileName: "[project]/components/OperationsWorkspace.tsx",
                            lineNumber: 1342,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "primary",
                            children: draft.id ? "Save Changes" : "Add Event"
                        }, void 0, false, {
                            fileName: "[project]/components/OperationsWorkspace.tsx",
                            lineNumber: 1345,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/OperationsWorkspace.tsx",
                    lineNumber: 1341,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/OperationsWorkspace.tsx",
            lineNumber: 1144,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/OperationsWorkspace.tsx",
        lineNumber: 1143,
        columnNumber: 5
    }, this);
}
_s1(EventModal, "ThhRy/DUVgz8Hdo2VKTrdjqDlak=");
_c6 = EventModal;
function EventMessageModal({ event, close }) {
    _s2();
    const [copied, setCopied] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const message = eventMessage(event);
    const copyMessage = async ()=>{
        try {
            await navigator.clipboard.writeText(message);
        } catch  {
            const textArea = document.getElementById("event-message-text");
            textArea?.select();
            document.execCommand("copy");
        }
        setCopied(true);
        window.setTimeout(()=>setCopied(false), 2000);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "modalBackdrop",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            className: "eventMessageModal",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "modalHeader",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                    children: "EVENT MESSAGE"
                                }, void 0, false, {
                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                    lineNumber: 1381,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    children: "Copy WhatsApp Message"
                                }, void 0, false, {
                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                    lineNumber: 1382,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "Review the generated message, copy it, and paste it into WhatsApp when ready."
                                }, void 0, false, {
                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                    lineNumber: 1383,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/OperationsWorkspace.tsx",
                            lineNumber: 1380,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: close,
                            "aria-label": "Close",
                            children: "×"
                        }, void 0, false, {
                            fileName: "[project]/components/OperationsWorkspace.tsx",
                            lineNumber: 1388,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/OperationsWorkspace.tsx",
                    lineNumber: 1379,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "eventMessageBody",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                        id: "event-message-text",
                        readOnly: true,
                        value: message
                    }, void 0, false, {
                        fileName: "[project]/components/OperationsWorkspace.tsx",
                        lineNumber: 1393,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/OperationsWorkspace.tsx",
                    lineNumber: 1392,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "modalFooter",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: close,
                            children: "Close"
                        }, void 0, false, {
                            fileName: "[project]/components/OperationsWorkspace.tsx",
                            lineNumber: 1396,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            className: "primary",
                            onClick: copyMessage,
                            children: copied ? "Copied ✓" : "Copy Message"
                        }, void 0, false, {
                            fileName: "[project]/components/OperationsWorkspace.tsx",
                            lineNumber: 1399,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/OperationsWorkspace.tsx",
                    lineNumber: 1395,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/OperationsWorkspace.tsx",
            lineNumber: 1378,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/OperationsWorkspace.tsx",
        lineNumber: 1377,
        columnNumber: 5
    }, this);
}
_s2(EventMessageModal, "NE86rL3vg4NVcTTWDavsT0hUBJs=");
_c7 = EventMessageModal;
function CrewModal({ draft, close, save, error }) {
    _s3();
    const workTypes = [
        "Traditional Photo",
        "Traditional Video",
        "Candid",
        "Cinematic",
        "Drone"
    ];
    const [selectedWork, setSelectedWork] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(String(draft.work || "").split("; ").filter(Boolean));
    const toggleWork = (work)=>setSelectedWork((current)=>current.includes(work) ? current.filter((item)=>item !== work) : [
                ...current,
                work
            ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "modalBackdrop",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
            className: "modalCard crewModal",
            onSubmit: save,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "modalHeader",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                    children: draft.id ? "UPDATE CREW PROFILE" : "NEW CREW PROFILE"
                                }, void 0, false, {
                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                    lineNumber: 1432,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    children: draft.id ? "Edit Photographer" : "Add Photographer"
                                }, void 0, false, {
                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                    lineNumber: 1435,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "Add contact and work details to your operations directory."
                                }, void 0, false, {
                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                    lineNumber: 1436,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/OperationsWorkspace.tsx",
                            lineNumber: 1431,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: close,
                            children: "×"
                        }, void 0, false, {
                            fileName: "[project]/components/OperationsWorkspace.tsx",
                            lineNumber: 1438,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/OperationsWorkspace.tsx",
                    lineNumber: 1430,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "crewFormGrid",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "wide",
                            children: [
                                "Photographer's Name",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    name: "name",
                                    required: true,
                                    defaultValue: draft.name || ""
                                }, void 0, false, {
                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                    lineNumber: 1445,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/OperationsWorkspace.tsx",
                            lineNumber: 1443,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            children: [
                                "Mobile",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    name: "mobile",
                                    type: "tel",
                                    required: true,
                                    defaultValue: draft.mobile || ""
                                }, void 0, false, {
                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                    lineNumber: 1449,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/OperationsWorkspace.tsx",
                            lineNumber: 1447,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            children: [
                                "Living In",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    name: "living_in",
                                    placeholder: "City / Area",
                                    defaultValue: draft.living_in || ""
                                }, void 0, false, {
                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                    lineNumber: 1458,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/OperationsWorkspace.tsx",
                            lineNumber: 1456,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("fieldset", {
                            className: "wide crewWorkPicker",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("legend", {
                                    children: "Work"
                                }, void 0, false, {
                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                    lineNumber: 1465,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "hidden",
                                    name: "work",
                                    value: selectedWork.join("; ")
                                }, void 0, false, {
                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                    lineNumber: 1466,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: workTypes.map((work)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "checkbox",
                                                    checked: selectedWork.includes(work),
                                                    onChange: ()=>toggleWork(work)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                                    lineNumber: 1470,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: work
                                                }, void 0, false, {
                                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                                    lineNumber: 1475,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, work, true, {
                                            fileName: "[project]/components/OperationsWorkspace.tsx",
                                            lineNumber: 1469,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                    lineNumber: 1467,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/OperationsWorkspace.tsx",
                            lineNumber: 1464,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            children: [
                                "Status",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    name: "status",
                                    required: true,
                                    defaultValue: draft.status || "",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "",
                                            children: "Select status"
                                        }, void 0, false, {
                                            fileName: "[project]/components/OperationsWorkspace.tsx",
                                            lineNumber: 1483,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            children: "In-House"
                                        }, void 0, false, {
                                            fileName: "[project]/components/OperationsWorkspace.tsx",
                                            lineNumber: 1484,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            children: "Outside"
                                        }, void 0, false, {
                                            fileName: "[project]/components/OperationsWorkspace.tsx",
                                            lineNumber: 1485,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/OperationsWorkspace.tsx",
                                    lineNumber: 1482,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/OperationsWorkspace.tsx",
                            lineNumber: 1480,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/OperationsWorkspace.tsx",
                    lineNumber: 1442,
                    columnNumber: 9
                }, this),
                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "formError",
                    children: error
                }, void 0, false, {
                    fileName: "[project]/components/OperationsWorkspace.tsx",
                    lineNumber: 1489,
                    columnNumber: 19
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "modalFooter",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: close,
                            children: "Cancel"
                        }, void 0, false, {
                            fileName: "[project]/components/OperationsWorkspace.tsx",
                            lineNumber: 1491,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "primary",
                            children: "Save Photographer"
                        }, void 0, false, {
                            fileName: "[project]/components/OperationsWorkspace.tsx",
                            lineNumber: 1494,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/OperationsWorkspace.tsx",
                    lineNumber: 1490,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/OperationsWorkspace.tsx",
            lineNumber: 1429,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/OperationsWorkspace.tsx",
        lineNumber: 1428,
        columnNumber: 5
    }, this);
}
_s3(CrewModal, "oFnJYMQHpdZOAaHkxExfdwI+9CQ=");
_c8 = CrewModal;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8;
__turbopack_context__.k.register(_c, "OperationsWorkspace");
__turbopack_context__.k.register(_c1, "Dashboard");
__turbopack_context__.k.register(_c2, "EventTable");
__turbopack_context__.k.register(_c3, "Calendar");
__turbopack_context__.k.register(_c4, "CrewTable");
__turbopack_context__.k.register(_c5, "LegacyEventModal");
__turbopack_context__.k.register(_c6, "EventModal");
__turbopack_context__.k.register(_c7, "EventMessageModal");
__turbopack_context__.k.register(_c8, "CrewModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=components_OperationsWorkspace_tsx_10mdl6i._.js.map