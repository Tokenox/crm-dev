import React from 'react';
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import CustomInput from '../input/CustomInput';
import DeleteIcon from '@mui/icons-material/Delete';

import { CategoryTypes, FieldTypes } from '../../types';

interface AddLeadProps {
  fields: FieldTypes[];
  getFieldsData: (value: string, name: string, index: number) => void;
  addNewField: () => void;
  category: CategoryTypes;
  setCategory: React.Dispatch<React.SetStateAction<CategoryTypes>>;
  removeField: (index: number) => void;
  isEdit: boolean;
}

const 
AddCategory = ({ category, setCategory, fields, isEdit, getFieldsData, addNewField, removeField }: AddLeadProps) => {
  const DataTypes = ['string', 'number', 'boolean', 'date'];
  return (
    <Grid>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, mb: 1 }}>
        <Box width="75%">
          {!isEdit && (
            <CustomInput
              label="Name"
              size="small"
              name={category.name}
              value={category.name}
              onChange={(e) => {
                setCategory({ ...category, name: e.target.value });
              }}
            />
          )}
        </Box>
        <Button
          variant="contained"
          onClick={() => {
            addNewField();
          }}
        >
          + New Field
        </Button>
      </Box>
      
      {fields?.map((field, index) => {
        return (
          <Grid container spacing={2} key={index}>
            <Grid item md={8}>
              <CustomInput
                label="Field Name"
                name="name"
                value={field.name}
                onChange={(e) => {
                  getFieldsData(e.target.value, e.target.name, index);
                }}
              />
            </Grid>
            <Grid item md={3}>
              <FormControl fullWidth sx={{ mt: '.5rem' }}>
                <InputLabel id="demo-simple-select-label">Select Type</InputLabel>
                <Select
                  value={field.type}
                  name="type"
                  label="Select Type"
                  onChange={(e: SelectChangeEvent) => {
                    getFieldsData(e.target.value, e.target.name, index);
                  }}
                  sx={{
                    '& .MuiSelect-select': {
                      textTransform: 'capitalize',
                      color: '#0c71edd8'
                    }
                  }}
                >
                  {DataTypes.map((type: string) => (
                    <MenuItem
                      key={type}
                      value={type}
                      sx={{
                        textTransform: 'capitalize',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)',
                          color: '#0c71edd8'
                        }
                      }}
                    >
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={1} display="flex" alignItems="center">
              <DeleteIcon
                onClick={() => {
                  removeField(index);
                }}
                sx={{
                  cursor: 'pointer',
                  color: 'grey',
                  '&:hover': {
                    color: 'red'
                  }
                }}
              />
            </Grid>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default AddCategory;
