"use client";

import type { ChangeEvent } from "react";
import { MinusIcon, PlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { cn } from "../../lib/utils";

export type QuantityInputProps = {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  className?: string;
};

export function QuantityInput({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled,
  className,
}: QuantityInputProps) {
  const clamped = Math.max(min, Math.min(max, value));
  const set = (next: number) => onChange(Math.max(min, Math.min(max, next)));

  return (
    <div
      className={cn(
        "inline-flex h-9 items-center rounded-md border bg-background",
        disabled && "opacity-50",
        className,
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="rounded-r-none border-r-0"
        disabled={disabled || clamped <= min}
        onClick={() => set(clamped - 1)}
        aria-label="Decrease quantity"
      >
        <MinusIcon className="size-3.5" />
      </Button>
      <Input
        type="number"
        inputMode="numeric"
        value={clamped}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const parsed = Number.parseInt(e.target.value ?? "", 10);
          if (Number.isNaN(parsed)) {
            set(min);
          } else {
            set(parsed);
          }
        }}
        disabled={disabled}
        className="h-9 w-12 rounded-none border-0 bg-transparent px-0 text-center tabular-nums shadow-none [appearance:textfield] focus-visible:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        aria-label="Quantity"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="rounded-l-none border-l-0"
        disabled={disabled || clamped >= max}
        onClick={() => set(clamped + 1)}
        aria-label="Increase quantity"
      >
        <PlusIcon className="size-3.5" />
      </Button>
    </div>
  );
}
