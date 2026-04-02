"use client";

import { Button } from "@/components/ui/button";
import { Eraser } from "lucide-react";
import { useTranslations } from "next-intl";

interface ClearButtonProps {
  onClear: () => void;
  className?: string;
}

export function ClearButton({ onClear, className }: ClearButtonProps) {
  const t = useTranslations("ToolActions");

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={className}
      onClick={onClear}
    >
      <Eraser className="size-4" />
      {t("clear")}
    </Button>
  );
}
