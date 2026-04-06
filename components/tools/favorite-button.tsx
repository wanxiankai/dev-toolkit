"use client";

import { useFavorites } from "@/hooks/use-favorites";
import { usePathname, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface FavoriteButtonProps {
  toolSlug: string;
  category: string;
  className?: string;
}

export function FavoriteButton({ toolSlug, category, className }: FavoriteButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn, isFavorited, toggleFavorite } = useFavorites();
  const [pending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useState<boolean | null>(null);

  const favorited = optimistic ?? isFavorited(toolSlug);

  const onClick = () => {
    if (!isLoggedIn) {
      toast.info("Please sign in to add favorites.");
      const nextParam = pathname ? `?next=${encodeURIComponent(pathname)}` : "";
      router.push(`/login${nextParam}`);
      return;
    }

    startTransition(async () => {
      const nextState = !favorited;
      setOptimistic(nextState);
      try {
        await toggleFavorite(toolSlug, category);
        toast.success(nextState ? "Added to favorites" : "Removed from favorites");
      } catch {
        setOptimistic(null);
        toast.error("Failed to update favorite");
      } finally {
        setOptimistic(null);
      }
    });
  };

  return (
    <Button
      variant={favorited ? "default" : "outline"}
      size="sm"
      type="button"
      className={cn(className)}
      onClick={onClick}
      disabled={pending}
      aria-pressed={favorited}
    >
      <Star className={cn("size-4", favorited && "fill-current")} />
      {favorited ? "Favorited" : "Favorite"}
    </Button>
  );
}

