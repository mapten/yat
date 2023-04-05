import { useEffect, useCallback } from 'react';

export const useOutsideClick = (ref: React.RefObject<HTMLElement>, callback: () => void) => {
  const clickHandler = useCallback(({ target }: MouseEvent) => {
    if (ref.current && !(ref.current).contains(target as Node)) {
      callback();
    }
  }, [callback, ref]);

  useEffect(() => {
    document.addEventListener('click', clickHandler, true);
    return () => {
      document.removeEventListener('click', clickHandler, true);
    };
  }, [clickHandler]);
};