export const NovrisAuthUrl = {
    NOVRIS_API_GET_AUTH_GET_CLIENT_ID: '/api/auth/get-clientId',
    NOVRIS_API_POST_AUTH_CHALLENGE: '/api/auth/challenge',
    NOVRIS_API_POST_AUTH_LOGIN_REQUEST: '/api/auth/login'
} as const;

export const NovrisUrl = {
    ...NovrisAuthUrl
} as const;