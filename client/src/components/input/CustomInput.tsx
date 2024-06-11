import { Box, TextField, Typography } from '@mui/material';
import React from 'react';

interface CustomInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  label: string;
  type?: 'text' | 'number' | 'password' | 'email' | 'tel' | 'url' | 'search';
  size?: 'small' | 'medium';
  error?: string;
}

const CustomInput = ({ type = 'text', value, name, label, size = 'medium', error, onChange }: CustomInputProps) => {
  return (
    <Box>
      <TextField
        type={type}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e)}
        name={name}
        label={label}
        fullWidth={true}
        sx={{ my: error ? 0 : 1 }}
        size={size}
      />
      {error && <Typography color={'darkorange'}>{error}</Typography>}
    </Box>
  );
};

export default CustomInput;
