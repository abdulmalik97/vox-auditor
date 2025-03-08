"use client";

import { Box, Button, Container, Stack, Typography, Paper, Stepper, Step, StepLabel } from "@mui/material";
import { useEffect, useState } from "react";
import AppointmentDatePicker from "./components/calender";
import ProviderPicker from "./components/providers";
import { Providers, Schedule } from "./model";
import { BookAppointmentPrivateApi } from "./api";
import ProviderSchedule from "./components/schedule";
import AppointmentConfirmationPage from "./components/pages/appointment-confirmation";
import AppointmentInformationPage from "./components/pages/appointment-information";
import { getFirstAvailableDate } from "./utils";
import AppointmentConfirmedPage from "./components/pages/appointment-confirmed";
import { useSearchParams } from "next/navigation";
import EventIcon from '@mui/icons-material/Event';

const STEPS = [
  'Select Time',
  'Patient Information',
  'Confirm Details',
  'Confirmed'
];

export interface AppointmentInformation {
  providers?: Providers;
  schedule?: Schedule;
  actorId?: string;
  date?: string;
  time?: string;
  patientFirstName?: string;
  patientLastName?: string;
  patientBirthdate?: string;
  patientPhoneNumber?: string;
  patientType?: string;
  locationName?: string;
  locationAddress?: string;
}

const BookAppointmentView = () => {
  const searchParams = useSearchParams();
  const practiceId = searchParams.get("practiceId") ?? "";
  const [appointmentInformation, setAppointmentInformation] = useState<AppointmentInformation>({});
  const [currentStep, setCurrentStep] = useState(1);

  const updateAppointmentInformation = (updates: Partial<AppointmentInformation>) => {
    setAppointmentInformation((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const clearAppointmentInformation = (schedule: Schedule) => {
    updateAppointmentInformation({
      schedule: schedule,
      date: getFirstAvailableDate(schedule),
      time: undefined,
      locationAddress: undefined,
      locationName: undefined,
    });
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const providers = await BookAppointmentPrivateApi.getProviders(practiceId);
        if (providers) {
          updateAppointmentInformation({
            providers: providers,
            actorId: Object.keys(providers)[0],
          });

          const schedule = await BookAppointmentPrivateApi.getSchedule(
            providers[Object.keys(providers)[0]].providerIds
          );
          if (schedule) {
            updateAppointmentInformation({
              schedule: schedule,
              date: getFirstAvailableDate(schedule),
            });
          }
        }
      } catch (error) {
        console.error('Error loading appointment data:', error);
      }
    };

    loadInitialData();
  }, [practiceId]);

  const disableNext = () => {
    if (currentStep === 1 && (!appointmentInformation.date || !appointmentInformation.time)) {
      return true;
    }

    if (
      currentStep === 2 &&
      (!appointmentInformation.patientFirstName ||
        !appointmentInformation.patientLastName ||
        !appointmentInformation.patientPhoneNumber ||
        !appointmentInformation.patientBirthdate ||
        !appointmentInformation.patientType)
    ) {
      return true;
    }

    if (currentStep === 4) return true;

    return false;
  };

  if (!appointmentInformation.providers || !appointmentInformation.schedule) {
    return (
      <Container maxWidth="md">
        <Paper elevation={0} sx={{ p: 3, mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <Typography color="text.secondary">Loading appointment details...</Typography>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={0} sx={{ p: 3, mt: 2 }}>
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
              <EventIcon color="primary" sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Book Appointment
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Schedule your appointment with our healthcare providers
                </Typography>
              </Box>
            </Stack>
          </Box>

          {/* Stepper */}
          <Stepper activeStep={currentStep - 1} alternativeLabel>
            {STEPS.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Content Section */}
          <Box sx={{ minHeight: '50vh' }}>
            {currentStep === 1 && (
              <Stack spacing={3}>
                <Typography variant="subtitle1" color="text.secondary" align="center">
                  Select the provider, location, and date/time of your appointment.
                </Typography>
                <Box>
                  <ProviderPicker
                    clearAppointmentInformation={clearAppointmentInformation}
                    appointmentInformation={appointmentInformation}
                    updateAppointmentInformation={updateAppointmentInformation}
                  />
                </Box>
                <Box>
                  <AppointmentDatePicker
                    appointmentInformation={appointmentInformation}
                    updateAppointmentInformation={updateAppointmentInformation}
                  />
                </Box>
                <Box>
                  <ProviderSchedule
                    appointmentInformation={appointmentInformation}
                    updateAppointmentInformation={updateAppointmentInformation}
                  />
                </Box>
              </Stack>
            )}

            {currentStep === 2 && (
              <AppointmentInformationPage
                appointmentInformation={appointmentInformation}
                updateAppointmentInformation={updateAppointmentInformation}
              />
            )}

            {currentStep === 3 && (
              <AppointmentConfirmationPage
                appointmentInformation={appointmentInformation}
              />
            )}

            {currentStep === 4 && (
              <AppointmentConfirmedPage
                appointmentInformation={appointmentInformation}
              />
            )}
          </Box>

          {/* Navigation Buttons */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            pt: 2,
            borderTop: '1px solid',
            borderColor: 'divider'
          }}>
            <Button
              variant="outlined"
              disabled={currentStep === 1 || currentStep === 4}
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              Previous
            </Button>

            <Button
              variant="contained"
              disabled={disableNext()}
              onClick={() => setCurrentStep(currentStep + 1)}
            >
              {currentStep === 3 ? "Confirm Appointment" : "Next"}
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
};

export default BookAppointmentView;
