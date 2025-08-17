import { atom } from 'recoil';
import { AtomKeys } from '../keys/AtomKeys';

export const targetIpState = atom<string>({
    key: AtomKeys.NOVRIS_AUTH_TARGET_IP_STATE,
    default: ''
});

export const clientIdState = atom<string | null>({
    key: AtomKeys.NOVRIS_AUTH_CLIENT_ID_STATE,
    default: null,
});

export const jwtState = atom<string | null>({
    key: AtomKeys.NOVRIS_AUTH_JWT_STATE,
    default: null,
});