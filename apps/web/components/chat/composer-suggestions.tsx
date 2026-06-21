"use client";

import { Suggestion, Suggestions } from "@bookstore/ui";

export function ComposerSuggestions({
  prompts,
  onPick,
  disabled,
}: {
  prompts: string[];
  onPick: (prompt: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="px-3 pb-2">
      <p className="mb-1.5 text-xs text-muted-foreground">Try:</p>
      <Suggestions className="gap-1.5">
        {prompts.map((prompt) => (
          <Suggestion
            key={prompt}
            suggestion={prompt}
            onClick={() => onPick(prompt)}
            disabled={disabled}
            variant="outline"
            size="xs"
          >
            {prompt}
          </Suggestion>
        ))}
      </Suggestions>
    </div>
  );
}
