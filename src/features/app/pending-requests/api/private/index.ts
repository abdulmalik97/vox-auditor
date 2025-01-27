import { endpoint } from "@/constants";
// import { AppointmentOutboundCallRequest } from "../../model";
// import { AppointmentOutboundCallRequest } from "../../model";

export class AppointmentOutboundRequestsPrivateApi {
  static async saveAppointmentOutboundRequest(data: {
    practiceId: string;
    patientFirstName: string;
    patientLastName: string;
    patientPrimaryPhoneNumber: string;
    patientSecondaryPhoneNumber?: string;
    patientDob: string;
    providerNameToSchedule: string;
  }) {
    try {
      console.log("data", data);
      const response = await fetch(
        `${endpoint}/api/appointment/outbound/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420", //to skip local browser warning using ngrok
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        console.log("Error saving appointment outbound request");
        return undefined;
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error("Error saving appointment outbound request", error);
      throw Error("Error saving appointment outbound request");
    }
  }

  static async getAppointmentOutboundRequests(practiceId: string) {
    try {
      const response = await fetch(
        `${endpoint}/api/appointment/outbound/request?practiceId=${practiceId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420", //to skip local browser warning using ngrok
          },
        }
      );

      if (!response.ok) {
        console.log("Error getting appointment requests");
        return undefined;
      }

      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Error getting prescription requests", error);
      throw Error("No prescription request data returned");
    }
  }

  static async getProvidersForOutboundRequests(practiceId: string) {
    try {
      const response = await fetch(
        `${endpoint}/api/appointment/outbound/request/providers?practiceId=${practiceId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420", //to skip local browser warning using ngrok
          },
        }
      );

      if (!response.ok) {
        console.log("Error getting providers");
        return undefined;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error getting providers", error);
      throw Error("Error getting providers");
    }
  }

  // static async confirmPrescriptionRequest(
  //   prescriptionRefillRequestId: string,
  //   notes: string
  // ) {
  //   try {
  //     const response = await fetch(
  //       `${endpoint}/api/prescription/refill/request/confirm`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           prescriptionRefillRequestId,
  //           notes,
  //         }),
  //       }
  //     );

  //     if (!response.ok) {
  //       console.log("Error confirming prescription request");
  //       return undefined;
  //     }

  //     const data = await response.json();

  //     return data as AppointmentOutboundCallRequest[];
  //   } catch (error) {
  //     console.error("Error confirming prescription requests", error);
  //     throw new Error("Error confirming prescription requests");
  //   }
  // }
}
