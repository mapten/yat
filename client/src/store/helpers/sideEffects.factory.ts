import { StoreApi } from 'zustand';

// Side effects
import {
  connectionErrorsAfterChange,
  connectionModeBeforeChange,
  serverConnectionStateAfterChange,
  storeModeBeforeChange
}
  from '../sideEffects/configuration.store.sideeffect';
import { userAfterChange } from '../sideEffects/user.store.sideeffects';

type SideEffect<T> = (store: StoreApi<T>, ...otherProps: unknown[]) => void;

const getFactoryMapping = <T>() => {
  return {
    'storeMode.beforeChange': storeModeBeforeChange,
    'connectionMode.beforeChange': connectionModeBeforeChange,
    'connectionErrors.afterChange': connectionErrorsAfterChange,
    'serverConnectionState.afterChange': serverConnectionStateAfterChange,
    'user.afterChange': userAfterChange,
  } as Record<string, SideEffect<T>>;
}

/**
 * Factory used to call side effects based on the property name
 * @param fullName The format is {propertyName}.{beforeChange|afterChange} @example storeMode.beforeChange
 * @param store The store instance @example useAuthStore
 * @param otherProps The props that are passed to the mapped side effect
 */
export const sideEffectFactory = <T>(fullName: string, store: StoreApi<T>, ...otherProps: any) => {
  const sideEffect = getFactoryMapping<T>()[fullName];

  if (!sideEffect) {
    return;
  }

  sideEffect(store, ...otherProps);
}