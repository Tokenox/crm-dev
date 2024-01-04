import { Box, Container } from '@mui/material';
import React from 'react';
import AvailabilityCalendar from '../components/calendar/AvailabilityCalender';

const AvaiabilityPlanner = () => {
  return (
    <Container>
      <h1>Availability Planner</h1>
      {/* <MyCalendar value={'email'} getActionData={() => {}} /> */}
      <AvailabilityCalendar />
    </Container>
  );
};

export default AvaiabilityPlanner;
