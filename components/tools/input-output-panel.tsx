"use client";

import { ReactNode } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface InputOutputPanelProps {
  inputValue: string;
  outputValue: string;
  onInputChange: (value: string) => void;
  inputLabel?: string;
  outputLabel?: string;
  inputPlaceholder?: string;
  outputPlaceholder?: string;
  inputActions?: ReactNode;
  outputActions?: ReactNode;
}

function PanelBody({
  label,
  value,
  placeholder,
  onChange,
  readOnly,
  actions,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  actions?: ReactNode;
}) {
  return (
    <div className="border rounded-xl flex flex-col min-h-[360px]">
      <div className="px-4 py-3 border-b text-sm font-medium">{label}</div>
      <div className="p-3 flex-1">
        <Textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          className={cn("h-full min-h-[280px] resize-none", readOnly && "opacity-90")}
        />
      </div>
      <div className="border-t px-3 py-2 flex items-center gap-2 min-h-11">{actions}</div>
    </div>
  );
}

export function InputOutputPanel({
  inputValue,
  outputValue,
  onInputChange,
  inputLabel = "Input",
  outputLabel = "Output",
  inputPlaceholder = "Type or paste your input here...",
  outputPlaceholder = "Output will appear here...",
  inputActions,
  outputActions,
}: InputOutputPanelProps) {
  return (
    <>
      <div className="hidden md:block h-[520px]">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={50} minSize={30}>
            <PanelBody
              label={inputLabel}
              value={inputValue}
              placeholder={inputPlaceholder}
              onChange={onInputChange}
              actions={inputActions}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50} minSize={30}>
            <PanelBody
              label={outputLabel}
              value={outputValue}
              placeholder={outputPlaceholder}
              readOnly
              actions={outputActions}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <div className="md:hidden space-y-4">
        <PanelBody
          label={inputLabel}
          value={inputValue}
          placeholder={inputPlaceholder}
          onChange={onInputChange}
          actions={inputActions}
        />
        <PanelBody
          label={outputLabel}
          value={outputValue}
          placeholder={outputPlaceholder}
          readOnly
          actions={outputActions}
        />
      </div>
    </>
  );
}
