import { SERVER_ENDPOINT } from "@/constants";
import { Account } from "@/contexts/account/context";
import { EntraAuthApi } from "../../../../utils/ms_auth";

export class AccountApi {
  static async getAccount(email: string) {
    try {
      const token = await EntraAuthApi.getBearerToken();
      
      const response = await fetch(
        `${SERVER_ENDPOINT}/api/account?email=${encodeURIComponent(email)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.log("Error getting account.");
        return undefined;
      }

      const data = await response.json();

      return data as Account;
    } catch (error) {
      console.error("Error getting account", JSON.stringify(error));
      throw Error("No account data returned");
    }
  }
}
