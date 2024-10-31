import { Table as RadixTable } from "@radix-ui/themes";

interface TableProps {
  columns: string[]; // Array of column headers
  data: { [key: string]: string | number }[]; // Array of objects representing rows with key-value pairs for cell data
}

const Table = ({ columns, data }: TableProps) => {
  const generateColumnHeaders = () => {
    return columns.map((column) => (
      <RadixTable.ColumnHeaderCell key={column}>
        {column}
      </RadixTable.ColumnHeaderCell>
    ));
  };

  const generateData = () => {
    return data.map((row, rowIndex) => (
      <RadixTable.Row key={rowIndex}>
        {columns.map((column) => (
          <RadixTable.Cell key={`${rowIndex}-${column}`}>
            {row[column]}
          </RadixTable.Cell>
        ))}
      </RadixTable.Row>
    ));
  };

  return (
    <RadixTable.Root variant="surface">
      <RadixTable.Header>
        <RadixTable.Row>{generateColumnHeaders()}</RadixTable.Row>
      </RadixTable.Header>
      <RadixTable.Body>{generateData()}</RadixTable.Body>
    </RadixTable.Root>
  );
};

export default Table;
