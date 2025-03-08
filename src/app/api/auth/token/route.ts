import { AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET } from "@/constants";
import { ClientSecretCredential } from "@azure/identity";
import { NextResponse } from "next/server";

// Handle CORS preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(request: Request) {
  try {
    const { scope } = await request.json();
    
    const credential = new ClientSecretCredential(
      AZURE_TENANT_ID!,
      AZURE_CLIENT_ID!,
      AZURE_CLIENT_SECRET!
    );

    const token = await credential.getToken(scope);
    
    return NextResponse.json({ token: token.token }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error("Error getting bearer token:", error);
    return NextResponse.json(
      { error: "Failed to get bearer token from MS Entra ID" },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );
  }
} 