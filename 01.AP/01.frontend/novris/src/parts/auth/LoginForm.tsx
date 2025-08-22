import { Box, Button, TextField, Typography } from '@mui/material';
import { ChangeEvent, FormEvent, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authSelector } from '../../store/recoil/common/auth/authRecoil';
import { NovrisRoutes } from '../../store/route/routes';
import AppContainer from '../layout/AppContainer';

export function LoginForm() {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [targetIp, setTargetIp] = useState('');
    const [error, setError] = useState<string>('');
    const { login } = useRecoilValue(authSelector);
    const navigate = useNavigate();

    const handleTargetIpChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setTargetIp(e.target.value);
        setPassword('');
    }, []);

    const handlePasswordChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }, []);

    const handleLoginSubmit = useCallback(async (e: FormEvent) => {
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
        setError('');
        try {
            await login(targetIp, password);
        } finally {
            setLoading(false);
            navigate(NovrisRoutes.AP_MC_NOVRIS_HOME.path);
        }
    }, [targetIp, password, login, navigate]);


    return (
        <AppContainer>
            <Box component="form" onSubmit={handleLoginSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, margin: 10 }}>
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
            </Box >
        </AppContainer>
    );
}
