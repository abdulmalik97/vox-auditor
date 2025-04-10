import { SERVER_ENDPOINT } from "@/constants";
import { EntraAuthApi } from "@/utils/ms_auth";
import { CancelledAppointment } from "../model";

export class CancelledAppointmentsApi {
  static async getCancelledAppointments(
    practiceId: string,
    locationId: string
  ) {
    try {
      const token = await EntraAuthApi.getBearerToken();

      const response = await fetch(
        `${SERVER_ENDPOINT}/api/appointment/cancelled?practiceId=${practiceId}&locationId=${locationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420", //to skip local browser warning using ngrok
          },
        }
      );

      if (!response.ok) {
        console.log("Error getting cancelled appointments");
        return undefined;
      }

      const data = await response.json();

      return data as CancelledAppointment[];
    } catch (error) {
      console.error("Error getting cancelled appointments", error);
      throw Error("Error getting cancelled appointments");
    }
  }
}
