"use client";

import { lazy, Suspense, useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Skeleton,
} from "@bookstore/ui";
import { SparklesIcon } from "lucide-react";

const ChatPanel = lazy(() =>
  import("./chat-panel").then((m) => ({ default: m.ChatPanel })),
);

const SESSION_KEY = "bookstore.eve.session";

export function ChatSheet({
  open,
  onOpenChange,
  pendingMessage,
  onConsumePending,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pendingMessage?: string | null;
  onConsumePending?: () => void;
}) {
  const [initialSession] = useState<unknown>(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!open) {
      onConsumePending?.();
    }
  }, [open, onConsumePending]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="flex w-full flex-col gap-0 p-0 sm:max-w-md"
        aria-describedby={undefined}
      >
        <SheetHeader className="flex-row items-center gap-3 border-b px-4 py-3">
          <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <SparklesIcon className="size-4" />
          </span>
          <div className="flex-1">
            <SheetTitle className="text-base">Paige</SheetTitle>
            <SheetDescription className="text-xs">
              Your bookstore concierge
            </SheetDescription>
          </div>
        </SheetHeader>

        {open ? (
          <Suspense
            fallback={
              <div className="flex flex-1 items-center justify-center p-6">
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            }
          >
            <ChatPanel
              initialSession={initialSession}
              pendingMessage={pendingMessage}
              onConsumePending={onConsumePending}
              onSessionChange={(session) => {
                try {
                  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
                } catch {
                  // ignore
                }
              }}
            />
          </Suspense>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
