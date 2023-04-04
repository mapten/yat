import { useEffect } from 'react';

export const useEscape = (callback: () => void) => {
  const escapeHandler = ({ key }: KeyboardEvent) => {
    if (key === 'Escape') {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', escapeHandler);
    return () => {
      document.removeEventListener('keydown', escapeHandler);
    };
  }, [callback]);
};