"use client";

import { Button } from "@/components/ui/button";
import { Beaker } from "lucide-react";
import { useTranslations } from "next-intl";

interface SampleButtonProps {
  onLoadSample: () => void;
  className?: string;
}

export function SampleButton({ onLoadSample, className }: SampleButtonProps) {
  const t = useTranslations("ToolActions");

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={className}
      onClick={onLoadSample}
    >
      <Beaker className="size-4" />
      {t("sample")}
    </Button>
  );
}
