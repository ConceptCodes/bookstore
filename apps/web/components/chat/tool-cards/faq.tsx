import { HelpCircleIcon } from "lucide-react";
import { CardShell } from "./card-shell";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@bookstore/ui";
import type { Faq } from "@bookstore/db";

export function FaqCard({ output }: { output: Faq[] }) {
  const entries = Array.isArray(output) ? output : [];
  if (entries.length === 0) {
    return (
      <CardShell icon={HelpCircleIcon} title="FAQ">
        <p className="text-sm text-muted-foreground">
          No matching FAQ entries. Ask me to open a support ticket instead.
        </p>
      </CardShell>
    );
  }

  return (
    <CardShell
      icon={HelpCircleIcon}
      title={`${entries.length} FAQ entr${entries.length === 1 ? "y" : "ies"}`}
    >
      <ul className="space-y-1">
        {entries.slice(0, 5).map((entry) => (
          <li key={entry.id}>
            <Collapsible>
              <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm font-medium hover:bg-accent">
                <span className="flex-1">{entry.question}</span>
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  {entry.category}
                </span>
              </CollapsibleTrigger>
              <CollapsibleContent className="px-2 pb-2 pt-1 text-xs text-muted-foreground">
                {entry.answer}
              </CollapsibleContent>
            </Collapsible>
          </li>
        ))}
      </ul>
    </CardShell>
  );
}
