import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { authSelector } from '../redux/slice/authSlice';

// components
import Iconify from '../components/iconify';
// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates
} from '../sections/@dashboard/app';
import { baseURL } from '../libs/client/apiClient';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const theme = useTheme();
  const data = useAppSelector(authSelector);

  const [AHJTimelineData, setData] = useState([]);

  const [DealsData, setDealsData] = useState([]);

  const [DealsAvgTimelineData, setDealsAvgData] = useState([]);

  const [AhjKeys, setAhjKeys] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [payError, setPayError] = useState(null);

  const fetchAhjTimelineData = async () => {
    try {
      const response = await fetch(`${baseURL}/crmAHJTimelines`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ repId: '00000' })
      });

      const responseData = await response.json();

      if (responseData && responseData.data && responseData.data.timeline) {
        const formattedArray = responseData.data.timeline.map((item) => ({
          name: item.AHJ.replace(/"/g, ''),
          data: [
            parseFloat(item.saleStage) || 0,
            parseFloat(item.welcometage) || 0,
            parseFloat(item.sstage) || 0,
            parseFloat(item.ntpstage) || 0,
            parseFloat(item.qcStage) || 0,
            parseFloat(item.planStage) || 0,
            parseFloat(item.flatage) || 0,
            parseFloat(item.permitStage) || 0,
            parseFloat(item.installStage) || 0,
            parseFloat(item.inspectStage) || 0
          ]
        }));

        setData(formattedArray);
      }

      setLoading(false);
    } catch (error) {
      setPayError(error);
      setLoading(false);
    }
  };

  const fetchDealsData = async () => {
    try {
      const response = await fetch(`${baseURL}/crmDealsGlobal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ recordId: '7777' })
      });

      const responseData = await response.json();

      if (responseData && responseData.data && responseData.data.deals) {
        const financingTypes = ['Sunnova', 'Enium', 'Cash'];

        // Initialize data structure
        const monthlyData = financingTypes.map((financingType) => ({
          name: financingType,
          type: 'column', // Change the type as needed
          fill: 'solid', // Change the fill as needed
          data: Array(12).fill(0) // Initialize an array for each month
        }));

        responseData.data.deals.forEach((item) => {
          const saleDate = new Date(item.saleDate);
          const month = saleDate.getMonth();
          const year = saleDate.getFullYear();

          console.log(year);
          /// alert("year")
          const financingType = item.financing.replace(/"/g, ''); // Remove double quotes

          const index = financingTypes.indexOf(financingType);
          if (index !== -1) {
            monthlyData[index].data[month] += 1;
          }
        });

        const chartData = monthlyData.map((item) => ({
          name: item.name,
          type: item.type,
          fill: item.fill,
          data: item.data
        }));

        console.log(chartData);
        setDealsData(chartData);
      }

      setLoading(false);
    } catch (error) {
      setPayError(error);
      setLoading(false);
    }
  };

  const fetchDealsAvgData = async () => {
    try {
      const response = await fetch(`${baseURL}/crmAvgTimelines`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ repId: '7777' })
      });

      const responseData = await response.json();

      if (responseData && responseData.data && responseData.data.timeline) {
        const timeline = responseData.data.timeline;

        const chartData = Object.entries(timeline).map(([label, value]) => ({
          label,
          value: parseFloat(value) || 0
        }));

        console.log(chartData);
        setDealsAvgData(chartData);
      }

      setLoading(false);
    } catch (error) {
      setPayError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAhjTimelineData();
    fetchDealsData();
    fetchDealsAvgData();
  }, []);

  return (
    <>
      <Helmet>
        <title> Dashboard | Voltaic </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Weekly Sales" total={2} icon={'ant-design:home-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="New Leads" total={14} color="info" icon={'ant-design:profile-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Tasks" total={4} color="warning" icon={'ant-design:profile-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Messages" total={234} color="error" icon={'ant-design:profile-filled'} />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Installs Month to Month"
              subheader="(+43%) than last year"
              chartLabels={[
                '01/01/2023',
                '02/01/2023',
                '03/01/2023',
                '04/01/2023',
                '05/01/2023',
                '06/01/2023',
                '07/01/2023',
                '08/01/2023',
                '09/01/2023',
                '10/01/2023',
                '11/01/2023',
                '12/01/2023'
              ]}
              chartData={DealsData}
              // chartData={
              //   [
              //   {
              //     name: 'Sunnova',
              //     type: 'column',
              //     fill: 'solid',
              //     data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
              //   },
              //   {
              //     name: 'Enium',
              //     type: 'area',
              //     fill: 'gradient',
              //     data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
              //   },
              //   {
              //     name: 'Cash',
              //     type: 'line',
              //     fill: 'solid',
              //     data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
              //   },
              // ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Avg Stage Duration"
              chartData={DealsAvgTimelineData}
              // chartData={[
              //   { label: 'America', value: 4344 },
              //   { label: 'Asia', value: 5435 },
              //   { label: 'Europe', value: 1443 },
              //   { label: 'Africa', value: 4443 },
              // ]}
              chartColors={[theme.palette.primary.main, theme.palette.info.main, theme.palette.warning.main, theme.palette.error.main]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates
              title="Projects by county"
              subheader="(+43%) than last year"
              // chartData={AHJTimelineData}
              chartData={[
                { label: 'San Diego County', value: 400 },
                { label: 'Orange County', value: 430 },
                { label: 'Riverside County', value: 448 },
                { label: 'San Bernardino County', value: 470 },
                { label: 'Imperial County', value: 540 },
                { label: 'Los Angeles County', value: 580 },
                { label: 'Ventura County', value: 690 },
                { label: 'Santa Barbara County', value: 1100 },
                { label: 'Kern County', value: 1200 },
                { label: 'San Luis Obispo County', value: 1380 }
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject
              title="Stage duration by AHJ "
              chartLabels={['Sale Date', 'Welcome', 'Site Survey', 'NTP', 'QC Check', 'FLA', 'Plans', 'Install', 'Inspection', 'PTO']}
              chartData={AHJTimelineData}
              // chartData={[
              //   { name: 'Los Angeles', data: [1, 5, 3, 4, 10, 20] },
              //   { name: 'Listing and marketing', data: [2, 3, 4, 8, 28, 20] },
              //   { name: 'Closing and follow-up', data: [1, 5, 7, 3, 45, 17] },
              // ]}
              chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
            />
          </Grid>

          {/* <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate
              title="Messages"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: faker.name.findName(),
                description: faker.phone.phoneNumberFormat(),
                image: `/assets/images/covers/cover_${index + 1}.jpg`,
                postedAt: faker.date.recent(),
              }))}
            />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="Hot Lead of the day"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: [
                  'Potential Lead',
                  'Qualified Lead',
                  'Scored Lead',
                  'Categorized Lead',
                  'Active Lead',
                ][index],
                type: `order${index + 1}`,
                time: faker.date.past(),
              }))}
            />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite
              title="Traffic by Site"
              list={[
                {
                  name: 'FaceBook',
                  value: 323234,
                  icon: <Iconify icon={'eva:facebook-fill'} color="#1877F2" width={32} />,
                },
                {
                  name: 'Google',
                  value: 341212,
                  icon: <Iconify icon={'eva:google-fill'} color="#DF3E30" width={32} />,
                },
                {
                  name: 'Linkedin',
                  value: 411213,
                  icon: <Iconify icon={'eva:linkedin-fill'} color="#006097" width={32} />,
                },
                {
                  name: 'Twitter',
                  value: 443232,
                  icon: <Iconify icon={'eva:twitter-fill'} color="#1C9CEA" width={32} />,
                },
              ]}
            />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={8}>
            <AppTasks
              title="Tasks"
              list={[
                { id: '1', label: 'Follow up with Lead #1233' },
                { id: '2', label: 'Call Lead #1233' },
                { id: '3', label: 'Show Lead #1233 Property #346' },
                { id: '4', label: 'Backlog Lead #4' },
                { id: '5', label: 'Set Up Meeting' },
              ]}
            />
          </Grid> */}
        </Grid>
      </Container>
    </>
  );
}
