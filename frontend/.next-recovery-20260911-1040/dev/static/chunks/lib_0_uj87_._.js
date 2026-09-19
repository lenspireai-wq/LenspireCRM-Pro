(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/date-format.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatDate",
    ()=>formatDate,
    "formatDateTime",
    ()=>formatDateTime
]);
const DATE_OPTIONS = {
    day: "2-digit",
    month: "short",
    year: "numeric"
};
const validDate = (value)=>{
    if (!value) return null;
    const source = value instanceof Date ? value : new Date(`${String(value).slice(0, 10)}T00:00:00`);
    return Number.isNaN(source.getTime()) ? null : source;
};
const formatDate = (value, empty = "—")=>{
    const parsed = validDate(value);
    return parsed ? parsed.toLocaleDateString("en-GB", DATE_OPTIONS).replace(/ /g, "-") : empty;
};
const formatDateTime = (value, empty = "—")=>{
    if (!value) return empty;
    const parsed = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(parsed.getTime())) return empty;
    const date = parsed.toLocaleDateString("en-GB", DATE_OPTIONS).replace(/ /g, "-");
    const time = parsed.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });
    return `${date}, ${time}`;
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/permissions.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "accessLevel",
    ()=>accessLevel,
    "canAccess",
    ()=>canAccess,
    "canWrite",
    ()=>canWrite,
    "departments",
    ()=>departments,
    "isAdministrator",
    ()=>isAdministrator
]);
const departments = [
    "sales",
    "operations",
    "accounts",
    "production"
];
const isAdministrator = (user)=>Boolean(user && (user.is_superuser || user.is_staff || user.role?.trim().toLowerCase() === "administrator"));
const accessLevel = (user, department)=>{
    if (isAdministrator(user)) return "full";
    const value = user?.department_access?.[department];
    return value === "read" || value === "full" ? value : "none";
};
const canAccess = (user, department)=>accessLevel(user, department) !== "none";
const canWrite = (user, department)=>accessLevel(user, department) === "full";
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=lib_0_uj87_._.js.map