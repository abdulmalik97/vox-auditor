import { EntraAuthApi } from "@/utils/ms_auth";
import { SERVER_ENDPOINT } from "@/constants";
import { AppointmentDetails } from "../model";

export class SearchAppointmentsApi {
  static async getAppointment(appointmentId: string) {
    try {
      const token = await EntraAuthApi.getBearerToken();

      const response = await fetch(
        `${SERVER_ENDPOINT}/api/appointment/search?appointmentId=${appointmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420", //to skip local browser warning using ngrok
          },
        }
      );

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error("Invalid appointment ID");
        }
        console.log("Error getting appointment details");
        return undefined;
      }

      const data = await response.json();

      return data as AppointmentDetails;
    } catch (error) {
      console.error("Error getting appointment details", error);
      throw Error("Error getting appointment details");
    }
  }
}
