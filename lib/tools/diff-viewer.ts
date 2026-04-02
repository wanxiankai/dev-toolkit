import { Change, diffLines } from "diff";

export interface DiffStats {
  added: number;
  removed: number;
  modified: number;
}

export function buildLineDiff(oldText: string, newText: string): Change[] {
  return diffLines(oldText, newText);
}

export function computeDiffStats(changes: Change[]): DiffStats {
  let added = 0;
  let removed = 0;

  changes.forEach((change) => {
    const lines = change.value.split("\n").filter((line) => line.length > 0).length;
    if (change.added) {
      added += lines;
    } else if (change.removed) {
      removed += lines;
    }
  });

  return {
    added,
    removed,
    modified: Math.min(added, removed),
  };
}
