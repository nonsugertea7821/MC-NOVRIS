import styled from '@emotion/styled';
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';

interface HeaderProps {
    onMenuToggle: () => void;
}

export const HEADER_HEIGHT = 64;

const StyledAppBar = styled(AppBar)({
    position: 'fixed',
    height: HEADER_HEIGHT,
});

const TitleTypography = styled(Typography)({
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    m: 0,
    p: 0,
});

export default function AppHeader({ onMenuToggle }: HeaderProps) {
    return (
        <StyledAppBar  sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar disableGutters sx={{ minHeight: HEADER_HEIGHT, height: HEADER_HEIGHT, px: 2 }}>
                <IconButton edge="start" color="inherit" onClick={onMenuToggle} sx={{ mr: 2, flexShrink: 0 }}>
                    <MenuIcon />
                </IconButton>
                <TitleTypography variant="h6" >
                    MC NOVRIS Ver.0.1.0
                </TitleTypography>
            </Toolbar>
        </StyledAppBar>
    );
}