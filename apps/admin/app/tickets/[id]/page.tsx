import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, MessageSquareIcon } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  StatusBadge,
  formatDateTime,
  formatRelativeTime,
} from "@bookstore/ui";
import { getSupportTicket, getUserTickets } from "@bookstore/db";
import { AdminPageHeader } from "@/components/admin-page-header";
import { TicketActions } from "../ticket-actions";

export const dynamic = "force-dynamic";

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ticketId = Number.parseInt(id, 10);
  if (!Number.isFinite(ticketId) || ticketId <= 0) notFound();

  const ticket = getSupportTicket(ticketId);
  if (!ticket) notFound();

  const otherTickets = getUserTickets(ticket.userId)
    .filter((t) => t.id !== ticket.id)
    .slice(0, 5);

  return (
    <>
      <Button variant="ghost" size="sm" className="-ml-2 mb-4 gap-1.5" asChild>
        <Link href="/tickets" prefetch>
          <ArrowLeftIcon className="size-4" />
          All tickets
        </Link>
      </Button>

      <AdminPageHeader
        title={`Ticket #${ticket.id}`}
        description={`From ${ticket.userId} · opened ${formatRelativeTime(ticket.createdAt)}`}
        actions={<StatusBadge status={ticket.status} kind="ticket" />}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
                Subject
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">{ticket.subject}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
                Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {ticket.body}
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                Opened {formatDateTime(ticket.createdAt)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
                Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TicketActions ticketId={ticket.id} status={ticket.status} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-1.5 text-sm uppercase tracking-wide text-muted-foreground">
              <MessageSquareIcon className="size-3.5" />
              Other tickets from {ticket.userId}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {otherTickets.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No other tickets from this customer.
              </p>
            ) : (
              <ul className="space-y-2">
                {otherTickets.map((t) => (
                  <li key={t.id}>
                    <Link
                      href={`/tickets/${t.id}`}
                      prefetch
                      className="block rounded-md border p-2 text-sm transition-colors hover:bg-accent"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium">#{t.id}</span>
                        <StatusBadge status={t.status} kind="ticket" />
                      </div>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {t.subject}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
