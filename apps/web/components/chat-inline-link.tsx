"use client";

import { useChatSheet } from "./storefront-shell";

export function ChatInlineLink({ children }: { children: React.ReactNode }) {
  const chat = useChatSheet();
  return (
    <button
      type="button"
      onClick={chat.open}
      className="font-medium text-foreground underline decoration-primary decoration-2 underline-offset-2 transition-all hover:decoration-4"
    >
      {children}
    </button>
  );
}
