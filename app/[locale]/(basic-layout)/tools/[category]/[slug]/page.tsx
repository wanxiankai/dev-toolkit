import { getToolBySlug } from "@/config/tools";
import { notFound } from "next/navigation";
import ToolPageClient from "./tool-page-client";

export default async function ToolPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool || tool.category !== category) {
    notFound();
  }

  return <ToolPageClient tool={tool} />;
}
