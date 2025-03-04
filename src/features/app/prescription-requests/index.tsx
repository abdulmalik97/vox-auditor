"use client";

import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  Stack,
  Alert,
} from "@mui/material";
import PrescriptionConfirmationModal from "./components/prescription-confirmation";
import { PrescriptionRefillRequest } from "./model";
import Table from "@/components/table";
import { useAccount } from "@/contexts/account";
import { PrescriptionRequestsPrivateApi } from "./api/private";
import RefreshIcon from '@mui/icons-material/Refresh';
import MedicationIcon from '@mui/icons-material/Medication';

const PRESCRIPTION_PENDING_STATUS = "Pending";
const PRESCRIPTION_COMPLETED_STATUS = "Completed";

const PrescriptionRequestsView = () => {
  const { currentAccount } = useAccount();
  const [statusFilter, setStatusFilter] = useState<string>(PRESCRIPTION_PENDING_STATUS);
  const [modalOpen, setModalOpen] = useState(false);
  const [prescriptionRefillRequests, setPrescriptionRefillRequests] = useState<PrescriptionRefillRequest[]>([]);
  const [refillRequest, setRefillRequest] = useState<PrescriptionRefillRequest | null>(null);
  const [tableLoading, setTableLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadPrescriptionRequests = async () => {
    if (!currentAccount) return;
    
    try {
      setTableLoading(true);
      setError(null);
      const practiceId = currentAccount.practice.practiceId;
      const requests = await PrescriptionRequestsPrivateApi.getPrescriptionRequests(
        practiceId,
        statusFilter
      );
      if (requests) {
        setPrescriptionRefillRequests(requests);
      }
    } catch (err) {
      setError('Failed to load prescription requests. Please try again.');
      console.error('Error loading prescription requests:', err);
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    loadPrescriptionRequests();
  }, [currentAccount, statusFilter]);

  const handleOpenModal = (refillRequest: PrescriptionRefillRequest) => {
    setRefillRequest(refillRequest);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleStatusFilterChange = (
    _event: React.MouseEvent<HTMLElement>,
    newStatus: "Pending" | "Completed"
  ) => {
    if (newStatus !== null) {
      setStatusFilter(newStatus);
    }
  };

  const handleSubmit = async (notes: string) => {
    if (refillRequest) {
      try {
        await PrescriptionRequestsPrivateApi.confirmPrescriptionRequest(
          refillRequest.id,
          notes
        );

        // Remove request from table
        const updatedPrescriptionRefillRequests =
          prescriptionRefillRequests.filter((prr) => prr.id !== refillRequest.id);
        setPrescriptionRefillRequests(updatedPrescriptionRefillRequests);
        handleCloseModal();
      } catch (err) {
        setError('Failed to confirm prescription request. Please try again.');
        console.error('Error confirming prescription request:', err);
      }
    }
  };

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
              <MedicationIcon color="primary" sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Prescription Refill Requests
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage and track prescription refill requests
                </Typography>
              </Box>
            </Stack>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <ToggleButtonGroup
                value={statusFilter}
                exclusive
                onChange={handleStatusFilterChange}
                size="small"
              >
                <ToggleButton value="Pending">Pending</ToggleButton>
                <ToggleButton value="Completed">Completed</ToggleButton>
              </ToggleButtonGroup>
              <Tooltip title="Refresh requests">
                <IconButton 
                  onClick={loadPrescriptionRequests}
                  disabled={tableLoading}
                  color="primary"
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
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
              rows={prescriptionRefillRequests}
              loading={tableLoading}
              columnsToExclude={["practiceId", "locationId"]}
              onRowClick={
                statusFilter === PRESCRIPTION_PENDING_STATUS
                  ? (refillRequest: PrescriptionRefillRequest) => {
                      handleOpenModal(refillRequest);
                    }
                  : undefined
              }
            />
          </Box>
        </Stack>

        <PrescriptionConfirmationModal
          open={modalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          prescriptionName={refillRequest?.prescriptionName}
          patientFirstName={refillRequest?.patientFirstName}
          patientLastName={refillRequest?.patientLastName}
          patientDob={refillRequest?.patientDob}
          patientPhoneNumber={refillRequest?.patientPhoneNumber}
          status={refillRequest?.status}
        />
      </Paper>
    </Container>
  );
};

export default PrescriptionRequestsView;
