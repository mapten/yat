import axios, { AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';

// Store
import { getTokenNonReactComponent } from '../store/auth.store';

export const getAxiosApiInstance = (endpoint: string): AxiosInstance => {
  const client = axios.create({
    baseURL: endpoint,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const token = getTokenNonReactComponent();
  if (token) {
    client.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  configureRetry(client);

  return client;
};

const configureRetry = (client: AxiosInstance) => {
  const retries = Number(import.meta.env.VITE_API_AXIOS_RETRIES || 5);

  axiosRetry(client, {
    retries, retryDelay: axiosRetry.exponentialDelay, retryCondition: (error) => {
      const errorCode = error.response?.status || 200;
      if (errorCode >= 500) {
        return true;
      }
      return false;
    },
  });
};