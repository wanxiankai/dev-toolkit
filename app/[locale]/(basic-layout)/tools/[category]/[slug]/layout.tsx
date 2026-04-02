import { getToolBySlug } from "@/config/tools";
import { Locale } from "@/i18n/routing";
import { constructMetadata } from "@/lib/metadata";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, category, slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool || tool.category !== category) {
    return constructMetadata({
      locale: locale as Locale,
      title: "Tool",
      description: "Developer tool",
      path: `/tools/${category}/${slug}`,
      noIndex: true,
    });
  }

  return constructMetadata({
    locale: locale as Locale,
    title: tool.name,
    description: tool.description,
    path: tool.path,
  });
}

export default function ToolMetadataLayout({ children }: { children: React.ReactNode }) {
  return children;
}
