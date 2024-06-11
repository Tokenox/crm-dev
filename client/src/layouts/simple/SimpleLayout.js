import { Outlet } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
// components
import Logo from '../../components/logo';
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

const StyledHeader = styled('header')(({ theme }) => ({
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

export default function SimpleLayout() {
  return (
    <>
      <StyledHeader>
        {/* <Logo /> */}


        <Box sx={{ px: 2.5, py: 3, display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
    <img
      src={`${process.env.PUBLIC_URL}/assets/images/iconImages/logo.png`} 
      alt="Voltaic CRM Logo"
      style={{
        maxWidth: '150px',
        maxHeight: '150px',
        width: 'auto',
        height: 'auto',
        objectFit: 'contain'
      }}
    />
  </Box>
      </StyledHeader>

      <Outlet />
    </>
  );
}
