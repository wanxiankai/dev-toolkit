"use client";

import { useEffect, useMemo, useState } from "react";
import { ToolLayout } from "@/components/tools/tool-layout";
import { getToolBySlug } from "@/config/tools";
import { useRecentTools } from "@/hooks/use-recent-tools";
import { transformUrlLines, UrlMode } from "@/lib/tools/url-codec";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InputOutputPanel } from "@/components/tools/input-output-panel";
import { CopyButton } from "@/components/tools/copy-button";
import { ClearButton } from "@/components/tools/clear-button";
import { SampleButton } from "@/components/tools/sample-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const tool = getToolBySlug("url")!;

export default function UrlCodecPage() {
  const { addRecentTool } = useRecentTools();
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [urlMode, setUrlMode] = useState<UrlMode>("component");
  const [input, setInput] = useState("");

  useEffect(() => {
    addRecentTool(tool.slug);
  }, [addRecentTool]);

  const output = useMemo(() => {
    if (!input.trim()) return "";
    try {
      return transformUrlLines(input, mode, urlMode);
    } catch (error) {
      return error instanceof Error ? error.message : "Failed to process URL";
    }
  }, [input, mode, urlMode]);

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <Tabs value={mode} onValueChange={(value) => setMode(value as "encode" | "decode")}> 
            <TabsList>
              <TabsTrigger value="encode">Encode</TabsTrigger>
              <TabsTrigger value="decode">Decode</TabsTrigger>
            </TabsList>
          </Tabs>

          <Select value={urlMode} onValueChange={(value) => setUrlMode(value as UrlMode)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="component">encodeURIComponent</SelectItem>
              <SelectItem value="full">encodeURI</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <InputOutputPanel
          inputValue={input}
          outputValue={output}
          onInputChange={setInput}
          inputPlaceholder="Paste one or more lines..."
          outputPlaceholder="Transformed result..."
          inputActions={
            <>
              <SampleButton onLoadSample={() => setInput("https://example.com/a path?q=你好\nemail=test@example.com")} />
              <ClearButton onClear={() => setInput("")} />
            </>
          }
          outputActions={<CopyButton text={output} />}
        />
      </div>
    </ToolLayout>
  );
}
