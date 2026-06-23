"use client";

import { useTransition } from "react";
import { Button } from "@bookstore/ui";
import { MessageCircleIcon } from "lucide-react";
import { useChatSheet } from "./storefront-shell";

export function AskAboutBookButton({
  bookTitle,
  bookId,
}: {
  bookTitle: string;
  bookId: number;
}) {
  const chat = useChatSheet();
  const [, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="outline"
      onClick={() =>
        startTransition(() =>
          chat.openWithMessage(`Tell me about "${bookTitle}" (book id ${bookId})`),
        )
      }
    >
      <MessageCircleIcon className="size-4" />
      Ask Paige about this book
    </Button>
  );
}
