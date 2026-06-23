export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function formatDate(date: Date | number | { getTime(): number }): string {
  const d = toDate(date);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

export function formatDateTime(date: Date | number | { getTime(): number }): string {
  const d = toDate(date);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

export function formatRelativeTime(date: Date | number | { getTime(): number }): string {
  const d = toDate(date);
  const diff = d.getTime() - Date.now();
  const absDiff = Math.abs(diff);
  const rtf = new Intl.RelativeTimeFormat("en-US", { numeric: "auto" });

  if (absDiff < 60_000) return rtf.format(Math.round(diff / 1000), "second");
  if (absDiff < 3_600_000) return rtf.format(Math.round(diff / 60_000), "minute");
  if (absDiff < 86_400_000) return rtf.format(Math.round(diff / 3_600_000), "hour");
  if (absDiff < 604_800_000) return rtf.format(Math.round(diff / 86_400_000), "day");
  if (absDiff < 2_629_800_000) return rtf.format(Math.round(diff / 604_800_000), "week");
  if (absDiff < 31_557_600_000) return rtf.format(Math.round(diff / 2_629_800_000), "month");
  return rtf.format(Math.round(diff / 31_557_600_000), "year");
}

function toDate(value: Date | number | { getTime(): number }): Date {
  if (value instanceof Date) return value;
  if (typeof value === "number") return new Date(value);
  return new Date(value.getTime());
}
