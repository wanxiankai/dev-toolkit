export type ToolCategory =
  | "encode-decode"
  | "formatters"
  | "generators"
  | "converters"
  | "viewers"
  | "ai";

export interface Tool {
  slug: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: string;
  path: string;
  keywords: string[];
  isAI?: boolean;
  priority: "P0" | "P1" | "P2";
}

export interface CategoryInfo {
  name: string;
  icon: string;
  description: string;
}
