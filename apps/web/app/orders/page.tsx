import Link from "next/link";
import { ArrowRightIcon, PackageIcon } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  EmptyState,
  Separator,
  StatusBadge,
  formatCurrency,
  formatDate,
} from "@bookstore/ui";
import { CUSTOMER_USER_ID, getOrderHistory } from "@bookstore/db";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const orders = getOrderHistory(CUSTOMER_USER_ID);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Your orders
        </h1>
        <p className="text-sm text-muted-foreground">
          {orders.length === 0
            ? "No orders yet."
            : `${orders.length} order${orders.length === 1 ? "" : "s"}`}
        </p>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon={PackageIcon}
          title="No orders yet"
          description="When you place an order it will show up here with tracking and details."
          action={
            <Button asChild>
              <Link href="/" prefetch>
                Browse books
              </Link>
            </Button>
          }
        />
      ) : (
        <ul className="space-y-3">
          {orders.map((order) => (
            <li key={order.id}>
              <Link href={`/orders/${order.id}`} prefetch className="block">
                <Card className="transition-colors hover:bg-accent/40">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <PackageIcon className="size-4" strokeWidth={2} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">Order #{order.id}</p>
                        <StatusBadge status={order.status} kind="order" />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Placed {formatDate(order.placedAt)} · {order.shippingAddress}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold tabular-nums">
                        {formatCurrency(order.totalCents)}
                      </p>
                      <p className="mt-0.5 inline-flex items-center gap-0.5 text-xs text-primary">
                        View
                        <ArrowRightIcon className="size-3" />
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Separator />

      <Button variant="outline" size="sm" asChild>
        <Link href="/" prefetch>
          Continue shopping
        </Link>
      </Button>
    </div>
  );
}
