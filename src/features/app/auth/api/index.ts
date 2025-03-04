import { bearer, endpoint } from "@/constants";
import { Account } from "@/contexts/account/context";

export class AccountApi {
  static async getAccount(email: string) {
    try {
      const response = await fetch(
        `${endpoint}/api/account?email=${encodeURIComponent(email)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${bearer}`,
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
