import axios, { AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';


export const getAxiosApiInstance = (endpoint: string): AxiosInstance => {
  const client = axios.create({
    baseURL: endpoint,
    headers: {
      'Content-Type': 'application/json'
    },
  });

  configureRetry(client);

  return client;
};

const configureRetry = (client: AxiosInstance) => {
  const retries = Number(import.meta.env.VITE_API_AXIOS_RETRIES || 3);

  axiosRetry(client, {
    retries, retryDelay: axiosRetry.exponentialDelay, retryCondition: (error) => {
      const errorCode = error.response?.status || 200;
      if (errorCode >= 400) {
        return true;
      }
      return false;
    },
  });
};