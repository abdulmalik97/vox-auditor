
interface TableProps {
  columns: string[]; // Array of column headers
  data: { [key: string]: string | number }[]; // Array of objects representing rows with key-value pairs for cell data
}

const Table = ({ columns, data }: TableProps) => {
 
};

export default Table;
