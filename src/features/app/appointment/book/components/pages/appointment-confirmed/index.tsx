import { Typography } from "@mui/material";
import { AppointmentInformation } from "../../..";
import AppointmentDetails from "../appointment-confirmation/details";

interface AppointmentConfirmedPageProps {
  appointmentInformation: AppointmentInformation;
}

const AppointmentConfirmedPage = ({
  appointmentInformation,
}: AppointmentConfirmedPageProps) => {
  return (
    <>
      <Typography align="center" pb={2} color="text.secondary">
        Your appointment has been confirmed. Below are the details of you
        appointment. In addition to this you will recieve a text confirmation.
      </Typography>
      <AppointmentDetails appointmentInformation={appointmentInformation} />
    </>
  );
};

export default AppointmentConfirmedPage;
