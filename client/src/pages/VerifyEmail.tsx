import { LoadingButton } from '@mui/lab';
import { Stack } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomInput from '../components/input/CustomInput';
import { useAppDispatch } from '../hooks/hooks';
import AuthenticationLayout from '../layouts/AuthenticationLayout';
import { startVerification } from '../redux/middleware/authentication';
import { setAlert } from '../redux/slice/alertSlice';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState<string>('');

  const handleVerifyEmail = async () => {
    const response: any = dispatch(startVerification({ email, type: 'password' }));
    navigate('/reset-password');

    if (response && response.error && response.error.message) {
      dispatch(
        setAlert({
          message: response.error.message,
          type: 'error'
        })
      );
      return;
    }

    if (response && response.payload) {
      dispatch(
        setAlert({
          message: 'User updated successfully',
          type: 'success'
        })
      );
    }
  };

  return (
    <AuthenticationLayout title="Verify Email" link={{ text: 'Login', to: '/login' }}>
      <Stack spacing={3}>
        <CustomInput value={email} onChange={(e) => setEmail(e.target.value)} name="email" label="Email" />
      </Stack>
      <LoadingButton fullWidth size="large" type="submit" variant="contained" sx={{ my: 3 }} onClick={handleVerifyEmail}>
        Send Verification Code
      </LoadingButton>
    </AuthenticationLayout>
  );
};

export default VerifyEmail;
