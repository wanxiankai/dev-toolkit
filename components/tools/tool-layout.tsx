import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { FavoriteButton } from "@/components/tools/favorite-button";
import { Link } from "@/i18n/routing";
import { Tool } from "@/types/tools";

interface ToolLayoutProps {
  tool: Tool;
  children: React.ReactNode;
}

function normalizeCategory(category: string) {
  return category
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

export function ToolLayout({ tool, children }: ToolLayoutProps) {
  return (
    <div className="w-full space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{normalizeCategory(tool.category)}</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{tool.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">{tool.name}</h1>
          <p className="text-muted-foreground">{tool.description}</p>
        </div>

        <FavoriteButton toolSlug={tool.slug} category={tool.category} />
      </div>

      <Card>
        <CardContent className="p-4 md:p-6">{children}</CardContent>
      </Card>
    </div>
  );
}
