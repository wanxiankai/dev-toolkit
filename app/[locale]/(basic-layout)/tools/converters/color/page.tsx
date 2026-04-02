"use client";

import { useEffect, useMemo, useState } from "react";
import { ToolLayout } from "@/components/tools/tool-layout";
import { getToolBySlug } from "@/config/tools";
import { useRecentTools } from "@/hooks/use-recent-tools";
import {
  complementHex,
  contrastTextHex,
  detectColorInput,
  hexToRgb,
  hslToRgb,
  rgbToHex,
  rgbToHsl,
  type RGB,
} from "@/lib/tools/color-converter";
import { CopyButton } from "@/components/tools/copy-button";
import { ClearButton } from "@/components/tools/clear-button";
import { SampleButton } from "@/components/tools/sample-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const tool = getToolBySlug("color")!;
const DEFAULT_RGB: RGB = { r: 59, g: 130, b: 246 };

export default function ColorPage() {
  const { addRecentTool } = useRecentTools();
  const [rgb, setRgb] = useState<RGB>(DEFAULT_RGB);
  const [input, setInput] = useState("#3B82F6");

  useEffect(() => {
    addRecentTool(tool.slug);
  }, [addRecentTool]);

  const hex = useMemo(() => rgbToHex(rgb), [rgb]);
  const hsl = useMemo(() => rgbToHsl(rgb), [rgb]);
  const rgbText = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hslText = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  const complement = useMemo(() => complementHex(hex), [hex]);
  const contrast = useMemo(() => contrastTextHex(hex), [hex]);

  const applyInput = () => {
    try {
      const parsed = detectColorInput(input);
      if (parsed.type === "hex") {
        setRgb(hexToRgb(parsed.value));
      } else if (parsed.type === "rgb") {
        setRgb(parsed.value);
      } else {
        setRgb(hslToRgb(parsed.value));
      }
      toast.success("Color parsed");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Invalid color");
    }
  };

  const setRgbChannel = (key: keyof RGB, value: number) => {
    setRgb((prev) => ({ ...prev, [key]: Math.min(255, Math.max(0, value)) }));
  };

  const setHslChannel = (key: "h" | "s" | "l", value: number) => {
    const next = { ...hsl, [key]: key === "h" ? clamp(value, 0, 360) : clamp(value, 0, 100) };
    setRgb(hslToRgb(next));
  };

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-4">
        <div className="rounded-lg border p-3 space-y-3">
          <Label>Input Color (HEX / RGB / HSL)</Label>
          <div className="flex flex-wrap gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="#3B82F6 or rgb(59,130,246) or hsl(217,91%,60%)"
            />
            <Button onClick={applyInput}>Detect</Button>
            <SampleButton onLoadSample={() => setInput("hsl(217, 91%, 60%)")} />
            <ClearButton
              onClear={() => {
                setInput("");
                setRgb(DEFAULT_RGB);
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="rounded-lg border p-3 space-y-3">
            <p className="text-sm font-semibold">Preview</p>
            <div className="h-28 rounded-md border" style={{ backgroundColor: hex }} />
            <div className="grid grid-cols-1 gap-2 text-xs">
              <ColorLine label="HEX" value={hex} />
              <ColorLine label="RGB" value={rgbText} />
              <ColorLine label="HSL" value={hslText} />
              <ColorLine label="Complementary" value={complement} />
              <ColorLine label="Contrast Text" value={contrast} />
            </div>
          </div>

          <div className="rounded-lg border p-3 space-y-3">
            <p className="text-sm font-semibold">RGB Sliders</p>
            {(["r", "g", "b"] as const).map((key) => (
              <div className="space-y-1" key={key}>
                <div className="flex items-center justify-between text-xs">
                  <span>{key.toUpperCase()}</span>
                  <span>{rgb[key]}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={255}
                  value={rgb[key]}
                  onChange={(e) => setRgbChannel(key, Number(e.target.value))}
                  className="w-full"
                />
              </div>
            ))}
          </div>

          <div className="rounded-lg border p-3 space-y-3">
            <p className="text-sm font-semibold">HSL Sliders</p>
            {([
              ["h", 360],
              ["s", 100],
              ["l", 100],
            ] as const).map(([key, max]) => (
              <div className="space-y-1" key={key}>
                <div className="flex items-center justify-between text-xs">
                  <span>{key.toUpperCase()}</span>
                  <span>{hsl[key]}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={max}
                  value={hsl[key]}
                  onChange={(e) => setHslChannel(key, Number(e.target.value))}
                  className="w-full"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

function ColorLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded bg-muted p-2">
      <span className="font-medium">{label}</span>
      <div className="flex items-center gap-2 min-w-0">
        <span className="font-mono truncate">{value}</span>
        <CopyButton text={value} />
      </div>
    </div>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

