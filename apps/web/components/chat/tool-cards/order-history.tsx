import Link from "next/link";
import { PackageIcon } from "lucide-react";
import { StatusBadge, formatCurrency, formatDate } from "@bookstore/ui";
import type { Order } from "@bookstore/db";
import { CardShell } from "./card-shell";

export function OrderHistoryCard({ output }: { output: Order[] }) {
  const orders = Array.isArray(output) ? output : [];
  if (orders.length === 0) {
    return (
      <CardShell icon={PackageIcon} title="Order history">
        <p className="text-sm text-muted-foreground">No past orders yet.</p>
      </CardShell>
    );
  }

  return (
    <CardShell
      icon={PackageIcon}
      title={`${orders.length} order${orders.length === 1 ? "" : "s"}`}
      action={
        <Link href="/orders" prefetch className="text-xs font-medium text-primary hover:underline">
          View all
        </Link>
      }
    >
      <ul className="-mx-1 divide-y">
        {orders.slice(0, 5).map((order) => (
          <li key={order.id} className="flex items-center justify-between gap-2 px-1 py-2">
            <div className="min-w-0">
              <p className="text-sm font-medium">Order #{order.id}</p>
              <p className="text-xs text-muted-foreground">{formatDate(order.placedAt)}</p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={order.status} kind="order" />
              <span className="text-sm font-medium tabular-nums">
                {formatCurrency(order.totalCents)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </CardShell>
  );
}
