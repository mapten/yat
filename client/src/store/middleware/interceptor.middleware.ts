import { StateCreator, StoreMutatorIdentifier } from 'zustand';

import { sideEffectFactory } from '../helpers/sideEffects.factory';

type Interceptor = <
  T extends object,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
  stateCreator: StateCreator<T, Mps, Mcs>
) => StateCreator<T, Mps, Mcs>;

type InterceptorImpl = <T extends object>(
  stateCreator: StateCreator<T, [], []>
) => StateCreator<T, [], []>;

type SetterFn<T> = (state: T) => T | Partial<T>;

/**
 * Zustand middleware to intercept state changes (before and after)
 * @param stateCreator
 * @returns 
 */
const impl: InterceptorImpl = (stateCreator) => (set, get, store) => {
  const newSet: typeof set = function (...args) {
    let newState = args[0];

    const propertyName = Object.keys(newState)[0];
    const propertyValue = Object.values(newState)[0];

    sideEffectFactory(`${propertyName}.beforeChange`, store, propertyValue);

    if (isSetterFunction(newState)) {
      newState = newState(get());
    }

    const newResult = { ...newState };
    set(newResult, args[1]);

    sideEffectFactory(`${propertyName}.afterChange`, store, propertyValue);
  };

  store.setState = newSet;
  return stateCreator(newSet, get, store);
};

const isSetterFunction = function <T>(setter: T | Partial<T> | SetterFn<T>): setter is SetterFn<T> {
  return (setter as SetterFn<T>).apply !== undefined;
};

export const interceptor = impl as Interceptor;