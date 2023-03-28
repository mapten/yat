// Utils
import { httpErrorHandler } from '../utils/axios.errorHandler';

const API_ENDPOINT = `${import.meta.env.VITE_APP_API_ENDPOINT}`;

export const fetchCSRFToken = async () => {
  return await fetch(`${API_ENDPOINT}/token/csrf-token`, {credentials: 'include'})
  .then((response) => response.json())
  .then((data) => data.csrfToken)
  .catch(httpErrorHandler);
}