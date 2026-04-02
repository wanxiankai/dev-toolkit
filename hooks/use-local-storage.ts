"use client";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(initialValue);
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) {
        setValue(JSON.parse(raw) as T);
      }
    } catch {
      setValue(initialValue);
    } finally {
      hydratedRef.current = true;
    }
  }, [key]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (!hydratedRef.current) {
      return;
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore localStorage write errors
    }
  }, [key, value]);

  return [value, setValue];
}
