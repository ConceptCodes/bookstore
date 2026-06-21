import type { VariantProps } from "class-variance-authority";
import { Badge, badgeVariants } from "../ui/badge";
import { cn } from "../../lib/utils";

export type OrderStatus = "pending" | "paid" | "shipped" | "cancelled";
export type TicketStatus = "open" | "answered" | "closed";
export type StatusKind = "order" | "ticket";

export type StatusBadgeProps = {
  status: string;
  kind?: StatusKind;
  variant?: VariantProps<typeof badgeVariants>["variant"];
  className?: string;
};

const ORDER_CLASSES: Record<OrderStatus, string> = {
  pending:
    "border-amber-300/60 bg-amber-100 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/50 dark:text-amber-200",
  paid: "border-blue-300/60 bg-blue-100 text-blue-900 dark:border-blue-900/40 dark:bg-blue-950/50 dark:text-blue-200",
  shipped:
    "border-emerald-300/60 bg-emerald-100 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/50 dark:text-emerald-200",
  cancelled:
    "border-rose-300/60 bg-rose-100 text-rose-900 dark:border-rose-900/40 dark:bg-rose-950/50 dark:text-rose-200",
};

const TICKET_CLASSES: Record<TicketStatus, string> = {
  open: "border-blue-300/60 bg-blue-100 text-blue-900 dark:border-blue-900/40 dark:bg-blue-950/50 dark:text-blue-200",
  answered:
    "border-emerald-300/60 bg-emerald-100 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/50 dark:text-emerald-200",
  closed:
    "border-muted-foreground/20 bg-muted text-muted-foreground",
};

export function StatusBadge({
  status,
  kind = "order",
  variant = "outline",
  className,
}: StatusBadgeProps) {
  const classes =
    kind === "order"
      ? ORDER_CLASSES[status as OrderStatus]
      : TICKET_CLASSES[status as TicketStatus];
  return (
    <Badge variant={variant} className={cn("font-medium capitalize", classes, className)}>
      {status}
    </Badge>
  );
}
