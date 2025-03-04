import { Typography } from "@mui/material";
import { AppointmentInformation } from "../../..";
import AppointmentDetails from "./details";

interface AppointmentConfirmationPageProps {
  appointmentInformation: AppointmentInformation;
}

const AppointmentConfirmationPage = ({
  appointmentInformation,
}: AppointmentConfirmationPageProps) => {
  return (
    <>
      <Typography align="center" pb={2} color="text.secondary">
        Confirm your appointment details.
      </Typography>
      <AppointmentDetails appointmentInformation={appointmentInformation} />
    </>
  );
};

export default AppointmentConfirmationPage;
