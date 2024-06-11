import React from 'react';
import Box from '@mui/material/Box';
import { DataGridPro, GridToolbar } from '@mui/x-data-grid-pro';
import { Button } from '@mui/material';
import { useAppSelector } from '../../hooks/hooks';
import { authSelector } from '../../redux/slice/authSlice';

interface CustomTableProps {
  data: any[];
  headLabel: {
    key: string;
    name: string;
  }[];
  onRowClick: (e: any, row: any) => void;
  onEditClick?: (e: any, row: any) => void;
  onDeleteClick?: (e: any, row: any) => void;
  loading?: boolean;
  isAllLeads?: boolean;
}

export default function CustomTable({ data, headLabel, loading, isAllLeads, onRowClick, onEditClick, onDeleteClick }: CustomTableProps) {
  const { data: admin } = useAppSelector(authSelector);

  // const [clickedRow, setClickedRow] = React.useState();

  // const onButtonClick = (e, row) => {
  //   e.stopPropagation();
  //   setClickedRow(row);
  // };

  // // handle page changes
  // const handlePageChange = async (newPage) => {
  //   // call api
  // };
  // const handlePageSizeChange = async (newPageSize) => {
  //   // call api
  // };

  const columnFields = headLabel.map((headCell) => ({
    field: headCell.key,
    headerName: headCell.name,
    width: 200
  }));

  const tableHeader = [
    {
      // add button for details
      field: 'details',
      headerName: 'Details',
      description: 'Details column.',
      sortable: false,
      width: 160,
      renderCell: (params) => {
        return (
          <Button onClick={(e) => onRowClick(e, params.row)} variant="outlined">
            Details
          </Button>
        );
      }
    },
    ...columnFields,
    {
      field: 'actions',
      headerName: 'Actions',
      description: 'Actions column.',
      sortable: false,
      width: 160,
      renderCell: (params) => {
        return (
          <Box display="flex" gap={1}>
            <Button onClick={(e) => onDeleteClick(e, params.row)} variant="contained">
              Delete
            </Button>
            {/* <Button onClick={(e) => onEditClick(e, params.row)} variant="contained">
              Edit
            </Button> */}
          </Box>
        );
      }
    }
  ];
  if (!admin.isSuperAdmin || !isAllLeads) {
    tableHeader.pop();
  }

  const columns = tableHeader.map((column) => ({
    ...column,
    disableClickEventBubbling: true
    // editable: column.field === 'actions' ? false : true
  }));

  return (
    <Box
      sx={{
        height: '60vh',
        width: '100%'
      }}
    >
      <DataGridPro
        rows={data || []}
        columns={columns}
        components={{
          Toolbar: GridToolbar
        }}
        checkboxSelection
        disableColumnFilter
        disableColumnSelector
        pagination={true}
        // paginationMode="server"
        // onPageChange={(value) => handlePageChange(value)} // handle page changes
        // onPageSizeChange={(value) => handlePageSizeChange(value)} // handle page size changes
        rowCount={data?.length || 0}
        pageSizeOptions={[10, 25, 50, 100, 200]}
        loading={loading}
        rowsLoadingMode="server"
      />
    </Box>
  );
}
