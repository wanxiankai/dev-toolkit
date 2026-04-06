"use client";

import { useEffect, useMemo, useState } from "react";
import { ToolLayout } from "@/components/tools/tool-layout";
import { getToolBySlug } from "@/config/tools";
import { useRecentTools } from "@/hooks/use-recent-tools";
import { BaseRadix, convertNumberBase } from "@/lib/tools/number-base";
import { CopyButton } from "@/components/tools/copy-button";
import { ClearButton } from "@/components/tools/clear-button";
import { SampleButton } from "@/components/tools/sample-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tool = getToolBySlug("number-base")!;

export default function NumberBasePage() {
  const { addRecentTool } = useRecentTools();
  const [input, setInput] = useState("255");
  const [base, setBase] = useState<BaseRadix>(10);

  useEffect(() => {
    addRecentTool(tool.slug);
  }, [addRecentTool]);

  const result = useMemo(() => {
    if (!input.trim()) return null;
    try {
      return { data: convertNumberBase(input, base) };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Invalid number" };
    }
  }, [base, input]);

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-4">
        <div className="space-y-3">
          <Label>Input</Label>
          <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter value..." />
          <Tabs value={String(base)} onValueChange={(value) => setBase(Number(value) as BaseRadix)}>
            <TabsList>
              <TabsTrigger value="2">Binary</TabsTrigger>
              <TabsTrigger value="8">Octal</TabsTrigger>
              <TabsTrigger value="10">Decimal</TabsTrigger>
              <TabsTrigger value="16">Hex</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex gap-2">
            <SampleButton onLoadSample={() => { setInput("FF"); setBase(16); }} />
            <ClearButton onClear={() => setInput("")} />
          </div>
        </div>

        {result?.error ? (
          <p className="text-sm text-destructive">{result.error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <BaseCard label="Binary (base 2)" value={result?.data?.binary ?? ""} />
            <BaseCard label="Octal (base 8)" value={result?.data?.octal ?? ""} />
            <BaseCard label="Decimal (base 10)" value={result?.data?.decimal ?? ""} />
            <BaseCard label="Hex (base 16)" value={result?.data?.hexadecimal ?? ""} />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

function BaseCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-3 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold">{label}</p>
        <CopyButton text={value} />
      </div>
      <p className="font-mono text-sm break-all">{value || "-"}</p>
    </div>
  );
}

