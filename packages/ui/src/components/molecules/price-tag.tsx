import { cn } from "../../lib/utils";
import { formatCurrency } from "../../lib/format";

export type PriceTagProps = {
  priceCents: number;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  strikeThroughCents?: number;
};

const sizeClasses: Record<NonNullable<PriceTagProps["size"]>, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-xl",
};

export function PriceTag({
  priceCents,
  size = "md",
  className,
  strikeThroughCents,
}: PriceTagProps) {
  return (
    <span className="inline-flex items-baseline gap-1.5">
      {strikeThroughCents !== undefined && strikeThroughCents > priceCents && (
        <span
          className={cn(
            "text-muted-foreground line-through tabular-nums",
            sizeClasses[size],
            className,
          )}
        >
          {formatCurrency(strikeThroughCents)}
        </span>
      )}
      <span
        className={cn(
          "font-semibold tabular-nums",
          sizeClasses[size],
          className,
        )}
      >
        {formatCurrency(priceCents)}
      </span>
    </span>
  );
}
