"use client";

import { useEffect, useMemo, useState } from "react";
import { ToolLayout } from "@/components/tools/tool-layout";
import { getToolBySlug } from "@/config/tools";
import { useRecentTools } from "@/hooks/use-recent-tools";
import { evaluatePasswordStrength, generatePasswords } from "@/lib/tools/password-generator";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyButton } from "@/components/tools/copy-button";
import { ClearButton } from "@/components/tools/clear-button";
import { SampleButton } from "@/components/tools/sample-button";
import { toast } from "sonner";

const tool = getToolBySlug("password")!;

export default function PasswordPage() {
  const { addRecentTool } = useRecentTools();
  const [length, setLength] = useState(16);
  const [count, setCount] = useState(5);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeChars, setExcludeChars] = useState("");
  const [passwords, setPasswords] = useState<string[]>([]);

  useEffect(() => {
    addRecentTool(tool.slug);
  }, [addRecentTool]);

  const onGenerate = () => {
    try {
      const result = generatePasswords({
        length,
        count,
        includeUppercase,
        includeLowercase,
        includeNumbers,
        includeSymbols,
        excludeChars,
      });
      setPasswords(result);
      toast.success(`Generated ${result.length} password${result.length > 1 ? "s" : ""}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to generate password");
    }
  };

  const strongest = useMemo(() => {
    if (!passwords.length) return null;
    return evaluatePasswordStrength(passwords[0]);
  }, [passwords]);

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="space-y-2">
            <Label>Length (4-128)</Label>
            <Input
              type="number"
              min={4}
              max={128}
              value={length}
              onChange={(e) => setLength(Math.min(128, Math.max(4, Number(e.target.value) || 16)))}
            />
          </div>
          <div className="space-y-2">
            <Label>Count (1-20)</Label>
            <Input
              type="number"
              min={1}
              max={20}
              value={count}
              onChange={(e) => setCount(Math.min(20, Math.max(1, Number(e.target.value) || 1)))}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Exclude Characters</Label>
            <Input value={excludeChars} onChange={(e) => setExcludeChars(e.target.value)} placeholder="e.g. 0OIl" />
          </div>
          <div className="flex items-end gap-2 flex-wrap">
            <Button onClick={onGenerate}>Generate</Button>
            <SampleButton
              onLoadSample={() => {
                setLength(20);
                setCount(5);
                setIncludeSymbols(true);
                onGenerate();
              }}
            />
            <ClearButton onClear={() => setPasswords([])} />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <OptionToggle id="pass-upper" label="Uppercase" checked={includeUppercase} onChange={setIncludeUppercase} />
          <OptionToggle id="pass-lower" label="Lowercase" checked={includeLowercase} onChange={setIncludeLowercase} />
          <OptionToggle id="pass-num" label="Numbers" checked={includeNumbers} onChange={setIncludeNumbers} />
          <OptionToggle id="pass-symbol" label="Symbols" checked={includeSymbols} onChange={setIncludeSymbols} />
        </div>

        <div className="rounded-lg border p-3 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold">Generated Passwords</p>
            <CopyButton text={passwords.join("\n")} />
          </div>
          {strongest && (
            <p className="text-sm text-muted-foreground">
              Strength: <span className="font-medium">{strongest}</span>
            </p>
          )}
          {passwords.length === 0 ? (
            <p className="text-sm text-muted-foreground">No passwords yet.</p>
          ) : (
            <div className="space-y-2">
              {passwords.map((password, index) => (
                <div key={`${password}-${index}`} className="rounded-md border px-3 py-2 flex items-center justify-between gap-2">
                  <span className="font-mono text-sm break-all">{password}</span>
                  <CopyButton text={password} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}

function OptionToggle({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-2 rounded-md border p-3">
      <Checkbox id={id} checked={checked} onCheckedChange={(v) => onChange(Boolean(v))} />
      <Label htmlFor={id}>{label}</Label>
    </div>
  );
}

