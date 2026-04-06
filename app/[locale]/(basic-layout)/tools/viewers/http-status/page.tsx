"use client";

import { useEffect, useMemo, useState } from "react";
import { ToolLayout } from "@/components/tools/tool-layout";
import { getToolBySlug } from "@/config/tools";
import { useRecentTools } from "@/hooks/use-recent-tools";
import { HTTP_STATUS_DATA } from "@/lib/tools/http-status-data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const tool = getToolBySlug("http-status")!;

export default function HttpStatusPage() {
  const { addRecentTool } = useRecentTools();
  const [query, setQuery] = useState("");

  useEffect(() => {
    addRecentTool(tool.slug);
  }, [addRecentTool]);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return HTTP_STATUS_DATA;
    return HTTP_STATUS_DATA.filter(
      (item) =>
        String(item.code).includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.useCase.toLowerCase().includes(q)
    );
  }, [query]);

  const grouped = useMemo(() => {
    return {
      "1xx": list.filter((item) => item.category === "1xx"),
      "2xx": list.filter((item) => item.category === "2xx"),
      "3xx": list.filter((item) => item.category === "3xx"),
      "4xx": list.filter((item) => item.category === "4xx"),
      "5xx": list.filter((item) => item.category === "5xx"),
    };
  }, [list]);

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-4">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search code, name, description..."
        />

        {(Object.keys(grouped) as Array<keyof typeof grouped>).map((category) => (
          <section key={category} className="space-y-2">
            <h2 className="text-lg font-semibold">{category}</h2>
            <Accordion type="multiple" className="rounded-lg border px-3">
              {grouped[category].length === 0 ? (
                <p className="text-sm text-muted-foreground py-3">No results in this category.</p>
              ) : (
                grouped[category].map((item) => (
                  <AccordionItem key={item.code} value={String(item.code)}>
                    <AccordionTrigger>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">{item.code}</Badge>
                        <span>{item.name}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2">
                      <p className="text-sm">{item.description}</p>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">Use case:</span> {item.useCase}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))
              )}
            </Accordion>
          </section>
        ))}
      </div>
    </ToolLayout>
  );
}

