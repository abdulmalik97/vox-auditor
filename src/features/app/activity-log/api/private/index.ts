import { AZURE_CLIENT_ID, SERVER_ENDPOINT } from "@/constants";
import { EntraAuthApi } from "@/utils/ms_auth";

export interface ActivityLogRecord {
  id: string;
  practiceId: string;
  patientPhoneNumber: string;
  reasonForCall: string;
  status: string;
  createdAt: string;
}

export class ActivityLogPrivateApi {
  /**
   * Gets call activity log
   */
  static async getActivityLog(practiceId: string) {
    try {

      const token = await EntraAuthApi.getBearerToken(`api://${AZURE_CLIENT_ID}`);
      
      const response = await fetch(
        `${SERVER_ENDPOINT}/api/activity-log?practiceId=${practiceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.log("Error getting prescription requests");
        return undefined;
      }

      const data = await response.json();

      return data as ActivityLogRecord[];
    } catch (error) {
      console.error("Error getting prescription requests", error);
      throw Error("No prescription request data returned");
    }
  }
}
