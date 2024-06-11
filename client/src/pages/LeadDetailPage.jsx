import React, { useState, useEffect } from 'react';
import {
  Grid,
  Dialog,
  Button,
  IconButton,
  TextField,
  Autocomplete,
  Box,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Avatar,
  Tooltip,
  Zoom,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { useParams } from 'react-router-dom';

import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';

import { styled } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditNoteIcon from '@mui/icons-material/EditNote';

// Import Timeline components if they are from MUI
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineConnector from '@mui/lab/TimelineConnector';

import { useAppSelector } from '../hooks/hooks';
import { authSelector } from '../redux/slice/authSlice';
import { baseURL } from '../libs/client/apiClient';

// Import any other necessary local components like StyledAccount, Card, etc.

const LeadDetailPage = () => {
  const steps = [
    'New Sale',
    'Welcome Call',
    'Site Survey',
    'Site Survey',
    'NTP',
    'QC check',
    'Plans',
    'FLA',
    'Solar Permit',
    'Solar Install',
    ' Final Inspection',
    'PTO',
    'Complete'
  ];

  // User redux object
  //update prod
  const { Projectdata } = useAppSelector(authSelector);
  const recordId = Projectdata?.recordID;

  const { id } = useParams();

  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [dealsError, setDealsError] = useState(null);

  // Sample hardcoded call data
  const sampleCalls = [
    { id: 1, type: 'call', body: 'Note', createdAt: new Date().toString() }
    // ... (more sample calls)
  ];
  const sampleNotes = [
    { id: 1, type: 'note', text: 'Note', createdAt: new Date().toString() }
    // ... (more sample calls)
  ];
  const sampleMessages = [
    { id: 1, type: 'message', text: 'Test Account needs to have John Symons set as leadgen. Thanks.', createdAt: new Date().toString() },

    {
      id: 2,
      type: 'message',
      text: 'Welcome call was a bit rough. Could not get a hold of the homeowner.',
      createdAt: new Date().toString()
    },

    {
      id: 3,
      type: 'message',
      text: 'Hello Team New Sunnova deal has been processed. Dom please add John Symons as the lead gen here. Thank you! NTP Submitted. Site Survey scheduled on Thursday, 11/9 at 12 Nn. Welcome Call was completed by Lisa. Welcome email was sent. VC Email Beryl Loughlin',
      createdAt: new Date().toString()
    }
    // ... (more sample calls)
  ];

  const hardcodedData = {
    lead: {
      homeownerName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '123-456-7890',
      address: '123 Main st',
      description: 'Description here...',
      categoriesList: ['Category 1', 'Category 2'],
      tagsList: ['Tag 1', 'Tag 2']
    },
    calls: [], // Add actual call data here
    emails: [], // Add actual email data here
    texts: [], // Add actual text data here
    notes: [], // Add actual notes data here
    voiceCalls: [], // Add actual voice call data here
    taskTypes: [] // Add actual task type data here
  };

  const [homeownerData, setHomeownerData] = useState(null);
  const [stage, setStage] = useState(null);
  const [phoneData, setPhoneData] = useState(null);
  const [emailData, setEmailData] = useState(null);
  const [addressData, setAddressData] = useState(null);
  const [messageData, setMessageData] = useState([]);
  const [addersData, setAddersData] = useState([]);

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  //details

  useEffect(() => {
    fetch(`${baseURL}/crmDeal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ recordId: id ? id : '3613' })
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log('API Response:', responseData); // Log the API response
        if (responseData.success && responseData.data) {
          // Assuming homeowner data is present in the response
          const homeownerInfo = responseData.data.homeownerName ? responseData.data.homeownerName.replace(/^"|"$/g, '') : 'Loading...';
          // const homeownerInfo = responseData.data.homeownerName ? responseData.data.homeownerName.replace(/^"|"$/g, '') : 'Loading...';
          const phoneInfo = responseData.data.saleDate ? responseData.data.saleDate.replace(/^"|"$/g, '') : 'Loading...';
          const stage = responseData.data.stage ? responseData.data.stage.replace(/^"|"$/g, '') : 'Loading...';
          const emailInfo = responseData.data.email ? responseData.data.email.replace(/^"|"$/g, '') : 'Loading...';
          const addressInfo = responseData.data.address ? responseData.data.address.replace(/^"|"$/g, '') : 'Loading...';

          const messageInfo = responseData.data.vcmessages ? responseData.data.vcmessages : [];

          const messagesArray = messageInfo.map((message) => ({
            id: message.id,
            from: message.from,
            type: 'message',
            text: message.text,
            createdAt: new Date(message.createdAt).toString()
          }));

          const addersInfo = responseData.data.vcadders ? responseData.data.vcadders : [];

          const addersArray = addersInfo.map((adder) => ({
            id: adder.relatedProject,
            description: adder.description.replace(/^"|"$/g, ''),
            type: 'call',
            quantity: adder.quantity,
            price: truncateDecimals(parseFloat(adder.price), 2),
            status: adder.status.replace(/^"|"$/g, ''),
            billTo: adder.billTo
          }));

          if (stage != null) {
            switch (stage) {
              case 'New Sale':
                // code for value1
                setActiveStep(1);
                break;
              case 'Welcome Call':
                // code for value2
                setActiveStep(2);
                break;
              case 'Site Survey':
                // code for value2
                setActiveStep(3);
                break;
              case 'NTP':
                setActiveStep(4);
                // code for value2
                break;

              case 'QC check':
                setActiveStep(5);
                // code for value2
                break;

              case 'Plans':
                setActiveStep(6);
                // code for value2
                break;

              case 'FLA':
                setActiveStep(7);
                // code for value2
                break;
              case 'Solar Permit':
                setActiveStep(8);
                // code for value2
                break;
              case 'Solar Install':
                setActiveStep(9);
                // code for value2
                break;

              case 'Final Inspection':
                setActiveStep(10);
                // code for value2
                break;

              case 'PTO':
                setActiveStep(11);
                // code for value2
                break;

              case 'Complete':
                setActiveStep(12);
                // code for value2
                break;
              // add more cases as needed
              default:
              // code to be executed if none of the cases match
            }
          }

          setAddersData(addersArray);
          setMessageData(messagesArray);

          setHomeownerData(String(homeownerInfo));
          setPhoneData(phoneInfo);
          setEmailData(emailInfo);
          setAddressData(addressInfo);

          console.log('homeowner name', homeownerInfo);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('API Error:', error); // Log API error
        setDealsError(error);
        setLoading(false);
      });
  }, [id]);

  function truncateDecimals(number, decimalPlaces) {
    const multiplier = Math.pow(10, decimalPlaces);
    return Math.floor(number * multiplier) / multiplier;
  }

  // State for UI control
  const [description, setDescription] = useState(hardcodedData.lead.description);
  const [open, setOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isMessageModal, setIsMessageModal] = useState(false);
  const [confirmCall, setConfirmCall] = useState(false);
  const [singleNoteModal, setSingleNoteModal] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [typeData, setTypeData] = useState(hardcodedData.taskTypes);
  const [addType, setAddType] = useState(false);
  const [type, setType] = useState('');
  const [formData, setFormData] = useState({
    contactId: '',
    firstName: '',
    lastName: '',
    notes: '',
    buyerAgent: '',
    listingAgent: ''
  });
  const [value, setValue] = useState({
    title: '',
    note: '',
    date: ''
  });

  // Handlers for UI interactions
  const handleClose = () => setOpen(false);
  const getSelected = (item) => {
    setSelectedItem(item);
    setOpen(true);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setValue({ ...value, [name]: value });
  };

  // Placeholder functions for actions
  const handleCall = () => console.log('Simulate call action');
  const handleInputChange = (e) => setDescription(e.target.value);
  const handleSubmit = () => console.log('Simulate submit action');

  return (
    <Grid container spacing={2} sx={{ overflow: 'hidden', padding: 2 }}>
      {/* isMessageModal Dialog */}
      {/* ... */}
      {/* Confirm Call Dialog */}
      {/* ... */}
      {/* Task Dialog */}
      {/* ... */}
      {/* Single Note Dialog */}
      {/* ... */}
      {/* Email Dialog */}
      {/* ... */}

      {/* Profile and general project details */}
      {/* Main Content Grid */}
      <Grid container spacing={2}>
        {/* Top-left Paper Box */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, margin: 2, backgroundColor: 'none' }}>
            <Typography variant="h6" gutterBottom>
              Homeowner Details
            </Typography>
            <List>
              <ListItem>
                <PersonIcon color="primary" />
                <ListItemText primary={homeownerData !== null ? homeownerData : 'Loading...'} secondary="Homeowner Name" />
              </ListItem>
              <ListItem>
                <PersonIcon color="primary" />
                <ListItemText primary={addressData !== null ? addressData : 'Loading...'} secondary="Address " />
              </ListItem>
              <ListItem>
                <EmailIcon color="primary" />
                <ListItemText primary={emailData !== null ? emailData : 'Loading...'} secondary="Email" />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Left side: Horizontal Stepper */}
        <Grid item xs={12} md={8}>
          <div
            style={{ minHeight: '100px', maxHeight: '400px', overflowY: 'auto', scrollbarWidth: 'thin', WebkitOverflowScrolling: 'touch' }}
          >
            <Stepper activeStep={activeStep}>
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </div>

          <Grid sx={{ p: 2, backgroundColor: 'none' }} container direction="column" spacing={2}>
            {/* Adders */}
            <Grid item>
              <h4>Adders</h4>
              {addersData !== null ? (
                addersData.map((adder) => (
                  <AddersCard key={adder.id} data={adder} text={adder.text} getItem={getSelected} type={adder.type} />
                ))
              ) : (
                <p>Loading...</p>
              )}
            </Grid>

            {/* Messages */}
            <Grid item>
              <h4>Messages</h4>
              {messageData !== null ? (
                messageData.map((msg) => (
                  <Card key={msg.id} data={msg} text={msg.text} from={msg.from} getItem={getSelected} type={msg.type} />
                ))
              ) : (
                <p>Loading...</p>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default LeadDetailPage;

const AddersCard = ({ data, getItem, type, leadName }) => {
  return (
    <Box sx={{ boxShadow: '0px 0px 10px #e3e3e3', marginTop: '16px', padding: '16px', cursor: 'pointer' }} onClick={() => getItem(data)}>
      <Box sx={{ display: 'flex', gap: '8px' }}>
        <TimelineSeparator>
          <TimelineDot
            sx={{ margin: '6px 0' }}
            color={
              // disable eslint
              // eslint-disable-next-line no-nested-ternary
              type === 'note' ? 'primary' : type === 'call' ? 'success' : type === 'note' ? 'info' : type === 'message' ? 'secondary' : ''
            }
          />
          <TimelineConnector />
        </TimelineSeparator>
        <Box>
          <Typography variant="subtitle2">{data?.description || ' '}</Typography>
          <Box display="flex" flexDirection="column">
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {/* {data?.note || data?.message || data?.text || data?.description} */}
              Status: {data?.status && data.status.length > 500 ? data.status.slice(0, 40) + '...' : data.status}
              {/* {data?.createdAt ? fDateTime(new Date(1685299278395).getTime()) : fDateTime(new Date().getTime())} */}
            </Typography>

            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {/* {data?.note || data?.message || data?.text || data?.description} */}
              Price: $ {data?.price && data.price}
              {/* {data?.createdAt ? fDateTime(new Date(1685299278395).getTime()) : fDateTime(new Date().getTime())} */}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const Card = ({ data, getItem, type, leadName, from }) => {
  return (
    <Box sx={{ boxShadow: '0px 0px 10px #e3e3e3', marginTop: '16px', padding: '16px', cursor: 'pointer' }} onClick={() => getItem(data)}>
      <Box sx={{ display: 'flex', gap: '8px' }}>
        <TimelineSeparator>
          <TimelineDot
            sx={{ margin: '6px 0' }}
            color={
              // disable eslint
              // eslint-disable-next-line no-nested-ternary
              type === 'note' ? 'primary' : type === 'call' ? 'success' : type === 'note' ? 'info' : type === 'message' ? 'secondary' : ''
            }
          />
          <TimelineConnector />
        </TimelineSeparator>
        <Box>
          <Typography variant="subtitle2">{data?.FirstName || leadName}</Typography>
          <Box display="flex" flexDirection="column">
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {/* {data?.note || data?.message || data?.text || data?.description} */}
              From: {data?.from && data.from.length > 500 ? data.from.slice(0, 40) + '...' : data.from}
              {/* {data?.createdAt ? fDateTime(new Date(1685299278395).getTime()) : fDateTime(new Date().getTime())} */}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {/* {data?.note || data?.message || data?.text || data?.description} */}
              {data?.text && data.text.length > 500 ? data.text.slice(0, 40) + '...' : data.text}
              {/* {data?.createdAt ? fDateTime(new Date(1685299278395).getTime()) : fDateTime(new Date().getTime())} */}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {/* {data?.note || data?.message || data?.text || data?.description} */}
              {data?.createdAt && data.createdAt}
              {/* {data?.createdAt ? fDateTime(new Date(1685299278395).getTime()) : fDateTime(new Date().getTime())} */}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const StyledAccount = styled('div')(({ theme }) => ({
  marginLeft: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  border: '1px solid #e3e3e3',
  gap: theme.spacing(1.5),
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12)
}));
const StyledTextArea = styled('div')(({ theme }) => ({
  marginLeft: theme.spacing(2),
  width: '100%',
  height: '150px',
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12)
}));

const StyledInformation = styled('div')(({ theme }) => ({
  marginLeft: theme.spacing(2),
  display: 'flex',
  flexGrow: '1',
  maxHeight: '770px',
  overflowY: 'scroll',
  gap: theme.spacing(1.5),
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12)
}));

const WrapSelectable = styled('div')(({ theme }) => ({
  marginLeft: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  // justifyContent: 'space-between',
  border: '1px solid #e3e3e3',
  gap: theme.spacing(1.5),
  padding: theme.spacing(2, 2.5),
  width: '100%',
  height: '150px',
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12)
}));
