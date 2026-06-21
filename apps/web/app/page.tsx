import Link from "next/link";
import { SearchIcon, SparklesIcon } from "lucide-react";
import {
  Button,
  EmptyState,
  Input,
  BookGrid,
} from "@bookstore/ui";
import {
  CUSTOMER_USER_ID,
  getFeaturedBooks,
  getRecommendations,
  listGenres,
  searchBooks,
} from "@bookstore/db";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ChatInlineLink } from "@/components/chat-inline-link";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; genre?: string }>;
}) {
  const { q, genre } = await searchParams;
  const query = typeof q === "string" && q.trim() ? q.trim() : undefined;
  const genreFilter = typeof genre === "string" ? genre : undefined;

  const featured = getFeaturedBooks(5);
  const recommendations = getRecommendations(CUSTOMER_USER_ID, 5);
  const genres = listGenres();
  const books = searchBooks({ query, genre: genreFilter, limit: 24 });

  const isBrowsing = Boolean(query || genreFilter);

  return (
    <div className="space-y-10">
      <section className="rounded-xl border bg-gradient-to-br from-secondary via-background to-background p-6 sm:p-8">
        <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <SparklesIcon className="size-3.5" />
          Welcome back, Ada
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl [text-wrap:balance]">
          Find your next favorite book.
        </h1>

        <form className="mt-4 flex gap-2" action="/" method="get">
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              name="q"
              defaultValue={query ?? ""}
              placeholder="Search by title, author, or topic"
              className="pl-9"
              autoComplete="off"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>

        {!isBrowsing && (
          <p className="mt-3 text-sm text-muted-foreground">
            Or ask <ChatInlineLink>Page the concierge</ChatInlineLink> for a personal pick.
          </p>
        )}
      </section>

      {!isBrowsing && recommendations.length > 0 && (
        <Section eyebrow="For you" title="Recommended based on your taste">
          <BookGrid
            books={recommendations}
            cardFooter={(b) => (b.stock > 0 ? <AddToCartButton bookId={b.id} /> : null)}
          />
        </Section>
      )}

      {!isBrowsing && featured.length > 0 && (
        <Section eyebrow="Staff picks" title="Featured books">
          <BookGrid
            books={featured}
            cardFooter={(b) => (b.stock > 0 ? <AddToCartButton bookId={b.id} /> : null)}
          />
        </Section>
      )}

      <Section
        eyebrow={isBrowsing ? "Results" : "Browse"}
        title={
          isBrowsing
            ? query
              ? `Matching "${query}"`
              : `Genre: ${genreFilter}`
            : "All books"
        }
      >
        <div className="flex flex-wrap items-center gap-1.5">
          <GenreChip href="/" active={!genreFilter}>All</GenreChip>
          {genres.map((g) => (
            <GenreChip
              key={g}
              href={
                query
                  ? `/?genre=${encodeURIComponent(g)}&q=${encodeURIComponent(query)}`
                  : `/?genre=${encodeURIComponent(g)}`
              }
              active={genreFilter === g}
            >
              {g}
            </GenreChip>
          ))}
        </div>

        {books.length === 0 ? (
          <EmptyState
            title="No books match your search"
            description="Try a different query or browse a genre."
          />
        ) : (
          <BookGrid
            books={books}
            cardFooter={(b) => (b.stock > 0 ? <AddToCartButton bookId={b.id} /> : null)}
          />
        )}
      </Section>
    </div>
  );
}

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {eyebrow}
        </p>
        <h2 className="text-lg font-semibold tracking-tight sm:text-xl">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function GenreChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      prefetch
      className={
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors " +
        (active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground")
      }
    >
      {children}
    </Link>
  );
}
