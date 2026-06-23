import Link from "next/link";
import { ArrowRightIcon, SearchIcon, SparklesIcon } from "lucide-react";
import {
  BookGrid,
  EmptyState,
  Ornament,
  SectionHeading,
  cn,
} from "@bookstore/ui";
import {
  CUSTOMER_USER_ID,
  getFeaturedBooks,
  getRecommendations,
  listGenres,
  searchBooks,
  countBooks,
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
  const totalBooks = countBooks();
  const books = searchBooks({ query, genre: genreFilter, limit: 24 });

  const isBrowsing = Boolean(query || genreFilter);

  return (
    <div className="space-y-14">
      <HeroSection query={query} isBrowsing={isBrowsing} totalBooks={totalBooks} totalGenres={genres.length} />

      {!isBrowsing && recommendations.length > 0 && (
        <section className="space-y-5">
          <SectionHeading
            eyebrow="For you"
            title="Recommended based on your taste"
            description="Drawn from the genres you already love."
          />
          <BookGrid
            books={recommendations}
            cardFooter={(b) => (b.stock > 0 ? <AddToCartButton bookId={b.id} /> : null)}
          />
        </section>
      )}

      {!isBrowsing && featured.length > 0 && (
        <section className="space-y-5">
          <Ornament className="!justify-start" />
          <SectionHeading
            eyebrow="Staff picks"
            title="Featured books"
            description="Hand-chosen by the shop."
          />
          <BookGrid
            books={featured}
            cardFooter={(b) => (b.stock > 0 ? <AddToCartButton bookId={b.id} /> : null)}
          />
        </section>
      )}

      <section className="space-y-5">
        <SectionHeading
          eyebrow={isBrowsing ? "Results" : "Browse"}
          title={
            isBrowsing
              ? query
                ? `Matching “${query}”`
                : `Genre: ${genreFilter}`
              : "All books"
          }
        />

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
      </section>
    </div>
  );
}

function HeroSection({
  query,
  isBrowsing,
  totalBooks,
  totalGenres,
}: {
  query?: string;
  isBrowsing: boolean;
  totalBooks: number;
  totalGenres: number;
}) {
  return (
    <section className="relative overflow-hidden rounded-2xl border bg-card shadow-sm">
      {/* warm reading-lamp cast, top-left */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(110% 90% at 12% -10%, oklch(0.93 0.035 78 / 0.95), transparent 58%)",
        }}
      />
      {/* leather-amber corner glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(closest-side, oklch(0.72 0.12 68 / 0.35), transparent)" }}
      />

      <div className="relative px-6 py-10 sm:px-10 sm:py-14">
        <Ornament glyph="hedera" className="!justify-start" />

        <div className="mt-5 flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          <SparklesIcon className="size-3.5" />
          Welcome back, Ada
        </div>

        <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl [text-wrap:balance]">
          Find your next{" "}
          <em className="font-display italic text-[oklch(0.55_0.13_65)]">favorite</em>{" "}
          book.
        </h1>

        <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-muted-foreground">
          A small shop of carefully chosen titles — browse the shelves, or let{" "}
          <ChatInlineLink className="font-medium text-foreground underline-offset-4 hover:underline">
            Paige, our concierge
          </ChatInlineLink>{" "}
          recommend something by hand.
        </p>

        <form className="mt-7 max-w-xl" action="/" method="get">
          <label htmlFor="hero-search" className="sr-only">
            Search by title, author, or topic
          </label>
          <div className="flex items-center gap-0 rounded-xl border border-border/80 bg-background/60 shadow-[inset_0_1px_2px_rgba(80,55,20,0.05)] transition focus-within:border-ring/50 focus-within:shadow-none focus-within:ring-2 focus-within:ring-ring/30">
            <SearchIcon className="pointer-events-none ml-3.5 size-4 shrink-0 text-muted-foreground" />
            <input
              id="hero-search"
              name="q"
              defaultValue={query ?? ""}
              placeholder="Search by title, author, or topic"
              className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
              autoComplete="off"
              type="search"
            />
            <button
              type="submit"
              className="mr-1.5 inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
            >
              Search
              <ArrowRightIcon className="size-3.5" />
            </button>
          </div>
        </form>

        {!isBrowsing && (
          <div className="mt-7 flex flex-wrap items-center divide-x divide-border/70 text-xs text-muted-foreground">
            <Stat value={`${totalBooks}`} label="titles in the shop" />
            <Stat value={`${totalGenres}`} label="genres" className="pl-6" />
            <Stat value="Personal" label="concierge" className="pl-6" />
          </div>
        )}
      </div>
    </section>
  );
}

function Stat({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={cn("flex items-baseline gap-1.5 pr-6", className)}>
      <span className="font-display text-sm font-semibold text-foreground tabular-nums">{value}</span>
      <span className="text-muted-foreground/80">{label}</span>
    </div>
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
        "inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition-colors " +
        (active
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-border bg-background text-muted-foreground hover:border-accent-foreground/30 hover:bg-accent hover:text-foreground")
      }
    >
      {children}
    </Link>
  );
}
