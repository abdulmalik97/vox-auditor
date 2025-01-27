"use client";

import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Box, CircularProgress } from "@mui/material";

interface TableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rows: any[];
  loading: boolean;
  columnOrder?: string[];
  columnsToExclude?: string[];
  title?: string;
  onRowClick?: (row: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any

  /**
   * A map of column field -> custom label.
   * If a key matches the field, we use its string value as the column name.
   */
  columnLabels?: Record<string, string>;

  /**
   * An optional list of fields that should be displayed in date format.
   */
  dateFields?: string[];
}

const Table = ({
  rows,
  title,
  columnsToExclude,
  onRowClick,
  columnLabels,
  dateFields,
  loading,
}: TableProps) => {
  // If you prefer a library like moment or date-fns, you can integrate that as well:
  // import moment from 'moment';
  // const formatDate = (val: string) => moment(val).format('MM/DD/YYYY');

  const formatDate = (val: string) => {
    // For a simple approach, let's use Intl.DateTimeFormat
    // Make sure the value can be parsed by new Date().
    if (!val) return "";
    const date = new Date(val);
    if (isNaN(date.valueOf())) return val; // Fallback if invalid date
    return new Intl.DateTimeFormat("en-US").format(date);
  };

  /**
   * Generate a readable header name from a field key, if no custom label is provided.
   * e.g. "patientDob" -> "Patient Dob" or "patientDOB" -> "Patient DOB".
   */

  const generateHeader = (input: string): string => {
    return input
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/^./, (str) => str.toUpperCase());
  };

  /**
   * Dynamically generate columns based on the data keys in the first row.
   * Exclude columns if specified and optionally apply date formatters and custom labels.
   */
  const generateColumns = (): GridColDef[] => {
    if (rows.length === 0) return [];

    const firstEntry = rows[0];
    const columns: GridColDef[] = [];

    for (const key of Object.keys(firstEntry)) {
      if (columnsToExclude?.includes(key)) {
        continue; // Skip excluded columns
      }

      columns.push({
        field: key,
        headerName: columnLabels?.[key] ?? generateHeader(key),
        flex: 1,
        // Only apply a date formatter if this field is in the dateFields array:
        valueFormatter: dateFields?.includes(key)
          ? (params: { value: string | undefined }) =>
              params.value ? formatDate(params.value) : undefined
          : undefined,
      });
    }

    return columns;
  };

  return (
    <Paper
      sx={{
        height: "82vh",
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

      {/* Show loader when data is loading */}
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <DataGrid
          rows={rows}
          columns={generateColumns()}
          initialState={{
            columns: {
              columnVisibilityModel: {
                id: false, // Hides the default "id" column if it exists
              },
            },
          }}
          pageSizeOptions={[5, 10]}
          sx={{
            cursor: onRowClick ? "pointer" : undefined,
            border: 0,
            "& .MuiDataGrid-cell:focus": {
              outline: "none", // Removes focus outline around cells
            },
            "& .MuiDataGrid-cell:focus-visible": {
              outline: "none", // Removes focus outline when cell is focused
            },
          }}
          onRowClick={(param) => {
            onRowClick?.(param.row);
          }}
        />
      )}
    </Paper>
  );
};

export default Table;
