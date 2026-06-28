module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/app/api/search/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
// Mock database results - replace with actual DB query later
const MOCK_RESULTS = {
    "question": "Show me all p53 western blots in A549 cells treated with Nutlin",
    "generated_sql": "SELECT * FROM western_blot_records WHERE target ILIKE '%p53%' AND (sample ILIKE '%a549%' OR organism ILIKE '%a549%') AND (treatment_context ILIKE '%nutlin%' OR condition ILIKE '%nutlin%');",
    "count": 3,
    "results": [
        {
            "id": 10,
            "paper_id": "mmc2",
            "page": null,
            "western_blot_type": "phospho_signaling",
            "sample": "A549 cells",
            "organism": null,
            "treatment_context": null,
            "figure_label": null,
            "target": "p53",
            "condition": "Nutlin (µM) -",
            "band_detected": true,
            "confidence": null
        },
        {
            "id": 11,
            "paper_id": "mmc2",
            "page": null,
            "western_blot_type": "phospho_signaling",
            "sample": "A549 cells",
            "organism": null,
            "treatment_context": null,
            "figure_label": null,
            "target": "p53",
            "condition": "Nutlin (µM) 10 +",
            "band_detected": true,
            "confidence": null
        },
        {
            "id": 12,
            "paper_id": "mmc2",
            "page": null,
            "western_blot_type": "phospho_signaling",
            "sample": "A549 cells",
            "organism": null,
            "treatment_context": null,
            "figure_label": null,
            "target": "p53",
            "condition": "Nutlin (µM) 20 +",
            "band_detected": true,
            "confidence": null
        }
    ]
};
async function POST(request) {
    try {
        const { query } = await request.json();
        if (!query || query.trim() === '') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Query is required'
            }, {
                status: 400
            });
        }
        // TODO: Replace with actual database query
        // For now, return mock data
        // Later: call your SQL generation service and execute against actual DB
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(MOCK_RESULTS);
    } catch (error) {
        console.error('Search API error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to search'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0nds0ph._.js.map