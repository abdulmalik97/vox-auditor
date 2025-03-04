import dayjs from "dayjs";
import { DATE_FORMAT } from "../constants";
import { Schedule } from "../model";

// TODO: Move this to server
export const getFirstAvailableDate = (schedule: Schedule) => {
  let minDate = undefined;

  if (schedule) {
    for (const practiceId of Object.keys(schedule)) {
      const dates = Object.keys(schedule[practiceId].availability);
      if (dates.length > 0) {
        const firstDate = dates[0];

        const formattedDate = dayjs(firstDate, DATE_FORMAT);
        if (minDate === undefined) {
          minDate = firstDate;
        } else {
          if (formattedDate.isBefore(minDate)) {
            minDate = firstDate;
          }
        }
      }
    }
  }

  return minDate;
};
