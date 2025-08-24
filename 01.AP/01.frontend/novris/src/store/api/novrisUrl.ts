/** 認証用URL */
export const NovrisAuthUrl = {
    NOVRIS_API_GET_AUTH_GET_CLIENT_ID: '/api/auth/get-clientId',
    NOVRIS_API_POST_AUTH_CHALLENGE: '/api/auth/challenge',
    NOVRIS_API_POST_AUTH_LOGIN_REQUEST: '/api/auth/login'
} as const;

/** 通常URL */
export const NovrisUrl = {
    ...NovrisAuthUrl,
    NOVRIS_API_POST_LOGOUT_REQUEST:'/api/logout'
} as const;