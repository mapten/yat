// Utils
import { AxiosError } from 'axios';
import { genericServerErrorConnectionToast } from './toast.utils';

// Store
import { useConfigurationStore } from '../store/configuration.store';

export const httpErrorHandler = (error: AxiosError) => {
  if (error.code === 'ERR_NETWORK') {
    useConfigurationStore.getState().increaseConnectionErrors();
  }

  genericServerErrorConnectionToast();
};