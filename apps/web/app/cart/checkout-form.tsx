"use client";

import { useState, useTransition } from "react";
import { ArrowRightIcon, LoaderIcon } from "lucide-react";
import { Button, Separator } from "@bookstore/ui";
import { checkoutAction } from "@/app/actions";
import { useChatSheet } from "@/components/storefront-shell";
import type { ShippingOption } from "@bookstore/db";

const format = (cents: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);

export function CheckoutForm({
  subtotalCents,
  options,
}: {
  subtotalCents: number;
  options: readonly ShippingOption[];
}) {
  const [optionId, setOptionId] = useState(options[0]?.id ?? "standard");
  const [pending, startTransition] = useTransition();
  const chat = useChatSheet();

  const selected = options.find((o) => o.id === optionId) ?? options[0];
  const totalCents = subtotalCents + (selected?.costCents ?? 0);

  return (
    <div className="space-y-4">
      <fieldset>
        <legend className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Shipping
        </legend>
        <ul className="mt-2 space-y-1.5">
          {options.map((opt) => {
            const active = opt.id === optionId;
            return (
              <li key={opt.id}>
                <label
                  className={
                    "flex cursor-pointer items-center justify-between gap-3 rounded-md border p-3 text-sm transition-colors " +
                    (active ? "border-primary bg-primary/5" : "hover:bg-accent")
                  }
                >
                  <span className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="shippingOptionId"
                      value={opt.id}
                      checked={active}
                      onChange={() => setOptionId(opt.id)}
                      className="size-4"
                    />
                    <span>
                      <span className="font-medium">{opt.label}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        {opt.etaBusinessDays} business day
                        {opt.etaBusinessDays === "1" ? "" : "s"}
                      </span>
                    </span>
                  </span>
                  <span className="font-medium tabular-nums">
                    {opt.costCents === 0 ? "Free" : format(opt.costCents)}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </fieldset>

      <Separator />

      <div className="space-y-1.5 text-sm">
        <Row label="Subtotal" value={subtotalCents} />
        <Row
          label={`Shipping (${selected?.label ?? "—"})`}
          value={selected?.costCents ?? 0}
        />
        <Separator className="my-2" />
        <div className="flex items-baseline justify-between text-base font-semibold">
          <span>Total</span>
          <span className="tabular-nums">{format(totalCents)}</span>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          startTransition(async () => {
            try {
              await checkoutAction(optionId);
            } catch (err) {
              console.error(err);
            }
          });
        }}
      >
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? (
            <>
              <LoaderIcon className="size-4 animate-spin" />
              Placing order…
            </>
          ) : (
            <>
              Place order
              <ArrowRightIcon className="size-4" />
            </>
          )}
        </Button>
      </form>

      <button
        type="button"
        onClick={() => chat.openWithMessage("Help me check out my cart")}
        className="block w-full text-center text-xs text-muted-foreground underline-offset-2 hover:underline"
      >
        or ask Paige to help
      </button>
    </div>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular-nums">{format(value)}</span>
    </div>
  );
}
