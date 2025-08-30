/**
 * createFastContext.jsx
 *
 * A utility for creating a fast, generic React context with fine-grained updates.
 *
 * This file exports a single function, `createFastContext`, which generates a strongly-typed
 * context provider and a custom hook for accessing and updating context state by key.
 *
 * Features:
 * - Fine-grained updates: Only components that use a specific key will re-render when that key changes.
 * - Type-safe: Works with any shape of store, preserving type safety for keys and values.
 * - Simple API: Returns a Provider component and a `useStore` hook for easy integration.
 *
 * Usage Example:
 *
 *   // Create a context with initial state values
 *   import createFastContext from '../path/to/createFastContext';
 *
 *   const { Provider, useStore } = createFastContext({
 *     count: 0,
 *     name: ''
 *   });
 *
 *   export { Provider as CustomProvider, useStore as useCustomStore }
 *
 *   // In your component tree:
 *   <CustomProvider>
 *     <ComponentA />
 *     <ComponentB />
 *     <ComponentC />
 *   </CustomProvider>
 *
 *   // In a child component:
 *   const [count, setCount] = useCustomStore('count');
 *   const [name, setName] = useCustomStore('name');
 *
 */

import React, { useRef, createContext, useContext, useCallback, useSyncExternalStore } from 'react';

/**
 * Creates a fast, generic context for a given store shape.
 * @param initialState The initial state object for the context store.
 * @returns An object with a Provider component and a useStore hook.
 */

export default function createFastContext(initialState) {
  /**
   * Internal hook to manage store data and subscriptions.
   * @returns Store accessors and subscription methods.
   */
  function useStoreData() {
    const store = useRef(initialState);

    // Returns the current store value
    const get = useCallback(() => store.current, []);

    const subscribers = useRef(new Set());

    // Merges new values into the store and notifies subscribers
    const set = useCallback((value) => {
      store.current = { ...store.current, ...value };
      subscribers.current.forEach((callback) => callback());
    }, []);

    // Adds/removes a subscriber callback for store changes
    const subscribe = useCallback((callback) => {
      subscribers.current.add(callback);
      return () => subscribers.current.delete(callback);
    }, []);

    return {
      get,
      set,
      subscribe,
    };
  }

  // React context for the store data.
  const StoreContext = createContext(null);

  /**
   * Provider component to wrap your app and provide the store context.
   * @param children React children
   */
  function Provider({ children }) {
    return <StoreContext.Provider value={useStoreData()}>{children}</StoreContext.Provider>;
  }

  /**
   * Custom hook to access and update a specific key in the store.
   * @param key The key of the store property to access.
   * @returns A tuple: [value, setValue]
   */
  function useStore(key) {
    const store = useContext(StoreContext);
    if (!store) {
      throw new Error('Store not found');
    }

    // Subscribe to changes for the specific key
    const state = useSyncExternalStore(
      store.subscribe,
      () => store.get()[key],
      () => initialState[key]
    );

    // Setter for the specific key
    const set = useCallback(
      (value) => {
        store.set({ [key]: value });
      },
      [key, store]
    );

    return [state, set];
  }

  // Returns the Provider component and useStore hook for this context.
  return {
    Provider,
    useStore,
  };
}
