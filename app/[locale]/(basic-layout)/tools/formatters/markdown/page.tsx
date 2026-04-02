"use client";

import { useEffect, useRef, useState } from "react";
import { ToolLayout } from "@/components/tools/tool-layout";
import { getToolBySlug } from "@/config/tools";
import { useRecentTools } from "@/hooks/use-recent-tools";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/tools/copy-button";
import { ClearButton } from "@/components/tools/clear-button";
import { SampleButton } from "@/components/tools/sample-button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { toast } from "sonner";

const tool = getToolBySlug("markdown")!;

const SAMPLE_MD = `# DevToolKit Markdown\n\n- Fast\n- Privacy-first\n- Developer focused\n\n\`\`\`ts\nconst hello = "markdown";\nconsole.log(hello);\n\`\`\``;

export default function MarkdownPage() {
  const { addRecentTool } = useRecentTools();
  const [markdown, setMarkdown] = useState(SAMPLE_MD);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    addRecentTool(tool.slug);
  }, [addRecentTool]);

  const exportHtml = () => {
    if (!previewRef.current) return;
    const html = `<!doctype html><html><head><meta charset=\"utf-8\"><title>Markdown Export</title></head><body>${previewRef.current.innerHTML}</body></html>`;
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "markdown-export.html";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported as HTML");
  };

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <SampleButton onLoadSample={() => setMarkdown(SAMPLE_MD)} />
          <ClearButton onClear={() => setMarkdown("")} />
          <CopyButton text={markdown} />
          <Button variant="outline" onClick={exportHtml}>Export HTML</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="border rounded-xl p-3">
            <p className="text-sm font-medium mb-2">Markdown Input</p>
            <Textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="min-h-[520px] resize-none font-mono"
            />
          </div>

          <div className="border rounded-xl p-3">
            <p className="text-sm font-medium mb-2">Preview</p>
            <div ref={previewRef} className="prose dark:prose-invert max-w-none min-h-[520px] overflow-auto">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                {markdown}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
