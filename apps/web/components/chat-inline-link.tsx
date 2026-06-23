"use client";

import { useChatSheet } from "./storefront-shell";
import { cn } from "@bookstore/ui";

export function ChatInlineLink({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const chat = useChatSheet();
  return (
    <button
      type="button"
      onClick={chat.open}
      className={cn(
        "font-medium text-foreground underline decoration-primary decoration-2 underline-offset-2 transition-all hover:decoration-4",
        className,
      )}
    >
      {children}
    </button>
  );
}
