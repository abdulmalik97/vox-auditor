import { Typography, Stack, TextField, MenuItem } from "@mui/material";
import { AppointmentInformation } from "../../..";
import { useState } from "react";

interface AppointmentInformationPageProps {
  appointmentInformation: AppointmentInformation;
  updateAppointmentInformation: (
    updates: Partial<AppointmentInformation>
  ) => void;
}

const AppointmentInformationPage = ({
  appointmentInformation,
  updateAppointmentInformation,
}: AppointmentInformationPageProps) => {
  return (
    <>
      <Typography align="center" pb={2} color="text.secondary">
        Enter your information for the appointment booking. 
      </Typography>
      <Stack spacing={2}>
        <TextField
          label="Patient First Name"
          fullWidth
          size="small"
          defaultValue={appointmentInformation.patientFirstName}
          onBlur={(e) =>
            updateAppointmentInformation({
              patientFirstName: e.target.value,
            })
          }
        />
        <TextField
          label="Patient Last Name"
          fullWidth
          size="small"
          defaultValue={appointmentInformation.patientLastName || ""}
          onBlur={(e) =>
            updateAppointmentInformation({
              patientLastName: e.target.value,
            })
          }
        />
        <TextField
          label="Patient Date of Birth"
          type="date"
          fullWidth
          size="small"
          defaultValue={appointmentInformation.patientBirthdate || ""}
          InputLabelProps={{ shrink: true }}
          onBlur={(e) =>
            updateAppointmentInformation({
              patientBirthdate: e.target.value,
            })
          }
        />
        <TextField
          label="Patient Phone Number"
          fullWidth
          size="small"
          type="tel"
          defaultValue={appointmentInformation.patientPhoneNumber || ""}
          error={appointmentInformation.patientPhoneNumber !== undefined && appointmentInformation.patientPhoneNumber.length !== 10}
          helperText={appointmentInformation.patientPhoneNumber !== undefined && appointmentInformation.patientPhoneNumber.length !== 10 ? "Phone number must be 10 digits" : ""}
          onBlur={(e) =>
            updateAppointmentInformation({
              patientPhoneNumber: e.target.value,
            })
          }
        />
        <TextField
          onChange={(e) =>
            updateAppointmentInformation({
              patientType: e.target.value,
            })
          }
          select
          value={appointmentInformation.patientType || "New Patient"}
          label="Patient Type"
          fullWidth
          size="small"
        >
          <MenuItem value="New Patient">New Patient</MenuItem>
          <MenuItem value="Existing Patient">Existing Patient</MenuItem>
        </TextField>
      </Stack>
    </>
  );
};

export default AppointmentInformationPage;
