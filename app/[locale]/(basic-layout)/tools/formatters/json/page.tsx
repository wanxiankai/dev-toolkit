"use client";

import { useEffect, useMemo, useState } from "react";
import { ToolLayout } from "@/components/tools/tool-layout";
import { getToolBySlug } from "@/config/tools";
import { useRecentTools } from "@/hooks/use-recent-tools";
import {
  formatJson,
  JsonIndent,
  minifyJson,
  parseJson,
  runSimpleJsonPath,
  validateJson,
} from "@/lib/tools/json-formatter";
import { CodeEditor } from "@/components/tools/code-editor";
import { CopyButton } from "@/components/tools/copy-button";
import { ClearButton } from "@/components/tools/clear-button";
import { SampleButton } from "@/components/tools/sample-button";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const tool = getToolBySlug("json")!;

function JsonNode({ value, nodeKey }: { value: unknown; nodeKey?: string }) {
  if (value === null || typeof value !== "object") {
    return (
      <div className="text-sm font-mono pl-4">
        {nodeKey ? <span className="text-muted-foreground">{nodeKey}: </span> : null}
        <span>{JSON.stringify(value)}</span>
      </div>
    );
  }

  if (Array.isArray(value)) {
    return (
      <details className="pl-4" open>
        <summary className="cursor-pointer text-sm font-medium">
          {nodeKey ? `${nodeKey}: ` : ""}[{value.length}]
        </summary>
        <div className="space-y-1 mt-1">
          {value.map((item, index) => (
            <JsonNode key={index} value={item} nodeKey={String(index)} />
          ))}
        </div>
      </details>
    );
  }

  const entries = Object.entries(value as Record<string, unknown>);
  return (
    <details className="pl-4" open>
      <summary className="cursor-pointer text-sm font-medium">
        {nodeKey ? `${nodeKey}: ` : ""}{"{"}{entries.length}{"}"}
      </summary>
      <div className="space-y-1 mt-1">
        {entries.map(([key, val]) => (
          <JsonNode key={key} value={val} nodeKey={key} />
        ))}
      </div>
    </details>
  );
}

export default function JsonPage() {
  const { addRecentTool } = useRecentTools();
  const [input, setInput] = useState("{\n  \"name\": \"DevToolKit\",\n  \"features\": [\"json\", \"regex\"],\n  \"active\": true\n}");
  const [output, setOutput] = useState("");
  const [indent, setIndent] = useState<JsonIndent>(2);
  const [sortKeys, setSortKeys] = useState(false);
  const [tab, setTab] = useState<"editor" | "tree">("editor");
  const [jsonPath, setJsonPath] = useState("$");
  const [jsonPathResult, setJsonPathResult] = useState("");
  const [validateMessage, setValidateMessage] = useState<string>("");

  useEffect(() => {
    addRecentTool(tool.slug);
  }, [addRecentTool]);

  const parsedTree = useMemo(() => {
    try {
      return parseJson(output || input);
    } catch {
      return null;
    }
  }, [input, output]);

  const onBeautify = () => {
    try {
      const formatted = formatJson(input, indent, sortKeys);
      setOutput(formatted);
      setValidateMessage("Valid JSON");
      toast.success("JSON formatted");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Invalid JSON";
      setValidateMessage(msg);
      toast.error(msg);
    }
  };

  const onMinify = () => {
    try {
      const minified = minifyJson(input);
      setOutput(minified);
      toast.success("JSON minified");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Invalid JSON";
      setValidateMessage(msg);
      toast.error(msg);
    }
  };

  const onValidate = () => {
    const result = validateJson(input);
    if (result.valid) {
      setValidateMessage("Valid JSON");
      toast.success("JSON is valid");
      return;
    }

    const msg = `Invalid JSON: ${result.message}${result.line ? ` (line ${result.line}, col ${result.column})` : ""}`;
    setValidateMessage(msg);
    toast.error(msg);
  };

  const onRunJsonPath = () => {
    try {
      const parsed = parseJson(input);
      const result = runSimpleJsonPath(parsed, jsonPath);
      setJsonPathResult(JSON.stringify(result, null, 2));
      toast.success("JSONPath query executed");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "JSONPath failed";
      setJsonPathResult(msg);
      toast.error(msg);
    }
  };

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div className="space-y-2">
            <Label>Indent</Label>
            <Select
              value={String(indent)}
              onValueChange={(v) => setIndent(v === "tab" ? "tab" : (Number(v) as JsonIndent))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 spaces</SelectItem>
                <SelectItem value="4">4 spaces</SelectItem>
                <SelectItem value="tab">Tab</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 h-10">
            <Switch checked={sortKeys} onCheckedChange={setSortKeys} id="sort-keys" />
            <Label htmlFor="sort-keys">Sort keys</Label>
          </div>

          <div className="md:col-span-2 flex flex-wrap gap-2">
            <Button onClick={onBeautify}>Beautify</Button>
            <Button variant="outline" onClick={onMinify}>Minify</Button>
            <Button variant="outline" onClick={onValidate}>Validate</Button>
            <SampleButton onLoadSample={() => setInput('{"project":"DevToolKit","numbers":[1,2,3],"nested":{"ok":true}}')} />
            <ClearButton onClear={() => { setInput(""); setOutput(""); setValidateMessage(""); }} />
          </div>
        </div>

        {validateMessage && <p className="text-sm text-muted-foreground">{validateMessage}</p>}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="border rounded-xl overflow-hidden">
            <div className="px-3 py-2 border-b text-sm font-medium">Input JSON</div>
            <CodeEditor value={input} onChange={setInput} language="json" height={420} />
          </div>

          <div className="border rounded-xl overflow-hidden">
            <div className="px-3 py-2 border-b text-sm font-medium flex items-center justify-between">
              <span>Output</span>
              <CopyButton text={output} />
            </div>
            <CodeEditor value={output} onChange={setOutput} language="json" readOnly height={420} />
          </div>
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as "editor" | "tree")}> 
          <TabsList>
            <TabsTrigger value="editor">JSONPath</TabsTrigger>
            <TabsTrigger value="tree">Tree View</TabsTrigger>
          </TabsList>
        </Tabs>

        {tab === "editor" ? (
          <div className="space-y-3 border rounded-xl p-4">
            <div className="flex gap-2">
              <Input value={jsonPath} onChange={(e) => setJsonPath(e.target.value)} placeholder="$.nested.value" />
              <Button onClick={onRunJsonPath}>Run</Button>
            </div>
            <pre className="text-xs overflow-auto rounded-md bg-muted p-3 min-h-24">{jsonPathResult}</pre>
          </div>
        ) : (
          <div className="border rounded-xl p-3 overflow-auto max-h-96">
            {parsedTree ? <JsonNode value={parsedTree} /> : <p className="text-sm text-muted-foreground">Invalid JSON</p>}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
