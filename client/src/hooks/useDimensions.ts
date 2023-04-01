import { useMemo, useSyncExternalStore } from 'react';

const subscribe = (callback: (e: Event) => void) => {
  window.addEventListener('resize', callback);
  return () => {
    window.removeEventListener('resize', callback);
  };
};

export const useDimensions = (ref: React.RefObject<HTMLElement>) => {
  const dimensions = useSyncExternalStore(
    subscribe,
    () => JSON.stringify({
      width: ref.current?.offsetWidth ?? 0,
      height: ref.current?.offsetHeight ?? 0,
    })
  );
  return useMemo(() => JSON.parse(dimensions), [dimensions]);
};