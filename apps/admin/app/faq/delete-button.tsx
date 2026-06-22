"use client";

import { useState, useTransition } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@bookstore/ui";
import { Button } from "@bookstore/ui";
import { LoaderIcon, Trash2Icon } from "lucide-react";
import { deleteFaqAction } from "@/app/actions";
import type { Faq } from "@bookstore/db";

export function DeleteFaqButton({ faq }: { faq: Faq }) {
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Delete FAQ ${faq.id}`}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2Icon className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this FAQ entry?</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="text-foreground">&ldquo;{faq.question}&rdquo;</span>{" "}
            will be removed from the storefront support page.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={pending}
            onClick={(e) => {
              e.preventDefault();
              startTransition(async () => {
                await deleteFaqAction(faq.id);
                setOpen(false);
              });
            }}
          >
            {pending && <LoaderIcon className="size-4 animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
