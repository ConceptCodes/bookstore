"use client";

import { useTransition } from "react";
import { Button } from "@bookstore/ui";
import { CheckIcon, LoaderIcon, MessageSquareReplyIcon, XCircleIcon } from "lucide-react";
import { closeTicketAction, respondToTicketAction } from "@/app/actions";
import type { TicketStatus } from "@bookstore/db";

export function TicketActions({ ticketId, status }: { ticketId: number; status: TicketStatus }) {
  const [pending1, startTransition1] = useTransition();
  const [pending2, startTransition2] = useTransition();

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        size="sm"
        variant={status === "answered" ? "outline" : "default"}
        disabled={pending1 || status === "answered" || status === "closed"}
        onClick={() =>
          startTransition1(async () => {
            await respondToTicketAction(ticketId);
          })
        }
      >
        {pending1 ? (
          <LoaderIcon className="size-3.5 animate-spin" />
        ) : status === "answered" ? (
          <CheckIcon className="size-3.5" />
        ) : (
          <MessageSquareReplyIcon className="size-3.5" />
        )}
        {status === "answered" ? "Answered" : "Mark answered"}
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={pending2 || status === "closed"}
        onClick={() =>
          startTransition2(async () => {
            await closeTicketAction(ticketId);
          })
        }
      >
        {pending2 ? (
          <LoaderIcon className="size-3.5 animate-spin" />
        ) : (
          <XCircleIcon className="size-3.5" />
        )}
        {status === "closed" ? "Closed" : "Close ticket"}
      </Button>
    </div>
  );
}
