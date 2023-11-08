import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Box } from '@mui/material';

import DealsData from '../components/dataGrid/DealsData';
import { useAppSelector } from '../hooks/hooks';
import { authSelector } from '../redux/slice/authSlice';


import DealsDataLeadgen from '../components/dataGrid/DealsDataLeadgen';

export default function DealsPage() {
 
  const { data } = useAppSelector(authSelector);
  const recordId = data?.recordID;
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: 'rgba(145, 158, 171, 0.16)',
       width: '100%',
        overflow: 'auto',
        overflowX: 'hidden'
      }}
    >
      <Helmet>
        <title> Deals </title>
      </Helmet>

      <Box
        sx={{
          width: '100vw',
          paddingX: {
            md: '40px',
            xs: '2px',
          },
        }}
      >
     <Box sx={{width: '100%', height: 'fit-content', overflow: 'auto', paddingTop: '1em', paddingLeft: '1em'}}>
      
          {/* <DataGridProCSV /> */}
          <h4>Sales Deals</h4>
          <DealsData recordUserId={recordId}/>


          <h4>Leadgen Deals</h4>


          <DealsDataLeadgen recordUserId={recordId}/>

        </Box>
      </Box>
    </Box>
  );
}
