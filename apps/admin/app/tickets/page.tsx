import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  EmptyState,
  StatusBadge,
  formatRelativeTime,
} from "@bookstore/ui";
import { LifeBuoyIcon } from "lucide-react";
import { listAllTickets } from "@bookstore/db";
import { AdminPageHeader } from "@/components/admin-page-header";
import type { TicketStatus } from "@bookstore/db";

export const dynamic = "force-dynamic";

const STATUS_FILTERS: { value: "all" | TicketStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "answered", label: "Answered" },
  { value: "closed", label: "Closed" },
];

export default async function TicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const statusFilter =
    status && status !== "all" ? (status as TicketStatus) : undefined;

  const allTickets = listAllTickets();
  const tickets = statusFilter
    ? allTickets.filter((t) => t.status === statusFilter)
    : allTickets;

  return (
    <>
      <AdminPageHeader
        title="Support tickets"
        description={`${allTickets.length} total · showing ${tickets.length}`}
      />

      <div className="mb-4 flex flex-wrap items-center gap-1.5">
        {STATUS_FILTERS.map((f) => (
          <Link
            key={f.value}
            href={f.value === "all" ? "/tickets" : `/tickets?status=${f.value}`}
            prefetch
            className={
              "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors " +
              ((statusFilter ?? "all") === f.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground")
            }
          >
            {f.label}
          </Link>
        ))}
      </div>

      {tickets.length === 0 ? (
        <EmptyState
          icon={LifeBuoyIcon}
          title="No tickets"
          description="Customer support tickets will appear here."
        />
      ) : (
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead className="hidden md:table-cell">Customer</TableHead>
                <TableHead className="hidden sm:table-cell">Opened</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-mono text-xs">#{ticket.id}</TableCell>
                  <TableCell>
                    <Link
                      href={`/tickets/${ticket.id}`}
                      prefetch
                      className="block max-w-[400px] truncate font-medium hover:underline"
                    >
                      {ticket.subject}
                    </Link>
                    <p className="max-w-[400px] truncate text-xs text-muted-foreground">
                      {ticket.body}
                    </p>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                    {ticket.userId}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                    {formatRelativeTime(ticket.createdAt)}
                  </TableCell>
                  <TableCell className="text-center">
                    <StatusBadge status={ticket.status} kind="ticket" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}
