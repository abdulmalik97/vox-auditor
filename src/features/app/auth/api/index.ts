import { endpoint } from "@/constants";
import { Account } from "@/contexts/account/context";

export class AccountApi {
  static async getAccount(email: string) {
    try {
      const response = await fetch(
        `${endpoint}/api/account?email=${encodeURIComponent(email)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420", //to skip local browser warning using ngrok
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
