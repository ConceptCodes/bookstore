"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useEveAgent } from "eve/react";
import {
  Button,
  Conversation,
  Textarea,
} from "@bookstore/ui";
import { ArrowUpIcon, SparklesIcon, StopCircleIcon } from "lucide-react";
import { MessageList } from "./message-list";
import { ComposerSuggestions } from "./composer-suggestions";

const QUICK_PROMPTS = [
  "Recommend a sci-fi book",
  "What's in my cart?",
  "Where is my last order?",
  "Do you ship internationally?",
];

export function ChatPanel({
  initialSession,
  pendingMessage,
  onConsumePending,
  onSessionChange,
}: {
  initialSession: unknown;
  pendingMessage?: string | null;
  onConsumePending?: () => void;
  onSessionChange?: (session: unknown) => void;
}) {
  const agent = useEveAgent({
    initialSession: (initialSession ?? undefined) as never,
    onSessionChange: ((session: unknown) => onSessionChange?.(session)) as never,
  });

  const isBusy = agent.status === "submitted" || agent.status === "streaming";
  const hasMessages = agent.data.messages.length > 0;
  const [value, setValue] = useState("");
  const sentRef = useRef<string | null>(null);

  useEffect(() => {
    if (
      pendingMessage &&
      sentRef.current !== pendingMessage &&
      agent.status === "ready"
    ) {
      sentRef.current = pendingMessage;
      void agent.send({ message: pendingMessage });
      onConsumePending?.();
    }
  }, [pendingMessage, agent, onConsumePending]);

  function submit(message: string) {
    const trimmed = message.trim();
    if (!trimmed || isBusy) return;
    setValue("");
    void agent.send({ message: trimmed });
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    submit(value);
  }

  return (
    <Conversation className="flex min-h-0 flex-1 flex-col">
      <MessageList
        messages={agent.data.messages}
        status={agent.status}
        onRespond={(requestId, optionId) => {
          void agent.send({
            inputResponses: [{ requestId, optionId }],
          } as never);
        }}
      />

      {!hasMessages && (
        <ComposerSuggestions
          prompts={QUICK_PROMPTS}
          disabled={isBusy}
          onPick={submit}
        />
      )}

      <form
        onSubmit={onSubmit}
        className="flex items-end gap-2 border-t bg-background p-3"
      >
        <Textarea
          name="message"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit(value);
            }
          }}
          placeholder={isBusy ? "Paige is responding…" : "Ask Paige anything…"}
          rows={1}
          disabled={isBusy}
          className="block max-h-40 min-h-[2.5rem] flex-1 resize-none"
        />
        {isBusy ? (
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={() => agent.stop()}
            aria-label="Stop"
          >
            <StopCircleIcon className="size-4" />
          </Button>
        ) : (
          <Button
            type="submit"
            size="icon"
            disabled={!value.trim()}
            aria-label="Send"
          >
            <ArrowUpIcon className="size-4" />
          </Button>
        )}
      </form>

      <p className="flex items-center justify-center gap-1 bg-background px-3 pb-2 text-[10px] text-muted-foreground">
        <SparklesIcon className="size-2.5" />
        Powered by Eve
      </p>
    </Conversation>
  );
}
