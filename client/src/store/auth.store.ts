import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

// Models
import { User, UserRequest, UserResponse } from '../models/user.model';

// Services
import { createUser, loginUser } from '../services/user.service';

type State = {
  user: User | null;
  token: string | null;
  isLoginVisible: boolean;
}

type Actions = {
  clear: () => void;
  createUser: (user: UserRequest) => Promise<void>;
  login: (user: Omit<UserRequest, 'name'>) => Promise<void>;
  logout: () => void;
  getToken: () => string | null;
  getUser: () => User | null;
  isAuthenticated: () => boolean;
  setIsLoginVisible: (isLoginVisible: boolean) => void;
}

export type AuthState = State & Actions;

export const useAuthStore = create<AuthState>()(
  persist(devtools((set, get) => ({
    user: null,
    token: null,
    isLoginVisible: false,

    clear: () => set({ user: null, token: null }),

    createUser: async (user: UserRequest) => {
      const response = (await createUser(user)) as UserResponse;
      if (!response) {
        return;
      }
      set({ user: { id: response.id, name: response.name, email: response.email } });
      set({ token: response.token });
      set({ isLoginVisible: false });
    },

    login: async (user: Omit<UserRequest, 'name'>) => {
      const response = (await loginUser(user)) as UserResponse;
      if (!response) {
        return;
      }
      set({ user: { id: response.id, name: response.name, email: response.email } });
      set({ token: response.token });
      set({ isLoginVisible: false });
    },

    logout: () => {
      set({ user: null });
      set({ token: null });
      set({ isLoginVisible: true });
    },

    getToken: () => {
      return get().token;
    },

    getUser: () => {
      return get().user;
    },

    isAuthenticated: () => {
      return get().token !== null;
    },

    setIsLoginVisible: (isLoginVisible: boolean) => {
      set({ isLoginVisible });
    }
  })), {
    name: 'auth-storage',
    storage: createJSONStorage(() => sessionStorage)
  })
);

export const getTokenNonReactComponent = () => {
  const tokenZustardWrapper = useAuthStore.getState().getToken();

  if (tokenZustardWrapper) {
    return (tokenZustardWrapper as unknown as { value: string }).value;
  }
};