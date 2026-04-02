"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Kbd } from "@/components/ui/kbd";
import { TOOLS, searchTools } from "@/config/tools";
import { useRecentTools } from "@/hooks/use-recent-tools";
import { useRouter } from "@/i18n/routing";
import { Tool, ToolCategory } from "@/types/tools";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

interface CommandPaletteProps {
  iconOnly?: boolean;
}

export default function CommandPalette({ iconOnly = false }: CommandPaletteProps) {
  const t = useTranslations("DevToolKit");
  const tCategories = useTranslations("Categories");
  const tTools = useTranslations("Tools");
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { recentTools, addRecentTool } = useRecentTools();

  useEffect(() => {
    const onKeydown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    const onOpen = () => setOpen(true);

    window.addEventListener("keydown", onKeydown);
    window.addEventListener("devtoolkit:open-search", onOpen);
    return () => {
      window.removeEventListener("keydown", onKeydown);
      window.removeEventListener("devtoolkit:open-search", onOpen);
    };
  }, []);

  const list = useMemo(() => {
    if (!query.trim()) {
      return TOOLS;
    }
    return searchTools(query.trim());
  }, [query]);

  const grouped = useMemo(() => {
    const map: Record<ToolCategory, Tool[]> = {
      "encode-decode": [],
      formatters: [],
      generators: [],
      converters: [],
      viewers: [],
      ai: [],
    };

    list.forEach((tool) => {
      map[tool.category].push(tool);
    });

    return map;
  }, [list]);

  const recent = useMemo(
    () => recentTools.map((slug) => TOOLS.find((tool) => tool.slug === slug)).filter(Boolean) as Tool[],
    [recentTools]
  );

  const onSelect = (tool: Tool) => {
    addRecentTool(tool.slug);
    setOpen(false);
    router.push(tool.path);
  };

  const getToolName = (tool: Tool) => tTools(`${tool.slug}.name`);

  const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => setOpen(true)}
        className={iconOnly ? "h-9 w-9 px-0" : "justify-between min-w-40"}
      >
        <span className="flex items-center gap-2">
          <Search className="size-4" />
          {!iconOnly && t("search_placeholder")}
        </span>
        {!iconOnly && <Kbd>{isMac ? "⌘K" : "Ctrl+K"}</Kbd>}
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          value={query}
          onValueChange={setQuery}
          placeholder={t("search_placeholder")}
        />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>

          {recent.length > 0 && !query && (
            <CommandGroup heading={t("recently_used")}>
              {recent.map((tool) => (
                <CommandItem key={`recent-${tool.slug}`} value={tool.slug} onSelect={() => onSelect(tool)}>
                  <span>{getToolName(tool)}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {Object.entries(grouped).map(([category, tools]) => {
            if (tools.length === 0) {
              return null;
            }

            return (
              <CommandGroup
                key={category}
                heading={tCategories(category as ToolCategory)}
              >
                {tools.map((tool) => (
                  <CommandItem key={tool.slug} value={`${getToolName(tool)} ${tool.keywords.join(" ")}`} onSelect={() => onSelect(tool)}>
                    <span>{getToolName(tool)}</span>
                    <span className="ml-auto text-xs text-muted-foreground">{tool.slug}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            );
          })}

          <CommandSeparator />
        </CommandList>
      </CommandDialog>
    </>
  );
}
