import type { ReactNode } from "react";
import { cn } from "../../lib/utils";
import type { BookCardBook, BookCardProps } from "../molecules/book-card";
import { BookCard } from "../molecules/book-card";

export type BookGridProps = {
  books: BookCardBook[];
  cols?: "default" | "compact" | "wide";
  className?: string;
  cardFooter?: (book: BookCardBook) => ReactNode;
  getHref?: (book: BookCardBook) => string | undefined;
  emptyState?: ReactNode;
};

const colsClasses: Record<NonNullable<BookGridProps["cols"]>, string> = {
  default: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
  compact: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6",
  wide: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
};

export function BookGrid({
  books,
  cols = "default",
  className,
  cardFooter,
  getHref,
  emptyState,
}: BookGridProps) {
  if (books.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div className={cn("grid gap-4", colsClasses[cols], className)}>
      {books.map((book) => {
        const props: BookCardProps = { book };
        if (cardFooter) props.footer = cardFooter(book);
        if (getHref) props.href = getHref(book);
        return <BookCard key={book.id} {...props} />;
      })}
    </div>
  );
}
