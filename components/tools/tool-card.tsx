"use client";

import { DynamicIcon } from "@/components/DynamicIcon";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import { Tool } from "@/types/tools";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const t = useTranslations("DevToolKit");
  const tTools = useTranslations("Tools");
  const name = tTools(`${tool.slug}.name`);
  const description = tTools(`${tool.slug}.description`);

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.15 }}>
      <Link href={tool.path} title={name} prefetch>
        <Card className="h-full transition-colors hover:border-primary/40 hover:bg-accent/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <DynamicIcon name={tool.icon} className="size-5" />
              </div>
              {tool.isAI && <Badge>{t("powered_by_ai")}</Badge>}
            </div>
            <CardTitle className="text-base leading-6">{name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{description}</p>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
