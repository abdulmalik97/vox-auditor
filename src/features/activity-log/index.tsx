import Table from "@/components/table";
import { Box, Container } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";

const View = () => {
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "firstName", headerName: "First name", width: 130 },
    { field: "lastName", headerName: "Last name", width: 130 },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      width: 90,
    },
    {
      field: "fullName",
      headerName: "Full name",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 160,
    },
  ];

  const rows = [
    { id: 1, lastName: "Snow", firstName: "Jon", age: 35, fullName: "John White Snow" },
  ];

  return (
    <Container maxWidth={"xl"}>
      <Box p={3}>
        <Table rows={rows} columns={columns} />
      </Box>
    </Container>
  );
};

export default View;
