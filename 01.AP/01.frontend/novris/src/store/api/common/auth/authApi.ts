import { axiosHelper } from "../../../axios/axiosHelper";
import { NovrisUrl } from "../../novrisUrl";
import { ChallengeResponse, LoginResponse, LogoutResponse } from "./data";

/**
 * クライアント識別子を取得する。
 * @returns クライアント識別子
 */
export async function getClientId(): Promise<string> {
    const res = await axiosHelper.get(
        NovrisUrl.NOVRIS_API_GET_AUTH_GET_CLIENT_ID
    );
    return res.data;
}

/**
 * チャレンジを取得する。
 * @param clientId クライアント識別子
 * @returns チャレンジ
 */
export async function challenge(clientId: string): Promise<ChallengeResponse> {
    const res = await axiosHelper.post<ChallengeResponse>(
        NovrisUrl.NOVRIS_API_POST_AUTH_CHALLENGE,
        { clientId }
    );
    return res.data;
}

/**
 * ログイン要求を行う。
 * @param clientId クライアント識別子
 * @param passwordHash ハッシュ化パスワード
 * @returns ログイン結果
 */
export async function loginRequest(clientId: string, passwordHash: string): Promise<LoginResponse> {
    const res = await axiosHelper.post<LoginResponse>(
        NovrisUrl.NOVRIS_API_POST_AUTH_LOGIN_REQUEST,
        { clientId, passwordHash }
    );
    return res.data;
}

/**
 * ログアウト要求を行う。
 * @returns ログアウト結果
 */
export async function logoutRequest(): Promise<LogoutResponse> {
    const res = await axiosHelper.post<LogoutResponse>(
        NovrisUrl.NOVRIS_API_POST_LOGOUT_REQUEST
    )
    return res.data;
}