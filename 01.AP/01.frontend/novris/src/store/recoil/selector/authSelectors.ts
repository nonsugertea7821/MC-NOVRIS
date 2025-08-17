import { selector } from 'recoil';
import { jwtState } from '../atom/authAtoms';
import { SelectorKeys } from '../keys/SelectorKeys';

export const isAuthenticatedState = selector<boolean>({
    key: SelectorKeys.NOVRIS_AUTH_IS_AUTHENTICATED_STATE,
    get: ({ get }) => {
        const jwt = get(jwtState);
        return Boolean(jwt !== null);
    },
});