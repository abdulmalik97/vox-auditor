import Table from "@/components/table";
import { Box, Container } from "@mui/material";
import { ActivityLogEntry } from "./model";

interface ActivityLogViewProps {
  activityLogEntries: ActivityLogEntry[];
}

const ActivityLogView = ({ activityLogEntries }: ActivityLogViewProps) => {
  
  return (
    <Container maxWidth={"xl"}>
      <Box>
        <Table rows={activityLogEntries} title={"Activity Log"} />
      </Box>
    </Container>
  );
};

export default ActivityLogView;
