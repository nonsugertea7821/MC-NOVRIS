// #region response

export interface ChallengeResponse {
    nonce: string;
}

export interface LoginResponse {
    jwtToken: string;
    errorMessage: string;
}

export interface LogoutResponse {
    resultCode: number;
    message: string;
}

// #endregion
// #region request

export interface LoginRequest {
    password: string;
}

// #endregion