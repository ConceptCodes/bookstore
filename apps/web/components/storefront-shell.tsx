"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { SiteHeader } from "./site-header";
import { ChatSheet } from "./chat/chat-sheet";

type ChatApi = {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: boolean;
};

const ChatContext = createContext<ChatApi | null>(null);

export function useChatSheet(): ChatApi {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChatSheet must be used inside <StorefrontShell>");
  return ctx;
}

export function StorefrontShell({
  children,
  cartItemCount,
}: {
  children: ReactNode;
  cartItemCount: number;
}) {
  const [chatOpen, setChatOpen] = useState(false);

  const api = useMemo<ChatApi>(
    () => ({
      open: () => setChatOpen(true),
      close: () => setChatOpen(false),
      toggle: () => setChatOpen((v) => !v),
      isOpen: chatOpen,
    }),
    [chatOpen],
  );

  return (
    <ChatContext.Provider value={api}>
      <SiteHeader cartItemCount={cartItemCount} />
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
      <ChatSheet open={chatOpen} onOpenChange={setChatOpen} />
    </ChatContext.Provider>
  );
}
