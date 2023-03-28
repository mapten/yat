import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

import { fetchCSRFToken as fetchCSRFTokenService } from '../services/token.service';

// Helpers
import cookiesStorage from './customStorage/cookies.storage';

export type State = {
  authToken: string | null;
  csrfToken: string | null;
}

type Actions = {
  setAuthToken: (authToken: string | null) => void;
  setCsrfToken: (csrfToken: string) => void;
  getAuthToken: () => string | null;
  getCsrfToken: () => string | null;
  fetchCsrfToken: () => Promise<void>;
}

export type TokenState = State & Actions;

const initialState: State = {
  authToken: null,
  csrfToken: null
};

export const useTokenStore = create<TokenState>()(
  persist(devtools((set, get) => ({
    ...initialState,
    setAuthToken: (authToken: string | null) => set({ authToken }),
    getAuthToken: () => get().authToken,
    setCsrfToken: (csrfToken: string) => set({ csrfToken }),
    getCsrfToken: () => {
      return get().csrfToken;
    },
    fetchCsrfToken: async () => {
      const csrfToken = await fetchCSRFTokenService();
      if (csrfToken) {
        set({ csrfToken });
      }
    }
  })), {
    name: 'token-storage',
    storage: createJSONStorage(() => cookiesStorage)
  })
);

export const getTokenNonReactComponent = () => {
  const tokenZustardWrapper = useTokenStore.getState().getAuthToken();

  if (!tokenZustardWrapper) {
    return null;
  }

  if (typeof tokenZustardWrapper === 'string') {
    return tokenZustardWrapper;
  }

  return (tokenZustardWrapper as unknown as { value: string }).value;
};