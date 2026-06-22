"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Textarea,
} from "@bookstore/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@bookstore/ui";
import { LoaderIcon, PencilIcon, PlusIcon } from "lucide-react";
import { createFaqAction, updateFaqAction } from "@/app/actions";
import type { Faq } from "@bookstore/db";

type Props =
  | { mode: "create"; categories: string[] }
  | { mode: "edit"; faq: Faq; categories: string[] };

export function FaqFormDialog(props: Props) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [question, setQuestion] = useState(
    props.mode === "edit" ? props.faq.question : "",
  );
  const [answer, setAnswer] = useState(props.mode === "edit" ? props.faq.answer : "");
  const [category, setCategory] = useState(
    props.mode === "edit"
      ? props.faq.category
      : props.categories[0] ?? "Shipping",
  );

  useEffect(() => {
    if (!open) return;
    if (props.mode === "edit") {
      setQuestion(props.faq.question);
      setAnswer(props.faq.answer);
      setCategory(props.faq.category);
    } else {
      setQuestion("");
      setAnswer("");
      setCategory(props.categories[0] ?? "Shipping");
    }
  }, [open, props]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const payload = {
        question: question.trim(),
        answer: answer.trim(),
        category,
      };
      if (props.mode === "create") {
        await createFaqAction(payload);
      } else {
        await updateFaqAction(props.faq.id, payload);
      }
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {props.mode === "create" ? (
          <Button>
            <PlusIcon className="size-4" />
            Add FAQ entry
          </Button>
        ) : (
          <Button variant="ghost" size="icon-sm" aria-label="Edit entry">
            <PencilIcon className="size-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {props.mode === "create" ? "Add FAQ entry" : "Edit entry"}
          </DialogTitle>
          <DialogDescription>
            FAQ entries appear in the storefront support page.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Question</Label>
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Answer</Label>
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={4}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {props.categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending && <LoaderIcon className="size-4 animate-spin" />}
              {props.mode === "create" ? "Create" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
