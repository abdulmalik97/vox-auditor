import { SERVER_ENDPOINT } from "@/constants";

export class EntraAuthApi {
  private static cachedToken: string | null = null;
  private static cachedTokenExpiry: number | null = null;

  /**
   * Gets a bearer token for the specified scope
   * @param scope The scope to request the token for (e.g. "https://management.azure.com/.default")
   * @returns The bearer token
   */
  static async getBearerToken(): Promise<string> {
    try {
      // Check if we have a cached token that's still valid (with 5 minute buffer)
      if (this.cachedToken && this.cachedTokenExpiry && this.cachedTokenExpiry > Date.now() + 300000) {
        return this.cachedToken;
      }

      // Get a new token from the backend
      const response = await fetch(`${SERVER_ENDPOINT}/api/token`);
      if (!response.ok) {
        throw new Error('Failed to fetch token from backend');
      }

      const data = await response.json();
      if (!data.accessToken) {
        throw new Error('No access token received from backend');
      }

      this.cachedToken = data.accessToken;
      // Set expiry to 1 hour from now (typical token lifetime)
      this.cachedTokenExpiry = Date.now() + 3600000;
      
      return data.accessToken;
    } catch (error) {
      console.error("Error getting bearer token:", error);
      throw new Error("Failed to get bearer token from backend API");
    }
  }
} 