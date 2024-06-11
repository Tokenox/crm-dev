import React from 'react';
import { Box, Grid } from '@mui/material';

import CustomInput from '../input/CustomInput';

interface AddLeadProps {
  leadValue: {
    name: string;
    type: string;
    value: string;
  }[];
  getAddLeadData: (value: string, name: string, index: number) => void;
}

const AddLead = ({ leadValue, getAddLeadData }: AddLeadProps) => {
  return (
    <Grid>
      {leadValue?.map((lead, index) => (
        <Box key={index}>
          <CustomInput
            label={lead.name}
            name={lead.name}
            value={lead.value}
            onChange={(e) => {
              getAddLeadData(e.target.value, e.target.name, index);
            }}
          />
        </Box>
      ))}
    </Grid>
  );
};

export default AddLead;
