'use client';

import { useState, useEffect, useCallback } from 'react';
import { safeJsonParse } from '../lib/utils';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? safeJsonParse(item, initialValue) : initialValue;
    } catch (e) {
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (e) {
      console.error(`Error saving localStorage key "${key}":`, e);
    }
  }, [key, storedValue]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(safeJsonParse(item, initialValue));
      }
    } catch (e) {}
  }, [key, initialValue]);

  return [storedValue, setValue];
}
