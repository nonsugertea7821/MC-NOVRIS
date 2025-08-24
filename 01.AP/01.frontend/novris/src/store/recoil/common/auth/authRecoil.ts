import { atom, selector } from 'recoil';
import { challenge, getClientId, loginRequest, logoutRequest } from '../../../api/common/auth/authApi';
import { axiosHelper } from '../../../axios/axiosHelper';
import { AtomKeys } from '../../keys/AtomKeys';
import { SelectorKeys } from '../../keys/SelectorKeys';
import { hmacSha256 } from './utils/HashUtil';

/** ログイン状態インターフェース */
interface LoginState {
    /** クライアント識別子 */
    clientId?: string;
    /** 認証状態 */
    isAuthenticated: boolean;
}

/** 認証機能インターフェース */
interface Auth {
    /** クライアント識別子 */
    clientId?: string,
    /** 認証状態 */
    isAuthenticated: boolean,
    /**
     * ログイン処理
     * @param targetIp 接続先IP
     * @param password 平文パスワード
     * @returns Promise<void>
     */
    login: (targetIp: string, password: string) => Promise<void>;
    /**
     * ログアウト処理
     * @returns Promise<void>
     */
    logout: () => Promise<void>;
}

/** ログイン状態 */
const loginState = atom<LoginState>({
    key: AtomKeys.NOVRIS_AUTH_LOGIN_STATE,
    default: {
        clientId: undefined,
        isAuthenticated: false
    }
});

/** クライアント識別子セレクター */
const clientIdSelector = selector<string>({
    key: SelectorKeys.NOVRIS_AUTH_CLIENT_ID_SELECTOR,
    get: async ({ get }) => {
        const clientId = get(loginState).clientId;
        if (!clientId) {
            return await getClientId();
        } else {
            return clientId;
        }
    }
})

/** 認証機能セレクター */
export const authSelector = selector<Auth>({
    key: SelectorKeys.NOVRIS_AUTH_INTERFACE_SELECTOR,
    get: ({ get, getCallback }) => {
        /** クライアントID */
        const clientId = get(loginState).clientId;
        /** 認証状態 */
        const isAuthenticated = get(loginState).isAuthenticated;

        /** ログイン処理 */
        const login = getCallback(({ snapshot, set }) => async (targetIp: string, password: string) => {
            axiosHelper.setIp(targetIp);
            const clientId = await snapshot.getPromise(clientIdSelector);
            const { nonce } = await challenge(clientId);
            const passwordHash = await hmacSha256(nonce, password);
            const { jwtToken, errorMessage } = await loginRequest(clientId, passwordHash);
            if (errorMessage) {
                throw new DOMException(errorMessage);
            }
            axiosHelper.setJwtToken(jwtToken);
            set(loginState, {
                clientId: clientId,
                isAuthenticated: true,
            } as LoginState);
        })

        /** ログアウト処理 */
        const logout = getCallback(({ reset }) => async () => {
            const logoutResponse = await logoutRequest();
            if (logoutResponse.resultCode === 0) {
                reset(loginState)
            }
        })

        return { clientId, isAuthenticated, login, logout }
    }
})