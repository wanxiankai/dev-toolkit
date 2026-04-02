"use client";

import { DynamicIcon } from "@/components/DynamicIcon";
import { ToolGrid } from "@/components/tools/tool-grid";
import { Button } from "@/components/ui/button";
import { CATEGORIES, TOOLS, getToolsByCategory } from "@/config/tools";
import { useRecentTools } from "@/hooks/use-recent-tools";
import { Link } from "@/i18n/routing";
import { ToolCategory } from "@/types/tools";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("DevToolKit");
  const tCategories = useTranslations("Categories");
  const tTools = useTranslations("Tools");
  const { recentTools } = useRecentTools();

  const recent = recentTools
    .map((slug) => TOOLS.find((tool) => tool.slug === slug))
    .filter((tool): tool is (typeof TOOLS)[number] => Boolean(tool));

  return (
    <div className="w-full">
      <section className="container max-w-8xl mx-auto px-4 py-14 md:py-20 space-y-8">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">{t("hero_title")}</h1>
          <p className="text-xl text-muted-foreground">{t("hero_subtitle")}</p>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t("hero_description")}</p>

          <div className="pt-2">
            <Button
              type="button"
              variant="outline"
              className="h-12 w-full max-w-xl justify-start text-muted-foreground"
              onClick={() => window.dispatchEvent(new Event("devtoolkit:open-search"))}
            >
              <Search className="size-4" />
              {t("search_placeholder")}
            </Button>
          </div>
        </div>

        {recent.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">{t("recently_used")}</h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {recent.map((tool) => (
                <Link
                  key={tool.slug}
                  href={tool.path}
                  className="min-w-[260px] rounded-xl border p-4 hover:bg-accent/20 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <DynamicIcon name={tool.icon} className="size-4" />
                    <span className="font-medium">{tTools(`${tool.slug}.name`)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{tTools(`${tool.slug}.description`)}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="space-y-8">
          {(Object.keys(CATEGORIES) as ToolCategory[]).map((category) => (
            <ToolGrid
              key={category}
              title={tCategories(category)}
              tools={getToolsByCategory(category)}
            />
          ))}
        </section>
      </section>
    </div>
  );
}
