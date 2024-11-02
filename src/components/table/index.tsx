import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

interface TableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rows: any[];
  columnOrder?: string[];
  title?: string; // Optional title for the table
}

const Table = ({ rows, title }: TableProps) => {
  const paginationModel = { page: 0, pageSize: 25 };

  const generateHeader = (input: string): string => {
    return input
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const generateColumns = () => {
    const columns: GridColDef[] = [];

    if (rows.length > 0) {
      const firstEntry = rows[0];

      for (const key of Object.keys(firstEntry)) {
        columns.push({ field: key, headerName: generateHeader(key), flex: 1 });
      }
    }

    return columns;
  };

  return (
    <Paper
      sx={{
        height: "80vh",
        width: "100%",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      {title && (
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">{title}</Typography>
        </Box>
      )}
      <DataGrid
        rows={rows}
        columns={generateColumns()}
        initialState={{
          pagination: { paginationModel },
          columns: {
            columnVisibilityModel: {
              id: false,
            },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0 }}
      />
    </Paper>
  );
};

export default Table;
