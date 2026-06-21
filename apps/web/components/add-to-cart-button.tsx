"use client";

import { useState, useTransition, type ReactElement } from "react";
import { CheckIcon, LoaderIcon, PlusIcon } from "lucide-react";
import { Button } from "@bookstore/ui";
import { addBookToCartAction } from "@/app/actions";

type ButtonProps = React.ComponentProps<typeof Button>;

type AddState = "idle" | "pending" | "success";

export function AddToCartButton({
  bookId,
  size = "sm",
  variant = "outline",
  label = "Add",
  className,
}: {
  bookId: number;
  size?: ButtonProps["size"];
  variant?: ButtonProps["variant"];
  label?: string;
  className?: string;
}) {
  const [state, setState] = useState<AddState>("idle");
  const [, startTransition] = useTransition();

  function handleClick() {
    setState("pending");
    startTransition(async () => {
      try {
        await addBookToCartAction(bookId);
        setState("success");
        window.setTimeout(() => setState("idle"), 1200);
      } catch {
        setState("idle");
      }
    });
  }

  const icon: ReactElement | null =
    state === "pending" ? (
      <LoaderIcon className="size-3.5 animate-spin" />
    ) : state === "success" ? (
      <CheckIcon className="size-3.5" />
    ) : (
      <PlusIcon className="size-3.5" />
    );

  return (
    <Button
      type="button"
      size={size}
      variant={variant}
      disabled={state === "pending"}
      onClick={handleClick}
      className={className}
    >
      {icon}
      {state === "success" ? "Added" : label}
    </Button>
  );
}
