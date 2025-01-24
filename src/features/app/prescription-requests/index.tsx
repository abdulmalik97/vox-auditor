"use client";

import React, { useEffect, useState } from "react";
import { Container, Box } from "@mui/material";
import PrescriptionConfirmationModal from "./components/prescrption-confirmation";
import { PrescriptionRefillRequest } from "./model";
import Table from "@/components/table";
import { useAccount } from "@/contexts/account";
import { PrescriptionRequestsPrivateApi } from "./api/private";

const PrescriptionRequestsView = () => {
  const { currentAccount } = useAccount();

  useEffect(() => {
    if (currentAccount) {
      const practiceId = currentAccount.practice.practiceId;
      PrescriptionRequestsPrivateApi.getPrescriptionRequests(practiceId).then(
        (requests) => {
          if (requests) {
            setPrescriptionRefillRequests(requests);
          }
        }
      );
    }
  }, [currentAccount]);

  const [modalOpen, setModalOpen] = useState(false);
  const [prescriptionRefillRequests, setPrescriptionRefillRequests] = useState<
    PrescriptionRefillRequest[]
  >([]);
  const [refillRequest, setRefillRequest] =
    useState<PrescriptionRefillRequest | null>(null);

  const handleOpenModal = (refillRequest: PrescriptionRefillRequest) => {
    setRefillRequest(refillRequest);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSubmit = async (notes: string) => {
    if (refillRequest) {
      await PrescriptionRequestsPrivateApi.confirmPrescriptionRequest(
        refillRequest.id,
        notes
      );
    }
    handleCloseModal();
  };

  return (
    <Container maxWidth={"xl"}>
      <Box>
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
          columnsToExclude={["practiceId", "locationId"]}
          onRowClick={(refillRequest: PrescriptionRefillRequest) => {
            handleOpenModal(refillRequest);
          }}
        />
      </Box>
    </Container>
  );
};

export default PrescriptionRequestsView;
