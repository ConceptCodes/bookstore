import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeftIcon,
  BookOpenIcon,
  CheckCircle2Icon,
  PackageIcon,
} from "lucide-react";
import {
  Badge,
  BookCover,
  BookGrid,
  Button,
  Card,
  CardContent,
  EmptyState,
  GenreBadge,
  PriceTag,
  RatingStars,
  Separator,
} from "@bookstore/ui";
import { getBookById, searchBooks } from "@bookstore/db";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { AskAboutBookButton } from "@/components/ask-about-book-button";

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const bookId = Number.parseInt(id, 10);
  if (!Number.isFinite(bookId) || bookId <= 0) notFound();

  const book = getBookById(bookId);
  if (!book) notFound();

  const related = searchBooks({ genre: book.genre, limit: 6 })
    .filter((b) => b.id !== book.id)
    .slice(0, 5);

  const outOfStock = book.stock <= 0;

  return (
    <div className="space-y-8">
      <Button variant="ghost" size="sm" className="-ml-2 gap-1.5" asChild>
        <Link href="/" prefetch>
          <ArrowLeftIcon className="size-4" />
          Back to books
        </Link>
      </Button>

      <div className="grid gap-8 md:grid-cols-[260px_minmax(0,1fr)] lg:gap-12">
        <div className="space-y-3">
          <div className="aspect-[2/3] overflow-hidden rounded-xl border bg-muted shadow-sm">
            <BookCover title={book.title} coverUrl={book.coverUrl} />
          </div>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
            ISBN {book.isbn ?? "—"}
          </p>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <GenreBadge genre={book.genre} />
              {outOfStock && (
                <Badge variant="outline" className="border-rose-500/40 text-rose-600 dark:text-rose-400">
                  Out of stock
                </Badge>
              )}
              {!outOfStock && book.stock <= 3 && (
                <Badge variant="outline" className="border-amber-500/40 text-amber-700 dark:text-amber-400">
                  Only {book.stock} left
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-semibold tracking-tight [text-wrap:balance]">
              {book.title}
            </h1>
            <p className="text-lg text-muted-foreground">{book.author}</p>
            <div className="flex items-center gap-3 text-sm">
              <RatingStars rating={book.rating} showNumber size={16} />
              <Separator orientation="vertical" className="h-4" />
              <span className="text-muted-foreground">
                {book.stock} in stock
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <PriceTag priceCents={book.priceCents} size="lg" />
            <span className="text-xs text-muted-foreground">+ shipping</span>
          </div>

          <div className="prose prose-sm max-w-none text-sm leading-relaxed text-foreground/90">
            <p>{book.description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            {outOfStock ? (
              <Button disabled>Out of stock</Button>
            ) : (
              <AddToCartButton
                bookId={book.id}
                size="lg"
                variant="default"
                label="Add to cart"
              />
            )}
            <AskAboutBookButton bookTitle={book.title} bookId={book.id} />
          </div>

          <Card className="bg-muted/30">
            <CardContent className="grid grid-cols-2 gap-3 p-4 text-xs">
              <Detail icon={BookOpenIcon} label="Author" value={book.author} />
              <Detail icon={PackageIcon} label="Stock" value={`${book.stock} available`} />
              <Detail
                icon={CheckCircle2Icon}
                label="Rating"
                value={`${book.rating.toFixed(1)} / 5`}
              />
              <Detail icon={BookOpenIcon} label="Genre" value={book.genre} />
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      <section className="space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            More like this
          </p>
          <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
            More in {book.genre}
          </h2>
        </div>
        {related.length === 0 ? (
          <EmptyState
            title="No related books"
            description={`We couldn't find other ${book.genre} books right now.`}
          />
        ) : (
          <BookGrid
            books={related}
            cardFooter={(b) => (b.stock > 0 ? <AddToCartButton bookId={b.id} /> : null)}
          />
        )}
      </section>
    </div>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof BookOpenIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="space-y-1">
      <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-muted-foreground">
        <Icon className="size-3" strokeWidth={2} />
        {label}
      </p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
