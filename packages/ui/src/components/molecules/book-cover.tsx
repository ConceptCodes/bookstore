"use client";

import { useMemo, useState } from "react";
import { cn } from "../../lib/utils";

export type BookCoverProps = {
  title: string;
  coverUrl?: string | null;
  alt?: string;
  className?: string;
};

function hashHue(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 360;
}

export function BookCover({ title, coverUrl, alt, className }: BookCoverProps) {
  const [errored, setErrored] = useState(false);
  const hue = useMemo(() => hashHue(title), [title]);
  const showImage = coverUrl && !errored;

  if (!showImage) {
    return (
      <div
        className={cn(
          "relative flex h-full w-full items-end overflow-hidden p-3",
          className,
        )}
        style={{
          background: `linear-gradient(135deg, hsl(${hue} 45% 22%), hsl(${(hue + 40) % 360} 50% 14%))`,
        }}
      >
        <span className="line-clamp-4 text-xs font-semibold leading-tight text-white/90 [text-wrap:balance]">
          {title}
        </span>
      </div>
    );
  }

  return (
    <img
      src={coverUrl}
      alt={alt ?? title}
      onError={() => setErrored(true)}
      loading="lazy"
      className={cn("h-full w-full object-cover", className)}
    />
  );
}
