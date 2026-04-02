"use client";

import { ToolLayout } from "@/components/tools/tool-layout";
import { useRecentTools } from "@/hooks/use-recent-tools";
import { Tool } from "@/types/tools";
import { useEffect } from "react";

export default function ToolPageClient({ tool }: { tool: Tool }) {
  const { addRecentTool } = useRecentTools();

  useEffect(() => {
    addRecentTool(tool.slug);
  }, [addRecentTool, tool.slug]);

  return (
    <ToolLayout tool={tool}>
      <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        Tool page scaffold is ready. Implementation for {tool.name} will be added in the next phase.
      </div>
    </ToolLayout>
  );
}
