import { endpoint } from "@/constants";

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
      const response = await fetch(
        `${endpoint}/api/activity-log?practiceId=${practiceId}`,
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

      return data as ActivityLogRecord[];
    } catch (error) {
      console.error("Error getting prescription requests", error);
      throw Error("No prescription request data returned");
    }
  }
}
