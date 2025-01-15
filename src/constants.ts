// Import dotenv to load environment variables from .env file
import dotenv from 'dotenv';

// Load the environment variables
dotenv.config();

// Read the environment variable and provide a default value
const environment = process.env.NODE_ENV


const devEndpoint = 'https://voxology-functions-dev.azurewebsites.net';
const prodEndpoint = 'https://voxology-functions-dev.azurewebsites.net';

// Use the environment to set the endpoint
export const endpoint = environment === 'production' ? prodEndpoint : devEndpoint;