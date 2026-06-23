"use client";

import { useEffect, useState, useTransition } from "react";
import { Button } from "@bookstore/ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@bookstore/ui";
import { Input } from "@bookstore/ui";
import { Label } from "@bookstore/ui";
import { Textarea } from "@bookstore/ui";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@bookstore/ui";
import { PlusIcon, PencilIcon, LoaderIcon } from "lucide-react";
import { createBookAction, updateBookAction, type BookInput } from "@/app/actions";
import type { Book } from "@bookstore/db";

type Props = { mode: "create"; genres: string[] } | { mode: "edit"; book: Book; genres: string[] };

function bookToInput(book: Book): BookInput {
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    genre: book.genre,
    priceCents: book.priceCents,
    description: book.description,
    rating: book.rating,
    stock: book.stock,
    coverUrl: book.coverUrl,
    isbn: book.isbn,
  };
}

export function BookFormDialog(props: Props) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [title, setTitle] = useState(props.mode === "edit" ? props.book.title : "");
  const [author, setAuthor] = useState(props.mode === "edit" ? props.book.author : "");
  const [genre, setGenre] = useState(
    props.mode === "edit" ? props.book.genre : (props.genres[0] ?? ""),
  );
  const [priceDollars, setPriceDollars] = useState(
    props.mode === "edit" ? (props.book.priceCents / 100).toFixed(2) : "",
  );
  const [rating, setRating] = useState(props.mode === "edit" ? String(props.book.rating) : "4.5");
  const [stock, setStock] = useState(props.mode === "edit" ? String(props.book.stock) : "0");
  const [description, setDescription] = useState(
    props.mode === "edit" ? props.book.description : "",
  );
  const [isbn, setIsbn] = useState(props.mode === "edit" ? (props.book.isbn ?? "") : "");
  const [coverUrl, setCoverUrl] = useState(
    props.mode === "edit" ? (props.book.coverUrl ?? "") : "",
  );

  useEffect(() => {
    if (!open) return;
    if (props.mode === "edit") {
      const i = bookToInput(props.book);
      setTitle(i.title);
      setAuthor(i.author);
      setGenre(i.genre);
      setPriceDollars((i.priceCents / 100).toFixed(2));
      setRating(String(i.rating));
      setStock(String(i.stock));
      setDescription(i.description);
      setIsbn(i.isbn ?? "");
      setCoverUrl(i.coverUrl ?? "");
    }
  }, [open, props]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const priceCents = Math.round(Number.parseFloat(priceDollars) * 100);
    if (!Number.isFinite(priceCents) || priceCents < 0) return;
    const ratingNum = Number.parseFloat(rating);
    const stockNum = Number.parseInt(stock, 10);
    if (!Number.isFinite(ratingNum) || !Number.isFinite(stockNum)) return;

    startTransition(async () => {
      const payload = {
        title: title.trim(),
        author: author.trim(),
        genre,
        priceCents,
        description: description.trim(),
        rating: ratingNum,
        stock: stockNum,
        coverUrl: coverUrl.trim() || null,
        isbn: isbn.trim() || null,
      };
      if (props.mode === "create") {
        await createBookAction(payload);
      } else {
        await updateBookAction(props.book.id, payload);
      }
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {props.mode === "create" ? (
          <Button>
            <PlusIcon className="size-4" />
            Add book
          </Button>
        ) : (
          <Button variant="ghost" size="icon-sm" aria-label="Edit book">
            <PencilIcon className="size-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {props.mode === "create" ? "Add a new book" : `Edit "${props.book.title}"`}
          </DialogTitle>
          <DialogDescription>
            {props.mode === "create"
              ? "Fill in the details below to add a book to the catalog."
              : "Update the book details. Changes apply immediately."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Title" required>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
            </Field>
            <Field label="Author" required>
              <Input value={author} onChange={(e) => setAuthor(e.target.value)} required />
            </Field>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Genre" required>
              <Select value={genre} onValueChange={setGenre}>
                <SelectTrigger>
                  <SelectValue placeholder="Pick a genre" />
                </SelectTrigger>
                <SelectContent>
                  {props.genres.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Price (USD)" required>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={priceDollars}
                onChange={(e) => setPriceDollars(e.target.value)}
                required
              />
            </Field>
            <Field label="Stock" required>
              <Input
                type="number"
                min="0"
                step="1"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
              />
            </Field>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Rating (0-5)">
              <Input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              />
            </Field>
            <Field label="ISBN">
              <Input value={isbn} onChange={(e) => setIsbn(e.target.value)} />
            </Field>
          </div>

          <Field label="Cover URL">
            <Input
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="https://..."
            />
          </Field>

          <Field label="Description" required>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            />
          </Field>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending && <LoaderIcon className="size-4 animate-spin" />}
              {props.mode === "create" ? "Create book" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      {children}
    </div>
  );
}
