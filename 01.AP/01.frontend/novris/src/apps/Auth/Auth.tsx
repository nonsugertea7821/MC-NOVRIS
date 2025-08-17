import { Box, Button, TextField, Typography } from '@mui/material';
import React, { ChangeEvent, FormEvent, useCallback, useState } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { targetIpState } from '../../store/recoil/atom/authAtoms';
import { isAuthenticatedState } from '../../store/recoil/selector/authSelectors';
import { useAuth } from './hooks/useAuth';

export function Auth() {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { login, logout } = useAuth();
    const targetIp = useRecoilValue(targetIpState);
    const isAuthenticated = useRecoilValue(isAuthenticatedState);

    const handleLogoutSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault();
        logout();
        setPassword('');
        setLoading(false);
        setError(null);
    }, [logout])

    const handleTargetIpChange = useRecoilCallback(({ set }) => (e: ChangeEvent<HTMLInputElement>) => {
        const targetIp = e.target.value;
        set(targetIpState, targetIp)
    }, []);

    const handlePasswordChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }, []);

    const handleSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault();
        if (!targetIp.trim()) {
            setError('接続先IPを入力してください');
            return;
        }
        if (!password.trim()) {
            setError('パスワードを入力してください');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await login(password);
        } catch {
            setError('ログインに失敗しました');
        } finally {
            setLoading(false);
        }
    }, [password, login, targetIp]);

    return (
        React.useMemo(() => (!isAuthenticated ?
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, margin: 10 }}>
                <TextField
                    type="text"
                    label="IPアドレス"
                    value={targetIp}
                    onChange={handleTargetIpChange}
                    disabled={loading}
                />
                <TextField
                    type="password"
                    label="パスワード"
                    value={password}
                    onChange={handlePasswordChange}
                    disabled={loading}
                />
                {error && <Typography color="error">{error}</Typography>}
                <Button type="submit" variant="contained" disabled={loading}>
                    {loading ? 'ログイン中…' : 'ログイン'}
                </Button>
            </Box > :
            <Box component="form" onSubmit={handleLogoutSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, margin: 10 }}>
                <Typography color="primary"> ログイン完了 </Typography>
                <Button type='submit' variant='contained' color='secondary'>
                    ログアウト
                </Button>
            </Box>
        ),
            [error, handleLogoutSubmit, handlePasswordChange, handleSubmit, handleTargetIpChange, isAuthenticated, loading, password, targetIp])
    );
}