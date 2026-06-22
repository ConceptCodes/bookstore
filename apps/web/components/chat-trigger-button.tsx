"use client";

import { Button } from "@bookstore/ui";
import { MessageSquareIcon } from "lucide-react";
import { useChatSheet } from "@/components/storefront-shell";

export function ChatTriggerButton() {
  const chat = useChatSheet();
  return (
    <Button onClick={() => chat.open()} className="w-full">
      <MessageSquareIcon className="size-4" />
      Ask Page
    </Button>
  );
}
