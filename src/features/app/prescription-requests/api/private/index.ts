import { endpoint } from "@/constants";
import { PrescriptionRefillRequest } from "../../model";

export class PrescriptionRequestsPrivateApi {

  static async getPrescriptionRequests(practiceId: string, status?: string) {
    try {
      console.log(status)
      const response = await fetch(
        `${endpoint}/api/prescription/refill/request?practiceId=${practiceId}`,
        {
          headers: {
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
      const response = await fetch(
        `${endpoint}/api/prescription/refill/request/confirm`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
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
