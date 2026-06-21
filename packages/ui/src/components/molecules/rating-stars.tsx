import { StarIcon } from "lucide-react";
import { cn } from "../../lib/utils";

export type RatingStarsProps = {
  rating: number;
  max?: number;
  size?: number;
  showNumber?: boolean;
  className?: string;
};

export function RatingStars({
  rating,
  max = 5,
  size = 14,
  showNumber = false,
  className,
}: RatingStarsProps) {
  const pct = Math.max(0, Math.min(100, (rating / max) * 100));

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <div className="relative inline-flex">
        <div className="flex text-muted-foreground/25">
          {Array.from({ length: max }).map((_, i) => (
            <StarIcon
              key={i}
              style={{ width: size, height: size }}
              className="fill-current"
              strokeWidth={0}
            />
          ))}
        </div>
        <div
          className="absolute inset-0 flex overflow-hidden text-amber-500"
          style={{ width: `${pct}%` }}
          aria-hidden
        >
          {Array.from({ length: max }).map((_, i) => (
            <StarIcon
              key={i}
              style={{ width: size, height: size, minWidth: size }}
              className="fill-current"
              strokeWidth={0}
            />
          ))}
        </div>
      </div>
      {showNumber && (
        <span className="text-xs tabular-nums text-muted-foreground">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
