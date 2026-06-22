import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeftIcon,
  CheckCircle2Icon,
  MapPinIcon,
  PackageIcon,
} from "lucide-react";
import {
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
import { getOrderDetail } from "@bookstore/db";
import { AdminPageHeader } from "@/components/admin-page-header";
import { OrderStatusSelect } from "../order-status-select";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const orderId = Number.parseInt(id, 10);
  if (!Number.isFinite(orderId) || orderId <= 0) notFound();

  const detail = getOrderDetail(orderId);
  if (!detail) notFound();
  const { order, items } = detail;

  return (
    <>
      <Button variant="ghost" size="sm" className="-ml-2 mb-4 gap-1.5" asChild>
        <Link href="/orders" prefetch>
          <ArrowLeftIcon className="size-4" />
          All orders
        </Link>
      </Button>

      <AdminPageHeader
        title={`Order #${order.id}`}
        description={`Placed ${formatDate(order.placedAt)} by ${order.userId}`}
        actions={<OrderStatusSelect orderId={order.id} status={order.status} />}
      />

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
                      href={`/books?q=${encodeURIComponent(item.title)}`}
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
                Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">Current</span>
                <StatusBadge status={order.status} kind="order" />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">Total</span>
                <span className="font-medium tabular-nums">
                  {formatCurrency(order.totalCents)}
                </span>
              </div>
              {order.status === "shipped" && (
                <div className="flex items-center gap-2 rounded-md bg-emerald-50 p-2 text-xs text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
                  <CheckCircle2Icon className="size-3.5" />
                  Shipped — ETA 3-5 business days
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
