"use client";

import { useTransition } from "react";
import Link from "next/link";
import { MinusIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { BookCover, Button, PriceTag } from "@bookstore/ui";
import { updateCartItemQtyAction, removeFromCartAction } from "@/app/actions";
import type { CartLine } from "@bookstore/db";

export function CartLineRow({ line }: { line: CartLine }) {
  const [, startTransition] = useTransition();

  function setQty(qty: number) {
    startTransition(async () => {
      await updateCartItemQtyAction(line.bookId, qty);
    });
  }

  function remove() {
    startTransition(async () => {
      await removeFromCartAction(line.bookId);
    });
  }

  return (
    <li className="flex items-center gap-3 py-3">
      <Link
        href={`/book/${line.bookId}`}
        prefetch
        className="size-[60px] shrink-0 overflow-hidden rounded bg-muted"
      >
        <BookCover title={line.title} coverUrl={line.coverUrl} />
      </Link>

      <div className="min-w-0 flex-1 space-y-0.5">
        <Link
          href={`/book/${line.bookId}`}
          prefetch
          className="block truncate text-sm font-medium hover:underline"
        >
          {line.title}
        </Link>
        <p className="truncate text-xs text-muted-foreground">{line.author}</p>
        <p className="text-xs text-muted-foreground">{formatUnit(line.unitPriceCents)} each</p>
      </div>

      <div className="flex items-center rounded-md border">
        <button
          type="button"
          className="flex size-7 items-center justify-center text-muted-foreground hover:bg-accent disabled:opacity-40"
          onClick={() => setQty(Math.max(0, line.quantity - 1))}
          disabled={line.quantity <= 1}
          aria-label="Decrease quantity"
        >
          <MinusIcon className="size-3.5" />
        </button>
        <span className="w-8 text-center text-sm font-medium tabular-nums">{line.quantity}</span>
        <button
          type="button"
          className="flex size-7 items-center justify-center text-muted-foreground hover:bg-accent disabled:opacity-40"
          onClick={() => setQty(line.quantity + 1)}
          disabled={line.quantity >= line.stock}
          aria-label="Increase quantity"
        >
          <PlusIcon className="size-3.5" />
        </button>
      </div>

      <div className="w-20 text-right">
        <PriceTag priceCents={line.lineTotalCents} size="sm" />
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={remove}
        aria-label={`Remove ${line.title}`}
        className="text-muted-foreground hover:text-destructive"
      >
        <Trash2Icon className="size-4" />
      </Button>
    </li>
  );
}

function formatUnit(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}
