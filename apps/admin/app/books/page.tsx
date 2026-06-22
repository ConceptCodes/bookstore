import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  RatingStars,
  PriceTag,
  EmptyState,
  Input,
  BookCover,
} from "@bookstore/ui";
import { BookOpenIcon, SearchIcon } from "lucide-react";
import { listGenres, listAllBooks, searchBooks } from "@bookstore/db";
import { AdminPageHeader } from "@/components/admin-page-header";
import { BookFormDialog } from "./book-form-dialog";
import { StockAdjustDialog } from "./stock-dialog";
import { DeleteBookButton } from "./delete-button";

export const dynamic = "force-dynamic";

export default async function BooksPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; genre?: string }>;
}) {
  const { q, genre } = await searchParams;
  const query = typeof q === "string" && q.trim() ? q.trim() : undefined;
  const genreFilter = typeof genre === "string" ? genre : undefined;

  const genres = listGenres();
  const allBooks = listAllBooks();
  const filtered = query || genreFilter
    ? searchBooks({ query, genre: genreFilter, limit: 200 })
    : allBooks;

  return (
    <>
      <AdminPageHeader
        title="Books"
        description={`${allBooks.length} in catalog · showing ${filtered.length}`}
        actions={<BookFormDialog mode="create" genres={genres} />}
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <form action="/books" method="get" className="relative flex-1 min-w-[200px]">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="q"
            defaultValue={query ?? ""}
            placeholder="Search title or author"
            className="pl-9"
            autoComplete="off"
          />
        </form>
        <GenreFilterLink href="/books" active={!genreFilter}>
          All genres
        </GenreFilterLink>
        {genres.map((g) => (
          <GenreFilterLink
            key={g}
            href={
              query
                ? `/books?genre=${encodeURIComponent(g)}&q=${encodeURIComponent(query)}`
                : `/books?genre=${encodeURIComponent(g)}`
            }
            active={genreFilter === g}
          >
            {g}
          </GenreFilterLink>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={BookOpenIcon}
          title="No books match"
          description="Try a different search or genre filter."
        />
      ) : (
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">Cover</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Genre</TableHead>
                <TableHead className="hidden sm:table-cell">Rating</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-center">Stock</TableHead>
                <TableHead className="w-[120px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((book) => (
                <TableRow key={book.id}>
                  <TableCell>
                    <div className="size-[40px] overflow-hidden rounded bg-muted">
                      <BookCover title={book.title} coverUrl={book.coverUrl} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <Link
                        href={`https://localhost:3000/book/${book.id}`}
                        target="_blank"
                        className="font-medium hover:underline"
                      >
                        {book.title}
                      </Link>
                      <span className="text-xs text-muted-foreground">
                        {book.author}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline">{book.genre}</Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <RatingStars rating={book.rating} showNumber size={12} />
                  </TableCell>
                  <TableCell className="text-right">
                    <PriceTag priceCents={book.priceCents} size="sm" />
                  </TableCell>
                  <TableCell className="text-center">
                    <StockAdjustDialog book={book} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-0.5">
                      <BookFormDialog mode="edit" book={book} genres={genres} />
                      <DeleteBookButton book={book} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}

function GenreFilterLink({
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
