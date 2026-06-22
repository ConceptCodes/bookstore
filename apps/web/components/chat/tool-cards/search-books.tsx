import Link from "next/link";
import { SparklesIcon, SearchIcon } from "lucide-react";
import { CardShell } from "./card-shell";
import {
  Badge,
  BookCover,
  PriceTag,
  RatingStars,
} from "@bookstore/ui";
import type { Book } from "@bookstore/db";
import { AddToCartButton } from "@/components/add-to-cart-button";

type SearchInput = { query?: string; genre?: string; limit?: number };

export function SearchBooksCard({
  input,
  output,
  toolName,
}: {
  input: SearchInput;
  output: Book[];
  toolCallId?: string;
  toolName?: string;
}) {
  const books = Array.isArray(output) ? output : [];
  const isRecommendations = toolName === "get_recommendations";
  const Icon = isRecommendations ? SparklesIcon : SearchIcon;
  const heading = isRecommendations
    ? "Recommended for you"
    : input.query
      ? books.length === 0
        ? `No matches for "${input.query}"`
        : `Found ${books.length} for "${input.query}"`
      : books.length === 0
        ? "No books"
        : `${books.length} book${books.length === 1 ? "" : "s"}`;

  if (books.length === 0) {
    return (
      <CardShell icon={Icon} title={heading}>
        <p className="text-sm text-muted-foreground">
          Try a different search or browse a genre.
        </p>
      </CardShell>
    );
  }

  const visible = books.slice(0, 3);
  const hidden = books.length - visible.length;

  return (
    <CardShell
      icon={Icon}
      title={heading}
      action={
        input.genre ? (
          <Badge variant="outline" className="font-normal">
            {input.genre}
          </Badge>
        ) : null
      }
    >
      <ul className="-mx-1 divide-y">
        {visible.map((book) => (
          <CompactBookRow key={book.id} book={book} />
        ))}
      </ul>
      {hidden > 0 && (
        <p className="mt-2 text-xs text-muted-foreground">
          + {hidden} more — ask me about any of them.
        </p>
      )}
    </CardShell>
  );
}

export function CompactBookRow({ book }: { book: Book }) {
  const outOfStock = book.stock <= 0;
  return (
    <li className="flex items-center gap-3 px-1 py-2">
      <Link
        href={`/book/${book.id}`}
        prefetch
        className="size-[60px] shrink-0 overflow-hidden rounded bg-muted"
      >
        <BookCover title={book.title} coverUrl={book.coverUrl} />
      </Link>
      <div className="min-w-0 flex-1 space-y-0.5">
        <Link
          href={`/book/${book.id}`}
          prefetch
          className="block truncate text-sm font-medium hover:underline"
        >
          {book.title}
        </Link>
        <p className="truncate text-xs text-muted-foreground">{book.author}</p>
        <div className="flex items-center gap-2">
          <RatingStars rating={book.rating} size={11} />
          {outOfStock && (
            <span className="text-[10px] uppercase text-rose-600 dark:text-rose-400">
              Out of stock
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <PriceTag priceCents={book.priceCents} size="sm" />
        {outOfStock ? null : <AddToCartButton bookId={book.id} size="xs" />}
      </div>
    </li>
  );
}
