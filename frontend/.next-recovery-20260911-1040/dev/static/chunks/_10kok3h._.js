(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/GlobalErrorBoundary.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GlobalErrorBoundary",
    ()=>GlobalErrorBoundary
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
"use client";
;
;
class GlobalErrorBoundary extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Component"] {
    constructor(props){
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }
    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            error
        };
    }
    componentDidCatch(error, errorInfo) {
        this.setState({
            errorInfo
        });
        console.error("Global Error Boundary caught an error:", error, errorInfo);
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }
    handleRetry = ()=>{
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
    };
    handleReload = ()=>{
        window.location.reload();
    };
    handleGoHome = ()=>{
        window.location.href = "/";
    };
    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: styles.container,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: styles.content,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: styles.icon,
                            children: "⚠️"
                        }, void 0, false, {
                            fileName: "[project]/components/GlobalErrorBoundary.tsx",
                            lineNumber: 60,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            style: styles.title,
                            children: "Something went wrong"
                        }, void 0, false, {
                            fileName: "[project]/components/GlobalErrorBoundary.tsx",
                            lineNumber: 61,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: styles.message,
                            children: "An unexpected error occurred. The error has been reported to our team."
                        }, void 0, false, {
                            fileName: "[project]/components/GlobalErrorBoundary.tsx",
                            lineNumber: 62,
                            columnNumber: 13
                        }, this),
                        ("TURBOPACK compile-time value", "development") === "development" && this.state.error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                            style: styles.details,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                                    style: styles.summary,
                                    children: "Error Details (Development Only)"
                                }, void 0, false, {
                                    fileName: "[project]/components/GlobalErrorBoundary.tsx",
                                    lineNumber: 67,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                    style: styles.errorText,
                                    children: this.state.error.toString()
                                }, void 0, false, {
                                    fileName: "[project]/components/GlobalErrorBoundary.tsx",
                                    lineNumber: 68,
                                    columnNumber: 17
                                }, this),
                                this.state.errorInfo?.componentStack && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                    style: styles.stackText,
                                    children: this.state.errorInfo.componentStack
                                }, void 0, false, {
                                    fileName: "[project]/components/GlobalErrorBoundary.tsx",
                                    lineNumber: 70,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/GlobalErrorBoundary.tsx",
                            lineNumber: 66,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: styles.actions,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: this.handleRetry,
                                    style: styles.primaryButton,
                                    children: "Try Again"
                                }, void 0, false, {
                                    fileName: "[project]/components/GlobalErrorBoundary.tsx",
                                    lineNumber: 75,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: this.handleGoHome,
                                    style: styles.secondaryButton,
                                    children: "Go to Dashboard"
                                }, void 0, false, {
                                    fileName: "[project]/components/GlobalErrorBoundary.tsx",
                                    lineNumber: 78,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: this.handleReload,
                                    style: styles.tertiaryButton,
                                    children: "Reload Page"
                                }, void 0, false, {
                                    fileName: "[project]/components/GlobalErrorBoundary.tsx",
                                    lineNumber: 81,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/GlobalErrorBoundary.tsx",
                            lineNumber: 74,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/GlobalErrorBoundary.tsx",
                    lineNumber: 59,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/GlobalErrorBoundary.tsx",
                lineNumber: 58,
                columnNumber: 9
            }, this);
        }
        return this.props.children;
    }
}
const styles = {
    container: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "2rem",
        backgroundColor: "var(--color-bg, #080d15)",
        color: "var(--color-text, #e6e6e6)"
    },
    content: {
        textAlign: "center",
        maxWidth: "600px",
        width: "100%"
    },
    icon: {
        fontSize: "4rem",
        marginBottom: "1.5rem"
    },
    title: {
        fontSize: "2rem",
        fontWeight: 600,
        marginBottom: "1rem",
        color: "var(--color-text, #e6e6e6)"
    },
    message: {
        fontSize: "1.125rem",
        color: "var(--color-text-secondary, #a0a0a0)",
        marginBottom: "2rem",
        lineHeight: 1.6
    },
    details: {
        marginBottom: "2rem",
        textAlign: "left",
        backgroundColor: "var(--color-surface, #0b1220)",
        padding: "1rem",
        borderRadius: "8px",
        border: "1px solid var(--color-border, #1e2d3d)"
    },
    summary: {
        cursor: "pointer",
        fontWeight: 600,
        marginBottom: "0.5rem",
        color: "var(--color-text, #e6e6e6)"
    },
    errorText: {
        fontSize: "0.875rem",
        color: "#ff6b6b",
        backgroundColor: "rgba(255, 107, 107, 0.1)",
        padding: "1rem",
        borderRadius: "4px",
        overflow: "auto",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        marginBottom: "0.5rem"
    },
    stackText: {
        fontSize: "0.75rem",
        color: "var(--color-text-secondary, #a0a0a0)",
        overflow: "auto",
        maxHeight: "200px",
        backgroundColor: "var(--color-bg-secondary, #0d1420)",
        padding: "0.75rem",
        borderRadius: "4px"
    },
    actions: {
        display: "flex",
        gap: "1rem",
        justifyContent: "center",
        flexWrap: "wrap"
    },
    primaryButton: {
        padding: "0.75rem 1.5rem",
        fontSize: "1rem",
        fontWeight: 600,
        color: "#fff",
        backgroundColor: "var(--color-primary, #7367f0)",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        transition: "background-color 0.2s"
    },
    secondaryButton: {
        padding: "0.75rem 1.5rem",
        fontSize: "1rem",
        fontWeight: 600,
        color: "var(--color-text, #e6e6e6)",
        backgroundColor: "transparent",
        border: "1px solid var(--color-border, #1e2d3d)",
        borderRadius: "6px",
        cursor: "pointer",
        transition: "background-color 0.2s"
    },
    tertiaryButton: {
        padding: "0.75rem 1.5rem",
        fontSize: "1rem",
        fontWeight: 500,
        color: "var(--color-text-secondary, #a0a0a0)",
        backgroundColor: "transparent",
        border: "none",
        cursor: "pointer",
        textDecoration: "underline"
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/QueryProvider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "QueryProvider",
    ()=>QueryProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$query$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/query.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function QueryProvider({ children }) {
    _s();
    const [client] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "QueryProvider.useState": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$query$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["queryClient"]
    }["QueryProvider.useState"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClientProvider"], {
        client: client,
        children: children
    }, void 0, false, {
        fileName: "[project]/components/QueryProvider.tsx",
        lineNumber: 8,
        columnNumber: 10
    }, this);
}
_s(QueryProvider, "T8oNMCeBhTqe5+Kp6FUHW+/Ft8U=");
_c = QueryProvider;
var _c;
__turbopack_context__.k.register(_c, "QueryProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ServiceWorkerRegister.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ServiceWorkerRegister",
    ()=>ServiceWorkerRegister
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
function ServiceWorkerRegister() {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ServiceWorkerRegister.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            if (!("serviceWorker" in navigator)) return;
            if (("TURBOPACK compile-time value", "development") !== "production" && !window.location.search.includes("sw=1")) {
                // A previous production session can leave a worker registered for the
                // localhost origin. Its cached Next.js route payloads do not survive
                // dev-server restarts and can incorrectly render the built-in 404 page.
                void navigator.serviceWorker.getRegistrations().then({
                    "ServiceWorkerRegister.useEffect": (registrations)=>Promise.all(registrations.map({
                            "ServiceWorkerRegister.useEffect": (registration)=>registration.unregister()
                        }["ServiceWorkerRegister.useEffect"]))
                }["ServiceWorkerRegister.useEffect"]);
                if ("caches" in window) {
                    void caches.keys().then({
                        "ServiceWorkerRegister.useEffect": (keys)=>Promise.all(keys.filter({
                                "ServiceWorkerRegister.useEffect": (key)=>key.startsWith("lenspirecrm-")
                            }["ServiceWorkerRegister.useEffect"]).map({
                                "ServiceWorkerRegister.useEffect": (key)=>caches.delete(key)
                            }["ServiceWorkerRegister.useEffect"]))
                    }["ServiceWorkerRegister.useEffect"]);
                }
                return;
            }
            const onLoad = {
                "ServiceWorkerRegister.useEffect.onLoad": ()=>{
                    navigator.serviceWorker.register("/sw.js", {
                        scope: "/"
                    }).catch({
                        "ServiceWorkerRegister.useEffect.onLoad": (error)=>console.warn("Service worker registration failed", error)
                    }["ServiceWorkerRegister.useEffect.onLoad"]);
                }
            }["ServiceWorkerRegister.useEffect.onLoad"];
            if (document.readyState === "complete") onLoad();
            else window.addEventListener("load", onLoad, {
                once: true
            });
            return ({
                "ServiceWorkerRegister.useEffect": ()=>window.removeEventListener("load", onLoad)
            })["ServiceWorkerRegister.useEffect"];
        }
    }["ServiceWorkerRegister.useEffect"], []);
    return null;
}
_s(ServiceWorkerRegister, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = ServiceWorkerRegister;
var _c;
__turbopack_context__.k.register(_c, "ServiceWorkerRegister");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ThemeToggle.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeProvider",
    ()=>ThemeProvider,
    "ThemeToggle",
    ()=>ThemeToggle,
    "useTheme",
    ()=>useTheme
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
"use client";
;
const STORAGE_KEY = "lenspire-theme";
const THEME_EVENT = "lenspire-theme-change";
const readStored = ()=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
    return null;
};
const apply = (theme)=>{
    if (typeof document === "undefined") return;
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
};
function ThemeProvider({ children }) {
    _s();
    const [theme, setTheme] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("dark");
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ThemeProvider.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const stored = window.localStorage.getItem(STORAGE_KEY);
            const host = window.location.hostname;
            const initial = stored === "light" || stored === "dark" ? stored : host === "crm.lenspireai.com" ? "light" : "dark";
            setTheme(initial);
            apply(initial);
            setMounted(true);
        }
    }["ThemeProvider.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ThemeProvider.useEffect": ()=>{
            if (!mounted) return;
            window.localStorage.setItem(STORAGE_KEY, theme);
            apply(theme);
            window.dispatchEvent(new CustomEvent(THEME_EVENT, {
                detail: theme
            }));
        }
    }["ThemeProvider.useEffect"], [
        theme,
        mounted
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false, {
        fileName: "[project]/components/ThemeToggle.tsx",
        lineNumber: 42,
        columnNumber: 10
    }, this);
}
_s(ThemeProvider, "W9Oa8l1RdaCxvkbD9Do76XViR5w=");
_c = ThemeProvider;
function useTheme() {
    _s1();
    const [theme, setThemeState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("dark");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useTheme.useEffect": ()=>{
            if (("TURBOPACK compile-time value", "object") !== "undefined" && window.location.hostname === "crm.lenspireai.com") {
                setThemeState("light");
            }
            const sync = {
                "useTheme.useEffect.sync": (event)=>{
                    const next = event.detail;
                    if (next) setThemeState(next);
                }
            }["useTheme.useEffect.sync"];
            const onStorage = {
                "useTheme.useEffect.onStorage": (event)=>{
                    if (event.key === STORAGE_KEY && (event.newValue === "light" || event.newValue === "dark")) {
                        setThemeState(event.newValue);
                    }
                }
            }["useTheme.useEffect.onStorage"];
            const stored = readStored();
            if (stored) setThemeState(stored);
            window.addEventListener(THEME_EVENT, sync);
            window.addEventListener("storage", onStorage);
            return ({
                "useTheme.useEffect": ()=>{
                    window.removeEventListener(THEME_EVENT, sync);
                    window.removeEventListener("storage", onStorage);
                }
            })["useTheme.useEffect"];
        }
    }["useTheme.useEffect"], []);
    return {
        theme,
        setTheme: (next)=>{
            setThemeState(next);
            apply(next);
            window.localStorage.setItem(STORAGE_KEY, next);
            window.dispatchEvent(new CustomEvent(THEME_EVENT, {
                detail: next
            }));
        },
        toggle: ()=>{
            const next = (readStored() ?? theme) === "light" ? "dark" : "light";
            setThemeState(next);
            apply(next);
            window.localStorage.setItem(STORAGE_KEY, next);
            window.dispatchEvent(new CustomEvent(THEME_EVENT, {
                detail: next
            }));
        }
    };
}
_s1(useTheme, "34N+IZbCZqzAyh3iA+j4MKvppqc=");
function ThemeToggle({ className }) {
    _s2();
    const { theme, toggle } = useTheme();
    const isDark = theme !== "light";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        className: `themeToggle ${className ?? ""}`.trim(),
        onClick: toggle,
        "aria-label": isDark ? "Switch to light theme" : "Switch to dark theme",
        "aria-pressed": isDark ? "true" : "false",
        title: isDark ? "Switch to light theme" : "Switch to dark theme",
        "data-theme-state": isDark ? "dark" : "light",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "themeToggleIcon",
                "aria-hidden": "true",
                children: isDark ? "☀" : "☾"
            }, void 0, false, {
                fileName: "[project]/components/ThemeToggle.tsx",
                lineNumber: 100,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "themeToggleLabel",
                children: isDark ? "Light" : "Dark"
            }, void 0, false, {
                fileName: "[project]/components/ThemeToggle.tsx",
                lineNumber: 103,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ThemeToggle.tsx",
        lineNumber: 91,
        columnNumber: 5
    }, this);
}
_s2(ThemeToggle, "2j2rBShd4uds6rCl6Oqp0C5AWzE=", false, function() {
    return [
        useTheme
    ];
});
_c1 = ThemeToggle;
var _c, _c1;
__turbopack_context__.k.register(_c, "ThemeProvider");
__turbopack_context__.k.register(_c1, "ThemeToggle");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "api",
    ()=>api
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$stores$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/stores/auth.ts [app-client] (ecmascript)");
;
;
const api = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: ("TURBOPACK compile-time value", "http://127.0.0.1:8000/api") || "http://localhost:8000/api"
});
let refreshing = null;
// Rate limit retry state
const retryState = new WeakMap();
/**
 * Calculate exponential backoff delay for rate-limited requests
 * @param attempt Retry attempt number (0-indexed)
 * @returns Delay in milliseconds
 */ function getRetryDelay(attempt) {
    // Exponential backoff: 1s, 2s, 4s, 8s, 16s (max 5 attempts)
    const baseDelay = 1000;
    const maxDelay = 16000;
    const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
    // Add jitter to prevent thundering herd
    const jitter = Math.random() * 0.3 * delay;
    return delay + jitter;
}
/**
 * Extract Retry-After header value in milliseconds
 * @param retryAfter Header value (seconds or HTTP date)
 * @returns Delay in milliseconds, or null if invalid
 */ function parseRetryAfter(retryAfter) {
    if (!retryAfter) return null;
    // Try parsing as seconds
    const seconds = parseInt(retryAfter, 10);
    if (!isNaN(seconds)) return seconds * 1000;
    // Try parsing as HTTP date
    const date = new Date(retryAfter);
    if (!isNaN(date.getTime())) {
        const delay = date.getTime() - Date.now();
        return delay > 0 ? delay : null;
    }
    return null;
}
api.interceptors.request.use((config)=>{
    const token = __TURBOPACK__imported__module__$5b$project$5d2f$stores$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"].getState().access;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});
api.interceptors.response.use((response)=>response, async (error)=>{
    const original = error.config;
    if (!original) return Promise.reject(error);
    const auth = __TURBOPACK__imported__module__$5b$project$5d2f$stores$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"].getState();
    // Handle 401 Unauthorized - token refresh
    if (error.response?.status === 401 && auth.refresh && !original._retried) {
        original._retried = true;
        try {
            // A late 401 may belong to the old token, after another request refreshed it.
            if (auth.access && original.headers.Authorization !== `Bearer ${auth.access}`) {
                original.headers.Authorization = `Bearer ${auth.access}`;
                return api(original);
            }
            if (!refreshing) {
                const refreshToken = auth.refresh;
                refreshing = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`${api.defaults.baseURL}/auth/refresh/`, {
                    refresh: refreshToken
                }).then(({ data })=>{
                    if (__TURBOPACK__imported__module__$5b$project$5d2f$stores$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"].getState().refresh !== refreshToken) throw new Error("Session changed");
                    __TURBOPACK__imported__module__$5b$project$5d2f$stores$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"].getState().setTokens(data.access, data.refresh || refreshToken);
                    return data.access;
                }).finally(()=>{
                    refreshing = null;
                });
            }
            const access = await refreshing;
            original.headers.Authorization = `Bearer ${access}`;
            return api(original);
        } catch  {
            auth.logout();
            return Promise.reject(error);
        }
    }
    // Handle 429 Rate Limited - exponential backoff retry
    if (error.response?.status === 429) {
        const state = retryState.get(original) || {
            attempt: 0,
            lastRetryAt: 0
        };
        const maxAttempts = 5;
        if (state.attempt >= maxAttempts) {
            // Max retries exceeded - add user-friendly error
            const enhancedError = error;
            enhancedError.userMessage = "The server is experiencing high load. Please try again in a few minutes.";
            return Promise.reject(enhancedError);
        }
        // Get retry delay from server or use exponential backoff
        const retryAfterHeader = error.response.headers['retry-after'];
        const serverDelay = parseRetryAfter(retryAfterHeader);
        const backoffDelay = getRetryDelay(state.attempt);
        const delay = serverDelay || backoffDelay;
        // Prevent retry if server delay is unreasonably long (> 60s)
        if (delay > 60000) {
            const enhancedError = error;
            enhancedError.userMessage = "Rate limit exceeded. Please try again later.";
            return Promise.reject(enhancedError);
        }
        // Update retry state
        state.attempt++;
        state.lastRetryAt = Date.now();
        retryState.set(original, state);
        // Wait and retry
        await new Promise((resolve)=>setTimeout(resolve, delay));
        return api(original).catch((retryError)=>{
            // If retry also fails, clean up state
            retryState.delete(original);
            return Promise.reject(retryError);
        });
    }
    // Handle 503 Service Unavailable - limited retry
    if (error.response?.status === 503 && !original._serviceRetried) {
        original._serviceRetried = true;
        await new Promise((resolve)=>setTimeout(resolve, 2000));
        return api(original);
    }
    return Promise.reject(error);
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/pagination.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchAllPages",
    ()=>fetchAllPages,
    "fetchPage",
    ()=>fetchPage,
    "uniqById",
    ()=>uniqById
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-client] (ecmascript)");
;
const buildParams = (q)=>{
    const params = new URLSearchParams();
    if (q.search) params.set("search", q.search);
    if (q.ordering) params.set("ordering", q.ordering);
    if (q.page) params.set("page", String(q.page));
    if (q.pageSize) params.set("page_size", String(q.pageSize));
    if (q.filters) {
        for (const [key, value] of Object.entries(q.filters)){
            if (value === undefined || value === null || value === "") continue;
            params.set(key, String(value));
        }
    }
    return params;
};
async function fetchPage(path, query = {}) {
    const separator = path.includes("?") ? "&" : "?";
    const url = `${path}${separator}${buildParams(query).toString()}`;
    const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(url);
    if (Array.isArray(data)) {
        return {
            count: data.length,
            next: null,
            previous: null,
            results: data
        };
    }
    return {
        count: data?.count ?? data?.results?.length ?? 0,
        next: data?.next ?? null,
        previous: data?.previous ?? null,
        results: data?.results ?? []
    };
}
function uniqById(items) {
    const seen = new Set();
    const out = [];
    for (const item of items){
        if (seen.has(item.id)) continue;
        seen.add(item.id);
        out.push(item);
    }
    return out;
}
async function fetchAllPages(path, signal) {
    const results = [];
    // Request subsequent pages from the same API path, retaining all filters.
    // Do not send authentication to an absolute `next` URL from the response.
    for(let page = 1;; page += 1){
        const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(path, {
            params: {
                page,
                page_size: 500
            },
            signal
        });
        if (Array.isArray(data)) return {
            count: data.length,
            results: data,
            next: null,
            previous: null
        };
        results.push(...data.results ?? []);
        if (!data.next) return {
            count: results.length,
            results,
            next: null,
            previous: null
        };
        if (!data.results?.length) throw new Error("The API returned an empty page with more results pending.");
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/query.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "queryClient",
    ()=>queryClient,
    "queryKeys",
    ()=>queryKeys,
    "useApiCollectionQuery",
    ()=>useApiCollectionQuery,
    "useApiMutation",
    ()=>useApiMutation,
    "useApiQuery",
    ()=>useApiQuery
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/queryClient.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pagination$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/pagination.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
"use client";
;
;
;
const queryClient = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClient"]({
    defaultOptions: {
        queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
            retry: 1
        },
        mutations: {
            retry: 0
        }
    }
});
const queryKeys = {
    leads: (filters)=>[
            "leads",
            filters ?? {}
        ],
    lead: (id)=>[
            "leads",
            id
        ],
    events: (filters)=>[
            "events",
            filters ?? {}
        ],
    customers: (filters)=>[
            "customers",
            filters ?? {}
        ],
    bookings: (filters)=>[
            "bookings",
            filters ?? {}
        ],
    payments: (filters)=>[
            "payments",
            filters ?? {}
        ],
    paymentReminders: (filters)=>[
            "payment-reminders",
            filters ?? {}
        ],
    salesTargets: (filters)=>[
            "sales-targets",
            filters ?? {}
        ],
    production: (filters)=>[
            "production",
            filters ?? {}
        ],
    quotations: (filters)=>[
            "quotations",
            filters ?? {}
        ],
    contracts: (filters)=>[
            "contracts",
            filters ?? {}
        ],
    invoices: (filters)=>[
            "invoices",
            filters ?? {}
        ],
    dashboard: ()=>[
            "dashboard"
        ],
    reports: (key, filters)=>[
            "reports",
            key,
            filters ?? {}
        ],
    notifications: (filters)=>[
            "notifications",
            filters ?? {}
        ],
    notificationSummary: ()=>[
            "notifications",
            "summary"
        ],
    notificationPreferences: ()=>[
            "notification-preferences"
        ],
    auditOrganization: (filters)=>[
            "audit",
            "organization",
            filters ?? {}
        ],
    auditUser: (filters)=>[
            "audit",
            "user",
            filters ?? {}
        ],
    backups: ()=>[
            "backups"
        ],
    throttleMetrics: ()=>[
            "admin",
            "throttle-metrics"
        ]
};
function useApiQuery(key, path, options) {
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: key,
        queryFn: {
            "useApiQuery.useQuery": async ()=>(await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get(path)).data
        }["useApiQuery.useQuery"],
        ...options
    });
}
_s(useApiQuery, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useApiCollectionQuery(key, path) {
    _s1();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            ...key,
            "all-pages"
        ],
        queryFn: {
            "useApiCollectionQuery.useQuery": ({ signal })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pagination$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchAllPages"])(path, signal)
        }["useApiCollectionQuery.useQuery"]
    });
}
_s1(useApiCollectionQuery, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useApiMutation(options) {
    _s2();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const { onSuccess, ...rest } = options ?? {};
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        ...rest,
        onSuccess: {
            "useApiMutation.useMutation": (data, variables, onMutateResult)=>{
                const handler = onSuccess;
                handler?.(data, variables, onMutateResult);
                queryClient.invalidateQueries();
            }
        }["useApiMutation.useMutation"]
    });
}
_s2(useApiMutation, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/stores/auth.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAuthStore",
    ()=>useAuthStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
;
;
const useAuthStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set)=>({
        access: null,
        refresh: null,
        user: null,
        setSession: (access, refresh, user)=>set({
                access,
                refresh,
                user
            }),
        setTokens: (access, refresh)=>set({
                access,
                refresh
            }),
        logout: ()=>set({
                access: null,
                refresh: null,
                user: null
            })
    }), {
    name: "lenspire-auth"
}));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_10kok3h._.js.map