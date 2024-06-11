import React, { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { IconButton, InputAdornment, Stack, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CustomInput from '../components/input/CustomInput';
import AuthenticationLayout from '../layouts/AuthenticationLayout';
import Iconify from '../components/iconify';
import { useAppDispatch } from '../hooks/hooks';
import { forgotPassword } from '../redux/middleware/authentication';
import { setAlert } from '../redux/slice/alertSlice';

const ResetPasswordPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [verificationCode, setVerificationCode] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleResetPassword = async () => {
    const response: any = await dispatch(forgotPassword({ code: verificationCode, password: password }));
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
      navigate('/login');
      dispatch(
        setAlert({
          message: 'User updated successfully',
          type: 'success'
        })
      );
    }
  };

  return (
    <AuthenticationLayout
      title={'Reset Password'}
      link={{
        text: 'Verify Email',
        to: '/verify-email'
      }}
    >
      <Stack spacing={3}>
        <CustomInput
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          name="verificationCode"
          label="Verification Code"
        />
        <TextField
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Stack>
      <LoadingButton fullWidth size="large" type="submit" variant="contained" sx={{ my: 3 }} onClick={handleResetPassword}>
        Reset Password
      </LoadingButton>
    </AuthenticationLayout>
  );
};

export default ResetPasswordPage;
