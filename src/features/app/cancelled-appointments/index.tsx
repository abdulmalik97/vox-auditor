"use client";

import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  Stack,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { CancelledAppointment } from "./model";
import Table from "@/components/table";
import { useAccount } from "@/contexts/account";
import { CancelledAppointmentsApi } from "./api";
import RefreshIcon from "@mui/icons-material/Refresh";
import EventBusyIcon from "@mui/icons-material/EventBusy";

interface LocationData {
  facilityName: string;
  facilityAddress?: string;
  providers?: string[];
}

const CancelledAppointmentsView = () => {
  const { currentAccount } = useAccount();
  const [tableLoading, setTableLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [cancelledAppointments, setCancelledAppointments] = useState<
    CancelledAppointment[]
  >([]);
  const [locations, setLocations] = useState<Record<string, LocationData>>({});

  const loadCancelledAppointments = async () => {
    if (!currentAccount || !selectedLocation) return;

    try {
      setTableLoading(true);
      setError(null);
      const practiceId = currentAccount.practice.practiceId;
      const response = await CancelledAppointmentsApi.getCancelledAppointments(
        practiceId,
        selectedLocation
      );

      if (response) {
        setCancelledAppointments(
          response.cancelledAppointments.map((appointment) => {
            // Format the appointment date and time
            const dateValue = appointment.appointment_datetime || "";
            const formattedDateTime = dateValue
              ? new Date(dateValue).toLocaleString("en-US", {
                  month: "2-digit",
                  day: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "";

            // Handle provider information
            const providerName = appointment.provider_id
              ? `${appointment.provider_first_name || ""} ${
                  appointment.provider_last_name || ""
                }`
              : "Provider not mentioned";

            // Handle patient information
            const patientName = `${appointment.first_name || ""} ${
              appointment.last_name || ""
            }`;

            return {
              id: appointment.id || appointment.appointmentId || "",
              appointmentDateTime: formattedDateTime,
              patientName: patientName,
              patientPhoneNumber: appointment.primary_phone_number || "",
              providerName: providerName,
              appointmentType: appointment.appointment_type || "",
              reasonForVisit: appointment.reason_for_visit || "",
              status: appointment.status || "CANCELLED",
              createdAt: appointment.created_at || "",
              updatedAt: appointment.updated_at || "",
            };
          })
        );
      }
    } catch (err) {
      setError("Failed to load cancelled appointments. Please try again.");
      console.error("Error loading cancelled appointments:", err);
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    if (currentAccount?.practice.locations) {
      const locationsData = currentAccount.practice.locations;
      setLocations(locationsData);

      // Set the first location as default if available
      const locationIds = Object.keys(locationsData);
      if (locationIds.length > 0 && !selectedLocation) {
        setSelectedLocation(locationIds[0]);
      }
    }
  }, [currentAccount]);

  useEffect(() => {
    if (selectedLocation) {
      loadCancelledAppointments();
    }
  }, [selectedLocation]);

  const handleLocationChange = (event: SelectChangeEvent) => {
    setSelectedLocation(event.target.value);
  };

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
              <EventBusyIcon color="primary" sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Cancelled Appointments
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  View and manage cancelled appointments for your practice
                </Typography>
              </Box>
            </Stack>
            <Box>
              <Tooltip title="Refresh cancelled appointments">
                <IconButton
                  onClick={loadCancelledAppointments}
                  disabled={tableLoading || !selectedLocation}
                  color="primary"
                  sx={{ mr: 1 }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Location Selector */}
          <Box>
            <FormControl fullWidth>
              <InputLabel id="location-select-label">Location</InputLabel>
              <Select
                labelId="location-select-label"
                id="location-select"
                value={selectedLocation}
                label="Location"
                onChange={handleLocationChange}
              >
                {Object.entries(locations).map(([id, location]) => (
                  <MenuItem key={id} value={id}>
                    {location.facilityName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Error Message */}
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Table Section */}
          <Box
            sx={{
              backgroundColor: "background.paper",
              borderRadius: 1,
              overflow: "hidden",
            }}
          >
            <Table
              rows={cancelledAppointments}
              columnLabels={{
                patientName: "Patient Name",
                patientPhoneNumber: "Phone Number",
                providerName: "Provider",
                appointmentDateTime: "Appointment Date & Time",
                appointmentType: "Type",
                reasonForVisit: "Reason",
                status: "Status",
              }}
              dateFields={[""]}
              columnsToExclude={[
                "appointmentId",
                "id",
                "createdAt",
                "updatedAt",
                "provider_id",
                "created_at",
                "updated_at",
                "first_name",
                "last_name",
                "provider_first_name",
                "provider_last_name",
                "appointment_datetime",
                "primary_phone_number",
              ]}
              loading={tableLoading}
            />
            {!tableLoading && cancelledAppointments.length === 0 && (
              <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="body1" color="text.secondary">
                  {!selectedLocation
                    ? "Please select a location to view cancelled appointments"
                    : "No cancelled appointments found"}
                </Typography>
              </Box>
            )}
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
};

export default CancelledAppointmentsView;
