"use client";

import { useCallback } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";

const RECENT_TOOLS_KEY = "devtoolkit-recent-tools";
const MAX_RECENT = 10;

export function useRecentTools() {
  const [recentTools, setRecentTools] = useLocalStorage<string[]>(
    RECENT_TOOLS_KEY,
    []
  );

  const addRecentTool = useCallback(
    (slug: string) => {
      setRecentTools((prev) => {
        const unique = prev.filter((item) => item !== slug);
        return [slug, ...unique].slice(0, MAX_RECENT);
      });
    },
    [setRecentTools]
  );

  return { recentTools, addRecentTool };
}
