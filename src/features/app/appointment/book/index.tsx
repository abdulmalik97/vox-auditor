"use client";

import { Box, Button, Container, Stack, Typography, Paper, Stepper, Step, StepLabel } from "@mui/material";
import { useEffect, useState } from "react";
import AppointmentDatePicker from "./components/calender";
import ProviderPicker from "./components/providers";
import { Locations, Providers, Schedule } from "./model";
import { BookAppointmentPrivateApi } from "./api";
import ProviderSchedule from "./components/schedule";
import AppointmentConfirmationPage from "./components/pages/appointment-confirmation";
import AppointmentInformationPage from "./components/pages/appointment-information";
import { getFirstAvailableDate } from "./utils";
import AppointmentConfirmedPage from "./components/pages/appointment-confirmed";
import { useSearchParams } from "next/navigation";
import EventIcon from '@mui/icons-material/Event';
import LocationPicker from "./components/locations";

const STEPS = [
  'Select Time',
  'Patient Information',
  'Confirm Details',
  'Confirmed'
];

export interface AppointmentInformation {
  providers?: Providers;
  locations?: Locations;
  schedule?: Schedule;
  providerId?: string;
  locationId?: string;
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
  const expiryKey = searchParams.get("expiryKey") ?? "";
  const [isUrlValid, setIsUrlValid] = useState<boolean>();
  const [appointmentInformation, setAppointmentInformation] = useState<AppointmentInformation>({patientType: "New Patient"});
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const bookAppointment = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await BookAppointmentPrivateApi.bookAppointment(appointmentInformation);
      await BookAppointmentPrivateApi.deactivateUrl(expiryKey);
      setCurrentStep(4);
    } catch (error) {
      setError("Failed to book appointment. Please try again.");
      console.error('Error booking appointment:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {

    const loadInitialData = async () => {
      try {
        const locations = await BookAppointmentPrivateApi.getLocations(practiceId);
        const providers = await BookAppointmentPrivateApi.getProviders(practiceId);

        if (locations && providers) {

          const locationId = Object.keys(locations)[0];
          const providerId = Object.keys(providers).find((providerId) => providers[providerId].locationId === locationId);
          
          updateAppointmentInformation({
            locations: locations,
            providers: providers,
            providerId: providerId,
            locationId: Object.keys(locations)[0],
          });

          if (providerId) {
            const schedule = await BookAppointmentPrivateApi.getSchedule(
              providerId
            );

            if (schedule) {
              updateAppointmentInformation({
                schedule: schedule,
                date: getFirstAvailableDate(schedule),
              });
            }
          }
        }
      } catch (error) {
        console.error('Error loading appointment data:', error);
      }
    };

    if (!expiryKey) {
      setIsUrlValid(false);
    } else if (expiryKey) {
      BookAppointmentPrivateApi.verifyUrl(expiryKey).then((isUrlValid) => {
        if (isUrlValid) {
          loadInitialData();
        }
        else {
          setIsUrlValid(false);
        }
      });
    }

  }, [practiceId, expiryKey]);

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
            <Typography color="text.secondary"> {isUrlValid || isUrlValid === undefined ? "Loading appointment details..." : "This URL has expired."} </Typography>
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
                  Select the location, provider, and date/time of your appointment.
                </Typography>
                <Box>
                  <LocationPicker
                    clearAppointmentInformation={clearAppointmentInformation}
                    appointmentInformation={appointmentInformation}
                    updateAppointmentInformation={updateAppointmentInformation}
                  />
                </Box>
                <Box>
                  <ProviderPicker
                    clearAppointmentInformation={clearAppointmentInformation}
                    appointmentInformation={appointmentInformation}
                    updateAppointmentInformation={updateAppointmentInformation}
                  />
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" align="center">
                    Note that some dates are disabled as there is no availability for those dates.
                  </Typography>
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
              <>
                <AppointmentConfirmationPage
                  appointmentInformation={appointmentInformation}
                />
                {error && (
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography color="error">{error}</Typography>
                  </Box>
                )}
              </>
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


            {currentStep === 3 ? (
              <Button
                variant="contained"
                disabled={disableNext() || isLoading}
                onClick={async () => await bookAppointment()}
              >
                {isLoading ? "Booking..." : "Confirm Appointment"}
              </Button>
            ) : (
              <Button
                variant="contained"
                disabled={disableNext()}
                onClick={() => setCurrentStep(currentStep + 1)}
              >
                {"Next"}
              </Button>
            )}
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
};

export default BookAppointmentView;
