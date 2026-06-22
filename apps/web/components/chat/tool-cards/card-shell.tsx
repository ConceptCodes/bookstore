import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
  cn,
} from "@bookstore/ui";

export type CardShellProps = {
  icon?: LucideIcon;
  title?: ReactNode;
  action?: ReactNode;
  tone?: "default" | "success" | "warning" | "danger";
  className?: string;
  children: ReactNode;
};

const toneClasses: Record<NonNullable<CardShellProps["tone"]>, string> = {
  default: "",
  success: "border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/30",
  warning: "border-amber-500/30 bg-amber-50 dark:bg-amber-950/30",
  danger: "border-rose-500/30 bg-rose-50 dark:bg-rose-950/30",
};

export function CardShell({
  icon: Icon,
  title,
  action,
  tone = "default",
  className,
  children,
}: CardShellProps) {
  const hasHeader = Boolean(Icon || title || action);
  return (
    <Card
      className={cn(
        "gap-3 rounded-lg px-3 py-3 shadow-xs",
        toneClasses[tone],
        className,
      )}
    >
      {hasHeader && (
        <CardHeader className="gap-1 px-0 py-0">
          <CardTitle className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {Icon && <Icon className="size-3.5" strokeWidth={2} />}
            {title && <span>{title}</span>}
          </CardTitle>
          {action && <CardAction>{action}</CardAction>}
        </CardHeader>
      )}
      <CardContent className="px-0">{children}</CardContent>
    </Card>
  );
}
