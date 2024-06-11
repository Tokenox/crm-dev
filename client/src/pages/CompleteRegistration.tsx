import React, { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Checkbox, IconButton, InputAdornment, Stack, TextField } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import AuthenticationLayout from '../layouts/AuthenticationLayout';
import Iconify from '../components/iconify';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { completeVerification, register, startVerification, verifyCode } from '../redux/middleware/authentication';
import { authSelector, startVerificationAction } from '../redux/slice/authSlice';
import { setAlert } from '../redux/slice/alertSlice';

const initialState = {
  email: '',
  name: '',
  password: '',
  confirmPassword: '',
  agree: false
};

const CompleteRegistration = () => {
  const dispatch = useAppDispatch();
  const { isStartVerification, verifyCodeLoading, verifyCodeError, loading } = useAppSelector(authSelector);

  const navigate = useNavigate();
  const [registerData, setRegisterData] = useState(initialState);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [code, setCode] = useState<string>('');

  const submitRegister = async () => {
    if (registerData.password !== registerData.confirmPassword) {
      dispatch(
        setAlert({
          message: 'Password and confirm password must be the same',
          type: 'error'
        })
      );
      return;
    }

    for (const key in registerData) {
      if (registerData[key] === '') {
        dispatch(
          setAlert({
            message: `Please fill ${key} field`,
            type: 'error'
          })
        );
        return;
      }
    }
    if (registerData.agree === false) {
      dispatch(
        setAlert({
          message: 'Please agree with terms and conditions',
          type: 'error'
        })
      );
      return;
    }

    const response: any = await dispatch(startVerification({ email: registerData.email, type: 'email' }));

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
          message: 'Verification code sent to your email',
          type: 'success'
        })
      );
    }
  };

  const handleCompleteVerification = async () => {
    if (registerData.password !== registerData.confirmPassword) {
      dispatch(
        setAlert({
          message: 'Password and confirm password must be the same',
          type: 'error'
        })
      );
      return;
    }

    for (const key in registerData) {
      if (registerData[key] === '') {
        dispatch(
          setAlert({
            message: `Please fill ${key} field`,
            type: 'error'
          })
        );
        return;
      }
    }
    if (registerData.agree === false) {
      dispatch(
        setAlert({
          message: 'Please agree with terms and conditions',
          type: 'error'
        })
      );
      return;
    }

    if (!code) {
      dispatch(
        setAlert({
          message: 'Please enter verification code',
          type: 'error'
        })
      );
      return;
    }

    const registerResponse: any = await dispatch(
      register({ email: registerData.email, name: registerData.name, password: registerData.password })
    );
    const completeRegResponse: any = await dispatch(completeVerification({ email: registerData.email, code: code }));

    if (registerResponse && registerResponse.error && registerResponse.error.message) {
      dispatch(
        setAlert({
          message: registerResponse.error.message,
          type: 'error'
        })
      );
      return;
    }
    if (completeRegResponse && completeRegResponse.error && completeRegResponse.error.message) {
      dispatch(
        setAlert({
          message: completeRegResponse.error.message,
          type: 'error'
        })
      );
      return;
    }

    if (registerResponse && registerResponse.payload && completeRegResponse && completeRegResponse.payload) {
      dispatch(
        setAlert({
          message: 'Registration successfully',
          type: 'success'
        })
      );
    }

    dispatch(startVerificationAction(false));
    navigate('/login', { replace: true });
  };

  return (
    <AuthenticationLayout title="Register" link={{ text: 'Login', to: '/login' }}>
      <Stack spacing={3}>
        <TextField
          value={registerData.email}
          onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
          name="email"
          label="Email address"
        />

        <TextField
          value={registerData.name}
          onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
          name="name"
          label="Name"
        />

        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2} sx={{ my: 2 }}>
          <TextField
            value={registerData.password}
            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
          />
          <TextField
            value={registerData.confirmPassword}
            onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
            name="confirmPassword"
            label="Confirm Password"
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
      </Stack>

      {isStartVerification && (
        <Box>
          <Stack spacing={3} sx={{ position: 'relative', mt: 2 }}>
            <TextField
              name="code"
              label="Code"
              value={code}
              onChange={async (e) => {
                setCode(e.target.value);
                if (e.target.value.length === 6) {
                  const response = await dispatch(
                    verifyCode({
                      email: registerData.email,
                      code: e.target.value
                    })
                  );
                  if (response.payload) {
                    dispatch(
                      setAlert({
                        message: 'Successfully verified',
                        type: 'success'
                      })
                    );
                  }
                }
              }}
            />
            <Button
              variant="text"
              sx={{ position: 'absolute', bottom: '10px', right: '10px' }}
              onClick={async () => {
                if (!registerData.email) {
                  dispatch(
                    setAlert({
                      message: 'Please enter email',
                      type: 'error'
                    })
                  );
                  return;
                }
                const response: any = dispatch(await dispatch(startVerification({ email: registerData.email, type: 'email' })));
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
                      message: 'Successfully verified',
                      type: 'success'
                    })
                  );
                }
              }}
            >
              Resend
            </Button>
          </Stack>
          {verifyCodeLoading ? <b style={{ color: '#0c71edd8', fontSize: '14px' }}>Loading...</b> : ''}
          {verifyCodeError ? <b style={{ color: 'red', fontSize: '14px' }}>{verifyCodeError}</b> : ''}
        </Box>
      )}

      <Stack direction="row" alignItems="center" justifyItems="start" sx={{ my: 2 }}>
        <Checkbox
          name="remember"
          checked={registerData.agree}
          onChange={(e) => setRegisterData({ ...registerData, agree: Boolean(e.target.value) })}
        />
        <Link to="#">I agree to the terms and conditions</Link>
      </Stack>
      {!isStartVerification ? (
        <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={submitRegister} loading={loading}>
          Registration
        </LoadingButton>
      ) : (
        <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleCompleteVerification} loading={loading}>
          Complete Registration
        </LoadingButton>
      )}
    </AuthenticationLayout>
  );
};

export default CompleteRegistration;
