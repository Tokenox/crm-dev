import { Button, Card, CircularProgress, Container } from '@mui/material';
import { Box, Stack } from '@mui/system';
import React, { Fragment, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { getCategories } from '../redux/middleware/category';
import { deleteLead, getLeadBySource, leadsForSuperAdmin } from '../redux/middleware/lead';
import { categorySelector } from '../redux/slice/categorySlice';
import { leadState, loadingLead } from '../redux/slice/leadSlice';
import { CategoryResponseTypes } from '../types';
import createAbortController from '../utils/createAbortController';
import CustomTable from '../components/custom-table/CustomTable';
import { authSelector } from '../redux/slice/authSlice';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import { useNavigate } from 'react-router-dom';

const DynamicLead = () => {
  // get the admin from redux store
  const { data: admin } = useAppSelector(authSelector);
  const navigate = useNavigate();

  const categories: CategoryResponseTypes[] = useAppSelector(categorySelector);
  // const categoryLoading = useAppSelector(loadingCategory);
  const leadLoading = useAppSelector(loadingLead);
  const { data: leadsData, allLeads, allLeadsLoading } = useAppSelector(leadState);
  const dispatch = useAppDispatch();
  const { signal, abort } = createAbortController();

  const [sourceName, setSourceName] = useState<string>('');
  const [isAllLeads, setIsAllLeads] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const response = await dispatch(getCategories({ signal }));
      setSourceName(response.payload[0]?.name);
    })();
    return () => {
      abort();
    };
  }, []);

  useEffect(() => {
    if (!categories.length || !sourceName) return;
    (async () => {
      setIsAllLeads(false);
      await dispatch(getLeadBySource({ skip: 0, take: 10, sort: 'desc', search: '', source: sourceName, signal }));
    })();

    return () => {
      abort();
    };
  }, [categories, sourceName]);

  //! Get all leads for super admin
  const getAllLeadsForSuperAdmin = async () => {
    setIsAllLeads(true);
    setSourceName('');
    await dispatch(leadsForSuperAdmin({ skip: 0, take: 10, sort: 'desc', search: '' }));
  };

  //! Delete lead
  const handleDeleteLead = async (e, row) => {
    e.stopPropagation();
    await dispatch(deleteLead({ id: row.id }));
    await dispatch(leadsForSuperAdmin({ skip: 0, take: 10, sort: 'desc', search: '' }));
  };

  return (
    <Fragment>
      <Helmet>
        <title> Dynamic Leads | Minimal UI </title>
      </Helmet>
      <Container>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <h2>Dynamic Lead</h2>
          <Button
            variant="contained"
            onClick={async () => {
              if (isAllLeads) {
                await dispatch(leadsForSuperAdmin({ skip: 0, take: 10, sort: 'desc', search: '' }));
              } else {
                await dispatch(getLeadBySource({ skip: 0, take: 10, sort: 'desc', search: '', source: sourceName, signal }));
                await dispatch(getCategories({ signal }));
              }
            }}
          >
            <RotateLeftIcon fontSize="large" />
          </Button>
        </Box>
        <Stack
          direction="row"
          alignItems="center"
          gap={2}
          mb={5}
          pb={2}
          sx={{
            overflowX: 'scroll',
            scrollbarWidth: 'auto',

            '&::-webkit-scrollbar': {
              width: '2px',
              maxHeight: '5px',
              borderRadius: '20px'
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
              borderRadius: '20px'
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#D3D3D3',
              scrollbarGutter: 'stable',
              borderRadius: '20px'
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: '#D3D3D3',
              borderRadius: '20px'
            }
          }}
          width={'100%'}
        >
          {(categories &&
            categories.map((category: CategoryResponseTypes) => (
              <Button
                key={category.name}
                variant={sourceName.toLocaleLowerCase() === category.name.toLocaleLowerCase() ? 'contained' : 'outlined'}
                sx={{ minWidth: 'auto' }}
                onClick={() => {
                  setSourceName(category.name);
                }}
              >
                {category.name}
              </Button>
            ))) ||
            ''}
          {admin.isSuperAdmin && (
            <Button variant={isAllLeads ? 'contained' : 'outlined'} sx={{ minWidth: 'auto' }} onClick={getAllLeadsForSuperAdmin}>
              All Leads
            </Button>
          )}
        </Stack>

        <Card
          sx={{
            mt: 2
          }}
        >
          {isAllLeads ? (
            <>
              {allLeadsLoading ? (
                <Box p={2}>
                  <CircularProgress size={24} />
                </Box>
              ) : (
                <>
                  {allLeads && allLeads.length ? (
                    <CustomTable
                      data={allLeads}
                      headLabel={headLabelForSuperAdmin}
                      loading={allLeadsLoading}
                      isAllLeads={isAllLeads}
                      onRowClick={(e, row) => {
                        navigate(`/dashboard/lead/detail/${row.id}`);
                        console.log(row);
                      }}
                      onDeleteClick={handleDeleteLead}
                    />
                  ) : (
                    <Box p={2}>No leads found for super admin</Box>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              {leadLoading ? (
                <Box p={2}>
                  <CircularProgress size={24} />
                </Box>
              ) : (
                <>
                  {leadsData && leadsData.length ? (
                    <CustomTable
                      data={leadsData}
                      headLabel={headLabel}
                      loading={leadLoading}
                      isAllLeads={false}
                      onRowClick={(e, row) => {
                        navigate(`/dashboard/lead/detail/${row.id}`);
                        console.log(row);
                      }}
                    />
                  ) : (
                    <Box p={2}>No leads found</Box>
                  )}
                </>
              )}
            </>
          )}
        </Card>
      </Container>
    </Fragment>
  );
};

export default DynamicLead;

// Header label for Sales Rep
const headLabel = [
  {
    key: 'firstName',
    name: 'First Name'
  },
  {
    key: 'lastName',
    name: 'Last Name'
  },
  {
    key: 'email',
    name: 'Email'
  },
  {
    key: 'phone',
    name: 'Phone'
  },
  {
    key: 'status',
    name: 'Status'
  }
];

// Header label for Super Admin
const headLabelForSuperAdmin = [
  {
    key: 'firstName',
    name: 'First Name'
  },
  {
    key: 'lastName',
    name: 'Last Name'
  },
  {
    key: 'email',
    name: 'Email'
  },
  {
    key: 'phone',
    name: 'Phone'
  },
  {
    key: 'status',
    name: 'Status'
  },
  {
    key: 'source',
    name: 'Source'
  }
];
