import React from 'react';

import { DataGridPro } from '@mui/x-data-grid-pro';
import { Box } from '@mui/material';

interface CsvTableProps {
  data: any;
  headLabel: {
    name: string;
    type?: string;
    alignRight?: boolean;
  }[];
}

const CsvTable = ({ data, headLabel }: CsvTableProps) => {
  const columns = headLabel.map((headCell) => ({
    field: headCell.name,
    headerName: headCell.name.charAt(0).toUpperCase() + headCell.name.slice(1),
    width: 200,
    textAlign: 'center'
  }));

  const rows = data.map((row) => ({
    id: Object.values(row)[0] || Math.random() * 1000,
    ...row
  }));

  return (
    <Box sx={{ height: '60vh', width: '100%' }}>
      <DataGridPro rows={rows} columns={columns} />
    </Box>
  );
};

export default CsvTable;
