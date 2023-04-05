import { useEffect, useCallback } from 'react';

export const useEscape = (callback: () => void) => {
  const escapeHandler = useCallback(({ key }: KeyboardEvent) => {
    if (key === 'Escape') {
      callback();
    }
  }, [callback]);

  useEffect(() => {
    document.addEventListener('keydown', escapeHandler);
    return () => {
      document.removeEventListener('keydown', escapeHandler);
    };
  }, [escapeHandler]);
};