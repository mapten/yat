import { StateStorage } from 'zustand/middleware';
import { getCookie, setCookie, removeCookie } from 'typescript-cookie';

/**
 * Custom storage for Zustand, used to store the state in cookies
 * important: Each cookie key has 4Kb limit, so it is not intended for large states
 */
const cookiesStorage: StateStorage = {
  getItem: (name: string) => {
    return getCookie(name) ?? null;
  },
  setItem: (name: string, value: string) => {
    setCookie(name, value, { expires: 1 });
  },
  removeItem: (name: string) => {
    removeCookie(name);
  }
}

export default cookiesStorage;