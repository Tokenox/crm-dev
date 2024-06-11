import React, { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { Button, Checkbox, IconButton, InputAdornment, Stack, TextField } from '@mui/material';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import AuthenticationLayout from '../layouts/AuthenticationLayout';
import Iconify from '../components/iconify';
import { RegisterOrgTypes } from '../types';
import { baseURL } from '../libs/client/apiClient';

const initialState = {
  email: '',
  name: '',
  company: '',
  password: '',
  confirmPassword: '',
  agree: false,
  verifyCode: ''
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const [register, setRegister] = useState<RegisterOrgTypes>(initialState);
  const [isCodeSent, setIsCodeSent] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleClick = async () => {
    try {
      const response = await axios.post(`${baseURL}/auth/start-verification`, {
        email: register.email,
        type: 'email'
      });

      if (response.status === 200) {
        setIsCodeSent(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleRegister = async () => {
    try {
      const response = await axios.post(`${baseURL}/auth/register`, {
        email: register.email,
        name: register.name,
        company: register.company,
        password: register.password,
        verificationToken: register.verifyCode
      });
      console.log(response);

      if (response.status === 200) {
        navigate('/login');
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <AuthenticationLayout title="Register" link={{ text: 'Login', to: '/login' }}>
      <Stack spacing={3}>
        <TextField
          disabled={isCodeSent}
          value={register.email}
          onChange={(e) => setRegister({ ...register, email: e.target.value })}
          name="email"
          label="Email address"
        />
        <TextField
          disabled={isCodeSent}
          value={register.name}
          onChange={(e) => setRegister({ ...register, name: e.target.value })}
          name="name"
          label="Name"
        />
        <TextField
          disabled={isCodeSent}
          value={register.company}
          onChange={(e) => setRegister({ ...register, company: e.target.value })}
          name="company"
          label="Company"
        />
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2} sx={{ my: 2 }}>
          <TextField
            value={register.password}
            onChange={(e) => setRegister({ ...register, password: e.target.value })}
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            disabled={isCodeSent}
          />
          <TextField
            value={register.confirmPassword}
            onChange={(e) => setRegister({ ...register, confirmPassword: e.target.value })}
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
            disabled={isCodeSent}
          />
        </Stack>
      </Stack>
      {isCodeSent && (
        <Stack spacing={3} sx={{ position: 'relative', mt: 2 }}>
          <TextField
            name="code"
            label="Code"
            value={register.verifyCode}
            onChange={(e) => setRegister({ ...register, verifyCode: e.target.value })}
          />
          <Button variant="text" sx={{ position: 'absolute', bottom: '10px', right: '10px' }}>
            Resend
          </Button>
        </Stack>
      )}

      <Stack direction="row" alignItems="center" justifyItems="start" sx={{ my: 2 }}>
        <Checkbox
          name="remember"
          checked={register.agree}
          onChange={(e) => setRegister({ ...register, agree: Boolean(e.target.value) })}
          disabled={isCodeSent}
        />
        <Link to="#">I agree to the terms and conditions</Link>
      </Stack>
      {!isCodeSent ? (
        <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
          Register
        </LoadingButton>
      ) : (
        <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleRegister}>
          Complete Registration
        </LoadingButton>
      )}
    </AuthenticationLayout>
  );
};

export default RegisterPage;
