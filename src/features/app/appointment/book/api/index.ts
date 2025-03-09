
import { EntraAuthApi } from "@/utils/ms_auth";
import { PartialBookAppointmentPayload, Providers, Schedule } from "../model";
import { SERVER_ENDPOINT } from "@/constants";
import { AppointmentInformation } from "..";

export class BookAppointmentPrivateApi {
  static async getProviders(practiceId: string) {
    try {
      const token = await EntraAuthApi.getBearerToken();

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

  static async getSchedule(providerId: string) {
    try {
      const token = await EntraAuthApi.getBearerToken();

      const response = await fetch(
        `${SERVER_ENDPOINT}/api/schedule?providerId=${providerId}`,
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

  static async verifyUrl(expiryKey: string) {
    try {
      const token = await EntraAuthApi.getBearerToken();

      const response = await fetch(
        `${SERVER_ENDPOINT}/api/appointment/url/verify`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ expiryKey }),
        }
      );

      if (!response.ok) {
        console.log("Error verifying url.");
        return undefined;
      }

      const data = await response.json() as { isUrlValid: boolean };

      return data.isUrlValid;
    } catch (error) {
      console.error("Error verifying url", error);
      throw Error("No url data returned.");
    }
  }

  static async deactivateUrl(expiryKey: string) {
    try {
      const token = await EntraAuthApi.getBearerToken();

      const response = await fetch(
        `${SERVER_ENDPOINT}/api/appointment/url/deactivate`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ expiryKey }),
        }
      );

      if (!response.ok) {
        console.log("Error deactivating url.");
        throw new Error("Error deactivating url.");
      }
    } catch (error) {
      console.error("Error deactivating url", error);
      throw Error("Error deactivating url.");
    }
  }

  static async bookAppointment(
    appointmentInformation: AppointmentInformation
  ) {
    try {
      const token = await EntraAuthApi.getBearerToken();

      const partialBookAppointmentPayload: PartialBookAppointmentPayload = {
        providerId: appointmentInformation.providerId,
        appointmentDateTime: appointmentInformation.date + " " + appointmentInformation.time,
        patientFirstName: appointmentInformation.patientFirstName,
        patientLastName: appointmentInformation.patientLastName,
        patientPhoneNumber: appointmentInformation.patientPhoneNumber,
        patientBirthdate: appointmentInformation.patientBirthdate,
      }

      const response = await fetch(`${SERVER_ENDPOINT}/api/appointment/booking`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(partialBookAppointmentPayload),
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
