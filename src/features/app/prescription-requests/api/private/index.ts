import { endpoint } from "@/constants";
import { PrescriptionRefillRequest } from "../../model";

export class PrescriptionRequestsPrivateApi {
  
  static async getPrescriptionRequests(practiceId: string) {
    try {
      const response = await fetch(
        `${endpoint}/api/prescription/refill/request?practiceId=${practiceId}`
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
