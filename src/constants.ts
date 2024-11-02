// Import dotenv to load environment variables from .env file
import dotenv from 'dotenv';

// Load the environment variables
dotenv.config();

// Read the environment variable and provide a default value
const environment = process.env.NODE_ENV


const devEndpoint = 'http://127.0.0.1:8000';
const prodEndpoint = 'https://voxology-development-efgzgjccbdghdkgu.canadacentral-01.azurewebsites.net';

// Use the environment to set the endpoint
export const endpoint = environment === 'production' ? prodEndpoint : devEndpoint;