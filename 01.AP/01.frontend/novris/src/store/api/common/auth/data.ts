// #region response

/** チャレンジレスポンス */
export interface ChallengeResponse {
    /** 一時salt */
    nonce: string;
}

/** ログインレスポンス */
export interface LoginResponse {
    /** jwtトークン */
    jwtToken: string;
    /** エラーメッセージ */
    errorMessage: string;
}

/** ログアウトレスポンス */
export interface LogoutResponse {
    /** ログアクト結果 */
    resultCode: number;
    /** メッセージ */
    message: string;
}

// #endregion