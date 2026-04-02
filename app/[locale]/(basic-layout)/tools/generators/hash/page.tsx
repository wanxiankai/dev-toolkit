"use client";

import { useEffect, useMemo, useState } from "react";
import { ToolLayout } from "@/components/tools/tool-layout";
import { getToolBySlug } from "@/config/tools";
import { useRecentTools } from "@/hooks/use-recent-tools";
import { hashFileAll, hashTextAll, HashAlgorithm } from "@/lib/tools/hash-generator";
import { InputOutputPanel } from "@/components/tools/input-output-panel";
import { CopyButton } from "@/components/tools/copy-button";
import { ClearButton } from "@/components/tools/clear-button";
import { SampleButton } from "@/components/tools/sample-button";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const tool = getToolBySlug("hash")!;

export default function HashPage() {
  const { addRecentTool } = useRecentTools();
  const [input, setInput] = useState("");
  const [result, setResult] = useState<Record<HashAlgorithm, string> | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    addRecentTool(tool.slug);
  }, [addRecentTool]);

  useEffect(() => {
    let active = true;
    if (!input) {
      setResult(null);
      return;
    }

    setLoading(true);
    hashTextAll(input)
      .then((value) => {
        if (active) {
          setResult(value);
        }
      })
      .catch(() => {
        if (active) {
          toast.error("Failed to hash input");
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [input]);

  const formattedOutput = useMemo(() => {
    if (!result) return "";
    return (Object.entries(result) as [HashAlgorithm, string][])
      .map(([algo, value]) => `${algo}: ${value}`)
      .join("\n");
  }, [result]);

  const onFileHash = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const value = await hashFileAll(file);
      setResult(value);
      toast.success(`Hashed file: ${file.name}`);
    } catch {
      toast.error("Failed to hash file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-4">
        <InputOutputPanel
          inputValue={input}
          outputValue={formattedOutput}
          onInputChange={setInput}
          inputLabel="Text Input"
          outputLabel="Hash Results"
          inputActions={
            <>
              <SampleButton onLoadSample={() => setInput("DevToolKit hash sample")} />
              <ClearButton
                onClear={() => {
                  setInput("");
                  setResult(null);
                }}
              />
              <Button variant="outline" size="sm" asChild>
                <label className="cursor-pointer">
                  Hash File
                  <input className="hidden" type="file" onChange={onFileHash} />
                </label>
              </Button>
            </>
          }
          outputActions={<CopyButton text={formattedOutput} />}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(Object.entries(result ?? {}) as [HashAlgorithm, string][]).map(([algo, value]) => (
            <div key={algo} className="rounded-lg border p-3 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold">{algo}</p>
                <CopyButton text={value} />
              </div>
              <p className="text-xs font-mono break-all">{value}</p>
            </div>
          ))}
        </div>

        {loading && <p className="text-sm text-muted-foreground">Calculating hash...</p>}
      </div>
    </ToolLayout>
  );
}

