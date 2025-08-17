import { ChallengeResponse } from '../../apps/Auth/data/apiData';
import { axiosHelper } from '../axios/axiosHelper';
import { NovrisUrl } from './novrisUrl';

export async function getClientId(): Promise<string> {
    const res = await axiosHelper.get(
        NovrisUrl.NOVRIS_API_GET_AUTH_GET_CLIENT_ID
    );
    return res.data;
}

export async function challenge(clientId: string): Promise<ChallengeResponse> {
    const res = await axiosHelper.post<ChallengeResponse>(
        NovrisUrl.NOVRIS_API_POST_AUTH_CHALLENGE,
        { clientId }
    );
    return res.data;
}

export async function loginRequest(clientId: string, passwordHash: string): Promise<string> {
    const res = await axiosHelper.post(
        NovrisUrl.NOVRIS_API_POST_AUTH_LOGIN_REQUEST,
        { clientId, passwordHash }
    );
    return res.data.jwt;
}