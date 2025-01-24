import { endpoint } from "@/constants";
import { ActivityLogEntry } from "../../model";

export class ActivityLogPrivateApi {
    
  /**
   * Gets call activity log
   */
  static async getActivityLog() {
    console.log("Making call with endpoint ", endpoint);

    try {
      const response = await fetch(`${endpoint}/get_activity_log`);
      
      if (!response.ok) {
        console.log('Error getting activity log');
        return undefined;
      }

      const data = await response.json();

      return data as ActivityLogEntry[];
    } catch (error) {
      console.error('Error getting activity log', error);
      throw Error("No activity log data returned");
    }
  }
}
