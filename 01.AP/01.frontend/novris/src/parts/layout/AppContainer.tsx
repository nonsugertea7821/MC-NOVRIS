import { Box } from '@mui/material';
import React, { JSX } from 'react';
import AppHeader, { HEADER_HEIGHT } from './AppHeader';
import AppRouteDrawer from './AppRouteDrawer';

interface AppContainerProps {
    children?: React.ReactNode;
}

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