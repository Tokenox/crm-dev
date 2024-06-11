import { FormControl, InputLabel, Checkbox, MenuItem, Select, SelectChangeEvent, FormControlLabel } from '@mui/material';
import React, { useState } from 'react';
import CustomInput from '../input/CustomInput';
import { RoleDataTypes } from '../../types';

interface AddNewUserProps {
  user: {
    name: string;
    role: string;
    isSuperAdmin: boolean;
  };
  getUsersData: (value: string, name: string) => void;
  roles: RoleDataTypes[];
}

const AddUserForm = ({ user, getUsersData, roles }: AddNewUserProps) => {
  const [isChecked, setIsChecked] = useState(user.isSuperAdmin);
  const handleOnChange = (e) => {
    setIsChecked(!isChecked);
    getUsersData(e.target.checked, 'isSuperAdmin');
  };
  return (
    <div>
      <CustomInput value={user.name} onChange={(e) => getUsersData(e.target.value, e.target.name)} name="name" label="Name" />
      <FormControl fullWidth sx={{ mt: '.8rem' }}>
        <InputLabel id="demo-simple-select-label">Select Role</InputLabel>
        <Select
          value={user.role}
          label="Select Role"
          name="role"
          onChange={(e: SelectChangeEvent) => {
            getUsersData(e.target.value, e.target.name);
          }}
        >
          {roles?.map(({ id, name }: { name: string; id: string }) => (
            <MenuItem key={id} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControlLabel sx={{ mt: '.8rem' }} control={<Checkbox checked={isChecked} onChange={handleOnChange} />} label="Super Admin" />
    </div>
  );
};

export default AddUserForm;
