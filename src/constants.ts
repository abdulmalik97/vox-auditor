// Import dotenv to load environment variables from .env file
import dotenv from 'dotenv';

// Load the environment variables
dotenv.config();

export const AZURE_CLIENT_ID = process.env.NEXT_PUBLIC_AZURE_CLIENT_ID
export const AZURE_CLIENT_SECRET = process.env.NEXT_PUBLIC_AZURE_CLIENT_SECRET
export const AZURE_TENANT_ID = process.env.NEXT_PUBLIC_AZURE_TENANT_ID

export const BEARER_TOKEN = process.env.NEXT_PUBLIC_BEARER_TOKEN || ''

export const ENV = process.env.NEXT_PUBLIC_ENV
export const SERVER_ENDPOINT = process.env.NEXT_PUBLIC_SERVER_ENDPOINT