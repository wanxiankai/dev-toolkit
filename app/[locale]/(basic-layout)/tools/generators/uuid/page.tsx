"use client";

import { useEffect, useState } from "react";
import { ToolLayout } from "@/components/tools/tool-layout";
import { getToolBySlug } from "@/config/tools";
import { useRecentTools } from "@/hooks/use-recent-tools";
import { generateUuids } from "@/lib/tools/uuid-generator";
import { CopyButton } from "@/components/tools/copy-button";
import { ClearButton } from "@/components/tools/clear-button";
import { SampleButton } from "@/components/tools/sample-button";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const tool = getToolBySlug("uuid")!;

export default function UuidPage() {
  const { addRecentTool } = useRecentTools();
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [withHyphen, setWithHyphen] = useState(true);
  const [uuids, setUuids] = useState<string[]>([]);
  const [history, setHistory] = useState<string[][]>([]);

  useEffect(() => {
    addRecentTool(tool.slug);
  }, [addRecentTool]);

  const runGenerate = () => {
    const next = generateUuids({ count, uppercase, withHyphen });
    setUuids(next);
    setHistory((prev) => [next, ...prev].slice(0, 10));
    toast.success(`Generated ${next.length} UUID${next.length > 1 ? "s" : ""}`);
  };

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="space-y-2">
            <Label htmlFor="count">Count (1-100)</Label>
            <Input
              id="count"
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e) => setCount(Math.min(100, Math.max(1, Number(e.target.value) || 1)))}
            />
          </div>

          <div className="flex items-center gap-2 pt-8">
            <Checkbox
              id="uppercase"
              checked={uppercase}
              onCheckedChange={(v) => setUppercase(Boolean(v))}
            />
            <Label htmlFor="uppercase">Uppercase</Label>
          </div>

          <div className="flex items-center gap-2 pt-8">
            <Checkbox
              id="hyphen"
              checked={withHyphen}
              onCheckedChange={(v) => setWithHyphen(Boolean(v))}
            />
            <Label htmlFor="hyphen">Include Hyphen</Label>
          </div>

          <div className="flex flex-wrap items-end gap-2">
            <Button onClick={runGenerate}>Generate</Button>
            <SampleButton
              onLoadSample={() => {
                setCount(10);
                setUppercase(false);
                setWithHyphen(true);
                const sample = generateUuids({ count: 10, uppercase: false, withHyphen: true });
                setUuids(sample);
                setHistory((prev) => [sample, ...prev].slice(0, 10));
              }}
            />
            <ClearButton
              onClear={() => {
                setUuids([]);
                setHistory([]);
              }}
            />
          </div>
        </div>

        <div className="border rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium">Generated UUIDs</p>
            <CopyButton text={uuids.join("\n")} />
          </div>
          <TextareaList lines={uuids} emptyText="Click Generate to create UUIDs." />
        </div>

        <div className="border rounded-xl p-3 space-y-2">
          <p className="text-sm font-medium">History</p>
          <div className="space-y-2 max-h-64 overflow-auto">
            {history.length === 0 ? (
              <p className="text-sm text-muted-foreground">No history yet.</p>
            ) : (
              history.map((batch, idx) => (
                <div key={idx} className="rounded-md border p-2 text-xs font-mono">
                  {batch.join("\n")}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

function TextareaList({ lines, emptyText }: { lines: string[]; emptyText: string }) {
  if (lines.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyText}</p>;
  }

  return (
    <pre className="text-xs font-mono rounded-md bg-muted p-3 max-h-96 overflow-auto whitespace-pre-wrap break-all">
      {lines.join("\n")}
    </pre>
  );
}
