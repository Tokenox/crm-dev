import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

interface CustomSelectFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<{ name?: string | undefined; value: unknown }>) => void;
  items: string[];
  label: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function CustomSelectField({ label, value, onChange, items, open, setOpen }: CustomSelectFieldProps) {
  const handleChange = (event) => {
    onChange(event);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <FormControl sx={{ my: 1, minWidth: 120, width: '100%' }}>
      <InputLabel id="demo-controlled-open-select-label">{label || 'Select'}</InputLabel>
      <Select
        labelId="demo-controlled-open-select-label"
        id="demo-controlled-open-select"
        open={open}
        onClose={handleClose}
        onOpen={handleOpen}
        value={value}
        label={label || 'Select'}
        onChange={handleChange}
      >
        <MenuItem value="">
          <em>Select</em>
        </MenuItem>
        {items.map((item) => (
          <MenuItem key={item} value={item}>
            {item}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
