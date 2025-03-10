import { SERVER_ENDPOINT } from "@/constants";
import { EntraAuthApi } from "@/utils/ms_auth";
import { PrescriptionRefillRequest } from "../../model";

export class PrescriptionRequestsPrivateApi {
  static async getPrescriptionRequests(practiceId: string, status?: string) {
    try {
      const token = await EntraAuthApi.getBearerToken();
      const response = await fetch(
        `${SERVER_ENDPOINT}/api/prescription/refill/request?practiceId=${practiceId}&status=${status}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420", //to skip local browser warning using ngrok
          },
        }
      );

      if (!response.ok) {
        console.log("Error getting prescription requests");
        return undefined;
      }

      const data = await response.json();

      return data as PrescriptionRefillRequest[];
    } catch (error) {
      console.error("Error getting prescription requests", error);
      throw Error("No prescription request data returned");
    }
  }

  static async confirmPrescriptionRequest(
    prescriptionRefillRequestId: string,
    notes: string
  ) {
    try {
      const token = await EntraAuthApi.getBearerToken();
      const response = await fetch(
        `${SERVER_ENDPOINT}/api/prescription/refill/request/confirm`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420", //to skip local browser warning using ngrok
          },
          body: JSON.stringify({
            prescriptionRefillRequestId,
            notes,
          }),
        }
      );

      if (!response.ok) {
        console.log("Error confirming prescription request");
        return undefined;
      }

      const data = await response.json();

      return data as PrescriptionRefillRequest[];
    } catch (error) {
      console.error("Error confirming prescription requests", error);
      throw new Error("Error confirming prescription requests");
    }
  }
}
