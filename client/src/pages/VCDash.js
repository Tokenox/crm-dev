// import React, { useState, useMemo } from 'react';
// import {
//   Box,
//   Container,
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   Button,
//   ButtonGroup,
//   Divider,
//   List,
//   ListItem,
//   ListItemText,
//   TableCell,
//   Table,
//   TableRow,
//   TableBody,
//   TableHead,
//   Paper,
//   TableContainer
// } from '@mui/material';
// import { ThemeProvider, createTheme } from '@mui/material/styles';

// // Define a theme for the dashboard
// const theme = createTheme({
//   palette: {
//     primary: {
//       main: '#1976d2',
//     },
//     secondary: {
//       main: '#ec407a',
//     },
//   },
// });

// function KpiCard({ title, value }) {
//   return (
//     <Card variant="outlined" sx={{ minWidth: 200, m: 1 }}>
//       <CardContent>
//         <Typography variant="h6" component="div">
//           {title}
//         </Typography>
//         <Typography variant="body2">
//           {value}
//         </Typography>
//       </CardContent>
//     </Card>
//   );
// }

// // Example of a list component for graveyard leads
// function GraveyardLeads({ leads }) {
//   return (
//     <List dense>
//       {leads.map((lead, index) => (
//         <ListItem key={index}>
//           <ListItemText
//             primary={lead.name}
//             secondary={`Status: ${lead.status}`}
//           />
//         </ListItem>
//       ))}
//     </List>
//   );
// }
// function RepCardRankings({ repCardUsers, sortConfig, handleSort }) {
//   // Memoize the sorted data to avoid unnecessary sorting on each render
//   const sortedUsers = useMemo(() => {
//     // ... (sorting logic here)
//     // Placeholder for sorting function, which you will replace with actual logic
//     return repCardUsers;
//   }, [repCardUsers, sortConfig]);

//   return (
//     <TableContainer component={Paper}>
//       <Table aria-label="simple table">
//         <TableHead>
//           <TableRow>
//             <TableCell>Name</TableCell>
//             {/* Add more TableCell elements for each metric with sort buttons */}
//             {/* ... */}
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {sortedUsers.map((user, index) => (
//             <TableRow key={index}>
//               <TableCell component="th" scope="row">
//                 {user.name}
//               </TableCell>
//               {/* Add more TableCell elements for each metric */}
//               {/* ... */}
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// }

// export default function Dashboard() {
//   const [timeFilter, setTimeFilter] = useState('week');
//  // RepCard users' data example
//  // Define initial RepCard users' data
//  const [repCardUsers, setRepCardUsers] = useState([
//   { name: 'Rep A', doorsKnocked: 150, appointmentsSet: 90, appointmentsSat: 45, appointmentsClosed: 30, closedInstalled: 15 },
//   { name: 'Rep B', doorsKnocked: 120, appointmentsSet: 60, appointmentsSat: 30, appointmentsClosed: 20, closedInstalled: 10 },
//   { name: 'Rep C', doorsKnocked: 180, appointmentsSet: 100, appointmentsSat: 70, appointmentsClosed: 50, closedInstalled: 25 },
//   // Add more rep data here...
// ]);
// // Sorting configuration state
// const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

//  // Sort handler
//  const handleSort = (key) => {
//   const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
//   setSortConfig({ key, direction });
// };
//   // Example data for KPIs
//   const kpiData = {
//     week: {
//       doorsKnocked: '120',
//       appointmentsSet: '80',
//       appointmentsSat: '60',
//       appointmentsCanceled: '5',
//       appointmentsRescheduled: '10',
//       appointmentsClosed: '50',
//       graveyardLeads: [
//         { name: 'Lead 1', status: 'Didn’t Close' },
//         { name: 'Lead 2', status: 'Canceled' },
//         // More leads...
//       ],
//       // Add more KPI data for 'week'
//     },
//     // Add data for 'month' and 'year'
//   };

//   // Placeholder for the leads carousel component
//   function LeadsCarousel() {
//     return <Typography>Carousel Placeholder</Typography>;
//   }

//   const handleTimeFilterChange = (event, newValue) => {
//     setTimeFilter(newValue);
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       <Container maxWidth="xl" sx={{ mt: 4 }}>
//         <Typography variant="h4" component="div" gutterBottom>
//           Door Knocking Dashboard
//         </Typography>
//         <Divider sx={{ mb: 4 }} />

//         {/* Time filter buttons */}
//         <Box sx={{ mb: 3 }}>
//           <ButtonGroup variant="text" color="primary">
//             <Button onClick={() => setTimeFilter('week')} variant={timeFilter === 'week' ? 'contained' : 'text'}>
//               This Week
//             </Button>
//             <Button onClick={() => setTimeFilter('month')} variant={timeFilter === 'month' ? 'contained' : 'text'}>
//               This Month
//             </Button>
//             <Button onClick={() => setTimeFilter('year')} variant={timeFilter === 'year' ? 'contained' : 'text'}>
//               This Year
//             </Button>
//           </ButtonGroup>
//         </Box>

//         {/* KPI cards */}
//         <Grid container spacing={2}>
//           {Object.entries(kpiData[timeFilter] || {}).map(([key, value], index) => (
//             key !== 'graveyardLeads' && (
//               <Grid item key={index} xs={12} sm={6} md={3} lg={2}>
//                 <KpiCard title={key.split(/(?=[A-Z])/).join(" ")} value={value} />
//               </Grid>
//             )
//           ))}
//         </Grid>

//         {/* Graveyard Leads */}
//         <Box sx={{ mt: 4 }}>
//           <Typography variant="h6" gutterBottom>
//             Graveyard Leads
//           </Typography>
//           <GraveyardLeads leads={kpiData[timeFilter].graveyardLeads} />
//         </Box>

//          {/* RepCard User Rankings */}
//          <Box sx={{ mt: 4 }}>
//           <Typography variant="h6" gutterBottom>
//             RepCard User Rankings
//           </Typography>
//           <RepCardRankings repCardUsers={repCardUsers} sortConfig={sortConfig} handleSort={handleSort} />
//         </Box>
//         {/* Leads Carousel */}
//         <Box sx={{ mt: 4 }}>
//           <Typography variant="h6" gutterBottom>
//             Leads Carousel
//           </Typography>
//           <LeadsCarousel />
//           {/* Implement the carousel with a third-party library */}
//         </Box>
//       </Container>
//     </ThemeProvider>
//   );
// }

// ============================================

import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme, ThemeProvider } from '@mui/material/styles';
import { Grid, Container, Typography, Paper, ListItem, List, ListItemText, CircularProgress } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { authSelector } from '../redux/slice/authSlice';
// ... (rest of your imports)
// Import additional components
import { Tab, Tabs, Box, Button, ButtonGroup } from '@mui/material';
import { leadState } from '../redux/slice/leadSlice';
import { claimLead, getLeadsForClaim } from '../redux/middleware/lead';
import createAbortController from '../utils/createAbortController';

// ... (rest of your code)

export default function VCDashboardAppPage() {
  const { claimData, loading: claimLeadLoading } = useAppSelector(leadState);
  const dispatch = useAppDispatch();
  const { signal, abort } = createAbortController();

  // ... (existing states and functions)

  // Add the leaderboard filters and options back into the UI
  const timeFilters = ['This Week', 'This Month', 'This Year'];
  const typeFilters = ['Company', 'Office'];
  const dataTypes = ['Closing Rate', 'Agreements', 'Revenue'];

  const [leaderboardType, setLeaderboardType] = useState('revenue');
  // Leaderboard filter states
  const [timeFilter, setTimeFilter] = useState('thisWeek');
  const [officeFilter, setOfficeFilter] = useState('company');
  const [dataFilter, setDataFilter] = useState('closingRate');

  const [activeTab, setActiveTab] = useState('myLeads');
  const [taskTab, setTaskTab] = useState('toDo');

  useEffect(() => {
    (async () => {
      await getClaimableLeads();
    })();

    return () => {
      abort();
    };
  }, []);

  const getClaimableLeads = async () => {
    await dispatch(
      getLeadsForClaim({
        signal
      })
    );
  };

  // Mock data for leaderboard
  const leaderboardData = {
    thisWeek: {
      company: {
        closingRate: [
          { name: 'Alice, Enerflo', closingRate: '80%', agreements: '45', revenue: '$95.00k' }
          // ... other entries
        ],
        agreements: [
          // ... data sorted by agreements
        ],
        revenue: [
          // ... data sorted by revenue
        ]
      },
      office: {
        // ... data for the office category
      }
    },
    thisMonth: {
      // ... data for thisMonth
    },
    thisYear: {
      // ... data for thisYear
    }
  };

  // Mock data for leads, deals, and installs
  const mockData = {
    myDoors: [
      { id: 1, title: 'Danny Copinga', subtitle: '23 Dominguez St' },
      { id: 2, title: 'Steve Kawasaki', subtitle: '2430 Chapman St' }
      // ... add more leads
    ],
    myAppointments: [
      { id: 1, title: 'Sunshine Solar', subtitle: 'Completed: 15' },
      { id: 2, title: 'Enerflo Power', subtitle: 'Pending: 7' }
      // ... add more deals
    ],
    myCloses: [
      { id: 1, title: 'Rooftop Install', subtitle: '2430 Chapman St' },
      { id: 2, title: 'Panel Upgrade', subtitle: '1985 Toucan Cir' }
      // ... add more installs
    ],
    myInstalls: [
      { id: 1, title: 'Door: Sets', subtitle: '43/72', percentage: '50%' },
      { id: 2, title: 'Sets: Sits', subtitle: '43/72', percentage: '50%' },
      { id: 2, title: 'Sits: Close', subtitle: '43/72', percentage: '50%' },
      { id: 2, title: 'Sits: Close', subtitle: '43/72', percentage: '50%' }
      // ... add more installs
    ]
  };

  const tasks = {
    toDo: [
      { title: 'Follow up with lead', completed: false }
      // ... add more to-do tasks
    ],
    recentlyCompleted: [
      { title: 'Send proposal to client', completed: true }
      // ... add more completed tasks
    ]
  };

  // Function to simulate filtered data based on selected filters
  const getFilteredLeaderboardData = () => {
    const timeData = leaderboardData[timeFilter] || {};
    const officeData = timeData[officeFilter] || {};
    const filteredData = officeData[dataFilter] || [];

    return filteredData;
  };

  const getFilteredData = (dataKey) => {
    // Check if the dataKey exists in mockData
    const data = mockData[dataKey];
    if (!data) {
      return <Typography>No data available.</Typography>;
    }

    return data.map((item) => (
      <ListItem key={item.id}>
        <ListItemText primary={item.title} secondary={item.subtitle} />
      </ListItem>
    ));
  };

  return (
    <>
      <Helmet>
        <title>Dashboard | Voltaic</title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3}>
          {/* Sidebar - Leaderboards */}
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, height: '100%' }}>
              {/* Time Filters */}
              <ButtonGroup variant="contained" fullWidth>
                <Button onClick={() => setTimeFilter('thisWeek')} variant={timeFilter === 'thisWeek' ? 'contained' : 'outlined'}>
                  This Week
                </Button>
                <Button onClick={() => setTimeFilter('thisMonth')} variant={timeFilter === 'thisMonth' ? 'contained' : 'outlined'}>
                  This Month
                </Button>
                <Button onClick={() => setTimeFilter('thisYear')} variant={timeFilter === 'thisYear' ? 'contained' : 'outlined'}>
                  This Year
                </Button>
              </ButtonGroup>
              {/* Office Filter */}
              <ButtonGroup variant="contained" fullWidth sx={{ my: 1 }}>
                <Button onClick={() => setOfficeFilter('company')} variant={officeFilter === 'company' ? 'contained' : 'outlined'}>
                  Company
                </Button>
                <Button onClick={() => setOfficeFilter('office')} variant={officeFilter === 'office' ? 'contained' : 'outlined'}>
                  Office
                </Button>
              </ButtonGroup>
              {/* Data Filters */}
              <ButtonGroup variant="contained" fullWidth>
                <Button onClick={() => setDataFilter('closingRate')} variant={dataFilter === 'closingRate' ? 'contained' : 'outlined'}>
                  Closing Rate
                </Button>
                <Button onClick={() => setDataFilter('agreements')} variant={dataFilter === 'agreements' ? 'contained' : 'outlined'}>
                  Agreements
                </Button>
                <Button onClick={() => setDataFilter('revenue')} variant={dataFilter === 'revenue' ? 'contained' : 'outlined'}>
                  Revenue
                </Button>
              </ButtonGroup>

              <List sx={{ mt: 2 }}>
                {getFilteredLeaderboardData().map((data, index) => (
                  <ListItem key={index} divider>
                    <ListItemText
                      primary={data.name}
                      secondary={`Closing Rate: ${data.closingRate}, Agreements: ${data.agreements}, Revenue: ${data.revenue}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Main Content - Leads, Deals, Installs, and Map */}
          <Grid item xs={12} md={6} container spacing={3} direction="column" sx={{ height: 'calc(100vh - 64px)' }}>
            {/* Tabs for Leads, Deals, Installs */}
            <Grid item>
              <Paper sx={{ p: 2 }}>
                <Tabs value={activeTab} onChange={(event, newValue) => setActiveTab(newValue)} variant="fullWidth">
                  <Tab label="Doors knocked" value="myDoors" />
                  <Tab label="Graveyard leads" value="myAppointments" />
                  <Tab label="Conversion Rates" value="myInstalls" />
                </Tabs>
                <List>{getFilteredData(activeTab)}</List>
              </Paper>
            </Grid>

            {/* Map */}
            <Grid item xs>
              <Paper
                sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
              >
                <Typography variant="h5" gutterBottom>
                  Map goes here
                </Typography>
                {/* Insert map component or iframe here */}
              </Paper>
            </Grid>
          </Grid>

          {/* Right Sidebar - Appointments & Tasks */}
          <Grid item xs={12} md={3}>
            <Paper sx={{ height: '40%' }}>
              <Typography variant="h5" px={2} pt={2} gutterBottom>
                Appointments
              </Typography>
              <List style={{ height: '80%', overflowY: 'scroll' }}>
                {claimLeadLoading && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress size={20} />
                  </Box>
                )}
                {/* {!claimData.length && <Typography sx={{ p: 2 }}>No lead is available for claim </Typography>} */}
                {claimData.map((item, index) => (
                  <ListItem key={index} divider>
                    <ListItemText
                      sx={{ textTransform: 'capitalize' }}
                      primary={item.source || ''}
                      secondary={`${item.firstName || ''} ${item.lastName || ''}` || ''}
                    />
                    <Button
                      variant="outlined"
                      onClick={async () => {
                        await dispatch(claimLead({ id: item._id }));
                        await getClaimableLeads();
                      }}
                    >
                      Claim
                    </Button>
                  </ListItem>
                )) || 'No lead is available for claim'}
              </List>
            </Paper>
            <Paper sx={{ p: 2, mt: 3, height: '60%' }}>
              <Typography variant="h5" gutterBottom>
                Tasks
              </Typography>
              <Tabs value={taskTab} onChange={(event, newValue) => setTaskTab(newValue)} variant="fullWidth">
                <Tab label="To Do" value="toDo" />
                <Tab label="Recently Completed" value="recentlyCompleted" />
              </Tabs>
              <List>
                {tasks[taskTab] ? (
                  tasks[taskTab].map((task, index) => (
                    <ListItem key={index} divider>
                      <ListItemText primary={task.title} />
                    </ListItem>
                  ))
                ) : (
                  <Typography>No tasks available.</Typography>
                )}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
