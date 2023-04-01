// Utils
import { httpErrorHandler } from '../utils/axios.errorHandler';
import { getAxiosApiInstance } from './axios.service';

const API_ENDPOINT = `${import.meta.env.VITE_APP_API_ENDPOINT}`;

export const fetchCSRFToken = async () => {
  return await getAxiosApiInstance(`${API_ENDPOINT}/token/csrf-token`)
    .get('')
    .then((response) => response.data.csrfToken)
    .catch(httpErrorHandler);
}