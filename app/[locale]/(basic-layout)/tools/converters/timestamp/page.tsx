"use client";

import { useEffect, useMemo, useState } from "react";
import { ToolLayout } from "@/components/tools/tool-layout";
import { getToolBySlug } from "@/config/tools";
import { useRecentTools } from "@/hooks/use-recent-tools";
import {
  dateToTimestamps,
  formatDateVariants,
  formatDateWithTimeZone,
  parseTimestamp,
} from "@/lib/tools/timestamp-converter";
import { ClearButton } from "@/components/tools/clear-button";
import { CopyButton } from "@/components/tools/copy-button";
import { SampleButton } from "@/components/tools/sample-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const tool = getToolBySlug("timestamp")!;
const TIMEZONES = ["UTC", "Asia/Shanghai", "Asia/Tokyo", "America/New_York", "Europe/London"];

export default function TimestampPage() {
  const { addRecentTool } = useRecentTools();
  const [timestampInput, setTimestampInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [timezone, setTimezone] = useState("UTC");
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    addRecentTool(tool.slug);
  }, [addRecentTool]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const timestampOutput = useMemo(() => {
    if (!timestampInput.trim()) return null;
    try {
      const date = parseTimestamp(timestampInput);
      const variants = formatDateVariants(date);
      return {
        timezone: formatDateWithTimeZone(date, timezone),
        ...variants,
      };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Invalid timestamp" };
    }
  }, [timestampInput, timezone]);

  const dateOutput = useMemo(() => {
    if (!dateInput.trim()) return null;
    try {
      return dateToTimestamps(dateInput);
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Invalid date input" };
    }
  }, [dateInput]);

  const nowSeconds = Math.floor(now.getTime() / 1000);
  const nowMs = now.getTime();

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-4">
        <div className="rounded-lg border p-3 space-y-2">
          <p className="text-sm font-semibold">Current Time (updates every second)</p>
          <p className="text-sm text-muted-foreground">{formatDateWithTimeZone(now, timezone)}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
            <div className="rounded bg-muted p-2 flex items-center justify-between gap-2">
              <span>{nowSeconds}</span>
              <CopyButton text={String(nowSeconds)} />
            </div>
            <div className="rounded bg-muted p-2 flex items-center justify-between gap-2">
              <span>{nowMs}</span>
              <CopyButton text={String(nowMs)} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-lg border p-3 space-y-3">
            <p className="text-sm font-semibold">Timestamp to Date</p>
            <Input
              value={timestampInput}
              onChange={(e) => setTimestampInput(e.target.value)}
              placeholder="e.g. 1710000000 or 1710000000000"
            />
            <div className="space-y-2">
              <Label>Time Zone</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map((tz) => (
                    <SelectItem value={tz} key={tz}>
                      {tz}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <SampleButton onLoadSample={() => setTimestampInput(String(Math.floor(Date.now() / 1000)))} />
              <ClearButton onClear={() => setTimestampInput("")} />
            </div>
            <ResultBlock
              lines={
                timestampOutput
                  ? "error" in timestampOutput
                    ? [`Error: ${timestampOutput.error}`]
                    : [
                        `ISO 8601: ${timestampOutput.iso8601}`,
                        `RFC 2822: ${timestampOutput.rfc2822}`,
                        `Relative: ${timestampOutput.relative}`,
                        `In ${timezone}: ${timestampOutput.timezone}`,
                      ]
                  : []
              }
            />
          </div>

          <div className="rounded-lg border p-3 space-y-3">
            <p className="text-sm font-semibold">Date to Timestamp</p>
            <Input
              type="datetime-local"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
            />
            <div className="flex gap-2">
              <SampleButton
                onLoadSample={() => {
                  const d = new Date();
                  d.setSeconds(0, 0);
                  setDateInput(d.toISOString().slice(0, 16));
                }}
              />
              <ClearButton onClear={() => setDateInput("")} />
            </div>
            <ResultBlock
              lines={
                dateOutput
                  ? "error" in dateOutput
                    ? [`Error: ${dateOutput.error}`]
                    : [`Seconds: ${dateOutput.seconds}`, `Milliseconds: ${dateOutput.milliseconds}`]
                  : []
              }
            />
            {dateOutput && !("error" in dateOutput) && (
              <div className="flex gap-2">
                <CopyButton text={String(dateOutput.seconds)} />
                <CopyButton text={String(dateOutput.milliseconds)} />
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

function ResultBlock({ lines }: { lines: string[] }) {
  if (lines.length === 0) {
    return <p className="text-sm text-muted-foreground">No result yet.</p>;
  }
  return (
    <pre className="rounded-md bg-muted p-3 text-xs font-mono whitespace-pre-wrap break-all">
      {lines.join("\n")}
    </pre>
  );
}
