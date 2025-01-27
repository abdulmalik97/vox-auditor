"use client";

import * as React from "react";
import {
  Modal,
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";

interface PrescriptionConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (notes: string) => Promise<void>;
  prescriptionName?: string;
  patientFirstName?: string;
  patientLastName?: string;
  patientDob?: string;
  patientPhoneNumber?: string;
  status?: string;
}

const PrescriptionConfirmationModal = ({
  open,
  onClose,
  onSubmit,
  prescriptionName,
  patientFirstName,
  patientLastName,
  patientDob,
  patientPhoneNumber,
  status,
}: PrescriptionConfirmationModalProps) => {
  const [notes, setNotes] = React.useState<string>("");
  const [isConfirmingPrescription, setIsConfirmingPrescription] =
    React.useState<boolean>(false);

  const handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotes(event.target.value);
  };

  const handleSubmit = async () => {
    setIsConfirmingPrescription(true);
    await onSubmit(notes);
    setNotes(""); // Clear the notes after submitting
    onClose(); // Close the modal
    setIsConfirmingPrescription(false);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          padding: 3,
          borderRadius: 2,
          boxShadow: 24,
          width: 400,
        }}
      >
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          <b>Confirm Prescription Refill</b>
        </Typography>

        {/* Prescription Details */}
        <Box sx={{ marginBottom: 2 }}>
          <Typography sx={{ marginBottom: 1 }}>
            <strong>Prescription Name:</strong>
          </Typography>
          <Typography sx={{ marginBottom: 2 }}>{prescriptionName}</Typography>

          <Typography sx={{ marginBottom: 1 }}>
            <strong>Patient Name:</strong>
          </Typography>
          <Typography sx={{ marginBottom: 2 }}>
            {patientFirstName} {patientLastName}
          </Typography>

          <Typography sx={{ marginBottom: 1 }}>
            <strong>Date of Birth:</strong>
          </Typography>
          <Typography sx={{ marginBottom: 2 }}>{patientDob}</Typography>

          <Typography sx={{ marginBottom: 1 }}>
            <strong>Phone Number:</strong>
          </Typography>
          <Typography sx={{ marginBottom: 2 }}>{patientPhoneNumber}</Typography>

          <Typography sx={{ marginBottom: 1 }}>
            <strong>Status:</strong>
          </Typography>
          <Typography>{status}</Typography>
        </Box>

        {/* Notes TextField */}
        <TextField
          label="Notes For Patient"
          placeholder={
            "Any notes such as the pharmacy the patient needs to pick the prescription at."
          }
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          value={notes}
          onChange={handleNotesChange}
          slotProps={{
            htmlInput: {
              maxLength: 100, // Set the character limit here
            },
          }}
          helperText={`${notes.length}/100 characters`} // Display the current character count
          sx={{ marginBottom: 2 }}
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={onClose} sx={{ marginRight: 1 }}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={notes.trim() === "" || isConfirmingPrescription}
            endIcon={
              isConfirmingPrescription ? (
                <CircularProgress size={24} color="inherit" />
              ) : null
            }
          >
            {isConfirmingPrescription ? "Submitting" : "Confirm"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default PrescriptionConfirmationModal;
