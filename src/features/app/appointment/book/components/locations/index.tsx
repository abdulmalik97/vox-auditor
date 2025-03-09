import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { AppointmentInformation } from "../..";
import { Schedule } from "../../model";

interface LocationPickerProps {
  appointmentInformation: AppointmentInformation;
  clearAppointmentInformation: (schedule: Schedule) => void;
  updateAppointmentInformation: (
    updates: Partial<AppointmentInformation>
  ) => void;
}

const LocationPicker = ({
  appointmentInformation,
  clearAppointmentInformation,
  updateAppointmentInformation,
}: LocationPickerProps) => {

  const onLocationSelect = (locationId: string) => {
    if (appointmentInformation.locations && appointmentInformation.providers) {
      updateAppointmentInformation({ locationId: locationId, providerId: Object.keys(appointmentInformation.providers).find((providerId) => 
        appointmentInformation.providers && appointmentInformation.providers[providerId].locationId === locationId) });
      if (appointmentInformation.schedule) {
        clearAppointmentInformation(appointmentInformation.schedule);
      }
    }
  };

  const locationId = appointmentInformation.locationId;
  const locations = appointmentInformation.locations;

  if (!locations) {
    return;
  }

  return (
    <FormControl fullWidth size="small">
      <InputLabel id="provider-label">Provider</InputLabel>
      <Select
        labelId="provider-label"
        label="Provider"
        value={locationId ? locationId : Object.keys(locations)[0]}
        onChange={(e) => onLocationSelect(e.target.value)}
      >
        {Object.keys(locations).map((key) => (
          <MenuItem key={key} value={key}>
            {locations[key].facilityName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LocationPicker;