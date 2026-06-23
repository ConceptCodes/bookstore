import { UserIcon } from "lucide-react";
import { formatCurrency } from "@bookstore/ui";
import type { AccountSummary } from "@bookstore/db";
import { CardShell } from "./card-shell";

export function AccountCard({ output }: { output: AccountSummary }) {
  const acct = output;
  if (!acct) return null;

  return (
    <CardShell icon={UserIcon} title="Account summary">
      <div className="space-y-2">
        <div>
          <p className="text-sm font-semibold">{acct.user.name}</p>
          <p className="text-xs text-muted-foreground">{acct.user.email}</p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <Stat label="Lifetime orders" value={String(acct.lifetimeOrderCount)} />
          <Stat label="Lifetime spent" value={formatCurrency(acct.lifetimeSpentCents)} />
          <Stat label="Open tickets" value={String(acct.openTickets)} />
          <Stat label="Cart items" value={String(acct.cartItemCount)} />
        </div>
      </div>
    </CardShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-muted/30 p-2">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold tabular-nums">{value}</p>
    </div>
  );
}
