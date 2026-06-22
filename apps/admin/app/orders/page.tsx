import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  EmptyState,
  formatCurrency,
  formatDate,
} from "@bookstore/ui";
import { PackageIcon } from "lucide-react";
import { listAllOrders } from "@bookstore/db";
import { AdminPageHeader } from "@/components/admin-page-header";
import { OrderStatusSelect } from "./order-status-select";
import type { OrderStatus } from "@bookstore/db";

export const dynamic = "force-dynamic";

const STATUS_FILTERS: { value: "all" | OrderStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "shipped", label: "Shipped" },
  { value: "cancelled", label: "Cancelled" },
];

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const statusFilter =
    status && status !== "all" ? (status as OrderStatus) : undefined;

  const allOrders = listAllOrders();
  const orders = statusFilter
    ? allOrders.filter((o) => o.status === statusFilter)
    : allOrders;

  return (
    <>
      <AdminPageHeader
        title="Orders"
        description={`${allOrders.length} total · showing ${orders.length}`}
      />

      <div className="mb-4 flex flex-wrap items-center gap-1.5">
        {STATUS_FILTERS.map((f) => (
          <Link
            key={f.value}
            href={f.value === "all" ? "/orders" : `/orders?status=${f.value}`}
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

      {orders.length === 0 ? (
        <EmptyState
          icon={PackageIcon}
          title="No orders"
          description="Orders will appear here once customers check out."
        />
      ) : (
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden md:table-cell">Placed</TableHead>
                <TableHead className="hidden lg:table-cell">Shipping</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Link
                      href={`/orders/${order.id}`}
                      prefetch
                      className="font-medium hover:underline"
                    >
                      #{order.id}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{order.userId}</span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {formatDate(order.placedAt)}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                    <span className="line-clamp-1 max-w-[200px]">
                      {order.shippingAddress}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {formatCurrency(order.totalCents)}
                  </TableCell>
                  <TableCell className="text-center">
                    <OrderStatusSelect orderId={order.id} status={order.status} />
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
