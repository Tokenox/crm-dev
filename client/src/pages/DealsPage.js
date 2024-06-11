import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Card, Container } from '@mui/material';

import DealsData from '../components/dataGrid/DealsData';
import { useAppSelector } from '../hooks/hooks';
import { authSelector } from '../redux/slice/authSlice';

import DealsDataLeadgen from '../components/dataGrid/DealsDataLeadgen';
import { Fragment } from 'react';

export default function DealsPage() {
  const { data } = useAppSelector(authSelector);
  const recordId = data?.recordID;

  return (
    <Fragment>
      <Helmet>
        <title> Deals </title>
      </Helmet>
      <Container>
        {/* <DataGridProCSV /> */}
        <h2>Sales Deals</h2>
        <Card sx={{ p: '1rem' }}>
          <DealsData recordUserId={recordId} />
        </Card>
        <Box mt={6}>
          <h2>Leadgen Deals</h2>
          <Card sx={{ p: '1rem' }}>
            <DealsDataLeadgen recordUserId={recordId} />
          </Card>
        </Box>
      </Container>
    </Fragment>
  );
}
