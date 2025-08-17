import { useRecoilCallback } from 'recoil';
import { challenge, getClientId, loginRequest } from '../../../store/api/authApi';
import { clientIdState, jwtState } from '../../../store/recoil/atom/authAtoms';
import { hmacSha256 } from '../utils/HashUtil';

export function useAuth() {

    const login = useRecoilCallback(({ set }) => async (password: string) => {
        const clientId = await getClientId();
        const challengeResponse = await challenge(clientId);
        const passwordHash = await hmacSha256(challengeResponse.nonce, password);
        const jwt = await loginRequest(clientId, passwordHash);
        set(clientIdState, clientId);
        set(jwtState, jwt);
    }, [clientIdState, jwtState]);

    const logout = useRecoilCallback(({ reset }) => () => {
        reset(clientIdState)
        reset(jwtState);
    }, [jwtState]);

    return { login, logout, fetchClientId: getClientId, fetchChallenge: challenge };
}