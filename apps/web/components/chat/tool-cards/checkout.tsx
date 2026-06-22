import Link from "next/link";
import { CheckCircle2Icon } from "lucide-react";
import { CardShell } from "./card-shell";
import {
  Separator,
  StatusBadge,
  formatCurrency,
  formatDate,
} from "@bookstore/ui";
import type { OrderDetail } from "@bookstore/db";

export function CheckoutCard({ output }: { output: OrderDetail }) {
  const detail = output;
  if (!detail) return null;
  const { order, items } = detail;

  return (
    <CardShell icon={CheckCircle2Icon} title="Order placed" tone="success">
      <p className="text-sm">
        Thanks, Ada! Your order{" "}
        <Link
          href={`/orders/${order.id}`}
          prefetch
          className="font-semibold text-primary hover:underline"
        >
          #{order.id}
        </Link>{" "}
        is confirmed.
      </p>

      <ul className="mt-2 divide-y">
        {items.map((item) => (
          <li
            key={item.bookId}
            className="flex items-center justify-between gap-2 py-1.5 first:pt-0 last:pb-0"
          >
            <div className="min-w-0">
              <p className="truncate text-xs font-medium">{item.title}</p>
              <p className="text-[10px] text-muted-foreground">
                qty {item.quantity}
              </p>
            </div>
            <span className="text-xs tabular-nums">
              {formatCurrency(item.lineTotalCents)}
            </span>
          </li>
        ))}
      </ul>

      <Separator className="my-2" />
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Total</span>
        <span className="font-semibold tabular-nums">
          {formatCurrency(order.totalCents)}
        </span>
      </div>
      <div className="mt-2 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Status</span>
        <StatusBadge status={order.status} kind="order" />
      </div>
      <p className="mt-2 text-[10px] text-muted-foreground">
        Placed {formatDate(order.placedAt)}
      </p>
    </CardShell>
  );
}
