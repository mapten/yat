// Models
import { StoreApi } from 'zustand';

// Models
import { User } from '../../models/user.model';

// Store
import { AuthState } from '../auth.store';

export const userAfterChange = (_:StoreApi<AuthState>, user: User | null) => {
  if (!user) {
    import('../configuration.store').then(({ useConfigurationStore }) => {
      useConfigurationStore.setState({ storeMode: 'offline'});
    });
  }
};