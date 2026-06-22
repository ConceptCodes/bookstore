import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeftIcon,
  CheckCircle2Icon,
  MapPinIcon,
  PackageIcon,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Separator,
  StatusBadge,
  formatCurrency,
  formatDate,
} from "@bookstore/ui";
import { CUSTOMER_USER_ID, getOrderDetail } from "@bookstore/db";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const orderId = Number.parseInt(id, 10);
  if (!Number.isFinite(orderId) || orderId <= 0) notFound();

  const detail = getOrderDetail(orderId, CUSTOMER_USER_ID);
  if (!detail) notFound();
  const { order, items } = detail;

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" className="-ml-2 gap-1.5" asChild>
        <Link href="/orders" prefetch>
          <ArrowLeftIcon className="size-4" />
          All orders
        </Link>
      </Button>

      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Order #{order.id}
          </h1>
          <p className="text-sm text-muted-foreground">
            Placed {formatDate(order.placedAt)}
          </p>
        </div>
        <StatusBadge status={order.status} kind="order" className="ml-auto" />
      </div>

      {order.status === "shipped" && (
        <Card className="border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/30">
          <CardContent className="flex items-center gap-3 p-4">
            <CheckCircle2Icon className="size-5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                Your order is on the way
              </p>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                Estimated delivery in 3-5 business days.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-1.5 text-sm uppercase tracking-wide text-muted-foreground">
              <PackageIcon className="size-3.5" />
              Items ({items.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y">
              {items.map((item) => (
                <li
                  key={item.bookId}
                  className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/book/${item.bookId}`}
                      prefetch
                      className="block truncate text-sm font-medium hover:underline"
                    >
                      {item.title}
                    </Link>
                    <p className="truncate text-xs text-muted-foreground">
                      {item.author}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Qty {item.quantity} · {formatCurrency(item.unitPriceCents)} each
                    </p>
                  </div>
                  <span className="text-sm font-medium tabular-nums">
                    {formatCurrency(item.lineTotalCents)}
                  </span>
                </li>
              ))}
            </ul>

            <Separator className="my-4" />

            <div className="space-y-1.5 text-sm">
              <div className="flex items-baseline justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="tabular-nums">
                  {formatCurrency(
                    items.reduce((s, i) => s + i.lineTotalCents, 0),
                  )}
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="tabular-nums">
                  {formatCurrency(
                    order.totalCents -
                      items.reduce((s, i) => s + i.lineTotalCents, 0),
                  )}
                </span>
              </div>
              <Separator className="my-2" />
              <div className="flex items-baseline justify-between text-base font-semibold">
                <span>Total</span>
                <span className="tabular-nums">
                  {formatCurrency(order.totalCents)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-1.5 text-sm uppercase tracking-wide text-muted-foreground">
                <MapPinIcon className="size-3.5" />
                Shipping address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{order.shippingAddress}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
                Order status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <StatusRow label="Status" value={<StatusBadge status={order.status} kind="order" />} />
              <StatusRow label="Total" value={formatCurrency(order.totalCents)} />
              <StatusRow label="Placed" value={formatDate(order.placedAt)} />
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">Shipping</span>
                <Badge variant="outline">Standard</Badge>
              </div>
            </CardContent>
          </Card>

          <Button variant="outline" className="w-full" asChild>
            <Link href="/orders" prefetch>
              All orders
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function StatusRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  );
}
