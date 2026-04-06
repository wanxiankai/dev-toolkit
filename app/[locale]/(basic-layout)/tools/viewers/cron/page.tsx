"use client";

import { useEffect, useMemo, useState } from "react";
import { ToolLayout } from "@/components/tools/tool-layout";
import { getToolBySlug } from "@/config/tools";
import { useRecentTools } from "@/hooks/use-recent-tools";
import { explainCron, getNextRuns } from "@/lib/tools/cron-parser";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CopyButton } from "@/components/tools/copy-button";
import { ClearButton } from "@/components/tools/clear-button";
import { SampleButton } from "@/components/tools/sample-button";

const tool = getToolBySlug("cron")!;

const PRESETS = [
  { label: "Every minute", value: "* * * * *" },
  { label: "Every 5 minutes", value: "*/5 * * * *" },
  { label: "Every hour", value: "0 * * * *" },
  { label: "Every day at 09:00", value: "0 9 * * *" },
  { label: "Every Monday at 09:00", value: "0 9 * * 1" },
  { label: "Every day at 09:00:00 (6-field)", value: "0 0 9 * * *" },
];

export default function CronPage() {
  const { addRecentTool } = useRecentTools();
  const [expression, setExpression] = useState("*/5 * * * *");

  useEffect(() => {
    addRecentTool(tool.slug);
  }, [addRecentTool]);

  const parsed = useMemo(() => {
    if (!expression.trim()) return null;
    try {
      const human = explainCron(expression);
      const runs = getNextRuns(expression, 10);
      return { human, runs };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Invalid cron expression" };
    }
  }, [expression]);

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Input
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            placeholder="e.g. */5 * * * *"
          />
          <SampleButton onLoadSample={() => setExpression("0 9 * * 1-5")} />
          <ClearButton onClear={() => setExpression("")} />
          <CopyButton text={expression} />
        </div>

        <Select onValueChange={setExpression}>
          <SelectTrigger className="max-w-sm">
            <SelectValue placeholder="Choose a common template" />
          </SelectTrigger>
          <SelectContent>
            {PRESETS.map((preset) => (
              <SelectItem key={preset.value} value={preset.value}>
                {preset.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {parsed && "error" in parsed ? (
          <p className="text-sm text-destructive">{parsed.error}</p>
        ) : (
          <>
            <div className="rounded-lg border p-3 space-y-2">
              <p className="text-sm font-semibold">Human Readable</p>
              <p className="text-sm">{parsed?.human ?? "-"}</p>
            </div>

            <div className="rounded-lg border p-3 space-y-2">
              <p className="text-sm font-semibold">Next 10 Runs</p>
              <div className="space-y-1">
                {(parsed?.runs ?? []).map((date, idx) => (
                  <p key={`${date.toISOString()}-${idx}`} className="font-mono text-xs">
                    {date.toISOString()} ({date.toLocaleString()})
                  </p>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="rounded-lg border p-3">
          <p className="text-sm font-semibold mb-2">Common Templates</p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <Button key={preset.value} variant="outline" size="sm" onClick={() => setExpression(preset.value)}>
                {preset.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

