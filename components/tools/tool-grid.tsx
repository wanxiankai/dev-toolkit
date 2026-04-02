import { Tool } from "@/types/tools";
import { ToolCard } from "@/components/tools/tool-card";

interface ToolGridProps {
  tools: Tool[];
  title: string;
}

export function ToolGrid({ tools, title }: ToolGridProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </section>
  );
}
