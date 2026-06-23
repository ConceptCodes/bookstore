import Link from "next/link";
import { BookOpenIcon } from "lucide-react";
import { CardShell } from "./card-shell";
import { Badge, BookCover, GenreBadge, PriceTag, RatingStars, formatCurrency } from "@bookstore/ui";
import type { Book } from "@bookstore/db";
import { AddToCartButton } from "@/components/add-to-cart-button";

export function BookDetailsCard({ output }: { output: Book }) {
  const book = output;
  if (!book) return null;
  const outOfStock = book.stock <= 0;

  return (
    <CardShell icon={BookOpenIcon} title="Book details">
      <div className="flex gap-3">
        <Link
          href={`/book/${book.id}`}
          prefetch
          className="size-[120px] shrink-0 overflow-hidden rounded bg-muted"
        >
          <BookCover title={book.title} coverUrl={book.coverUrl} />
        </Link>
        <div className="min-w-0 flex-1 space-y-1.5">
          <Link
            href={`/book/${book.id}`}
            prefetch
            className="block text-sm font-semibold leading-tight hover:underline"
          >
            {book.title}
          </Link>
          <p className="text-xs text-muted-foreground">{book.author}</p>
          <div className="flex items-center gap-2">
            <RatingStars rating={book.rating} showNumber size={12} />
            <GenreBadge genre={book.genre} />
          </div>
          <p className="line-clamp-3 text-xs text-muted-foreground">{book.description}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2 border-t pt-3">
        <div className="flex items-baseline gap-2">
          <PriceTag priceCents={book.priceCents} />
          {outOfStock && (
            <Badge
              variant="outline"
              className="border-rose-500/40 text-rose-600 dark:text-rose-400"
            >
              Out of stock
            </Badge>
          )}
          {!outOfStock && book.stock <= 3 && (
            <Badge
              variant="outline"
              className="border-amber-500/40 text-amber-700 dark:text-amber-400"
            >
              Only {book.stock} left
            </Badge>
          )}
        </div>
        {outOfStock ? null : <AddToCartButton bookId={book.id} />}
      </div>
      <p className="mt-2 text-[10px] text-muted-foreground">
        ISBN: {book.isbn ?? "—"} · {formatCurrency(book.priceCents)} · Stock: {book.stock}
      </p>
    </CardShell>
  );
}
