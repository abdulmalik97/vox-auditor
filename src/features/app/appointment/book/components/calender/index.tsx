import { LocalizationProvider, DateCalendar } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { AppointmentInformation } from "../..";
import { getFirstAvailableDate } from "../../utils";

interface AppointmentDatePickerProps {
  appointmentInformation: AppointmentInformation;
  updateAppointmentInformation: (
    updates: Partial<AppointmentInformation>
  ) => void;
}

const AppointmentDatePicker = ({
  appointmentInformation,
  updateAppointmentInformation,
}: AppointmentDatePickerProps) => {
  const DATE_FORMAT = "YYYY-MM-DD";


  const getDatesWithAvailability = () => {
    const datesWithAvailability = [];
    if (appointmentInformation.schedule) {
      for (const practiceId of Object.keys(appointmentInformation.schedule)) {
        const dates = Object.keys(appointmentInformation.schedule[practiceId].availability);
        for(const date of dates) {
          datesWithAvailability.push(appointmentInformation.schedule[practiceId].availability[date].dateInYYYYMMDD);
        }
      }
    }
    return datesWithAvailability;
  };

  const shouldDisableDate = (date: dayjs.Dayjs) => {
    const availableDates = getDatesWithAvailability();
    const formattedDate = date.format(DATE_FORMAT);
    return !availableDates.includes(formattedDate);
  };

  const getMinDate = () => {
    if (appointmentInformation.schedule) {
      const firstDateAvailable = getFirstAvailableDate(
        appointmentInformation.schedule
      );
      return dayjs(firstDateAvailable)
    }

    return dayjs();
  };

  const getMaxDate = () => {
    let maxDate = null;

    if (appointmentInformation.schedule) {
      for (const practiceId of Object.keys(appointmentInformation.schedule)) {
        const dates = Object.keys(
          appointmentInformation.schedule[practiceId].availability
        );
        if (dates.length > 0) {
          const lastDate = dates[dates.length - 1];
          const formattedDate = dayjs(lastDate, DATE_FORMAT);
          if (maxDate === null) {
            maxDate = formattedDate;
          } else {
            if (formattedDate.isAfter(maxDate)) {
              maxDate = formattedDate;
            }
          }
        }
      }
    }

    return maxDate ?? dayjs();
  };

  const minDate = getMinDate();
  const maxDate = getMaxDate();

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      const formattedDate = date.format(DATE_FORMAT);
      updateAppointmentInformation({
        date: formattedDate,
        time: undefined
      });
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        minDate={minDate}
        maxDate={maxDate}
        value={
          appointmentInformation.date
            ? dayjs(appointmentInformation.date, DATE_FORMAT)
            : minDate
        }
        onChange={handleDateChange}
        shouldDisableDate={shouldDisableDate}
      />
    </LocalizationProvider>
  );
};

export default AppointmentDatePicker;
