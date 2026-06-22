import Link from "next/link";
import {
  AlertTriangleIcon,
  DollarSignIcon,
  PackageIcon,
  TicketIcon,
  BookOpenIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  Stat,
  StatusBadge,
  formatCurrency,
  formatDate,
} from "@bookstore/ui";
import {
  getOverviewMetrics,
  listAllBooks,
  listAllOrders,
} from "@bookstore/db";
import { AdminPageHeader } from "@/components/admin-page-header";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const metrics = getOverviewMetrics();
  const orders = listAllOrders().slice(0, 5);
  const lowStockBooks = listAllBooks()
    .filter((b) => b.stock <= 3)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 5);

  return (
    <>
      <AdminPageHeader
        title="Overview"
        description="Today at the bookstore."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Revenue"
          value={formatCurrency(metrics.revenueCents)}
          icon={DollarSignIcon}
          hint="Lifetime, paid + shipped"
        />
        <Stat
          label="Open orders"
          value={metrics.openOrders}
          icon={PackageIcon}
          hint="Awaiting processing"
        />
        <Stat
          label="Low stock"
          value={metrics.lowStock}
          icon={AlertTriangleIcon}
          hint="≤ 3 copies left"
        />
        <Stat
          label="Open tickets"
          value={metrics.openTickets}
          icon={TicketIcon}
          hint="Customer support queue"
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-sm uppercase tracking-wide text-muted-foreground">
              <span>Recent orders</span>
              <Link
                href="/orders"
                prefetch
                className="text-xs font-medium text-primary hover:underline"
              >
                View all
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <EmptyState title="No orders yet" />
            ) : (
              <ul className="divide-y">
                {orders.map((order) => (
                  <li
                    key={order.id}
                    className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <Link
                        href={`/orders/${order.id}`}
                        prefetch
                        className="text-sm font-medium hover:underline"
                      >
                        Order #{order.id}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(order.placedAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={order.status} kind="order" />
                      <span className="text-sm font-medium tabular-nums">
                        {formatCurrency(order.totalCents)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-sm uppercase tracking-wide text-muted-foreground">
              <span>Low stock</span>
              <Link
                href="/books"
                prefetch
                className="text-xs font-medium text-primary hover:underline"
              >
                Manage
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lowStockBooks.length === 0 ? (
              <EmptyState
                icon={BookOpenIcon}
                title="Everything in stock"
                description="No books are running low."
              />
            ) : (
              <ul className="divide-y">
                {lowStockBooks.map((book) => (
                  <li
                    key={book.id}
                    className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {book.title}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {book.author}
                      </p>
                    </div>
                    <span
                      className={
                        "text-sm font-semibold tabular-nums " +
                        (book.stock === 0
                          ? "text-rose-600 dark:text-rose-400"
                          : "text-amber-600 dark:text-amber-400")
                      }
                    >
                      {book.stock} left
                    </span>
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
