"use client";

import { useEffect, useState } from "react";
import { ToolLayout } from "@/components/tools/tool-layout";
import { getToolBySlug } from "@/config/tools";
import { useRecentTools } from "@/hooks/use-recent-tools";
import { formatSql, minifySql, SqlDialect } from "@/lib/tools/sql-formatter";
import { CodeEditor } from "@/components/tools/code-editor";
import { CopyButton } from "@/components/tools/copy-button";
import { ClearButton } from "@/components/tools/clear-button";
import { SampleButton } from "@/components/tools/sample-button";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const tool = getToolBySlug("sql")!;

const SAMPLE_SQL = "select u.id, u.name, p.title from users u left join posts p on p.user_id = u.id where u.active = 1 order by u.created_at desc;";

export default function SqlFormatterPage() {
  const { addRecentTool } = useRecentTools();
  const [input, setInput] = useState(SAMPLE_SQL);
  const [output, setOutput] = useState("");
  const [dialect, setDialect] = useState<SqlDialect>("postgresql");
  const [tabWidth, setTabWidth] = useState(2);
  const [uppercase, setUppercase] = useState(true);

  useEffect(() => {
    addRecentTool(tool.slug);
  }, [addRecentTool]);

  const onFormat = () => {
    try {
      const result = formatSql(input, { dialect, tabWidth, uppercaseKeywords: uppercase });
      setOutput(result);
      toast.success("SQL formatted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to format SQL");
    }
  };

  const onMinify = () => {
    setOutput(minifySql(input));
    toast.success("SQL minified");
  };

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="space-y-2">
            <Label>Dialect</Label>
            <Select value={dialect} onValueChange={(value) => setDialect(value as SqlDialect)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sql">Standard SQL</SelectItem>
                <SelectItem value="mysql">MySQL</SelectItem>
                <SelectItem value="postgresql">PostgreSQL</SelectItem>
                <SelectItem value="sqlite">SQLite</SelectItem>
                <SelectItem value="transactsql">MSSQL</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Indent</Label>
            <Input
              type="number"
              min={1}
              max={8}
              value={tabWidth}
              onChange={(e) => setTabWidth(Math.min(8, Math.max(1, Number(e.target.value) || 2)))}
            />
          </div>

          <div className="flex items-center gap-2 pt-8">
            <Checkbox
              id="uppercase-keywords"
              checked={uppercase}
              onCheckedChange={(checked) => setUppercase(Boolean(checked))}
            />
            <Label htmlFor="uppercase-keywords">Uppercase Keywords</Label>
          </div>

          <div className="flex flex-wrap items-end gap-2">
            <Button onClick={onFormat}>Format</Button>
            <Button variant="outline" onClick={onMinify}>Minify</Button>
            <SampleButton onLoadSample={() => setInput(SAMPLE_SQL)} />
            <ClearButton onClear={() => { setInput(""); setOutput(""); }} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-xl border overflow-hidden">
            <div className="px-3 py-2 border-b text-sm font-medium">Input SQL</div>
            <CodeEditor value={input} onChange={setInput} language="sql" height={460} />
          </div>

          <div className="rounded-xl border overflow-hidden">
            <div className="px-3 py-2 border-b text-sm font-medium flex items-center justify-between">
              <span>Output SQL</span>
              <CopyButton text={output} />
            </div>
            <CodeEditor value={output} onChange={setOutput} language="sql" readOnly height={460} />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

