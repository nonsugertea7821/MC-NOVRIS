import { Box } from '@mui/material';
import React, { JSX } from 'react';
import AppHeader, { HEADER_HEIGHT } from './AppHeader';
import AppRouteDrawer from './AppRouteDrawer';

/**
 * アプリケーションのコンテナコンポーネント引数
 * @author nonsugertea7821
 * @param children - 子コンポーネント
 * @returns JSX.Element
 */
interface AppContainerProps {
    /** 子コンポーネント */
    children?: React.ReactNode;
}

/**
 * アプリケーションのコンテナコンポーネント
 * @author nonsugertea7821
 * @param children - 子コンポーネント
 * @returns JSX.Element
 */
export default function AppContainer({ children }: AppContainerProps): JSX.Element {
    const [menuOpen, setMenuOpen] = React.useState(false);

    const handleMenuToggle = React.useCallback(() => {
        setMenuOpen(!menuOpen);
    }, [menuOpen]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <AppHeader onMenuToggle={handleMenuToggle} />
            <Box component="main" sx={{ paddingTop: `${HEADER_HEIGHT}px`, flex: 1 }}>
                <AppRouteDrawer open={menuOpen} />
                {children}
            </Box>
        </Box>
    );
}