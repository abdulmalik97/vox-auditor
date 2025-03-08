import { Typography, Divider } from "@mui/material";
import { AppointmentInformation } from "../../../..";

interface AppointmentDetailsProps {
  appointmentInformation: AppointmentInformation;
}

const AppointmentDetails = ({
  appointmentInformation,
}: AppointmentDetailsProps) => {
  const getProviderName = () => {
    if (appointmentInformation.providers && appointmentInformation.providerId) {
      return (
        appointmentInformation.providers[appointmentInformation.providerId]
          .providerFirstName +
        " " +
        appointmentInformation.providers[appointmentInformation.providerId]
          .providerLastName
      );
    }
  };

  const getProviderSpeciality = () => {
    if (appointmentInformation.providers && appointmentInformation.providerId) {
      return appointmentInformation.providers[appointmentInformation.providerId]
        .providerSpeciality;
    }
  };

  return (
    <>
      <Typography fontWeight={600}>Provider</Typography>
      <Typography>{getProviderName()}</Typography>
      <Typography>{getProviderSpeciality()}</Typography>
      <Divider sx={{ my: 2 }} />
      <Typography fontWeight={600}>Clinic Information</Typography>
      <Typography>{"Medical Services Of The Border Wyoming"}</Typography>
      <Typography>{"2121 Wyoming Ave, El Paso, TX 79903"}</Typography>
      <Divider sx={{ my: 2 }} />
      <Typography fontWeight={600}>Appointment Time</Typography>
      <Typography>
        {appointmentInformation.date} at {appointmentInformation.time}
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Typography fontWeight={600}>Patient Details</Typography>
      <Typography>
        {appointmentInformation.patientFirstName}{" "}
        {appointmentInformation.patientLastName}
      </Typography>
      <Typography>
        Date of Birth: {appointmentInformation.patientBirthdate}
      </Typography>
      <Typography>
        Phone: {appointmentInformation.patientPhoneNumber}
      </Typography>
      <Typography>Status: {"New Patient"}</Typography>
    </>
  );
};

export default AppointmentDetails;
