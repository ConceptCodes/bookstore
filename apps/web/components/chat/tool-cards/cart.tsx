import Link from "next/link";
import { CardShell } from "./card-shell";
import { MinusIcon, PlusIcon, ShoppingCartIcon, Trash2Icon } from "lucide-react";
import { BookCover, Separator, formatCurrency } from "@bookstore/ui";
import type { Cart } from "@bookstore/db";

const TITLES: Record<string, { label: string; icon: typeof ShoppingCartIcon }> = {
  get_cart: { label: "Your cart", icon: ShoppingCartIcon },
  add_to_cart: { label: "Added to cart", icon: PlusIcon },
  update_cart_item: { label: "Cart updated", icon: ShoppingCartIcon },
  remove_from_cart: { label: "Removed from cart", icon: MinusIcon },
  clear_cart: { label: "Cart cleared", icon: Trash2Icon },
};

export function CartCard({
  output,
  toolName = "get_cart",
}: {
  output: Cart;
  toolCallId?: string;
  toolName?: string;
}) {
  const cart = output;
  const meta = TITLES[toolName] ?? TITLES.get_cart!;
  const empty = cart.lines.length === 0;

  return (
    <CardShell
      icon={meta.icon}
      title={meta.label}
      action={
        <Link href="/cart" prefetch className="text-xs font-medium text-primary hover:underline">
          View cart
        </Link>
      }
    >
      {empty ? (
        <p className="text-sm text-muted-foreground">Your cart is empty.</p>
      ) : (
        <>
          <ul className="-mx-1 divide-y">
            {cart.lines.map((line) => (
              <li key={line.cartItemId} className="flex items-center gap-3 px-1 py-2">
                <div className="size-[40px] shrink-0 overflow-hidden rounded bg-muted">
                  <BookCover title={line.title} coverUrl={line.coverUrl} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{line.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {line.author} · qty {line.quantity}
                  </p>
                </div>
                <div className="text-right text-sm font-medium tabular-nums">
                  {formatCurrency(line.lineTotalCents)}
                </div>
              </li>
            ))}
          </ul>
          <Separator className="my-2" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {cart.itemCount} item{cart.itemCount === 1 ? "" : "s"}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-muted-foreground">Subtotal</span>
              <span className="font-semibold tabular-nums">
                {formatCurrency(cart.subtotalCents)}
              </span>
            </div>
          </div>
        </>
      )}
    </CardShell>
  );
}
