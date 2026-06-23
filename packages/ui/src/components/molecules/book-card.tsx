import type { ReactNode } from "react";
import Link from "next/link";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { cn } from "../../lib/utils";
import { BookCover } from "./book-cover";
import { PriceTag } from "./price-tag";
import { RatingStars } from "./rating-stars";
import { GenreBadge } from "./genre-badge";

export type BookCardBook = {
  id: number;
  title: string;
  author: string;
  genre: string;
  priceCents: number;
  rating: number;
  coverUrl: string | null;
  stock: number;
};

export type BookCardProps = {
  book: BookCardBook;
  href?: string;
  footer?: ReactNode;
  className?: string;
};

export function BookCard({ book, href, footer, className }: BookCardProps) {
  const linkHref = href ?? `/book/${book.id}`;
  const outOfStock = book.stock <= 0;

  return (
    <Card
      className={cn(
        "group flex flex-col overflow-hidden p-0 transition-all duration-300",
        "hover:-translate-y-0.5 hover:border-accent-foreground/25 hover:shadow-sm",
        className,
      )}
    >
      <Link
        href={linkHref}
        className="relative block aspect-[2/3] overflow-hidden bg-muted"
        prefetch
      >
        <BookCover
          title={book.title}
          coverUrl={book.coverUrl}
          className="transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
        {/* physical book depth: spine shadow on the left, page-edge highlight on the right */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-[7%] min-w-[3px] bg-gradient-to-r from-black/22 to-transparent"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-[2px] bg-gradient-to-l from-white/25 to-transparent"
        />
        {/* inner frame */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5"
        />
        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/75 p-4 backdrop-blur-[1px]">
            <Badge
              variant="outline"
              className="border-foreground/25 bg-background/95 text-foreground"
            >
              Out of stock
            </Badge>
          </div>
        )}
      </Link>

      <CardContent className="flex flex-1 flex-col gap-2.5 p-3.5">
        <div className="space-y-0.5">
          <Link href={linkHref} prefetch className="block">
            <h3 className="font-display line-clamp-2 text-[0.95rem] font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-foreground">
              {book.title}
            </h3>
          </Link>
          <p className="text-xs text-muted-foreground">{book.author}</p>
        </div>

        <div className="flex items-center justify-between gap-2">
          <RatingStars rating={book.rating} showNumber size={12} />
          <GenreBadge genre={book.genre} />
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-border/60 pt-2.5">
          <PriceTag priceCents={book.priceCents} size="sm" />
          {footer}
        </div>
      </CardContent>
    </Card>
  );
}
