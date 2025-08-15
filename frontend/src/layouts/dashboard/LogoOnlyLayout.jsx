import { Link as RouterLink, Outlet } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { AppBar, Toolbar } from '@mui/material';
// components
import Logo from '../../components/Logo';
import { Box } from '@mui/system';

// ----------------------------------------------------------------------

const HeaderStyle = styled(AppBar)(({ theme }) => ({
  top: 0,
  left: 0,
  lineHeight: 0,
  width: '100%',
  position: 'absolute',
  padding: theme.spacing(3, 3, 0),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(5, 5, 0),
  },
}));

// ----------------------------------------------------------------------

export default function LogoOnlyLayout() {
  return (
    <>
      <HeaderStyle>
        <Toolbar>
          <RouterLink to="/">
            <Logo />
          </RouterLink>
        </Toolbar>
      </HeaderStyle>
      <Box sx={{mt:15}}>
      <Outlet />
      </Box>
    </>
  );
}
