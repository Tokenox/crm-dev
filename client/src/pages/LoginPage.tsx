import React, { useState } from 'react';
import { Checkbox, FormControlLabel, IconButton, InputAdornment, Stack, TextField } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import AuthenticationLayout from '../layouts/AuthenticationLayout';
import Iconify from '../components/iconify';
import CustomInput from '../components/input/CustomInput';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { login } from '../redux/middleware/authentication';
import { setAlert } from '../redux/slice/alertSlice';
import { authSelector } from '../redux/slice/authSlice';

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading } = useAppSelector(authSelector);

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleClick = async () => {
    try {
      if (!email || !password) return dispatch(setAlert({ message: 'Please fill all fields', type: 'error' }));
      const response: any = await dispatch(login({ email, password }));
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
            message: 'Login successful',
            type: 'success'
          })
        );
      }
      navigate('/dashboard/deals', { replace: true });
    } catch (error) {
      dispatch(
        setAlert({
          message: error.response.data.message,
          type: 'error'
        })
      );
      console.log(error);
    }
  };
  return (
    <AuthenticationLayout title="Login" link={{ text: 'Register', to: '/register' }}>
      <Stack spacing={3}>
        <CustomInput value={email} onChange={(e) => setEmail(e.target.value)} name="email" label="Email address" />
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

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <FormControlLabel value="remember" control={<Checkbox />} label="Remember me" labelPlacement="end" />
        <Link to="/verify-email">Forgot password?</Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick} loading={loading}>
        Login
      </LoadingButton>
    </AuthenticationLayout>
  );
};

export default LoginPage;
