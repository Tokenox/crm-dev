import React, { Fragment, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { Helmet } from 'react-helmet-async';
import createAbortController from '../utils/createAbortController';
import { authSelector } from '../redux/slice/authSlice';
import { getLeadById } from '../redux/middleware/lead';
import { leadState } from '../redux/slice/leadSlice';
import { Box, Card, CircularProgress, Container } from '@mui/material';
import { LeadDetailResponseTypes } from '../types';

const LeadDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { signal, abort } = createAbortController();
  const { data: admin } = useAppSelector(authSelector);
  const dispatch = useAppDispatch();
  const {
    leadDetails,
    loading
  }: {
    leadDetails: LeadDetailResponseTypes | undefined;
    loading: boolean;
  } = useAppSelector(leadState);

  useEffect(() => {
    if (!id) return;
    (async () => {
      await dispatch(getLeadById({ id, signal }));
    })();

    return () => {
      abort();
    };
  }, []);

  return (
    <Fragment>
      <Helmet>
        <title>Lead Details | Minimal UI </title>
      </Helmet>
      <Container>
        <h2>Lead Details</h2>
        <Card sx={{ p: 2 }}>
          {loading ? (
            <Box p={2}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <Box display={'flex'} gap={8}>
              <Box>
                <Box display={'flex'} gap={3} sx={{ textTransform: 'capitalize' }}>
                  <p>Lead Name:</p>
                  <p>
                    {leadDetails?.firstName || ''} {leadDetails?.lastName || ''}
                  </p>
                </Box>
                <Box display={'flex'} gap={3} sx={{ textTransform: 'capitalize' }}>
                  <p>Lead Email:</p> <p> {leadDetails?.email || ''}</p>
                </Box>
                <Box display={'flex'} gap={3} sx={{ textTransform: 'capitalize' }}>
                  <p>Lead Phone:</p> <p> {leadDetails?.phone || ''}</p>
                </Box>
                <Box display={'flex'} gap={3} sx={{ textTransform: 'capitalize' }}>
                  <p>Lead Source:</p> <p>{leadDetails?.source || ''}</p>
                </Box>
              </Box>
              <Box>
                <Box display={'flex'} gap={3} sx={{ textTransform: 'capitalize' }}>
                  <p>Sale Rep Name:</p> <p>{leadDetails?.saleRepName || ''}</p>
                </Box>
                <Box display={'flex'} gap={3} sx={{ textTransform: 'capitalize' }}>
                  <p>Sale Rep Email:</p> <p> {leadDetails?.saleRepEmail || ''}</p>
                </Box>
                <Box display={'flex'} gap={3} sx={{ textTransform: 'capitalize' }}>
                  <p>Lead Status:</p> <p> {leadDetails?.status || ''}</p>
                </Box>
              </Box>
            </Box>
          )}
        </Card>
      </Container>
    </Fragment>
  );
};

export default LeadDetail;
