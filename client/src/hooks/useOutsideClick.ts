import { useEffect } from 'react';

export const useOutsideClick = (ref: React.RefObject<HTMLElement>, callback: () => void) => {

  const clickHandler = ({ target }: MouseEvent) => {
    if (ref.current && !(ref.current).contains(target as Node)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener('click', clickHandler, true);
    return () => {
      document.removeEventListener('click', clickHandler, true);
    };
  }, [ref, callback]);
};