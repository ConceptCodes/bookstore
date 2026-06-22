import { TruckIcon } from "lucide-react";
import { formatCurrency } from "@bookstore/ui";
import type { ShippingOption } from "@bookstore/db";
import { CardShell } from "./card-shell";

export function ShippingOptionsCard({ output }: { output: ShippingOption[] }) {
  const options = Array.isArray(output) ? output : [];
  if (options.length === 0) {
    return (
      <CardShell icon={TruckIcon} title="Shipping options">
        <p className="text-sm text-muted-foreground">
          No shipping options available.
        </p>
      </CardShell>
    );
  }

  return (
    <CardShell icon={TruckIcon} title="Shipping options">
      <ul className="divide-y">
        {options.map((opt) => (
          <li
            key={opt.id}
            className="flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0"
          >
            <div>
              <p className="text-sm font-medium">{opt.label}</p>
              <p className="text-xs text-muted-foreground">
                {opt.etaBusinessDays} business day
                {opt.etaBusinessDays === "1" ? "" : "s"}
              </p>
            </div>
            <span className="text-sm font-medium tabular-nums">
              {formatCurrency(opt.costCents)}
            </span>
          </li>
        ))}
      </ul>
    </CardShell>
  );
}
