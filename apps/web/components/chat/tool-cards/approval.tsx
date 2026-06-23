"use client";

import { useState } from "react";
import { ShieldCheckIcon } from "lucide-react";
import { Button } from "@bookstore/ui";
import type { InputRequest, ToolPartLike } from "./types";
import { CardShell } from "./card-shell";

export function ApprovalCard({
  part,
  onRespond,
}: {
  part: ToolPartLike;
  onRespond?: (requestId: string, optionId: string) => void;
}) {
  const request = part.toolMetadata?.eve?.inputRequest as InputRequest | undefined;
  const [responded, setResponded] = useState<string | null>(null);

  if (!request) return null;
  const req = request;

  const options = req.options ?? [
    { optionId: "approve", label: "Approve" },
    { optionId: "deny", label: "Deny" },
  ];

  function handleRespond(optionId: string) {
    if (responded) return;
    setResponded(optionId);
    onRespond?.(req.requestId, optionId);
  }

  const approve = options.find((o) => o.optionId === "approve") ?? options[0];
  const deny = options.find((o) => o.optionId === "deny") ?? options[1];
  const isApproved = responded === approve?.optionId;

  if (responded) {
    return (
      <CardShell
        icon={ShieldCheckIcon}
        title="Checkout decision"
        tone={isApproved ? "success" : "danger"}
      >
        <p className="text-sm">
          {isApproved ? "Approved — placing your order now." : "Declined — your cart is unchanged."}
        </p>
      </CardShell>
    );
  }

  return (
    <CardShell icon={ShieldCheckIcon} title="Approval needed" tone="warning">
      {req.prompt && <p className="mb-3 text-sm font-medium">{req.prompt}</p>}
      {req.description && <p className="mb-3 text-xs text-muted-foreground">{req.description}</p>}
      <div className="flex gap-2">
        {approve && (
          <Button
            size="sm"
            onClick={() => handleRespond(approve.optionId)}
            disabled={Boolean(responded)}
          >
            {approve.label ?? "Approve"}
          </Button>
        )}
        {deny && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleRespond(deny.optionId)}
            disabled={Boolean(responded)}
          >
            {deny.label ?? "Decline"}
          </Button>
        )}
      </div>
    </CardShell>
  );
}
