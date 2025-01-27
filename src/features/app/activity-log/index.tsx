"use client";

import Table from "@/components/table";
import { Box, Container, Typography } from "@mui/material";
import { useAccount } from "@/contexts/account";
import { useEffect, useState } from "react";
import { ActivityLogPrivateApi, ActivityLogRecord } from "./api/private";

const ActivityLogView = () => {
  const { currentAccount } = useAccount();
  const [tableLoading, setTableLoading] = useState<boolean>(true);
  const [activityLogRecords, setActivityLogRecords] = useState<
    ActivityLogRecord[]
  >([]);

  useEffect(() => {
    getPendingPrescriptionRefillRequests(async (requests) => {
      setActivityLogRecords(requests);
      setTableLoading(false);
    });
  }, [currentAccount]);

  const getPendingPrescriptionRefillRequests = (
    callback: (requests: ActivityLogRecord[]) => Promise<void>
  ) => {
    if (currentAccount) {
      const practiceId = currentAccount.practice.practiceId;
      ActivityLogPrivateApi.getActivityLog(practiceId).then(
        async (requests) => {
          if (requests) {
            setTableLoading(true);
            await callback(requests);
            setTableLoading(false);
          }
        }
      );
    }
  };

  return (
    <Container maxWidth={"xl"}>
      <Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h5">Activity Log</Typography>
        </Box>
        <Table
          rows={activityLogRecords}
          loading={tableLoading}
          columnsToExclude={["practiceId"]}
        />
      </Box>
    </Container>
  );
};

export default ActivityLogView;
