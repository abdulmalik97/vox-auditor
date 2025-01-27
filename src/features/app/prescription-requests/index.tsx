"use client";

import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import PrescriptionConfirmationModal from "./components/prescrption-confirmation";
import { PrescriptionRefillRequest } from "./model";
import Table from "@/components/table";
import { useAccount } from "@/contexts/account";
import { PrescriptionRequestsPrivateApi } from "./api/private";

const PRESCRIPTION_PENDING_STATUS = "Pending";
const PRESCRIPTION_COMPLETED_STATUS = "Completed";

const PrescriptionRequestsView = () => {
  const { currentAccount } = useAccount();
  const [statusFilter, setStatusFilter] = useState<string>(
    PRESCRIPTION_PENDING_STATUS
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [prescriptionRefillRequests, setPrescriptionRefillRequests] = useState<
    PrescriptionRefillRequest[]
  >([]);
  const [refillRequest, setRefillRequest] =
    useState<PrescriptionRefillRequest | null>(null);
  const [tableLoading, setTableLoading] = useState<boolean>(true);

  useEffect(() => {
    getPendingPrescriptionRefillRequests(async (requests) => {
      setPrescriptionRefillRequests(requests);
      setTableLoading(false);
    });
  }, [currentAccount]);

  const getPendingPrescriptionRefillRequests = (
    callback: (requests: PrescriptionRefillRequest[]) => Promise<void>
  ) => {
    if (currentAccount) {
      const practiceId = currentAccount.practice.practiceId;
      PrescriptionRequestsPrivateApi.getPrescriptionRequests(
        practiceId,
        PRESCRIPTION_PENDING_STATUS
      ).then(async (requests) => {
        if (requests) {
          setTableLoading(true);
          await callback(requests);
          setTableLoading(false);
        }
      });
    }
  };

  const getConfirmedPrescriptionRefillRequests = (
    callback: (requests: PrescriptionRefillRequest[]) => void
  ) => {
    if (currentAccount) {
      const practiceId = currentAccount.practice.practiceId;
      PrescriptionRequestsPrivateApi.getPrescriptionRequests(
        practiceId,
        PRESCRIPTION_COMPLETED_STATUS
      ).then((requests) => {
        if (requests) {
          callback(requests);
        }
      });
    }
  };

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
    console.log("HERER");
    if (newStatus !== null) {
      setStatusFilter(newStatus);

      if (newStatus === "Pending") {
        getPendingPrescriptionRefillRequests((requests) => {
          setPrescriptionRefillRequests(requests);
        });
      } else if (newStatus === "Completed") {
        getConfirmedPrescriptionRefillRequests((requests) => {
          setPrescriptionRefillRequests(requests);
        });
      }
    }
  };

  const handleSubmit = async (notes: string) => {
    if (refillRequest) {
      await PrescriptionRequestsPrivateApi.confirmPrescriptionRequest(
        refillRequest.id,
        notes
      );

      // Remove request from table
      const updatedPrescriptionRefillRequests =
        prescriptionRefillRequests.filter((prr) => prr.id !== refillRequest.id);
      setPrescriptionRefillRequests(updatedPrescriptionRefillRequests);
    }

    handleCloseModal();
  };

  return (
    <Container maxWidth={"xl"}>
      <Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Typography variant="h5">Prescription Refill Requests</Typography>

          <ToggleButtonGroup
            value={statusFilter}
            exclusive
            onChange={handleStatusFilterChange}
          >
            <ToggleButton value="Pending">Pending</ToggleButton>
            <ToggleButton value="Completed">Completed</ToggleButton>
          </ToggleButtonGroup>
        </Box>

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
    </Container>
  );
};

export default PrescriptionRequestsView;
