import { ClientSecretCredential } from "@azure/identity";
import { AccessToken } from "@azure/identity";

export class EntraAuthApi {
  private static credential: ClientSecretCredential | null = null;
  private static cachedToken: AccessToken | null = null;

  private static getCredential() {
    if (!this.credential) {
      const tenantId = process.env.AZURE_TENANT_ID;
      const clientId = process.env.AZURE_CLIENT_ID;
      const clientSecret = process.env.AZURE_CLIENT_SECRET;

      if (!tenantId || !clientId || !clientSecret) {
        throw new Error("Missing required Azure credentials in environment variables");
      }

      this.credential = new ClientSecretCredential(
        tenantId,
        clientId,
        clientSecret
      );
    }
    return this.credential;
  }

  /**
   * Gets a bearer token for the specified scope
   * @param scope The scope to request the token for (e.g. "https://management.azure.com/.default")
   * @returns The bearer token
   */
  static async getBearerToken(scope: string): Promise<string> {
    try {
      // Check if we have a cached token that's still valid (with 5 minute buffer)
      if (this.cachedToken && this.cachedToken.expiresOnTimestamp > Date.now() + 300000) {
        return this.cachedToken.token;
      }

      // Get a new token
      const credential = this.getCredential();
      this.cachedToken = await credential.getToken(scope);
      
      return this.cachedToken.token;
    } catch (error) {
      console.error("Error getting bearer token:", error);
      throw new Error("Failed to get bearer token from MS Entra ID");
    }
  }
} 