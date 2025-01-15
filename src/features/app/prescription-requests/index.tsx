"use client";

import React, { useState } from "react";
import { Container, Box } from "@mui/material";
import PrescriptionConfirmationModal from "./components/prescrption-confirmation";
import { PrescriptionRefillRequest } from "./model";
import Table from "@/components/table";

interface PrescriptionRequestsViewProps {
  prescriptionRefillRequests: PrescriptionRefillRequest[];
}

const PrescriptionRequestsView = ({
  prescriptionRefillRequests,
}: PrescriptionRequestsViewProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [refillRequest, setRefillRequest] =
    useState<PrescriptionRefillRequest | null>(null);
  // const [_notes, setNotes] = useState<string>("");

  const handleOpenModal = (refillRequest: PrescriptionRefillRequest) => {
    setRefillRequest(refillRequest);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    // setNotes("");
  };

  const handleSubmit = () => {
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
          title={"Prescriptions"}
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
