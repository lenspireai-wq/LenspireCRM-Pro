module.exports = [
"[project]/lib/permissions.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
];

//# sourceMappingURL=lib_permissions_ts_1b99u3d._.js.map