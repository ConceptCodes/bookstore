"use client";

import { useEffect, useRef } from "react";
import type { EveMessage } from "eve/react";
import {
  Message,
  MessageContent,
} from "@bookstore/ui";
import { SparklesIcon } from "lucide-react";
import { ToolCard } from "./tool-cards";

export type ChatStatus = "ready" | "submitted" | "streaming" | "error";

export function MessageList({
  messages,
  status,
  onRespond,
}: {
  messages: readonly EveMessage[];
  status: ChatStatus;
  onRespond?: (requestId: string, optionId: string) => void;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, status]);

  if (messages.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
        <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <SparklesIcon className="size-5" />
        </span>
        <div className="space-y-1">
          <p className="text-sm font-medium">Hi, I&apos;m Page.</p>
          <p className="mx-auto max-w-xs text-sm text-muted-foreground">
            Your bookstore concierge. Ask me for recommendations, cart help,
            order status, or anything else.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={viewportRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
      {messages.map((message) => (
        <Message key={message.id} from={message.role}>
          <MessageContent>
            <MessageParts message={message} onRespond={onRespond} />
          </MessageContent>
        </Message>
      ))}

      {status === "submitted" && (
        <Message from="assistant">
          <MessageContent>
            <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
              <span className="flex gap-0.5">
                <Dot />
                <Dot delay="0.15s" />
                <Dot delay="0.3s" />
              </span>
              Thinking…
            </span>
          </MessageContent>
        </Message>
      )}
    </div>
  );
}

function MessageParts({
  message,
  onRespond,
}: {
  message: EveMessage;
  onRespond?: (requestId: string, optionId: string) => void;
}) {
  const parts = message.parts;
  if (!parts || parts.length === 0) return null;

  return (
    <>
      {parts.map((part, i) => {
        const key = `${message.id}-${i}`;
        const type = (part as { type?: string }).type;

        if (type === "text") {
          const text = (part as { text?: string }).text ?? "";
          if (!text) return null;
          return (
            <p
              key={key}
              className="whitespace-pre-wrap text-sm leading-relaxed"
            >
              {text}
            </p>
          );
        }

        if (type === "reasoning") return null;

        if (typeof type === "string" && type.includes("tool")) {
          return (
            <ToolCard
              key={key}
              part={part as never}
              onRespond={onRespond}
            />
          );
        }

        return null;
      })}
    </>
  );
}

function Dot({ delay = "0s" }: { delay?: string }) {
  return (
    <span
      className="inline-block size-1.5 animate-bounce rounded-full bg-current"
      style={{ animationDelay: delay }}
    />
  );
}
