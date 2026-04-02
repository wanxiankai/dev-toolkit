"use client";

import { useEffect, useMemo, useState } from "react";
import { ToolLayout } from "@/components/tools/tool-layout";
import { getToolBySlug } from "@/config/tools";
import { useRecentTools } from "@/hooks/use-recent-tools";
import { decodeBase64Text, encodeBase64Text, fileToBase64 } from "@/lib/tools/base64";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InputOutputPanel } from "@/components/tools/input-output-panel";
import { CopyButton } from "@/components/tools/copy-button";
import { ClearButton } from "@/components/tools/clear-button";
import { SampleButton } from "@/components/tools/sample-button";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const tool = getToolBySlug("base64")!;

export default function Base64Page() {
  const { addRecentTool } = useRecentTools();
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");

  useEffect(() => {
    addRecentTool(tool.slug);
  }, [addRecentTool]);

  const output = useMemo(() => {
    if (!input.trim()) return "";
    try {
      return mode === "encode" ? encodeBase64Text(input) : decodeBase64Text(input);
    } catch (error) {
      return error instanceof Error ? error.message : "Failed to transform Base64";
    }
  }, [input, mode]);

  const onLoadSample = () => {
    setInput(mode === "encode" ? "Hello DevToolKit 👋" : "SGVsbG8gRGV2VG9vbEtpdCDwn5GL");
  };

  const onFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const base64 = await fileToBase64(file);
      setMode("encode");
      setInput(base64);
      toast.success("File encoded to Base64");
    } catch {
      toast.error("Failed to encode file");
    }
  };

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

          <div>
            <Button variant="outline" size="sm" asChild>
              <label className="cursor-pointer">
                Upload File
                <input type="file" className="hidden" onChange={onFileUpload} />
              </label>
            </Button>
          </div>
        </div>

        <InputOutputPanel
          inputValue={input}
          outputValue={output}
          onInputChange={setInput}
          inputLabel={mode === "encode" ? "Plain Text" : "Base64 Input"}
          outputLabel={mode === "encode" ? "Base64 Output" : "Decoded Text"}
          inputActions={
            <>
              <SampleButton onLoadSample={onLoadSample} />
              <ClearButton onClear={() => setInput("")} />
            </>
          }
          outputActions={<CopyButton text={output} />}
        />
      </div>
    </ToolLayout>
  );
}
