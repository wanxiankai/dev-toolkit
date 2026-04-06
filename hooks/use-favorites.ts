"use client";

import {
  getFavorites,
  toggleFavorite as toggleFavoriteAction,
} from "@/actions/favorites";
import { authClient } from "@/lib/auth/auth-client";
import { useMemo } from "react";
import useSWR from "swr";

type FavoriteItem = Awaited<ReturnType<typeof getFavorites>>[number];

export function useFavorites() {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const userId = (session?.user as { id?: string } | undefined)?.id;

  const { data, isLoading, mutate } = useSWR(
    userId && !sessionPending ? ["favorites", userId] : null,
    () => getFavorites(),
    {
      revalidateOnFocus: true,
      shouldRetryOnError: false,
    }
  );

  const favorites = data ?? [];
  const favoriteSet = useMemo(() => new Set(favorites.map((item) => item.toolSlug)), [favorites]);

  const isFavorited = (toolSlug: string) => favoriteSet.has(toolSlug);

  const toggleFavorite = async (toolSlug: string, category: string) => {
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const exists = favoriteSet.has(toolSlug);
    const optimistic = exists
      ? favorites.filter((item) => item.toolSlug !== toolSlug)
      : [
          {
            id: `optimistic-${toolSlug}`,
            userId,
            toolSlug,
            category,
            createdAt: new Date(),
          } as FavoriteItem,
          ...favorites,
        ];

    mutate(optimistic, { revalidate: false });

    try {
      await toggleFavoriteAction(toolSlug, category);
      await mutate();
      return !exists;
    } catch (error) {
      await mutate();
      throw error;
    }
  };

  return {
    favorites,
    isLoading: isLoading || sessionPending,
    isLoggedIn: Boolean(userId),
    isFavorited,
    toggleFavorite,
  };
}

