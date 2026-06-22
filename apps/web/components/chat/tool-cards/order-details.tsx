import { PackageSearchIcon } from "lucide-react";
import { CardShell } from "./card-shell";
import {
  Separator,
  StatusBadge,
  formatCurrency,
  formatDate,
} from "@bookstore/ui";
import type { OrderDetail } from "@bookstore/db";

export function OrderDetailsCard({ output }: { output: OrderDetail }) {
  const detail = output;
  if (!detail) return null;
  const { order, items } = detail;

  return (
    <CardShell icon={PackageSearchIcon} title={`Order #${order.id}`}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <p className="text-xs text-muted-foreground">
            Placed {formatDate(order.placedAt)}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {order.shippingAddress}
          </p>
        </div>
        <StatusBadge status={order.status} kind="order" />
      </div>
      <ul className="-mx-1 divide-y">
        {items.map((item) => (
          <li
            key={item.bookId}
            className="flex items-center justify-between gap-2 px-1 py-2"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{item.title}</p>
              <p className="truncate text-xs text-muted-foreground">
                {item.author} · qty {item.quantity}
              </p>
            </div>
            <span className="text-sm font-medium tabular-nums">
              {formatCurrency(item.lineTotalCents)}
            </span>
          </li>
        ))}
      </ul>
      <Separator className="my-2" />
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Total</span>
        <span className="font-semibold tabular-nums">
          {formatCurrency(order.totalCents)}
        </span>
      </div>
    </CardShell>
  );
}
