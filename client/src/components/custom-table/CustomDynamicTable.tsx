import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Button } from '@mui/material';
import { useEffect } from 'react';


interface CustomDynamicTableProps {
  data: any[];
  headLabel: {
    name: string;
    type?: string;
  }[];
  onRowClick?: (row: any) => void;
  onEditClick?: (e: any, row: any) => void;
  onDeleteClick?: (e: any, row: any) => void;
}
export default function CustomDynamicTable({ data, headLabel, onEditClick, onDeleteClick }: CustomDynamicTableProps) {
  const [clickedRow, setClickedRow] = React.useState();
  const [rows, setRows] = React.useState([]);

  useEffect(() => {
    if (data && data.length) {
      const rows = data?.map((row) => ({
        id: row._id,
        ...row
      }));
      setRows(rows);
      console.log('-----row', rows.values);
      console.log('-----data', data);
      console.log('-----headlabel', headLabel);
      console.log('rows------', rows);
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
  const updatedData = [...columns, ...rows];
//   console.log('data------', data);
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {headLabel.map((label) => (
              <TableCell align="left">{label.name}</TableCell>
            ))}
          </TableRow>
        </TableHead>
      
        <TableBody>
       
          <TableRow  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
         
          {rows.map((row) => (
              <TableCell  key={row.id} align="left" component="th" scope="row">
                {row.values}
              </TableCell>
             ))}
          </TableRow>
       
        </TableBody>
      </Table>
    </TableContainer>
  );
}
