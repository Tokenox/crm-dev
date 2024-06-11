import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

interface DateTimePickerValueProps {
  label: string;
  value: Dayjs | null;
  onChange: (date: Dayjs | null) => void;
}

export default function DateTimePickerValue({ label, value, onChange }: DateTimePickerValueProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateTimePicker']}>
        <DateTimePicker label={label || 'Date & Time'} value={value} onChange={(newValue) => onChange(newValue)} />
      </DemoContainer>
    </LocalizationProvider>
  );
}
