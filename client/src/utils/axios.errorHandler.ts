// Utils
import { AxiosError } from 'axios';

import { useConfigurationStore } from '../store/configuration.store';

// Helpers
import { genericServerErrorConnectionToast } from './toast.utils';

export const httpErrorHandler = (error: AxiosError) => {
  if (error.code === 'ERR_NETWORK') {
    useConfigurationStore.getState().increaseConnectionErrors();
  }

  // TODO: Handle other errors, only display 500 errors

  genericServerErrorConnectionToast();
};