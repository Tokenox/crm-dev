import { Box } from '@mui/material';
import React, { useState } from 'react';
import CustomInput from '../input/CustomInput';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimeClock } from '@mui/x-date-pickers/TimeClock';
// import { MultiSectionDigitalClock } from '@mui/x-date-pickers/MultiSectionDigitalClock';
import { PlannerState } from '../calendar/Calendar';
import { Dayjs } from 'dayjs';
import { CategoryResponseTypes } from '../../types';
import CustomSelectField from '../custom-select-field/CustomSelectField';

interface PlannerProps {
  state?: PlannerState;
  categories: CategoryResponseTypes[];
  error?: { title: string; description: string };
  getFormData?: ({ name, value }: { name: string; value: string | Dayjs }) => void;
}

const PlannerForm = ({ state, error, getFormData, categories }: PlannerProps) => {
  const [isCustomFieldOpen, setIsCustomFieldOpen] = React.useState(false);

  return (
    <Box>
      <CustomSelectField
        label={'Select Source'}
        value={state.source}
        onChange={(e) => getFormData({ name: 'source', value: e.target.value.toString() })}
        items={categories.map((category) => category.name)}
        open={isCustomFieldOpen}
        setOpen={setIsCustomFieldOpen}
      />
      <CustomInput
        label="Title"
        name={'title'}
        onChange={(e) => getFormData({ name: e.target.name, value: e.target.value })}
        value={state.title}
        error={error.title}
      />
      <CustomInput
        label="Description"
        name={'description'}
        onChange={(e) => getFormData({ name: e.target.name, value: e.target.value })}
        value={state.description}
        error={error.description}
      />
      <Box mt={1.5}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DateTimePicker', 'DatePicker', 'TimeClock']}>
            <DatePicker
              label="Start Event"
              value={state.startDate}
              onChange={(newValue) => getFormData({ name: 'startDate', value: newValue })}
            />
            <Box alignItems={'center'}>
              <TimeClock
                ampm
                ampmInClock
                value={state.timeOfExecution}
                onChange={(newValue) => {
                  getFormData({ name: 'timeOfExecution', value: newValue });
                }}
              />
            </Box>
            {/* <MultiSectionDigitalClock
              value={state.timeOfExecution}
              onChange={(newValue) => getFormData({ name: 'timeOfExecution', value: newValue })}
              /> */}
          </DemoContainer>
        </LocalizationProvider>
      </Box>
    </Box>
  );
};

export default PlannerForm;
