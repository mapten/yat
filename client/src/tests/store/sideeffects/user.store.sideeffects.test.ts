import { describe, it, expect, vi, afterEach } from 'vitest';
import { StoreApi } from 'zustand';

// Models
import { User } from '../../../models/user.model';

// Store
import { AuthState } from '../../../store/auth.store';
import { useConfigurationStore } from '../../../store/configuration.store';

// Side effects
import { userAfterChange } from '../../../store/sideEffects/user.store.sideeffects';

describe('user store side effects', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should set store mode to offline when user is null', async () => {
    // arrange
    const mockTokenStoreSetState = vi.spyOn(useConfigurationStore, 'setState');

    // act
    userAfterChange(null as unknown as StoreApi<AuthState>, null);

    await new Promise(process.nextTick);

    // assert
    expect(mockTokenStoreSetState).toHaveBeenCalledWith({ storeMode: 'offline'});
  });

  it('should not set store mode to offline when user is not null', async () => {
    // arrange
    const mockTokenStoreSetState = vi.spyOn(useConfigurationStore, 'setState');

    // act
    userAfterChange(null as unknown as StoreApi<AuthState>, { id: '1'} as unknown as User);

    await new Promise(process.nextTick);

    // assert
    expect(mockTokenStoreSetState).not.toHaveBeenCalled();
  });
});