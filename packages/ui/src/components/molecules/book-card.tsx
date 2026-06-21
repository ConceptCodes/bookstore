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
    <Card className={cn("group flex flex-col overflow-hidden p-0", className)}>
      <Link
        href={linkHref}
        className="relative block aspect-[2/3] overflow-hidden bg-muted"
        prefetch
      >
        <BookCover
          title={book.title}
          coverUrl={book.coverUrl}
          className="transition-transform duration-300 group-hover:scale-[1.04]"
        />
        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 p-4 backdrop-blur-[1px]">
            <Badge variant="outline" className="border-foreground/30 bg-background/90 text-foreground">
              Out of stock
            </Badge>
          </div>
        )}
      </Link>

      <CardContent className="flex flex-1 flex-col gap-2 p-3">
        <div className="space-y-1">
          <Link href={linkHref} prefetch className="block">
            <h3 className="line-clamp-2 text-sm font-semibold leading-tight hover:underline">
              {book.title}
            </h3>
          </Link>
          <p className="text-xs text-muted-foreground">{book.author}</p>
        </div>

        <div className="flex items-center justify-between gap-2">
          <RatingStars rating={book.rating} showNumber size={12} />
          <GenreBadge genre={book.genre} />
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <PriceTag priceCents={book.priceCents} size="sm" />
          {footer}
        </div>
      </CardContent>
    </Card>
  );
}
