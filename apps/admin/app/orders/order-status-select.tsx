"use client";

import { useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@bookstore/ui";
import { LoaderIcon } from "lucide-react";
import { updateOrderStatusAction } from "@/app/actions";
import type { OrderStatus } from "@bookstore/db";

const STATUSES: OrderStatus[] = ["pending", "paid", "shipped", "cancelled"];

export function OrderStatusSelect({
  orderId,
  status,
}: {
  orderId: number;
  status: OrderStatus;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="relative">
      <Select
        defaultValue={status}
        onValueChange={(next) =>
          startTransition(async () => {
            await updateOrderStatusAction(orderId, next as OrderStatus);
          })
        }
      >
        <SelectTrigger className="h-8 w-32 text-xs" disabled={pending}>
          {pending && <LoaderIcon className="size-3 animate-spin" />}
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STATUSES.map((s) => (
            <SelectItem key={s} value={s} className="text-xs capitalize">
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
