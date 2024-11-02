import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

interface TableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rows: any[];
  columns: GridColDef[];
  title?: string; // Optional title for the table
}

const Table = ({ rows, columns, title }: TableProps) => {
  const paginationModel = { page: 0, pageSize: 25 };

  return (
    <Paper sx={{ height: "80vh", width: "100%", borderRadius: 2, overflow: 'hidden' }}>
      {title && (
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">{title}</Typography>
        </Box>
      )}
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0 }}
      />
    </Paper>
  );
};

export default Table;
