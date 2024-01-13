import { useState } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, Popover } from '@mui/material';
// mocks_
import account from '../../../_mock/account';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { authSelector } from '../../../redux/slice/authSlice';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../redux/middleware/authentication';
import { setAlert } from '../../../redux/slice/alertSlice';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    icon: 'eva:home-fill',
    actionLink: 'eva:home'
  },
  {
    label: 'Profile',
    icon: 'eva:person-fill',
    actionLink: 'eva:home'
  },
  {
    label: 'Settings',
    icon: 'eva:settings-2-fill',
    actionLink: 'eva:home'
  },
  {
    label: 'VC Assistant',
    icon: 'eva:settings-2-fill',
    actionLink: 'https://vccrm.vercel.app/dashboard/assistant'
  }
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const navigate = useNavigate();

  // Function to handle navigation
  const handleNavigation = (path) => {
    handleClose(); // Close the popover
    navigate(path); // Navigate to the specified path
  };
  const dispatch = useAppDispatch();

  const { data } = useAppSelector(authSelector);
  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8)
            }
          })
        }}
      >
        <Avatar src={account.photoURL} alt="photoURL" />
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75
            }
          }
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap sx={{ textTransform: 'uppercase' }}>
            {data?.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {data?.email}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {data?.role}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {data?.recordID}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} onClick={() => handleNavigation(option.actionLink)}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {/* Logout Button */}
        <MenuItem
          sx={{ m: 1 }}
          onClick={async () => {
            const response = await dispatch(logout());
            if (response.error) {
              dispatch(setAlert({ message: response.error.message, type: 'error', open: true }));
              return;
            }
            dispatch(setAlert({ message: 'Logout successful', type: 'success', open: true }));
            handleClose();
            localStorage.removeItem('persist:root');
            navigate('/login', { replace: true });
          }}
        >
          Logout
        </MenuItem>
      </Popover>
    </>
  );
}
