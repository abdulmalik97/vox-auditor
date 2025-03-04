import { Box, Card, Typography } from "@mui/material";
import { AppointmentInformation } from "../..";
import theme from "@/theme";

interface ScheduleProps {
  appointmentInformation: AppointmentInformation;
  updateAppointmentInformation: (
    updates: Partial<AppointmentInformation>
  ) => void;
}

const ProviderSchedule = ({
  appointmentInformation,
  updateAppointmentInformation,
}: ScheduleProps) => {
  const displaySchedule = () => {
    const elements: JSX.Element[] = [];

    const schedule = appointmentInformation.schedule;

    const selectedDate = appointmentInformation.date
    const selectedTime = appointmentInformation.time;

    if (!schedule || !selectedDate) {
      return;
    }

    for (const key of Object.keys(schedule)) {
      const location = schedule[key];

      if (location.availability[selectedDate]) {
        elements.push(
          <Box pb={4} key={key}>
            <Box pb={2} textAlign={{ xs: "center", sm: "center" }}>
              <Typography>
                <b>{location.locationName}</b>
              </Typography>
              <Typography component="p" color="textSecondary" variant="body2">
                {location.locationAddress}
              </Typography>
            </Box>
            <Box
              display="flex"
              flexWrap="wrap"
              gap={1}
              justifyContent={{ xs: "center", sm: "center" }}
              sx={{ width: "100%" }}
            >
              {location.availability[selectedDate].formattedTimes.map(
                (time, index) => (
                  <Card
                    key={index}
                    onClick={() =>
                      updateAppointmentInformation({
                        locationAddress: location.locationAddress,
                        locationName: location.locationName,
                        time: time,
                      })
                    }
                    sx={{
                      textAlign: "center",
                      cursor: "pointer",
                      backgroundColor:
                        selectedTime === time
                          ? theme.palette.primary.main
                          : "#fff",
                      color: selectedTime === time ? "#fff" : "#000",
                      transition: "0.3s",
                    }}
                  >
                    <Box p={2}>
                      <Typography>{time}</Typography>
                    </Box>
                  </Card>
                )
              )}
            </Box>
          </Box>
        );
      }
    }

    if (elements.length === 0) {
      return (
        <Typography mt={4} align="center" pb={2} color="text.secondary">
          There is no available times on this day.
        </Typography>
      );
    }

    return elements;
  };

  return <div>{displaySchedule()}</div>;
};

export default ProviderSchedule;
