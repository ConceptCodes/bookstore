"use client";

import { useState, useTransition } from "react";
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
import { BoxesIcon, LoaderIcon, MinusIcon, PlusIcon } from "lucide-react";
import { adjustStockAction } from "@/app/actions";
import type { Book } from "@bookstore/db";

export function StockAdjustDialog({ book }: { book: Book }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [value, setValue] = useState(String(book.stock));

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next = Math.max(0, Number.parseInt(value, 10) || 0);
    startTransition(async () => {
      await adjustStockAction(book.id, next);
      setOpen(false);
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) setValue(String(book.stock));
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 font-medium tabular-nums"
          aria-label={`Adjust stock for ${book.title}`}
        >
          {book.stock === 0 ? (
            <span className="text-rose-600 dark:text-rose-400">{book.stock}</span>
          ) : book.stock <= 3 ? (
            <span className="text-amber-600 dark:text-amber-400">{book.stock}</span>
          ) : (
            <span>{book.stock}</span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1.5">
            <BoxesIcon className="size-4" />
            Adjust stock
          </DialogTitle>
          <DialogDescription>
            Set the new on-hand count for{" "}
            <span className="font-medium text-foreground">{book.title}</span>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-3">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() =>
                setValue(String(Math.max(0, Number.parseInt(value, 10) - 1)))
              }
            >
              <MinusIcon className="size-4" />
            </Button>
            <Input
              type="number"
              min="0"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="text-center"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() =>
                setValue(String(Number.parseInt(value || "0", 10) + 1))
              }
            >
              <PlusIcon className="size-4" />
            </Button>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending && <LoaderIcon className="size-4 animate-spin" />}
              Save stock
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
