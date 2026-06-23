import { cn } from "../../lib/utils";

export type OrnamentProps = {
  glyph?: "hedera" | "star" | "diamond" | "asterisk";
  className?: string;
};

const GLYPHS: Record<NonNullable<OrnamentProps["glyph"]>, string> = {
  hedera: "❧",
  star: "✦",
  diamond: "◆",
  asterisk: "⁂",
};

export function Ornament({ glyph = "hedera", className }: OrnamentProps) {
  return (
    <div
      role="presentation"
      aria-hidden
      className={cn("flex items-center justify-center gap-3 text-muted-foreground/70", className)}
    >
      <span className="h-px w-10 bg-gradient-to-r from-transparent to-border sm:w-14" />
      <span className="text-base leading-none text-muted-foreground/80">{GLYPHS[glyph]}</span>
      <span className="h-px w-10 bg-gradient-to-l from-transparent to-border sm:w-14" />
    </div>
  );
}
