import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGridPro, GridToolbar } from '@mui/x-data-grid-pro';
import { Button } from '@mui/material';

interface CustomTableProps {
  data: any[];
  headLabel: {
    name: string;
    type?: string;
  }[];
  onRowClick?: (row: any) => void;
  onEditClick?: (e: any, row: any) => void;
  onDeleteClick?: (e: any, row: any) => void;
}

export default function CustomTable({ data, headLabel, onEditClick, onDeleteClick }: CustomTableProps) {
  const [clickedRow, setClickedRow] = React.useState();
  const [rows, setRows] = React.useState([]);

  useEffect(() => {
    if (data && data.length) {
      const rows = data?.map((row) => ({
        id: row._id,
        ...row
      }));
      setRows(rows);
    }
  }, [data]);

  const onButtonClick = (e, row) => {
    e.stopPropagation();
    setClickedRow(row);
  };

  // handle page changes
  const handlePageChange = async (newPage) => {
    // call api
  };
  const handlePageSizeChange = async (newPageSize) => {
    // call api
  };

  const columnFields = headLabel.map((headCell) => ({
    field: headCell.name,
    headerName: headCell.name.charAt(0).toUpperCase() + headCell.name.slice(1),
    width: 200
  }));

  const tableHeader = [
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
            <Button onClick={(e) => onEditClick(e, params.row)} variant="contained">
              Edit
            </Button>
          </Box>
        );
      }
    }
  ];

  const columns = tableHeader.map((column) => ({
    ...column,
    disableClickEventBubbling: true,
    editable: column.field === 'actions' ? false : true
  }));
  console.log('rows---', rows);
  return (
    <Box
      sx={{
        height: '60vh',
        width: '100%'
      }}
    >
      <table className='w-full'>
        <tr>
          {headLabel.map((field) => {
            return <th>{field.name}</th>;
          })}
        </tr>
        <tr>
          <td>Alfreds Futterkiste</td>
          <td>Maria Anders</td>
          <td>Germany</td>
        </tr>
      </table>
      {/* <DataGridPro
        rows={rows || []}
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
      /> */}
    </Box>
  );
}
