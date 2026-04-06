import { format } from "sql-formatter";

export type SqlDialect = "sql" | "mysql" | "postgresql" | "sqlite" | "transactsql";

export interface SqlFormatOptions {
  dialect: SqlDialect;
  tabWidth: number;
  uppercaseKeywords: boolean;
}

export function formatSql(input: string, options: SqlFormatOptions): string {
  return format(input, {
    language: options.dialect,
    tabWidth: options.tabWidth,
    keywordCase: options.uppercaseKeywords ? "upper" : "preserve",
    linesBetweenQueries: 1,
  });
}

export function minifySql(input: string): string {
  return input
    .replace(/\s+/g, " ")
    .replace(/\s*([(),;=<>+-])\s*/g, "$1")
    .trim();
}

