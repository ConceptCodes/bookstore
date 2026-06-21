"use client";

import { Badge } from "@bookstore/ui";
import { WrenchIcon } from "lucide-react";

type ToolPartLike = {
  type: string;
  toolName?: string | undefined;
  state?: string | undefined;
  input?: unknown;
};

const STATE_LABEL: Record<string, string> = {
  "input-streaming": "Preparing",
  "input-available": "Running",
  "output-available": "Done",
  "output-error": "Failed",
  "output-denied": "Denied",
};

export function ToolPartBadge({ part }: { part: ToolPartLike }) {
  const toolName = part.toolName ?? "tool";
  const state = part.state ? STATE_LABEL[part.state] ?? part.state : "called";
  return (
    <Badge variant="outline" className="gap-1.5 py-1 text-xs font-normal">
      <WrenchIcon className="size-3 text-muted-foreground" />
      <span className="font-mono">{toolName}</span>
      <span className="text-muted-foreground">· {state}</span>
    </Badge>
  );
}
