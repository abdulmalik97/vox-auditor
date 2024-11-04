import { endpoint } from "@/constants";
import { ActivityLogEntry } from "../../model";
import axios from "axios";

export class ActivityLogPrivateApi {
    
  /**
   * Gets call activity log
   */
  static async getActivityLog() {
    console.log("Making call with endpoint ", endpoint)
    const response = await axios
      .get( `${endpoint}/get_activity_log`)
      .catch(() => {
        console.log('Error getting activity log');
        return undefined;
      });

    if (response?.data) {
      console.log(response?.data)
      return response.data as ActivityLogEntry[];
    } else {
      throw Error("No activity log data returned");
    }
  }
}
