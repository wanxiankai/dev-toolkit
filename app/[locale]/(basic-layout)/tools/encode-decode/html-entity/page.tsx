"use client";

import { useEffect, useMemo, useState } from "react";
import { ToolLayout } from "@/components/tools/tool-layout";
import { getToolBySlug } from "@/config/tools";
import { useRecentTools } from "@/hooks/use-recent-tools";
import {
  COMMON_ENTITY_TABLE,
  decodeHtmlEntities,
  encodeHtmlEntities,
  HtmlEntityMode,
} from "@/lib/tools/html-entity";
import { InputOutputPanel } from "@/components/tools/input-output-panel";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CopyButton } from "@/components/tools/copy-button";
import { ClearButton } from "@/components/tools/clear-button";
import { SampleButton } from "@/components/tools/sample-button";

const tool = getToolBySlug("html-entity")!;

export default function HtmlEntityPage() {
  const { addRecentTool } = useRecentTools();
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [entityMode, setEntityMode] = useState<HtmlEntityMode>("named");
  const [input, setInput] = useState("");

  useEffect(() => {
    addRecentTool(tool.slug);
  }, [addRecentTool]);

  const output = useMemo(() => {
    if (!input) return "";
    if (mode === "encode") {
      return encodeHtmlEntities(input, entityMode);
    }
    return decodeHtmlEntities(input);
  }, [entityMode, input, mode]);

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Tabs value={mode} onValueChange={(value) => setMode(value as "encode" | "decode")}>
            <TabsList>
              <TabsTrigger value="encode">Encode</TabsTrigger>
              <TabsTrigger value="decode">Decode</TabsTrigger>
            </TabsList>
          </Tabs>

          {mode === "encode" && (
            <Select value={entityMode} onValueChange={(value) => setEntityMode(value as HtmlEntityMode)}>
              <SelectTrigger className="w-[170px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="named">Named Entity</SelectItem>
                <SelectItem value="numeric">Numeric Entity</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        <InputOutputPanel
          inputValue={input}
          outputValue={output}
          onInputChange={setInput}
          inputLabel={mode === "encode" ? "Plain Text" : "HTML Entity"}
          outputLabel={mode === "encode" ? "HTML Entity Output" : "Decoded Text"}
          inputActions={
            <>
              <SampleButton
                onLoadSample={() =>
                  setInput(mode === "encode" ? `<h1>DevToolKit & "Tools"</h1>` : "&lt;h1&gt;DevToolKit &amp; &#34;Tools&#34;&lt;/h1&gt;")
                }
              />
              <ClearButton onClear={() => setInput("")} />
            </>
          }
          outputActions={<CopyButton text={output} />}
        />

        <div className="rounded-lg border overflow-hidden">
          <div className="px-3 py-2 border-b text-sm font-semibold">Common Entities</div>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/70">
                <tr>
                  <th className="text-left p-2">Character</th>
                  <th className="text-left p-2">Named</th>
                  <th className="text-left p-2">Numeric</th>
                </tr>
              </thead>
              <tbody>
                {COMMON_ENTITY_TABLE.map((item) => (
                  <tr key={`${item.char}-${item.numeric}`} className="border-t">
                    <td className="p-2 font-mono">{item.char}</td>
                    <td className="p-2 font-mono">{item.named}</td>
                    <td className="p-2 font-mono">{item.numeric}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

