'use client';

import { useState, useEffect, useCallback } from 'react';

type StateInitializer<T> = (storedState: T) => T;

export function usePersistence<T>(
  key: string,
  initialValue: T,
  initializer?: StateInitializer<T>
): [T, React.Dispatch<React.SetStateAction<T>>, boolean] {
  const [state, setState] = useState<T>(() => {
    // Return initial value on server
    if (typeof window === 'undefined') {
      return initialValue;
    }
    // On client, try to get from localStorage
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        return initializer ? initializer(parsed) : parsed;
      }
    } catch (error) {
      console.error(`Error reading localStorage key “${key}”:`, error);
    }
    // Return initial value if nothing in localStorage
    return initialValue;
  });

  const [isLoading, setIsLoading] = useState(true);

  // Effect to load data from localStorage on initial client render
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        setState(initializer ? initializer(parsed) : parsed);
      }
    } catch (error) {
        console.error(`Error loading from localStorage key "${key}":`, error);
        setState(initialValue);
    } finally {
        setIsLoading(false);
    }
  }, [key, initialValue, initializer]);

  // Effect to save state to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      try {
        window.localStorage.setItem(key, JSON.stringify(state));
      } catch (error) {
        console.error(`Error writing to localStorage key “${key}”:`, error);
      }
    }
  }, [key, state, isLoading]);

  const stableSetState = useCallback(setState, []);

  return [state, stableSetState, isLoading];
}
