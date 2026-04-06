import { getFavorites } from "@/actions/favorites";
import { ToolGrid } from "@/components/tools/tool-grid";
import { getToolBySlug } from "@/config/tools";
import { getSession } from "@/lib/auth/server";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

export default async function FavoritesPage() {
  const session = await getSession();
  if (!session?.user?.id) {
    redirect("/login?next=/favorites");
  }

  const t = await getTranslations("DevToolKit");
  const records = await getFavorites();
  const tools = records
    .map((item) => getToolBySlug(item.toolSlug))
    .filter((tool): tool is NonNullable<typeof tool> => Boolean(tool));

  return (
    <div className="w-full container max-w-8xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">{t("favorites")}</h1>
      {tools.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
          {t("no_favorites")}
        </div>
      ) : (
        <ToolGrid title={t("favorites")} tools={tools} />
      )}
    </div>
  );
}

