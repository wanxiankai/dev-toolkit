"use client";

import { DynamicIcon } from "@/components/DynamicIcon";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CATEGORIES, TOOLS } from "@/config/tools";
import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { Menu, Star } from "lucide-react";
import { useTranslations } from "next-intl";

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const tCategories = useTranslations("Categories");
  const t = useTranslations("DevToolKit");

  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 p-4">
        <Link
          href="/favorites"
          title={t("favorites")}
          onClick={onNavigate}
          className={cn(
            "mb-2 flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent",
            pathname === "/favorites" && "bg-accent text-foreground"
          )}
        >
          <Star className="size-4" />
          {t("favorites")}
        </Link>

        {Object.keys(CATEGORIES).map((category) => {
          const categoryMeta = CATEGORIES[category as keyof typeof CATEGORIES];
          const categoryTools = TOOLS.filter((tool) => tool.category === category);

          return (
            <div key={category} className="space-y-2">
              <div className="text-sm font-semibold flex items-center gap-2">
                <DynamicIcon name={categoryMeta.icon} className="size-4" />
                {tCategories(category as keyof typeof CATEGORIES)}
              </div>

              <div className="space-y-1">
                {categoryTools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={tool.path}
                    title={tool.name}
                    onClick={onNavigate}
                    className={cn(
                      "block rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent",
                      pathname === tool.path && "bg-accent text-foreground"
                    )}
                  >
                    {tool.name}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full container max-w-8xl mx-auto px-4 py-6">
      <div className="flex gap-6">
        <aside className="hidden lg:block w-72 shrink-0 border rounded-xl h-[calc(100vh-10rem)] sticky top-24">
          <SidebarNav />
        </aside>

        <div className="flex-1 min-w-0">
          <div className="lg:hidden mb-4">
            <Sheet>
              <SheetTrigger className="inline-flex items-center gap-2 px-3 py-2 border rounded-md text-sm">
                <Menu className="size-4" />
                Browse Tools
              </SheetTrigger>
              <SheetContent side="left" className="p-0">
                <SheetTitle className="sr-only">Browse Tools</SheetTitle>
                <SidebarNav />
              </SheetContent>
            </Sheet>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
