// Services
import { getAxiosApiInstance } from './axios.service';

const API_ENDPOINT = `${import.meta.env.VITE_APP_API_ENDPOINT}/ping`;

export const pingToServer = async () => {
  return getAxiosApiInstance(API_ENDPOINT)
    .get<boolean>('')
    .then((response) => {
      if (response && response.status === 200) {
        return true;
      }
    })
    .catch(() => {
      return false;
    });
};