// Import dotenv to load environment variables from .env file
import dotenv from 'dotenv';

// Load the environment variables
dotenv.config();

// Read the environment variable and provide a default value
const environment = process.env.NODE_ENV


const devEndpoint = 'https://74dd-2603-8080-2700-ef3-58cf-bdd1-bfac-bb0a.ngrok-free.app';
const prodEndpoint = 'https://voxology-app-0962ec6f2b52.herokuapp.com';

// Use the environment to set the endpoint
export const endpoint = environment === 'production' ? prodEndpoint : devEndpoint;