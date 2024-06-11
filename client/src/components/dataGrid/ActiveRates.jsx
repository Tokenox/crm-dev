// TODO: add subscription to update the table when a new lead is added, NEW_LEAD_SUBSCRIPTION
import * as React from 'react';
import { Button, TextField, Typography, CircularProgress, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';

import { DataGridPro, GridToolbar, GroupingPanel } from '@mui/x-data-grid-pro';

import { useAppSelector } from '../../hooks/hooks';
import { authSelector } from '../../redux/slice/authSlice';
import { gridStyles } from '../../constants/styles';

import { styled, darken, lighten } from '@mui/material/styles';
import { baseURL } from '../../libs/client/apiClient';

export default function ActiveRates(props) {
  //USER OBJECT

  const navigate = useNavigate();
  const { recordUserId } = props;

  // Grid style
  const gridStyles = {
    height: 350,
    maxWidth: '100%', // ensure the grid does not exceed the width of its container
    overflow: 'auto' // allow scrolling within the grid if content exceeds its bounds
  };

  const [gridRef] = useState({});

  const [searchQuery, setSearchQuery] = useState('');

  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);

  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [payError, setPayError] = useState(null);

  const repIDValue = '1890'; // Replace this with the actual repID value you want to send

  //CHANGE THE COLUMNS AND THOSE FIELDS THAT ARE ADDED TO IT.
  const columns = useMemo(
    () => [
      // {
      //   field: 'Profile',
      //   headerName: 'Profile',
      //   width: 150,
      //   editable: true,
      //   renderCell: (params) => {
      //     return (
      //       <Button
      //         variant="outlined"
      //         onClick={() => {
      //          //Open up user modal
      //            navigate(`/dashboard/lead/${params?.row?.id}`);

      //         }}
      //       >
      //      Details
      //       </Button>
      //     );
      //   },
      // },

      {
        field: 'partner',
        headerName: 'Fulfilment Partner',
        width: 180,
        editable: false
      },
      {
        field: 'years',
        headerName: 'Years',
        width: 180,
        editable: false,
        hide: false
      },

      {
        field: 'financing',
        headerName: 'Financing',
        width: 180,
        editable: false,
        type: 'text'
      },

      {
        field: 'apr',
        headerName: 'APR',
        width: 200,
        editable: false,

        hide: false
      },

      {
        field: 'feerate',
        headerName: 'Fee Rate',
        width: 180,
        editable: false,

        hide: false
      },

      {
        field: 'status',
        headerName: 'Status',
        width: 180,
        editable: false,

        hide: false,
        cellClassName: (params) => {
          if (params.value === 'Active') {
            return 'active-cell';
          } else if (params.value === 'Inactive') {
            return 'inactive-cell';
          }
          return '';
        }
      },
      {
        field: 'id',
        headerName: 'id',
        width: 500,
        editable: false,
        hide: true
      }
    ],
    [data]
  );

  useEffect(() => {
    fetch(`${baseURL}/crmRatesActive`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log(responseData.data.rates);

        console.log('responseData.data.payrollData:', responseData.data.rates);

        if (responseData.success && responseData.data.rates) {
          const RateData = responseData.data.rates.map((feeRateItem, index) => {
            return {
              partner: feeRateItem.partner.replace(/"/g, ''),
              years: feeRateItem.years,
              status: feeRateItem.status.replace(/"/g, ''),
              financing: feeRateItem.financing.replace(/"/g, ''),
              apr: feeRateItem.apr.replace(/"/g, ''),
              feerate: feeRateItem.feerate.replace(/"/g, ''),
              id: index
            };
          });

          setData(RateData);
        }

        setLoading(false);
      })
      .catch((error) => {
        setPayError(error);
        setLoading(false);
      });
  }, [recordUserId]);

  // remove categories and tags from data.leads and make new array
  // ORIGINAL

  //HELPERS
  function truncateDecimals(number, decimalPlaces) {
    const multiplier = Math.pow(10, decimalPlaces);
    return Math.floor(number * multiplier) / multiplier;
  }

  function formatSaleDate(dateStr) {
    const [year, month, day] = dateStr.split('-');
    const dateString = `${month}/${day}/${year}`;

    return new Date(dateString); // Convert string to Date object
  }

  function formatDollar(amount) {
    const amountStr = `$ ${amount}`;
    return amountStr; // Convert string to Date object
  }

  const visible = [];
  columns.forEach((column) => {
    visible.push(column.field);
  });

  // go over columns and get colums that does not have hide:true
  const visibleColumns = [];
  columns.forEach((column) => {
    if (!column.hide) {
      visibleColumns.push(column.field);
    }
  });

  const leadsRows = data || [];

  let selectIds = [];

  const handleSelectionModelChange = async (newSelection) => {
    selectIds = newSelection;
  };

  // disable eslint for now
  // eslint-disable-next-line no-unused-vars

  return (
    //<div style={{ height: 700, width: '100%' }}>
    <div
      style={{
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        overflow: 'hidden',
        justifyContent: 'center'
      }}
    >
      <div style={{ height: 350, width: '80%', overflow: 'auto' }}>
        <Box
          sx={{
            height: 'fit-content',
            maxWidth: '100%',
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              position: 'relative',
              top: '60px',
              right: '16px',
              zIndex: '2',
              width: '60%',

              // maxWidth: '330px',
              marginLeft: 'auto'
            }}
          >
            <TextField size="small" variant="outlined" type={'search'} label="Search" value={searchQuery} />
          </Box>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </Box>
          ) : (
            <StyledDataGrid
              pageSize={pageSize}
              page={page}
              rowCount={data?.leads?.count} // Use the state to inform the grid of the total row count
              paginationMode="server"
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              onPageChange={(newPage) => setPage(newPage)}
              sx={gridStyles}
              //  rows={categories.length || searchQuery ? data?.leads?.rows : leadsRows}  columns={columnsToShow}
              rows={leadsRows}
              editable
              editMode="cell"
              // apiRef={apiRef}
              disableColumnMenu
              checkboxSelection
              // selectionModel={selectedIds}
              onSelectionModelChange={(e) => handleSelectionModelChange(e)}
              // filterModel={filterModel}
              // onFilterModelChange={(value) => handleFilterModelChange(value)}
              // sortModel={sortModel}
              // onSortModelChange={(e) => handleSortModelChange(e)}
              key={Math.random().toString()}
              components={{ Toolbar: GridToolbar, gridRef }}
              componentsProps={{
                filterPanel: {
                  disableAddFilterButton: true
                }
              }}
              rowsPerPageOptions={[10, 25, 50, 100, 200]}
              pagination="true" // enable pagination
              columns={columns}
              getRowClassName={(params) => {
                if (params.row.saleStatus === 'Active') {
                  return 'active-cell';
                } else if (params.row.saleStatus === 'Cancelled') {
                  return 'inactive-cell';
                } else if (params.row.saleStatus === 'Retention') {
                  return 'retention-cell';
                }
                return '';
              }}
            />
          )}
        </Box>
      </div>
    </div>
  );
}

const getColorForPercentage = (percentage) => {
  if (percentage >= 0 && percentage <= 30) {
    return 'skyblue';
  } else if (percentage > 30 && percentage <= 60) {
    return 'yellow';
  } else if (percentage > 60 && percentage <= 90) {
    return 'lightgreen';
  } else if (percentage > 90) {
    return 'darkgreen';
  }
  return 'gray'; // default case
};

const stageToPercentMapping = {
  'New Sale': 0,
  'Welcome Call': 5,
  'Site Survey': 10,
  'Construction Call': 15,
  NTP: 20,
  'QC Check': 30,
  Plans: 40,
  FLA: 50,
  FLA: 60,
  'Solar Permit': 70,
  'Solar Install': 80,
  'Final Inspection': 90,
  PTO: 95,
  Complete: 100
};

const ProgressBar = ({ percentage, status }) => {
  const color = getColorForPercentage(percentage);
  return (
    <div style={{ width: '100%', backgroundColor: '#eee', borderRadius: '4px', position: 'relative' }}>
      <div
        style={{
          width: `${percentage}%`,
          backgroundColor: color,
          height: '20px',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold'
        }}
      >
        {status}
      </div>
    </div>
  );
};

const getBackgroundColor = (color, mode) => (mode === 'dark' ? darken(color, 0.7) : lighten(color, 0.7));

const getHoverBackgroundColor = (color, mode) => (mode === 'dark' ? darken(color, 0.6) : lighten(color, 0.6));

const getSelectedBackgroundColor = (color, mode) => (mode === 'dark' ? darken(color, 0.5) : lighten(color, 0.5));

const getSelectedHoverBackgroundColor = (color, mode) => (mode === 'dark' ? darken(color, 0.4) : lighten(color, 0.4));

const StyledDataGrid = styled(DataGridPro)(({ theme }) => ({
  '& .retention-cell': {
    backgroundColor: getBackgroundColor(theme.palette.warning.main, theme.palette.mode), // using warning palette (yellow) for retention
    '&:hover': {
      backgroundColor: getHoverBackgroundColor(theme.palette.warning.main, theme.palette.mode)
    },
    '&.Mui-selected': {
      backgroundColor: getSelectedBackgroundColor(theme.palette.warning.main, theme.palette.mode),
      '&:hover': {
        backgroundColor: getSelectedHoverBackgroundColor(theme.palette.warning.main, theme.palette.mode)
      }
    }
  },

  '& .active-cell': {
    backgroundColor: getBackgroundColor(theme.palette.success.main, theme.palette.mode),
    '&:hover': {
      backgroundColor: getHoverBackgroundColor(theme.palette.success.main, theme.palette.mode)
    },
    '&.Mui-selected': {
      backgroundColor: getSelectedBackgroundColor(theme.palette.success.main, theme.palette.mode),
      '&:hover': {
        backgroundColor: getSelectedHoverBackgroundColor(theme.palette.success.main, theme.palette.mode)
      }
    }
  },

  '& .inactive-cell': {
    backgroundColor: getBackgroundColor(theme.palette.error.main, theme.palette.mode),
    '&:hover': {
      backgroundColor: getHoverBackgroundColor(theme.palette.error.main, theme.palette.mode)
    },
    '&.Mui-selected': {
      backgroundColor: getSelectedBackgroundColor(theme.palette.error.main, theme.palette.mode),
      '&:hover': {
        backgroundColor: getSelectedHoverBackgroundColor(theme.palette.error.main, theme.palette.mode)
      }
    }
  }
}));
