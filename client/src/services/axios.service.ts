import axios, { AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';

// Store
import { useTokenStore } from '../store/token.store';

export const getAxiosApiInstance = (endpoint: string) => {
  const client = axios.create({
    baseURL: endpoint,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!client.defaults.headers.common.Authorization) {
    const authToken = useTokenStore.getState().getAuthToken();
    if (authToken) {
      client.defaults.headers.common.Authorization = `Bearer ${authToken}`;
    }
  }

  if (!client.defaults.headers.common['x-csrf-token']) {
    const csrfToken = useTokenStore.getState().getCsrfToken();
    if (csrfToken) {
      client.defaults.headers.common['x-csrf-token'] = csrfToken;
    }
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