"use client";

import React, { useEffect, useState } from "react";
import { Container, Box, Button } from "@mui/material";
import AppointmentConfirmationModal from "./components/appointment-confirmation";
import OutreachModal from "./components/outreach-modal";
import { AppointmentOutboundCallRequest } from "./model";
import Table from "@/components/table";
import { useAccount } from "@/contexts/account";
import { AppointmentOutboundRequestsPrivateApi } from "./api/private";

const AppointmentOutboundRequestsView = () => {
  const { currentAccount } = useAccount();

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

  useEffect(() => {
    if (currentAccount) {
      const practiceId = currentAccount.practice.practiceId;
      const locations = currentAccount.practice.locations;
      console.log(locations, practiceId, currentAccount);
      AppointmentOutboundRequestsPrivateApi.getAppointmentOutboundRequests(
        practiceId
      ).then((requests) => {
        if (requests) {
          const mappedRequests = requests.map(
            (request: {
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
              patientSecondaryPhoneNumber:
                request.patient_secondary_phone_number,
              patientDob: new Date(request.patient_dob).toLocaleDateString(
                "en-US",
                {
                  month: "2-digit",
                  day: "2-digit",
                  year: "numeric",
                }
              ),
              status: request.status,
              providerNameToSchedule: request.provider_name_to_schedule,
              createdAt: request.created_at,
              updatedAt: request.updated_at,
            })
          );
          setAppointmentRequests(mappedRequests);
        }
      });

      AppointmentOutboundRequestsPrivateApi.getProvidersForOutboundRequests(
        practiceId
      ).then((providers) => {
        const formattedProviders = providers.map(
          (provider: {
            id: string;
            first_name: string;
            last_name: string;
          }) => ({
            id: provider.id,
            name: `${provider.first_name} ${provider.last_name}`,
          })
        );
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
    <Container maxWidth={"xl"}>
      <Box>
        <AppointmentConfirmationModal
          open={modalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          providerNameToSchedule={appointmentRequest?.providerNameToSchedule}
          patientFirstName={appointmentRequest?.patientFirstName}
          patientLastName={appointmentRequest?.patientLastName}
          patientDob={appointmentRequest?.patientDob}
          patientPhoneNumber={appointmentRequest?.patientPrimaryPhoneNumber}
          patientSecondaryPhoneNumber={
            appointmentRequest?.patientSecondaryPhoneNumber
          }
          status={appointmentRequest?.status}
        />

        <OutreachModal
          open={outreachModalOpen}
          onClose={handleCloseOutreachModal}
          onSubmit={handleOutreachSubmit}
          locations={locations}
          providers={providers}
        />
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button variant="contained" onClick={handleOpenOutreachModal}>
            Create Outreach
          </Button>
        </Box>

        <Table
          rows={appointmentRequests}
          // Provide a map of labels for specific columns:
          columnLabels={{
            patientFirstName: "Patient First Name",
            patientLastName: "Patient Last Name",
            patientDob: "Patient DOB",
            patientPrimaryPhoneNumber: "Primary Phone",
            patientSecondaryPhoneNumber: "Secondary Phone",
            providerNameToSchedule: "Provider Name",
            status: "Status",
          }}
          // Specify columns that contain date values:
          dateFields={[""]}
          columnsToExclude={[
            "practiceId",
            "locationId",
            "createdAt",
            "updatedAt",
          ]}
          loading={false}
          onRowClick={(appointmentRequest: AppointmentOutboundCallRequest) => {
            handleOpenModal(appointmentRequest);
          }}
        />
      </Box>
    </Container>
  );
};

export default AppointmentOutboundRequestsView;
