import Link from "next/link";
import { LifeBuoyIcon, MessageSquareIcon } from "lucide-react";
import { StatusBadge, formatRelativeTime } from "@bookstore/ui";
import type { SupportTicket } from "@bookstore/db";
import { CardShell } from "./card-shell";

const ICONS: Record<string, typeof LifeBuoyIcon> = {
  create_support_ticket: LifeBuoyIcon,
  get_support_ticket: MessageSquareIcon,
};

const TITLES: Record<string, string> = {
  create_support_ticket: "Ticket opened",
  get_support_ticket: "Support ticket",
};

export function SupportTicketCard({
  output,
  toolName = "get_support_ticket",
}: {
  output: SupportTicket;
  toolCallId?: string;
  toolName?: string;
}) {
  const ticket = output;
  if (!ticket) return null;
  const Icon = ICONS[toolName] ?? MessageSquareIcon;
  const title = TITLES[toolName] ?? "Support ticket";

  return (
    <CardShell
      icon={Icon}
      title={title}
      action={<StatusBadge status={ticket.status} kind="ticket" />}
    >
      <div className="space-y-1.5">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-sm font-semibold">Ticket #{ticket.id}</p>
          <span className="text-[10px] text-muted-foreground">
            opened {formatRelativeTime(ticket.createdAt)}
          </span>
        </div>
        <p className="text-sm font-medium">{ticket.subject}</p>
        <p className="line-clamp-3 text-xs text-muted-foreground">
          {ticket.body}
        </p>
        <Link
          href="/support"
          prefetch
          className="inline-block text-xs font-medium text-primary hover:underline"
        >
          View in support
        </Link>
      </div>
    </CardShell>
  );
}
