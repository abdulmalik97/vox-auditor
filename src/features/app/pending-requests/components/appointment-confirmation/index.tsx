"use client";

import * as React from "react";
import { Modal, Box, Button, Typography, Grid, Divider } from "@mui/material";

interface AppointmentConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (notes: string) => void;
  providerNameToSchedule?: string;
  patientFirstName?: string;
  patientLastName?: string;
  patientDob?: string;
  patientPhoneNumber?: string;
  patientSecondaryPhoneNumber?: string;
  status?: string;
}

const AppointmentConfirmationModal = ({
  open,
  onClose,
  onSubmit,
  providerNameToSchedule,
  patientFirstName,
  patientLastName,
  patientDob,
  patientPhoneNumber,
  patientSecondaryPhoneNumber,
  status,
}: AppointmentConfirmationModalProps) => {
  const handleSubmit = () => {
    onSubmit("");
    onClose();
  };

  const InfoRow = ({ label, value }: { label: string; value?: string }) => (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid item xs={4}>
        <Typography variant="subtitle2" color="text.secondary">
          {label}
        </Typography>
      </Grid>
      <Grid item xs={8}>
        <Typography>{value || "—"}</Typography>
      </Grid>
    </Grid>
  );

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          padding: 4,
          borderRadius: 2,
          boxShadow: 24,
          width: 500,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <Typography variant="h5" sx={{ mb: 3 }}>
          Appointment Request Details
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Patient Information
          </Typography>
          <InfoRow
            label="Name"
            value={`${patientFirstName} ${patientLastName}`}
          />
          <InfoRow label="Date of Birth" value={patientDob} />
          <InfoRow label="Primary Phone" value={patientPhoneNumber} />
          <InfoRow
            label="Secondary Phone"
            value={patientSecondaryPhoneNumber}
          />
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Appointment Details
          </Typography>
          <InfoRow label="Provider" value={providerNameToSchedule} />
          <InfoRow label="Status" value={status} />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
          <Button onClick={onClose} variant="outlined" sx={{ mr: 2 }}>
            Cancel
          </Button>
          {/* <Button onClick={handleSubmit} variant="contained" color="primary">
            Schedule Appointment Now
          </Button> */}
        </Box>
      </Box>
    </Modal>
  );
};

export default AppointmentConfirmationModal;
