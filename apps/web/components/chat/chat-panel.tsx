"use client";

import { useState, type FormEvent } from "react";
import { useEveAgent } from "eve/react";
import { Conversation } from "@bookstore/ui";
import { ArrowUpIcon, SparklesIcon, StopCircleIcon } from "lucide-react";
import { Button } from "@bookstore/ui";
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
  onSessionChange,
}: {
  initialSession: unknown;
  onSessionChange?: (session: unknown) => void;
}) {
  const agent = useEveAgent({
    initialSession: (initialSession ?? undefined) as never,
    onSessionChange: ((session: unknown) => onSessionChange?.(session)) as never,
  });

  const isBusy = agent.status === "submitted" || agent.status === "streaming";
  const hasMessages = agent.data.messages.length > 0;
  const [value, setValue] = useState("");

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
      <MessageList messages={agent.data.messages} status={agent.status} />

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
        <textarea
          name="message"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit(value);
            }
          }}
          placeholder={isBusy ? "Page is responding…" : "Ask Page anything…"}
          rows={1}
          disabled={isBusy}
          className="block max-h-40 min-h-[2.5rem] flex-1 resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
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
