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
  const [modalOpen, setModalOpen] = useState(false);
  const [prescriptionRefillRequests, setPrescriptionRefillRequests] = useState<
    PrescriptionRefillRequest[]
  >([]);
  const [refillRequest, setRefillRequest] =
    useState<PrescriptionRefillRequest | null>(null);
  const [tableLoading, setTableLoading] = useState<boolean>(true);

  useEffect(() => {
    if (currentAccount) {
      const practiceId = currentAccount.practice.practiceId;
      PrescriptionRequestsPrivateApi.getPrescriptionRequests(practiceId).then(
        (requests) => {
          if (requests) {
            setPrescriptionRefillRequests(requests);
            setTableLoading(false);
          }
        }
      );
    }
  }, [currentAccount]);

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
          title={"Prescription Refill Requests"}
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
