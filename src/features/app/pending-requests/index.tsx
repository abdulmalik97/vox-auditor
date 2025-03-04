"use client";

import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Button,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  Stack,
  Alert,
} from "@mui/material";
import AppointmentConfirmationModal from "./components/appointment-confirmation";
import OutreachModal from "./components/outreach-modal";
import { AppointmentOutboundCallRequest } from "./model";
import Table from "@/components/table";
import { useAccount } from "@/contexts/account";
import { AppointmentOutboundRequestsPrivateApi } from "./api/private";
import RefreshIcon from '@mui/icons-material/Refresh';
import PendingActionsIcon from '@mui/icons-material/PendingActions';

const AppointmentOutboundRequestsView = () => {
  const { currentAccount } = useAccount();
  const [tableLoading, setTableLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [locations, setLocations] = useState<
    Record<
      string,
      {
        providers: string[];
        facilityName: string;
      }
    >
  >({});
  const [providers, setProviders] = useState<{ id: string; name: string }[]>(
    []
  );

  const loadRequests = async () => {
    if (!currentAccount) return;
    
    try {
      setTableLoading(true);
      setError(null);
      const practiceId = currentAccount.practice.practiceId;
      const requests = await AppointmentOutboundRequestsPrivateApi.getAppointmentOutboundRequests(practiceId);
      if (requests) {
        const mappedRequests = requests.map((request: {
          id: string;
          practice_id: string;
          location_id: string;
          patient_first_name: string;
          patient_last_name: string;
          patient_primary_phone_number: string;
          patient_secondary_phone_number?: string;
          patient_dob: string;
          status: string;
          provider_name_to_schedule: string;
          created_at: string;
          updated_at: string;
        }) => ({
          id: request.id,
          practiceId: request.practice_id,
          locationId: request.location_id,
          patientFirstName: request.patient_first_name,
          patientLastName: request.patient_last_name,
          patientPrimaryPhoneNumber: request.patient_primary_phone_number,
          patientSecondaryPhoneNumber: request.patient_secondary_phone_number,
          patientDob: new Date(request.patient_dob).toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
          }),
          status: request.status,
          providerNameToSchedule: request.provider_name_to_schedule,
          createdAt: request.created_at,
          updatedAt: request.updated_at,
        }));
        setAppointmentRequests(mappedRequests);
      }
    } catch (err) {
      setError('Failed to load pending requests. Please try again.');
      console.error('Error loading pending requests:', err);
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    if (currentAccount) {
      loadRequests();
      const practiceId = currentAccount.practice.practiceId;
      
      AppointmentOutboundRequestsPrivateApi.getProvidersForOutboundRequests(practiceId)
        .then((providers) => {
          const formattedProviders = providers.map((provider: {
            id: string;
            first_name: string;
            last_name: string;
          }) => ({
            id: provider.id,
            name: `${provider.first_name} ${provider.last_name}`,
          }));
          setProviders(formattedProviders);
        });
    }
    if (currentAccount?.practice.locations) {
      setLocations(currentAccount.practice.locations);
    }
  }, [currentAccount]);

  const [modalOpen, setModalOpen] = useState(false);
  const [outreachModalOpen, setOutreachModalOpen] = useState(false);
  const [appointmentRequests, setAppointmentRequests] = useState<
    AppointmentOutboundCallRequest[]
  >([]);
  const [appointmentRequest, setAppointmentRequest] =
    useState<AppointmentOutboundCallRequest | null>(null);

  const handleOpenModal = (
    appointmentRequest: AppointmentOutboundCallRequest
  ) => {
    setAppointmentRequest(appointmentRequest);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleOpenOutreachModal = () => {
    setOutreachModalOpen(true);
  };

  const handleCloseOutreachModal = () => {
    setOutreachModalOpen(false);
  };

  const handleSubmit = async () => {
    if (appointmentRequest) {
      // await AppointmentOutboundRequestsPrivateApi.confirmAppointmentRequest(
      //   appointmentRequest.id,
      //   notes
      // );
    }
    handleCloseModal();
  };

  const handleOutreachSubmit = async (data: {
    locationId: string;
    patientFirstName: string;
    patientLastName: string;
    patientDob: string;
    patientPrimaryPhoneNumber: string;
    patientSecondaryPhoneNumber?: string;
    providerNameToSchedule: string;
  }) => {
    const practiceId = currentAccount?.practice.practiceId;
    if (practiceId) {
      await AppointmentOutboundRequestsPrivateApi.saveAppointmentOutboundRequest(
        {
          ...data,
          practiceId,
        }
      );

      handleCloseOutreachModal();
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
              <PendingActionsIcon color="primary" sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Pending Requests
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage and track appointment requests for your practice
                </Typography>
              </Box>
            </Stack>
            <Box>
              <Tooltip title="Refresh pending requests">
                <IconButton 
                  onClick={loadRequests}
                  disabled={tableLoading}
                  color="primary"
                  sx={{ mr: 1 }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Button variant="contained" onClick={handleOpenOutreachModal}>
                Create Outreach
              </Button>
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
              rows={appointmentRequests}
              columnLabels={{
                patientFirstName: "Patient First Name",
                patientLastName: "Patient Last Name",
                patientDob: "Patient DOB",
                patientPrimaryPhoneNumber: "Primary Phone",
                patientSecondaryPhoneNumber: "Secondary Phone",
                providerNameToSchedule: "Provider Name",
                status: "Status",
              }}
              dateFields={[""]}
              columnsToExclude={[
                "practiceId",
                "locationId",
                "createdAt",
                "updatedAt",
              ]}
              loading={tableLoading}
              onRowClick={(appointmentRequest: AppointmentOutboundCallRequest) => {
                handleOpenModal(appointmentRequest);
              }}
            />
          </Box>
        </Stack>
      </Paper>

      <AppointmentConfirmationModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        providerNameToSchedule={appointmentRequest?.providerNameToSchedule}
        patientFirstName={appointmentRequest?.patientFirstName}
        patientLastName={appointmentRequest?.patientLastName}
        patientDob={appointmentRequest?.patientDob}
        patientPhoneNumber={appointmentRequest?.patientPrimaryPhoneNumber}
        patientSecondaryPhoneNumber={appointmentRequest?.patientSecondaryPhoneNumber}
        status={appointmentRequest?.status}
      />

      <OutreachModal
        open={outreachModalOpen}
        onClose={handleCloseOutreachModal}
        onSubmit={handleOutreachSubmit}
        locations={locations}
        providers={providers}
      />
    </Container>
  );
};

export default AppointmentOutboundRequestsView;
