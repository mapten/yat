// Services
import { getAxiosApiInstance } from './axios.service';
import axios, { AxiosResponse } from 'axios';
import { toast } from 'react-hot-toast';

// Utils
import { httpErrorHandler } from '../utils/axios.errorHandler';

// Models
import { UserRequest, UserResponse } from '../models/user.model';

const API_ENDPOINT = `${import.meta.env.VITE_APP_API_ENDPOINT}/user`;

/**
 * Service to create a new user
 * @returns a string with the token
 */
export const createUser = async (user: UserRequest) => {
  return getAxiosApiInstance(API_ENDPOINT)
    .post<UserResponse>('/signin', user)
    .then((response: AxiosResponse<UserResponse>) => {
      if (response && response.status === 201) {
        return response.data;
      }
    })
    .catch((error) => {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 409) {
          toast.error('User already exists');
        }
      }
      else {
        httpErrorHandler(error);
      }
    });
};

export const loginUser = async (user: Omit<UserRequest, 'name'>) => {
  return getAxiosApiInstance(API_ENDPOINT)
    .post<UserResponse>('/login', user)
    .then((response: AxiosResponse<UserResponse>) => {
      if (response && response.status === 200) {
        return response.data;
      }
    })
    .catch((error) => {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          toast.error('Invalid credentials');
        }
      }
      else {
        httpErrorHandler(error);
      }
    });
};