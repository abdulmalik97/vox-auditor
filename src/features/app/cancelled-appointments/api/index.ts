import { SERVER_ENDPOINT } from "@/constants";
import { EntraAuthApi } from "@/utils/ms_auth";
import { CancelledAppointmentsResponse } from "../model";

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

      // Handle both the original API response format and the new format
      if (Array.isArray(data)) {
        // New format: direct array of appointments
        return {
          cancelledAppointments: data,
        } as CancelledAppointmentsResponse;
      } else {
        // Original format
        return data as CancelledAppointmentsResponse;
      }
    } catch (error) {
      console.error("Error getting cancelled appointments", error);
      throw Error("Error getting cancelled appointments");
    }
  }
}
