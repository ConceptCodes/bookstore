import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { cn } from "../../lib/utils";

export type StatProps = {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  hint?: string;
  className?: string;
};

export function Stat({ label, value, icon: Icon, hint, className }: StatProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="flex items-start justify-between gap-3 p-4">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="text-2xl font-semibold tabular-nums">{value}</p>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
        {Icon && (
          <div className="rounded-md bg-muted p-2 text-muted-foreground">
            <Icon className="size-4" strokeWidth={2} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
