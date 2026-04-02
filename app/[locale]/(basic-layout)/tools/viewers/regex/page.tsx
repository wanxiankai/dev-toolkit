"use client";

import { useEffect, useMemo, useState } from "react";
import { ToolLayout } from "@/components/tools/tool-layout";
import { getToolBySlug } from "@/config/tools";
import { useRecentTools } from "@/hooks/use-recent-tools";
import {
  highlightMatches,
  REGEX_PRESETS,
  runRegex,
} from "@/lib/tools/regex-tester";
import { ClearButton } from "@/components/tools/clear-button";
import { CopyButton } from "@/components/tools/copy-button";
import { SampleButton } from "@/components/tools/sample-button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const tool = getToolBySlug("regex")!;
const SAMPLE_TEXT = "Reach me at devtoolkit@example.com and admin@example.org.";

export default function RegexPage() {
  const { addRecentTool } = useRecentTools();
  const [pattern, setPattern] = useState("[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState(SAMPLE_TEXT);
  const [error, setError] = useState("");

  useEffect(() => {
    addRecentTool(tool.slug);
  }, [addRecentTool]);

  const matches = useMemo(() => {
    if (!pattern) return [];
    try {
      setError("");
      return runRegex(pattern, flags, text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid regex");
      return [];
    }
  }, [pattern, flags, text]);

  const highlighted = useMemo(() => highlightMatches(text, matches), [text, matches]);

  const toggleFlag = (flag: string, enabled: boolean) => {
    const set = new Set(flags.split("").filter(Boolean));
    if (enabled) {
      set.add(flag);
    } else {
      set.delete(flag);
    }
    setFlags(Array.from(set).sort().join(""));
  };

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Pattern</Label>
            <Input value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="\\d+" />
          </div>
          <div className="space-y-2">
            <Label>Presets</Label>
            <Select
              onValueChange={(value) => {
                const preset = REGEX_PRESETS.find((item) => item.name === value);
                if (!preset) return;
                setPattern(preset.pattern);
                setFlags(preset.flags);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select preset" />
              </SelectTrigger>
              <SelectContent>
                {REGEX_PRESETS.map((item) => (
                  <SelectItem key={item.name} value={item.name}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {(["g", "i", "m", "s", "u"] as const).map((flag) => (
            <div className="flex items-center gap-2" key={flag}>
              <Checkbox
                id={`flag-${flag}`}
                checked={flags.includes(flag)}
                onCheckedChange={(checked) => toggleFlag(flag, Boolean(checked))}
              />
              <Label htmlFor={`flag-${flag}`}>{flag}</Label>
            </div>
          ))}
          <Badge variant="secondary">{matches.length} matches</Badge>
          <CopyButton text={pattern} />
        </div>

        <div className="space-y-2">
          <Label>Test Text</Label>
          <Textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-40" />
          <div className="flex gap-2">
            <SampleButton onLoadSample={() => setText(SAMPLE_TEXT)} />
            <ClearButton onClear={() => setText("")} />
          </div>
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <div className="rounded-lg border p-3 space-y-2">
          <p className="text-sm font-semibold">Match Highlight</p>
          <div className="rounded bg-muted p-3 text-sm whitespace-pre-wrap break-words">
            {highlighted.map((part, idx) => (
              <span
                key={idx}
                className={part.matched ? "bg-yellow-300/60 dark:bg-yellow-500/40 rounded px-0.5" : ""}
              >
                {part.text}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-lg border overflow-hidden">
          <div className="px-3 py-2 border-b text-sm font-semibold">Capture Groups</div>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/70">
                <tr>
                  <th className="text-left p-2">#</th>
                  <th className="text-left p-2">Match</th>
                  <th className="text-left p-2">Groups</th>
                </tr>
              </thead>
              <tbody>
                {matches.length === 0 ? (
                  <tr>
                    <td className="p-3 text-muted-foreground" colSpan={3}>
                      No matches.
                    </td>
                  </tr>
                ) : (
                  matches.map((match) => (
                    <tr className="border-t" key={`${match.index}-${match.start}`}>
                      <td className="p-2 font-mono">{match.index}</td>
                      <td className="p-2 font-mono break-all">{match.text}</td>
                      <td className="p-2 font-mono break-all">
                        {match.groups.length ? match.groups.map((g) => g ?? "undefined").join(" | ") : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

