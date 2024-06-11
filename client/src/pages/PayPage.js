import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Card, Container } from '@mui/material';
import PayrollData from '../components/dataGrid/PayrollData';
import LeadGenPay from '../components/dataGrid/LeadGenPay';
import { useAppSelector } from '../hooks/hooks';
import { authSelector } from '../redux/slice/authSlice';
import { Fragment } from 'react';

export default function PayPage() {
  const { data } = useAppSelector(authSelector);
  const recordId = data?.recordID;
  return (
    <Fragment>
      <Helmet>
        <title>Payroll</title>
      </Helmet>
      <Container>
        <h2>Sales Commissions</h2>
        <Card sx={{ p: '1rem' }}>
          <PayrollData recordUserId={recordId} />
        </Card>
        <Box mt={6}>
          <h2>Lead generation Commissions</h2>
          <Card sx={{ p: '1rem' }}>
            <LeadGenPay recordUserId={recordId} />
          </Card>
        </Box>

        {/* <h1>Lead generation Commissions</h1>
          <LeadGenPay recordUserId={recordId} /> */}
      </Container>
    </Fragment>
  );
}

// export default function PayPage() {
//   return (
//     <Box
//       sx={{
//         height: '100vh',
//         display: 'flex',
//         justifyContent: 'center',
//         alignContent: 'center',
//         backgroundColor: 'rgba(145, 158, 171, 0.16)',

//       }}
//     >
//       <Helmet>
//         <title> Payroll </title>
//       </Helmet>

//       <Box
//         sx={{
//           width: '100vw',
//           paddingX: {
//             md: '40px',
//             xs: '2px',
//           },
//         }}
//       >
//         <Box sx={{ width: '100%', height: 'fit-content' }}>
//           {/* <DataGridProCSV /> */}
//           <h1>Sales Commissions</h1>
//           <PayrollData />
//           <h1>Lead generation Commissions</h1>
//           <PayrollData />
//         </Box>
//       </Box>
//     </Box>
//   );
// }
