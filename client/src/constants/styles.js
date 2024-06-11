export const gridStyles = {
    root: {
      '& .MuiDataGrid-root': {
        backgroundColor: '#fff',
        border: '1px solid #ddd',
      },
      '& .MuiDataGrid-columnsContainer': {
        backgroundColor: '#f5f5f5',
        borderBottom: '1px solid #ddd',
      },
      '& .MuiDataGrid-columnHeader': {
        fontWeight: 'bold',
        color: '#333',
      },
      '& .MuiDataGrid-cell': {
        borderBottom: '1px solid rgba(224, 224, 224, 1)',
      },
      '& .MuiDataGrid-cell:nth-of-type(even)': {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
      },
      '& .MuiDataGrid-cell:last-child': {
        borderRight: 'none',
      },
      '& .MuiDataGrid-cellEditable': {
        backgroundColor: '#fff',
        '& input': {
          color: '#333',
        },
      },
      '& .MuiDataGrid-cell--textLeft': {
        textAlign: 'left',
      },
      '& .MuiDataGrid-cell--textCenter': {
        textAlign: 'center',
      },
      '& .MuiDataGrid-cell--textRight': {
        textAlign: 'right',
      },
    },
   };
  
  
  