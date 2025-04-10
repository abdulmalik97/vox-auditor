"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { SearchAppointmentsApi } from "./api";
import { AppointmentDetails } from "./model";
import { useSearchParams } from "next/navigation";

const SearchAppointmentsView = () => {
  const searchParams = useSearchParams();
  const appointmentIdFromUrl = searchParams.get("appointmentId") ?? "";
  const [appointmentId, setAppointmentId] = useState(appointmentIdFromUrl);
  const [appointmentDetails, setAppointmentDetails] = useState<
    AppointmentDetails | undefined
  >(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (appointmentIdFromUrl) {
      handleSearch();
    }
  }, [appointmentIdFromUrl]);

  const handleSearch = async () => {
    if (!appointmentId.trim()) {
      setError("Please enter an appointment ID");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const details = await SearchAppointmentsApi.getAppointment(appointmentId);
      setAppointmentDetails(details);
    } catch (err) {
      setError(
        err instanceof Error
          ? "You have entered an invalid appointment ID."
          : "Failed to fetch appointment details. Please try again."
      );
      setAppointmentDetails(undefined);
    } finally {
      setLoading(false);
    }
  };

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
      <Box sx={{ width: "40%" }}>
        <Typography variant="subtitle2" color="text.secondary">
          {label}
        </Typography>
      </Box>
      <Box sx={{ width: "60%" }}>
        <Typography>{value}</Typography>
      </Box>
    </Stack>
  );

  return (
    <Container maxWidth={false}>
      <Paper elevation={0} sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Header Section */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid",
              borderColor: "divider",
              pb: 2,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <SearchIcon color="primary" sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Search Appointments
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Search appointment details
                </Typography>
              </Box>
            </Stack>
          </Box>

          {/* Search Section */}
          <Box>
            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Appointment ID"
                value={appointmentId}
                onChange={(e) => setAppointmentId(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
              <Button
                variant="contained"
                onClick={handleSearch}
                disabled={loading}
                sx={{ minWidth: 120 }}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? "Searching..." : "Search"}
              </Button>
            </Stack>

            {error && (
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            {appointmentDetails && (
              <Box
                sx={{
                  backgroundColor: "background.paper",
                  borderRadius: 1,
                  p: 3,
                  mt: 2,
                }}
              >
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Appointment Details
                </Typography>

                {/* Patient Information Section */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, color: 'primary.main' }}>
                    Patient Information
                  </Typography>
                  <InfoRow
                    label="Patient Name"
                    value={`${appointmentDetails.patientName}`}
                  />
                  <InfoRow
                    label="Patient Phone Number"
                    value={appointmentDetails.patientPhoneNumber}
                  />
                  <InfoRow
                    label="Patient Date of Birth"
                    value={appointmentDetails.patientDateOfBirth}
                  />
                </Box>

                {/* Provider Information Section */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, color: 'primary.main' }}>
                    Provider Information
                  </Typography>
                  <InfoRow
                    label="Provider Name"
                    value={`${appointmentDetails.providerName}`}
                  />
                </Box>

                {/* Call Information Section */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, color: 'primary.main' }}>
                    Call Information
                  </Typography>
                  <InfoRow
                    label="Appointment Date/Time"
                    value={appointmentDetails.appointmentDateTime}
                  />
                  <InfoRow
                    label="Status"
                    value={
                      appointmentDetails.appointmentStatus
                        .charAt(0)
                        .toUpperCase() +
                      appointmentDetails.appointmentStatus.slice(1)
                    }
                  />
                  <InfoRow
                    label="Reason for Call"
                    value={appointmentDetails.reasonForCall}
                  />
                </Box>

                {/* Facility Information Section */}
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, color: 'primary.main' }}>
                    Facility Information
                  </Typography>
                  <InfoRow
                    label="Facility Name"
                    value={appointmentDetails.facilityName}
                  />
                  <InfoRow
                    label="Facility Address"
                    value={appointmentDetails.facilityAddress}
                  />
                  <InfoRow
                    label="Facility Phone Number"
                    value={appointmentDetails.facilityPhoneNumber}
                  />
                  <InfoRow
                    label="Facility Fax Number"
                    value={appointmentDetails.facilityFaxNumber}
                  />
                </Box>
              </Box>
            )}
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
};

export default SearchAppointmentsView;
