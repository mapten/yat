// Services
import { getAxiosApiInstance } from './axios.service';

const API_ENDPOINT = `${import.meta.env.VITE_APP_API_ENDPOINT}/generic`;

export const pingToServer = async () => {
  return await getAxiosApiInstance(`${API_ENDPOINT}/ping`)
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