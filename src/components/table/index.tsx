"use client";

import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

interface TableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rows: any[];
  columnOrder?: string[];
  columnsToExclude?: string[];
  title?: string; // Optional title for the table
  onRowClick?: (row: any) => void; // Optional callback for row click
}

const Table = ({ rows, title, columnsToExclude, onRowClick }: TableProps) => {
  const generateHeader = (input: string): string => {
    return input
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/^./, (str) => str.toUpperCase());
  };

  const generateColumns = () => {
    const columns: GridColDef[] = [];

    if (rows.length > 0) {
      const firstEntry = rows[0];

      for (const key of Object.keys(firstEntry)) {
        if (!columnsToExclude?.includes(key)) {
          columns.push({
            field: key,
            headerName: generateHeader(key),
            flex: 1,
          });
        }
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
          columns: {
            columnVisibilityModel: {
              id: false,
            },
          },
        }}
        pageSizeOptions={[5, 10]}
        sx={{
          border: 0,
          "& .MuiDataGrid-cell:focus": {
            outline: "none", // Removes focus outline around cells
          },
          "& .MuiDataGrid-cell:focus-visible": {
            outline: "none", // Removes focus outline when cell is focused
          },
        }}
        onRowClick={(param) => {
          // Execute the callback if provided
          onRowClick?.(param.row);
        }}
      />
    </Paper>
  );
};

export default Table;
