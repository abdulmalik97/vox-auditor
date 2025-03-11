import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { AppointmentInformation } from "../..";
import { BookAppointmentPrivateApi } from "../../api";
import { Schedule } from "../../model";

interface ProviderPickerProps {
  appointmentInformation: AppointmentInformation;
  clearAppointmentInformation: (schedule: Schedule) => void;
  updateAppointmentInformation: (
    updates: Partial<AppointmentInformation>
  ) => void;
}

const ProviderPicker = ({
  appointmentInformation,
  clearAppointmentInformation,
  updateAppointmentInformation,
}: ProviderPickerProps) => {
  const onProviderSelect = (providerId: string) => {
    if (appointmentInformation.providers) {
      BookAppointmentPrivateApi.getSchedule(
        providerId
      ).then((schedule) => {
        updateAppointmentInformation({ providerId: providerId });
        if (schedule) {
          clearAppointmentInformation(schedule);
        }
      });
    }
  };

  const providerId = appointmentInformation.providerId;
  const providers = appointmentInformation.providers;

  if (!providers) {
    return;
  }

  const providerIdsForLocation = Object.keys(providers).filter((providerId) => providers[providerId].locationId === appointmentInformation.locationId);
  
  return (
    <FormControl fullWidth size="small">
      <InputLabel id="provider-label">Provider</InputLabel>
      <Select
        labelId="provider-label"
        label="Provider"
        value={providerId ? providerId : Object.keys(providers).find((providerId) => providers[providerId].locationId === appointmentInformation.locationId)}
        onChange={(e) => onProviderSelect(e.target.value)}
      >
        {providerIdsForLocation.map((key) => (
          <MenuItem key={key} value={key}>
            {"Dr. " +
              providers[key].providerFirstName +
              " " +
              providers[key].providerLastName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ProviderPicker;
