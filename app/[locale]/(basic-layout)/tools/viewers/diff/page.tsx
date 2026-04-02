"use client";

import { useEffect, useMemo, useState } from "react";
import { ToolLayout } from "@/components/tools/tool-layout";
import { getToolBySlug } from "@/config/tools";
import { useRecentTools } from "@/hooks/use-recent-tools";
import { buildLineDiff, computeDiffStats } from "@/lib/tools/diff-viewer";
import { ClearButton } from "@/components/tools/clear-button";
import { CopyButton } from "@/components/tools/copy-button";
import { SampleButton } from "@/components/tools/sample-button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const tool = getToolBySlug("diff")!;
const SAMPLE_LEFT = "line 1\nline 2\nline 3";
const SAMPLE_RIGHT = "line 1\nline two\nline 3\nline 4";

type RenderLine = { text: string; type: "added" | "removed" | "normal" };

export default function DiffPage() {
  const { addRecentTool } = useRecentTools();
  const [left, setLeft] = useState(SAMPLE_LEFT);
  const [right, setRight] = useState(SAMPLE_RIGHT);
  const [view, setView] = useState<"side" | "inline">("side");

  useEffect(() => {
    addRecentTool(tool.slug);
  }, [addRecentTool]);

  const changes = useMemo(() => buildLineDiff(left, right), [left, right]);
  const stats = useMemo(() => computeDiffStats(changes), [changes]);
  const inlineLines = useMemo<RenderLine[]>(() => {
    return changes.flatMap((change) => {
      const rows = change.value.split("\n").filter((line) => line.length > 0);
      return rows.map((row) => ({
        text: row,
        type: change.added ? "added" : change.removed ? "removed" : "normal",
      }));
    });
  }, [changes]);

  const sideBySide = useMemo(() => {
    const leftLines: RenderLine[] = [];
    const rightLines: RenderLine[] = [];

    changes.forEach((change) => {
      const rows = change.value.split("\n").filter((line) => line.length > 0);
      if (change.added) {
        rows.forEach((row) => {
          leftLines.push({ text: "", type: "normal" });
          rightLines.push({ text: row, type: "added" });
        });
        return;
      }
      if (change.removed) {
        rows.forEach((row) => {
          leftLines.push({ text: row, type: "removed" });
          rightLines.push({ text: "", type: "normal" });
        });
        return;
      }
      rows.forEach((row) => {
        leftLines.push({ text: row, type: "normal" });
        rightLines.push({ text: row, type: "normal" });
      });
    });

    return { leftLines, rightLines };
  }, [changes]);

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Old Text</p>
            <Textarea value={left} onChange={(e) => setLeft(e.target.value)} className="min-h-56 font-mono" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">New Text</p>
            <Textarea value={right} onChange={(e) => setRight(e.target.value)} className="min-h-56 font-mono" />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-2">
            <SampleButton
              onLoadSample={() => {
                setLeft(SAMPLE_LEFT);
                setRight(SAMPLE_RIGHT);
              }}
            />
            <ClearButton
              onClear={() => {
                setLeft("");
                setRight("");
              }}
            />
            <CopyButton text={inlineLines.map((line) => `${prefix(line.type)} ${line.text}`).join("\n")} />
          </div>

          <Tabs value={view} onValueChange={(value) => setView(value as "side" | "inline")}>
            <TabsList>
              <TabsTrigger value="side">Side by Side</TabsTrigger>
              <TabsTrigger value="inline">Inline</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge className="bg-green-600">{`+${stats.added}`}</Badge>
          <Badge variant="destructive">{`-${stats.removed}`}</Badge>
          <Badge variant="secondary">{`~${stats.modified}`}</Badge>
        </div>

        {view === "inline" ? (
          <div className="rounded-lg border overflow-hidden">
            <DiffColumn title="Inline Diff" lines={inlineLines} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-lg border overflow-hidden">
              <DiffColumn title="Old" lines={sideBySide.leftLines} />
            </div>
            <div className="rounded-lg border overflow-hidden">
              <DiffColumn title="New" lines={sideBySide.rightLines} />
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

function prefix(type: RenderLine["type"]) {
  if (type === "added") return "+";
  if (type === "removed") return "-";
  return " ";
}

function DiffColumn({ title, lines }: { title: string; lines: RenderLine[] }) {
  return (
    <>
      <div className="px-3 py-2 border-b text-sm font-semibold">{title}</div>
      <div className="font-mono text-xs max-h-[420px] overflow-auto">
        {lines.length === 0 ? (
          <p className="p-3 text-muted-foreground">No diff data.</p>
        ) : (
          lines.map((line, index) => (
            <div
              key={`${title}-${index}`}
              className={lineClassName(line.type)}
            >
              <span className="opacity-60 select-none pr-2">{prefix(line.type)}</span>
              <span>{line.text || " "}</span>
            </div>
          ))
        )}
      </div>
    </>
  );
}

function lineClassName(type: RenderLine["type"]) {
  if (type === "added") return "px-3 py-1 bg-green-500/15";
  if (type === "removed") return "px-3 py-1 bg-red-500/15";
  return "px-3 py-1";
}

