import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar.scss';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Button, CircularProgress, DialogTitle } from '@mui/material';
import CustomModal from '../modals/CustomModal';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import createAbortController from '../../utils/createAbortController';
import { availabilityLoading, availabilitySelector } from '../../redux/slice/availabilitySlice';
import { createAvailability, deleteAvailability, getAvailability } from '../../redux/middleware/availability';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export type AvailabilityPlanState = {
  startDate: string;
  endDate: string;
};

const initialState: AvailabilityPlanState = {
  startDate: '',
  endDate: ''
};

const localizer = momentLocalizer(moment);

const AvailabilityCalender = () => {
  const dispatch = useAppDispatch();
  const { data: availability, events } = useAppSelector(availabilitySelector);
  const loading = useAppSelector(availabilityLoading);
  const { signal, abort } = createAbortController();
  const [addFormValues, setAddFormValues] = React.useState<AvailabilityPlanState>(initialState);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEventOpen, setIsEventOpen] = useState<boolean>(false);
  const [eventId, setEventId] = useState<string>('');
  const [error, setError] = React.useState<{ title: string; description: string }>({
    title: '',
    description: ''
  });

  useEffect(() => {
    (async () => {
      await dispatch(getAvailability({ signal }));
    })();

    return () => {
      abort();
    };
  }, []);

  const { defaultDate } = useMemo(
    () => ({
      defaultDate: new Date()
    }),
    []
  );

  const handleClose = () => {
    setIsModalOpen(false);
    setIsEventOpen(false);
  };
  const handleSelectedSlot = useCallback(({ start, end }) => {
    setIsModalOpen(true);
    setAddFormValues({ ...addFormValues, startDate: start, endDate: end });
  }, []);

  const deleteAvailabilitySlot = async (eventId) => {
    await dispatch(deleteAvailability({ id: eventId }));
    setIsEventOpen(false);
    await dispatch(getAvailability({ signal }));
  };

  const handleSelectedEvent = useCallback((event) => {
    setAddFormValues({
      ...addFormValues,
      startDate: event.start,
      endDate: event.end
    });
    setEventId(event.id);
    setIsEventOpen(true);
  }, []);

  //! submit planner form
  const submitAvailability = async () => {
    const data = {
      startDate: addFormValues.startDate.toString(),
      endDate: addFormValues.endDate.toString()
    };
    await dispatch(createAvailability({ availability: data }));
    await dispatch(getAvailability({ signal }));
    setIsModalOpen(false);
  };

  const eventPropGetter = useCallback(
    (event) => ({
      ...(event && {
        style: {
          backgroundColor: '#DCDCDC',
          color: '#000'
        }
      })
    }),
    []
  );

  const slotGroupPropGetter = useCallback(
    () => ({
      style: {
        minHeight: 60
      }
    }),
    []
  );

  return (
    <Box>
      <Calendar
        localizer={localizer}
        events={events}
        timeslots={2}
        startAccessor="start"
        endAccessor="end"
        defaultDate={defaultDate}
        views={['week']}
        defaultView={Views.WEEK}
        style={{ height: 500 }}
        dayLayoutAlgorithm="no-overlap"
        selectable={true}
        eventPropGetter={eventPropGetter}
        slotGroupPropGetter={slotGroupPropGetter}
        onSelectEvent={(event) => handleSelectedEvent(event)}
        onSelectSlot={(slotInfo) => handleSelectedSlot(slotInfo)}
      />

      <CustomModal open={isModalOpen} setOpen={setIsModalOpen} size="xs">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyItems: 'center',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <InfoOutlinedIcon sx={{ fontSize: '50px', color: '#f3ab65' }} />
          <p>Are you sure to mark this Time Slot as Unavailable?</p>
          <Box
            sx={{
              display: 'flex',
              gap: '30px',
              justifyItems: 'center',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Button
              sx={{
                color: '#ffffff',
                backgroundColor: '#C04000',
                '&:hover': {
                  color: '#C04000'
                },
                borderRadius: '6px',
                paddingX: '24px'
              }}
              onClick={handleClose}
              autoFocus
            >
              Cancel
            </Button>
            <Button
              sx={{
                color: '#ffffff',
                backgroundColor: '#4F7942',
                '&:hover': {
                  color: '#4F7942'
                },
                borderRadius: '6px',
                paddingX: '24px'
              }}
              onClick={submitAvailability}
              autoFocus
            >
              Confirm
            </Button>
          </Box>
        </Box>
      </CustomModal>
      <CustomModal open={isEventOpen} setOpen={setIsEventOpen} size="xs">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyItems: 'center',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <InfoOutlinedIcon sx={{ fontSize: '50px', color: '#f3ab65' }} />
          <p>Are you sure to delete this unavailable Time Slot?</p>
          <Box
            sx={{
              display: 'flex',
              gap: '30px',
              justifyItems: 'center',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Button
              sx={{
                color: '#ffffff',
                backgroundColor: '#4F7942',
                '&:hover': {
                  color: '#4F7942'
                },
                borderRadius: '6px',
                paddingX: '24px'
              }}
              onClick={handleClose}
              autoFocus
            >
              Cancel
            </Button>
            <Button
              sx={{
                color: '#ffffff',
                backgroundColor: '#C04000',
                '&:hover': {
                  color: '#C04000'
                },
                borderRadius: '6px',
                paddingX: '24px'
              }}
              onClick={(event) => deleteAvailabilitySlot(eventId)}
              autoFocus
            >
              Delete
            </Button>
          </Box>
        </Box>
      </CustomModal>
    </Box>
  );
};

export default AvailabilityCalender;
