import Link from "next/link";
import { ArrowLeftIcon, ShoppingCartIcon } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  Separator,
  formatCurrency,
} from "@bookstore/ui";
import {
  CUSTOMER_USER_ID,
  SHIPPING_OPTIONS,
  getCart,
} from "@bookstore/db";
import { CartLineRow } from "./cart-line-row";
import { CheckoutForm } from "./checkout-form";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const cart = getCart(CUSTOMER_USER_ID);
  const empty = cart.lines.length === 0;

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" className="-ml-2 gap-1.5" asChild>
        <Link href="/" prefetch>
          <ArrowLeftIcon className="size-4" />
          Continue shopping
        </Link>
      </Button>

      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Your cart
        </h1>
        <p className="text-sm text-muted-foreground">
          {empty
            ? "Nothing here yet."
            : `${cart.itemCount} item${cart.itemCount === 1 ? "" : "s"} · ${formatCurrency(cart.subtotalCents)} subtotal`}
        </p>
      </div>

      {empty ? (
        <EmptyState
          icon={ShoppingCartIcon}
          title="Your cart is empty"
          description="Browse the catalog and add a book to get started."
          action={
            <Button asChild>
              <Link href="/" prefetch>
                Browse books
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
                Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y">
                {cart.lines.map((line) => (
                  <CartLineRow key={line.cartItemId} line={line} />
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="h-fit lg:sticky lg:top-20">
            <CardHeader>
              <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
                Checkout
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CheckoutForm
                subtotalCents={cart.subtotalCents}
                options={SHIPPING_OPTIONS}
              />
            </CardContent>
          </Card>
        </div>
      )}

      <Separator />
    </div>
  );
}
