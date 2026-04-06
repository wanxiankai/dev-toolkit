"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { favorite } from "@/lib/db/schema";
import { and, asc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function getFavorites() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return [];

  return db
    .select()
    .from(favorite)
    .where(eq(favorite.userId, session.user.id))
    .orderBy(asc(favorite.createdAt));
}

export async function toggleFavorite(toolSlug: string, category: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Unauthorized");
  }

  const existing = await db
    .select()
    .from(favorite)
    .where(and(eq(favorite.userId, session.user.id), eq(favorite.toolSlug, toolSlug)))
    .limit(1);

  if (existing.length > 0) {
    await db.delete(favorite).where(eq(favorite.id, existing[0].id));
  } else {
    await db.insert(favorite).values({
      userId: session.user.id,
      toolSlug,
      category,
    });
  }

  revalidatePath("/");
  revalidatePath("/favorites");
}

export async function isFavorited(toolSlug: string): Promise<boolean> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return false;

  const result = await db
    .select()
    .from(favorite)
    .where(and(eq(favorite.userId, session.user.id), eq(favorite.toolSlug, toolSlug)))
    .limit(1);

  return result.length > 0;
}

