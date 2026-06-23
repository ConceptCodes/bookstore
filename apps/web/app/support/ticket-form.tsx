"use client";

import { useState, useTransition } from "react";
import { Button, Input, Label, Textarea } from "@bookstore/ui";
import { CheckCircle2Icon, LoaderIcon } from "lucide-react";
import { createSupportTicketAction } from "@/app/actions";

export function TicketForm({ onSuccess }: { onSuccess?: (ticketId: number) => void }) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState<number | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) return;
    startTransition(async () => {
      const ticket = await createSupportTicketAction(subject.trim(), body.trim());
      setSubject("");
      setBody("");
      setDone(ticket.id);
      onSuccess?.(ticket.id);
    });
  }

  if (done !== null) {
    return (
      <div className="rounded-lg border border-emerald-500/30 bg-emerald-50 p-4 dark:bg-emerald-950/30">
        <div className="flex items-start gap-3">
          <CheckCircle2Icon className="size-5 text-emerald-600 dark:text-emerald-400" />
          <div className="flex-1">
            <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
              Ticket #{done} opened
            </p>
            <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-300">
              We&apos;ll get back to you within one business day. Refresh this page to see your
              ticket history.
            </p>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="mt-3"
              onClick={() => setDone(null)}
            >
              Open another ticket
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Brief summary of the issue"
          required
          maxLength={120}
          disabled={pending}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="body">Details</Label>
        <Textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Tell us what's going on. Include order ids, book titles, or anything else that helps."
          rows={5}
          required
          minLength={10}
          disabled={pending}
        />
      </div>
      <Button type="submit" disabled={pending || !subject.trim() || !body.trim()}>
        {pending ? (
          <>
            <LoaderIcon className="size-4 animate-spin" />
            Opening ticket…
          </>
        ) : (
          "Open ticket"
        )}
      </Button>
    </form>
  );
}
