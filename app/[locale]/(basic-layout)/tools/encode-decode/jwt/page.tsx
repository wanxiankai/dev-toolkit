"use client";

import { useEffect, useMemo, useState } from "react";
import { ToolLayout } from "@/components/tools/tool-layout";
import { getToolBySlug } from "@/config/tools";
import { useRecentTools } from "@/hooks/use-recent-tools";
import { decodeJwt, getJwtExpiryStatus } from "@/lib/tools/jwt-decoder";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/tools/copy-button";
import { ClearButton } from "@/components/tools/clear-button";
import { SampleButton } from "@/components/tools/sample-button";

const tool = getToolBySlug("jwt")!;

const SAMPLE_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkRldlRvb2xLaXQiLCJleHAiOjQxMDA5NDcyMDB9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

export default function JwtPage() {
  const { addRecentTool } = useRecentTools();
  const [token, setToken] = useState("");

  useEffect(() => {
    addRecentTool(tool.slug);
  }, [addRecentTool]);

  const parsed = useMemo(() => {
    if (!token.trim()) return null;
    try {
      const decoded = decodeJwt(token);
      const exp = getJwtExpiryStatus(decoded.payload);
      return { decoded, exp, error: null as string | null };
    } catch (error) {
      return {
        decoded: null,
        exp: null,
        error: error instanceof Error ? error.message : "Invalid token",
      };
    }
  }, [token]);

  const segments = token.split(".");

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="min-h-32"
            placeholder="Paste JWT token here..."
          />
          <div className="flex gap-2">
            <SampleButton onLoadSample={() => setToken(SAMPLE_JWT)} />
            <ClearButton onClear={() => setToken("")} />
          </div>
        </div>

        {segments.length === 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs font-mono">
            <div className="p-2 rounded bg-blue-500/10 break-all">{segments[0]}</div>
            <div className="p-2 rounded bg-green-500/10 break-all">{segments[1]}</div>
            <div className="p-2 rounded bg-amber-500/10 break-all">{segments[2]}</div>
          </div>
        )}

        {parsed?.error && <p className="text-sm text-destructive">{parsed.error}</p>}

        {parsed?.decoded && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center justify-between">Header <CopyButton text={JSON.stringify(parsed.decoded.header, null, 2)} /></CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs overflow-auto">{JSON.stringify(parsed.decoded.header, null, 2)}</pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center justify-between">Payload <CopyButton text={JSON.stringify(parsed.decoded.payload, null, 2)} /></CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {parsed.exp && (
                  <Badge variant={parsed.exp.status === "expired" ? "destructive" : "default"}>{parsed.exp.message}</Badge>
                )}
                <pre className="text-xs overflow-auto">{JSON.stringify(parsed.decoded.payload, null, 2)}</pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center justify-between">Signature <CopyButton text={parsed.decoded.signature} /></CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs break-all font-mono">{parsed.decoded.signature}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
