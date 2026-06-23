import type { VariantProps } from "class-variance-authority";
import { Badge, badgeVariants } from "../ui/badge";
import { cn } from "../../lib/utils";

export type GenreBadgeProps = {
  genre: string;
  variant?: VariantProps<typeof badgeVariants>["variant"];
  className?: string;
};

const GENRE_CLASSES: Record<string, string> = {
  "Sci-Fi":
    "border-purple-200/60 bg-purple-100 text-purple-900 dark:border-purple-900/40 dark:bg-purple-950/40 dark:text-purple-200",
  Fantasy:
    "border-emerald-200/60 bg-emerald-100 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-200",
  Fiction:
    "border-blue-200/60 bg-blue-100 text-blue-900 dark:border-blue-900/40 dark:bg-blue-950/40 dark:text-blue-200",
  Mystery:
    "border-slate-300/70 bg-slate-100 text-slate-900 dark:border-slate-700/60 dark:bg-slate-800/60 dark:text-slate-100",
  "Non-Fiction":
    "border-amber-200/60 bg-amber-100 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-200",
  History:
    "border-stone-300/70 bg-stone-100 text-stone-900 dark:border-stone-700/60 dark:bg-stone-800/60 dark:text-stone-100",
  Biography:
    "border-rose-200/60 bg-rose-100 text-rose-900 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-200",
  Romance:
    "border-pink-200/60 bg-pink-100 text-pink-900 dark:border-pink-900/40 dark:bg-pink-950/40 dark:text-pink-200",
};

export function GenreBadge({ genre, variant = "outline", className }: GenreBadgeProps) {
  const tone = GENRE_CLASSES[genre];
  return (
    <Badge variant={variant} className={cn("font-medium", tone, className)}>
      {genre}
    </Badge>
  );
}
