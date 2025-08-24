/** NOVRISルート */
export const NovrisRoutes = {
    AP_MC_NOVRIS_HOME: { path: '/home' },
    AP_MC_SERVER_MANAGEMENT: { path: '/management', label: '管理AP' },
    AP_MC_SERVER_MONITORING: { path: '/monitoring', label: 'モニタリングAP' },
    AP_MC_SERVER_EXCEPTIONS_REPORT: { path: '/exceptions-report', label: 'レポートAP' }
} as const