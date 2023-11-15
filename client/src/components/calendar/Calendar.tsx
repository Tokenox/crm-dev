import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar.scss';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Button } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import SmsIcon from '@mui/icons-material/Sms';
import HistoryIcon from '@mui/icons-material/History';
import CampaignIcon from '@mui/icons-material/Campaign';
import CustomModal from '../modals/CustomModal';
import PlannerForm from '../planner-form/PlannerForm';
import dayjs, { Dayjs } from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { createPlanner, getPlanners } from '../../redux/middleware/planner';
import { setAlert } from '../../redux/slice/alertSlice';
import { plannerSelector } from '../../redux/slice/plannerSlice';
import createAbortController from '../../utils/createAbortController';

interface CalendarProps {
  value: string;
  getActionData: (value: string, name: string) => void;
}

export type PlannerState = {
  title: string;
  description: string;
  action: string;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  timeOfExecution: Dayjs | null;
};

const initialState: PlannerState = {
  title: '',
  description: '',
  action: 'email',
  startDate: dayjs(new Date()),
  endDate: dayjs(new Date()),
  timeOfExecution: dayjs(new Date())
};

const localizer = momentLocalizer(moment);

const events = [
  {
    title: 'Event 1',
    start: new Date(2023, 10, 15, 10, 0), // Year, Month (0-indexed), Day, Hour, Minute
    end: new Date(2023, 10, 15, 12, 0)
  }
];

const MyCalendar = ({ value, getActionData }: CalendarProps) => {
  const dispatch = useAppDispatch();
  const { data: plannerData, events } = useAppSelector(plannerSelector);
  const { signal, abort } = createAbortController();

  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  // const [myEvents, setEvents] = useState(events);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [addFormValues, setAddFormValues] = React.useState<PlannerState>(initialState);
  const [error, setError] = React.useState<{ title: string; description: string }>({
    title: '',
    description: ''
  });

  useEffect(() => {
    (async () => {
      await dispatch(getPlanners({ signal }));
    })();

    return () => {
      abort();
    };
  }, []);

  console.log('plannerData----------------------', plannerData ,events);

  const { defaultDate, scrollToTime } = useMemo(
    () => ({
      defaultDate: new Date(),
      scrollToTime: new Date(1970, 1, 1, 6)
    }),
    []
  );
  const handleSelectSlot = useCallback(({ start, end, box, nativeEvent }) => {
    const boundingBox = box || nativeEvent.target.getBoundingClientRect();
    setSelectedSlot({ start, end, boundingBox });
    setDropdownVisible(true);
    setAddFormValues({ ...addFormValues, startDate: dayjs(start), endDate: dayjs(end) });
  }, []);

  const handleSelectEvent = useCallback((event) => window.alert(event.title), []);

  const closeDropdown = () => {
    // Close the dropdown
    setDropdownVisible(false);
  };

  const handleDropdownAction = (value) => {
    // Handle the action when an item in the dropdown is selected
    // For example, you can perform some action and then close the dropdown
    console.log('Dropdown action performed', value);
    setIsModalOpen(true);
    closeDropdown();
  };

  //! submit planner form
  const submitPlan = async () => {
    if (!addFormValues.title || !addFormValues.description) {
      setError({ title: 'Please enter title', description: 'Please enter description' });
      return;
    }
    const data = {
      title: addFormValues.title,
      description: addFormValues.description,
      action: addFormValues.action,
      startDate: addFormValues.startDate.toString(),
      endDate: addFormValues.endDate.toString(),
      timeOfExecution: addFormValues.timeOfExecution.toString()
    };
    const response: any = await dispatch(createPlanner({ planner: data }));
    if (response && response.error && response.error.message) {
      dispatch(setAlert({ message: response.error.message, type: 'error' }));
      return;
    }
    if (response && response.payload) {
      dispatch(setAlert({ message: 'Planner created successfully', type: 'success' }));
      setIsModalOpen(false);
      await dispatch(getPlanners({ signal }));
    }
  };

  //! Dropdown
  const renderDropdown = () => {
    if (!selectedSlot || !selectedSlot.boundingBox) {
      return null;
    }

    const { x, y } = selectedSlot.boundingBox;
    const dropdownStyle: React.CSSProperties = {
      position: 'absolute',
      top: y,
      left: x,
      backgroundColor: 'white',
      boxShadow: '0 0 5px 0 rgba(0, 0, 0, 0.2)',
      padding: '10px',
      borderRadius: '5px',
      zIndex: 4
    };
    const itemStyle: React.CSSProperties = {
      fontWeight: 700,
      fontSize: '14px',
      fontFamily: 'math'
    };

    const getIcon = (value) => {
      switch (value) {
        case 'email':
          return <EmailIcon fontSize={'small'} htmlColor="#676666" />;
        case 'post':
          return <SmsIcon fontSize={'small'} htmlColor="#bdbdbd" />;
        case 'story':
          return <HistoryIcon fontSize={'small'} htmlColor="#bdbdbd" />;
        case 'ad':
          return <CampaignIcon fontSize={'small'} htmlColor="#bdbdbd" />;
        default:
          return null;
      }
    };

    return (
      <div style={dropdownStyle}>
        {ACTIONS.map((action: ActionTypes) => (
          <div
            style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
              padding: '4px 0',
              cursor: action.value === 'email' ? 'pointer' : 'no-drop'
            }}
            onClick={() => {
              action.value === 'email' && handleDropdownAction(action.value);
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>{getIcon(action.value)}</div>
            <div
              style={{
                ...itemStyle,
                color: action.value === 'email' ? '#676666' : '#bdbdbd',
                marginTop: '2px'
              }}
            >
              {action.name}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Box>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" onClick={() => setIsModalOpen(true)}>
          Add Event
        </Button>
      </Box>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultDate={defaultDate}
        defaultView={Views.MONTH}
        style={{ height: 500 }}
        selectable={true}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        scrollToTime={scrollToTime}
      />
      {dropdownVisible && renderDropdown()}
      <CustomModal title="Add Event" open={isModalOpen} setOpen={setIsModalOpen} handleSubmit={submitPlan}>
        <PlannerForm
          state={addFormValues}
          getFormData={({ name, value }) => {
            setAddFormValues({ ...addFormValues, [name]: value });
            if (name === 'title' && value) setError({ ...error, title: '' });
            if (name === 'description' && value) setError({ ...error, description: '' });
          }}
          error={error}
        />
      </CustomModal>
    </Box>
  );
};

export default MyCalendar;

type ActionTypes = {
  id: number;
  name: string;
  value: string;
};

const ACTIONS: ActionTypes[] = [
  {
    id: 1,
    name: 'Schedule Email',
    value: 'email'
  },
  {
    id: 2,
    name: 'Schedule Post',
    value: 'post'
  },
  {
    id: 3,
    name: 'Schedule Story',
    value: 'story'
  },
  {
    id: 4,
    name: 'Schedule Ad',
    value: 'ad'
  }
];
