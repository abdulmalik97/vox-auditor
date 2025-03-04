import { endpoint } from "@/constants";
import { PartialBookAppointmentPayload, Providers, Schedule } from "../model";

export class BookAppointmentPrivateApi {
  static async getProviders(practiceId: string) {
    try {
      const response = await fetch(
        `${endpoint}/api/provider?practiceId=${practiceId}`,
        {
          headers: {
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
      const response = await fetch(
        `${endpoint}/api/schedule?providerIds=${providerIds.join(",")}`,
        {
          headers: {
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
      const response = await fetch(`${endpoint}/api/appointment`, {
        method: "POST",
        headers: {
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
