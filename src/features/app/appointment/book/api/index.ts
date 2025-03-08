
import { EntraAuthApi } from "@/utils/ms_auth";
import { PartialBookAppointmentPayload, Providers, Schedule } from "../model";
import { AZURE_CLIENT_ID, SERVER_ENDPOINT } from "@/constants";

export class BookAppointmentPrivateApi {
  static async getProviders(practiceId: string) {
    try {
      const token = await EntraAuthApi.getBearerToken(`api://${AZURE_CLIENT_ID}`);

      const response = await fetch(
        `${SERVER_ENDPOINT}/api/provider?practiceId=${practiceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.log("Error getting providers");
        return undefined;
      }

      const data = await response.json();

      return data as Providers;
    } catch (error) {
      console.error("Error getting providers", error);
      throw Error("No providers returned.");
    }
  }

  static async getSchedule(providerIds: string[]) {
    try {
      const token = await EntraAuthApi.getBearerToken(`api://${AZURE_CLIENT_ID}`);

      const response = await fetch(
        `${SERVER_ENDPOINT}/api/schedule?providerIds=${providerIds.join(",")}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.log("Error getting schedule.");
        return undefined;
      }

      const data = await response.json();

      return data as Schedule;
    } catch (error) {
      console.error("Error getting schedules", error);
      throw Error("No schedule data returned.");
    }
  }

  static async bookAppointment(
    bookAppointmentPayload: PartialBookAppointmentPayload
  ) {
    try {
      const token = await EntraAuthApi.getBearerToken(`api://${AZURE_CLIENT_ID}`);

      const response = await fetch(`${SERVER_ENDPOINT}/api/appointment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookAppointmentPayload),
      });

      if (response.status === 400) {
        console.log("Failed to book the appointment.");
        throw new Error("Failed to book the appointment.");
      }
    } catch (error) {
      console.error("Failed to book the appointment.", error);
      throw new Error("Failed to book the appointment.");
    }
  }
}
