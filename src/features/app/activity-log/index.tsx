"use client";

import Table from "@/components/table";
import { Box, Container, Typography, Paper, IconButton, Tooltip, Stack, Alert } from "@mui/material";
import { useAccount } from "@/contexts/account";
import { useEffect, useState } from "react";
import { ActivityLogPrivateApi, ActivityLogRecord } from "./api/private";
import RefreshIcon from '@mui/icons-material/Refresh';
import TimelineIcon from '@mui/icons-material/Timeline';
import { GridColDef } from "@mui/x-data-grid";

const ActivityLogView = () => {
  const { currentAccount } = useAccount();
  const [tableLoading, setTableLoading] = useState<boolean>(true);
  const [activityLogRecords, setActivityLogRecords] = useState<ActivityLogRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Custom column definitions
  const customColumns: GridColDef[] = [
    {
      field: 'callSummary',
      headerName: 'Call Summary',
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={params.value || ''} arrow>
          <div style={{ 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap',
            width: '100%'
          }}>
            {params.value}
          </div>
        </Tooltip>
      ),
    }
  ];

  const loadActivityLog = async () => {
    if (!currentAccount) return;
    
    try {
      setTableLoading(true);
      setError(null);
      const practiceId = currentAccount.practice.practiceId;
      const requests = await ActivityLogPrivateApi.getActivityLog(practiceId);
      setActivityLogRecords(requests || []);  
    } catch (err) {
      setError('Failed to load activity log. Please try again.');
      console.error('Error loading activity log:', err);
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    loadActivityLog();
  }, [currentAccount]);

  return (
    <Container maxWidth={false}>
      <Paper elevation={0} sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Header Section */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderBottom: '1px solid',
            borderColor: 'divider',
            pb: 2
          }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <TimelineIcon color="primary" sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Activity Log
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Track all activities and changes in your practice
                </Typography>
              </Box>
            </Stack>
            <Tooltip title="Refresh activity log">
              <IconButton 
                onClick={loadActivityLog}
                disabled={tableLoading}
                color="primary"
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Error Message */}
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Table Section */}
          <Box sx={{ 
            backgroundColor: 'background.paper',
            borderRadius: 1,
            overflow: 'hidden'
          }}>
            <Table
              rows={activityLogRecords}
              loading={tableLoading}
              columnsToExclude={["practiceId"]}
              customColumns={customColumns}
            />
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
};

export default ActivityLogView;
