"use client";

import { useCopyClipboard } from "@/hooks/use-copy-clipboard";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className }: CopyButtonProps) {
  const t = useTranslations("ToolActions");
  const { copied, copyToClipboard } = useCopyClipboard();

  const onClick = async () => {
    try {
      await copyToClipboard(text);
      toast.success(t("copied"));
    } catch {
      toast.error("Copy failed");
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={className}
      onClick={onClick}
    >
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      {copied ? t("copied") : t("copy")}
    </Button>
  );
}
