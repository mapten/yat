// Models
import { StoreApi } from 'zustand';
import { User } from '../../models/user.model';
import { AuthState } from '../auth.store';

export const userAfterChange = (_:StoreApi<AuthState>, user: User) => {
  if (!user) {
    import('../configuration.store').then(({ useConfigurationStore }) => {
      useConfigurationStore.setState({ storeMode: 'offline'});
    });
  }
};