import { Container } from '@mui/material';
import React from 'react';
import AvailabilityCalendar from '../components/calendar/AvailabilityCalender';

const AvaiabilityPlanner = () => {
  return (
    <Container>
      <h1>Availability</h1>
      <AvailabilityCalendar />
    </Container>
  );
};

export default AvaiabilityPlanner;
