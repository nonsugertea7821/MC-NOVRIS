import { Drawer, List, ListItemButton, ListItemText } from '@mui/material';
import React from 'react';
import { NovrisRoutes } from '../../store/route/routes';
import { HEADER_HEIGHT } from './AppHeader';

interface AppRouteDrawerProps {
    open: boolean;
    onClose?: () => void;
    onSelect?: (apKey: string) => void;
}

const AP_ROUTES_DRAWER_LIST = [
    NovrisRoutes.AP_MC_SERVER_MANAGEMENT,
];

export default function AppRouteDrawer({ open, onClose, onSelect }: AppRouteDrawerProps) {

    return (
        <Drawer
            anchor="left"
            open={open}
            onClose={onClose}
            ModalProps={{
                keepMounted: true, // モバイルでのパフォーマンス向上
            }}
            variant="temporary"
            sx={{
                '& .MuiDrawer-paper': {
                    boxSizing: 'border-box',
                    width: 240,
                    top: HEADER_HEIGHT,
                    height: `calc(100 - ${HEADER_HEIGHT})`,  // ヘッダーの高さ分だけ高さを縮める
                },
            }}
        >
            <List sx={{ width: 240 }}>
                {React.useMemo(() => {
                    return AP_ROUTES_DRAWER_LIST.map((menu) => (
                        <ListItemButton key={menu.path} onClick={() => { onSelect?.(menu.path); }}>
                            <ListItemText primary={menu.label} />
                        </ListItemButton>
                    ));
                }, [onSelect])}
            </List>
        </Drawer>
    );
}