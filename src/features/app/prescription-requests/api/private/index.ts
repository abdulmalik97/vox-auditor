import { endpoint } from "@/constants";
import { PrescriptionRefillRequest } from "../../model";

export class PrescriptionRequestsPrivateApi {
    
  /**
   * Gets call activity log
   */
  static async getPrescriptionRequests() {
    console.log("Making call with endpoint ", endpoint);

    try {
      const locationId = '4abc4129-7178-4ff1-b264-78bc7967fb22';
      const response = await fetch(`${endpoint}/api/prescription/request?locationId=${locationId}`);
      
      if (!response.ok) {
        console.log('Error getting prescription requests');
        return undefined;
      }

      const data = await response.json();

      return data as PrescriptionRefillRequest[];
    } catch (error) {
      console.error('Error getting prescription requests', error);
      throw Error("No prescription request data returned");
    }
  }
}
