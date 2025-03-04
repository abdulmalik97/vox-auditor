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
  const onProviderSelect = (actorId: string) => {
    if (appointmentInformation.providers) {
      BookAppointmentPrivateApi.getSchedule(
        appointmentInformation.providers[actorId].providerIds
      ).then((schedule) => {
        updateAppointmentInformation({ actorId: actorId });
        if (schedule) {
          clearAppointmentInformation(schedule);
        }
      });
    }
  };

  const actorId = appointmentInformation.actorId;
  const providers = appointmentInformation.providers;

  if (!providers) {
    return;
  }

  return (
    <FormControl fullWidth size="small">
      <InputLabel id="provider-label">Provider</InputLabel>
      <Select
        labelId="provider-label"
        label="Provider"
        value={actorId ? actorId : Object.keys(providers)[0]}
        onChange={(e) => onProviderSelect(e.target.value)}
      >
        {Object.keys(providers).map((key) => (
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
