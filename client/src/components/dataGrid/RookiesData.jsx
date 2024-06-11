// TODO: add subscription to update the table when a new lead is added, NEW_LEAD_SUBSCRIPTION
import * as React from 'react';
import { Button, TextField, Typography, CircularProgress, Select, MenuItem } from '@mui/material';

import { useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import { DataGridPro, GridToolbar } from '@mui/x-data-grid-pro';
import { styled, darken, lighten } from '@mui/material/styles';
import { baseURL } from '../../libs/client/apiClient';
// import { gridStyles } from '../../constants/styles';

export default function RookieData(props) {
  const navigate = useNavigate();
  const { recordUserId } = props;

  // Add redux user info here:
  // const { user } = useSelector((state) => state.auth);
  // console.log("User" , user)

  const [sortModel, setSortModel] = useState([{ field: 'name', sort: 'asc' }]);
  const [sort, setSort] = useState('');
  const [column, setColumn] = useState('');

  const [categories, setCategories] = useState([]);

  const [columnsToShow, setColumnsToShow] = useState([]);
  const [gridRef] = useState({});

  const [rowSelectedUsers] = useState(['dominiqmartinez13@gmail.com', 'unhashlabs@gmail.com']);
  const [take, setTake] = useState('10');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('');
  const [filterModel, setFilterModel] = useState({});
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const [skip, setSkip] = React.useState(0);
  // const [isLoading, setIsLoading] = useState(true);

  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [dealsError, setDealsError] = useState(null);

  // Provide a default value if UserData or recordID is undefined

  //  const repIDValue = UserData.recordID; // Replace this with the actual repID value you want to send

  //STYLES:

  const gridStyles = {
    height: 350,
    maxWidth: '100%', // ensure the grid does not exceed the width of its container
    overflow: 'auto' // allow scrolling within the grid if content exceeds its bounds
  };

  const apiRef = React.useRef(null);

  //CHANGE THE COLUMNS AND THOSE FIELDS THAT ARE ADDED TO IT.
  const columns = useMemo(
    () => [
      {
        field: 'Profile',
        headerName: 'Profile',
        width: 150,
        editable: true,
        renderCell: (params) => {
          return (
            <Button
              variant="outlined"
              onClick={() => {
                //Open up user modal
                navigate(`/dashboard/lead/${params?.row?.id}`);
              }}
            >
              Details
            </Button>
          );
        }
      },
      {
        field: 'saleDate',
        headerName: 'SaleDate',
        width: 180,
        editable: false,
        hide: false,
        type: 'date'
      },

      {
        field: 'homeownerName',
        headerName: 'Homeowner Name',
        width: 180,
        editable: false,
        type: 'text'
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 180,
        editable: false,

        hide: false,
        cellClassName: (params) => {
          if (params.value === 'active') {
            return 'active-cell';
          } else if (params.value === 'inactive') {
            return 'inactive-cell';
          }
          return '';
        }
      },
      {
        field: 'email',
        headerName: 'Email',
        width: 250,
        editable: false
      },
      {
        field: 'stage',
        headerName: 'Stage',
        width: 180,
        editable: false,
        hide: false,
        renderCell: (params) => {
          const percentage = stageToPercentMapping[params.value.toString()]; // or just params.value if it's already a string
          return <ProgressBar percentage={percentage} status={params.value} />;
        }
      },
      {
        field: 'repName',
        headerName: 'Sales Rep',
        width: 180,
        editable: false,
        type: 'text'
      },
      {
        field: 'plansReceived',
        headerName: 'Plans Received Date',
        width: 180,
        editable: false,
        type: 'text'
      },
      {
        field: 'installComplete',
        headerName: 'Install Complete Date',
        width: 180,
        editable: false,
        type: 'text'
      },

      {
        field: 'ptoApproved',
        headerName: 'PTO Approved Date',
        width: 180,
        editable: false,
        type: 'text'
      },

      {
        field: 'ppwFinal',
        headerName: 'PpwFinal',
        width: 500,
        editable: false,
        hide: false
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

  function truncateDecimals(number, decimalPlaces) {
    const multiplier = Math.pow(10, decimalPlaces);
    return Math.floor(number * multiplier) / multiplier;
  }

  //EDIT THE LEAD ROWS HERE:
  // Make the API call

  //=============================
  // get columns where hide is false
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

  useEffect(() => {
    fetch(`${baseURL}/auth/crmDealsRookie`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.success && responseData.data.deals) {
          const dealsData = responseData.data.deals.map((deal) => {
            return {
              stage: deal.stage.replace(/^"|"$/g, ''),
              status: deal.status.replace(/^"|"$/g, ''),
              milestone: deal.milestone.replace(/^"|"$/g, ''),
              datePaid: deal.datePaid.replace(/^"|"$/g, ''),
              email: deal.email.replace(/^"|"$/g, ''),
              saleDate: formatSaleDate(deal.saleDate.replace(/^"|"$/g, '')),
              plansReceived: deal.plansReceived.replace(/^"|"$/g, ''),
              installComplete: deal.installComplete.replace(/^"|"$/g, ''),
              ptoApproved: deal.ptoApproved.replace(/^"|"$/g, ''),
              ppwFinal: truncateDecimals(deal.ppwFinal, 1),
              homeownerName: deal.homeownerName.replace(/^"|"$/g, ''),
              profile: 'hello',
              id: deal.projectID,
              repName: deal.repName.replace(/^"|"$/g, '')
            };
          });
          setData(dealsData);
        }
        setLoading(false);
      })
      .catch((error) => {
        setDealsError(error);
        setLoading(false);
      });
  }, []);

  function formatSaleDate(dateStr) {
    const [year, month, day] = dateStr.split('-');
    const dateString = `${month}/${day}/${year}`;

    return new Date(dateString); // Convert string to Date object
  }

  const leadsRows = data || [];

  const handleSearchInputChange = (event) => {
    const input = event.target.value;
    setSearchQuery(input);
    if (!input) {
      setFilter('');
      setTake('10');
      setFilterModel({});
    }
  };

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter') {
      setFilter(searchQuery);
      setCategories([]);
    }
  };

  // fiter mui data grid pro with db
  function handleFilterModelChange(newFilterModel) {
    setSort('');
    if (
      !newFilterModel.items[0].value &&
      newFilterModel.items[0].operatorValue !== 'isEmpty' &&
      newFilterModel.items[0].operatorValue !== 'isNotEmpty'
    )
      return;
    setFilterModel(newFilterModel.items[0]);
  }

  // sorting
  function handleSortModelChange(newSortModel) {
    if (!newSortModel.length) return;
    setSort(newSortModel[0].sort);
    setColumn(newSortModel[0].field);
    setSortModel(newSortModel);

    setSkip(0);
    setPage(0);
    // setPageSize(10);
  }

  let selectIds = [];

  const handleSelectionModelChange = async (newSelection) => {
    selectIds = newSelection;
  };

  // disable eslint for now
  // eslint-disable-next-line no-unused-vars

  return (
    <div
      style={{
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        overflow: 'auto',
        justifyContent: 'center'
      }}
    >
      {/* filter lead modal */}

      <div style={{ height: 350, width: '80%', overflow: 'auto' }}>
        <Box
          sx={{
            height: '100%',
            maxWidth: '100%',
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              position: 'relative',

              right: '16px',
              zIndex: '2',
              width: '60%',
              // maxWidth: '330px',
              marginLeft: 'auto'
            }}
          >
            {/* <Typography variant="h6" style={{ marginRight: 16 }}>
              User Fields
            </Typography> */}
            <TextField
              size="small"
              variant="outlined"
              type={'search'}
              label="Search"
              value={searchQuery}
              onKeyPress={handleKeyPress}
              onChange={(e) => handleSearchInputChange(e)}
            />
          </Box>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </Box>
          ) : (
            <StyledDataGrid
              sx={gridStyles}
              //  rows={categories.length || searchQuery ? data?.leads?.rows : leadsRows}  columns={columnsToShow}
              rows={leadsRows}
              editable
              editMode="cell"
              apiRef={apiRef}
              disableColumnMenu
              checkboxSelection
              // selectionModel={selectedIds}
              onSelectionModelChange={(e) => handleSelectionModelChange(e)}
              // filterModel={filterModel}
              onFilterModelChange={(value) => handleFilterModelChange(value)}
              sortModel={sortModel}
              onSortModelChange={(e) => handleSortModelChange(e)}
              key={Math.random().toString()}
              components={{ Toolbar: GridToolbar, gridRef }}
              componentsProps={{
                filterPanel: {
                  disableAddFilterButton: true
                }
              }}
              rowsPerPageOptions={[10, 25, 50, 100, 200]}
              pagination="true" // enable pagination
              pageSize={pageSize} // set the page size to 10
              page={page} // set the initial page to 1
              rowCount={data?.leads?.count} // set the total number of rows to the length of the rows array
              paginationMode="server" // paginate on the client-side
              columns={columns}
              getRowClassName={(params) => {
                if (params.row.status === 'Active') {
                  return 'active-cell';
                } else if (params.row.status === 'Cancelled') {
                  return 'inactive-cell';
                } else if (params.row.status === 'Retention') {
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

// Stage Mapping
//Color Row Status

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
