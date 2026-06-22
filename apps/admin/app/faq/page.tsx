import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  EmptyState,
} from "@bookstore/ui";
import { HelpCircleIcon } from "lucide-react";
import { listAllFaq, listFaqCategories } from "@bookstore/db";
import { AdminPageHeader } from "@/components/admin-page-header";
import { FaqFormDialog } from "./faq-form-dialog";
import { DeleteFaqButton } from "./delete-button";

export const dynamic = "force-dynamic";

export default async function FaqPage() {
  const entries = listAllFaq();
  const categories = listFaqCategories();

  return (
    <>
      <AdminPageHeader
        title="FAQ"
        description={`${entries.length} entries across ${categories.length} categories`}
        actions={<FaqFormDialog mode="create" categories={categories} />}
      />

      {entries.length === 0 ? (
        <EmptyState
          icon={HelpCircleIcon}
          title="No FAQ entries yet"
          description="Add common questions to surface them on the storefront support page."
        />
      ) : (
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">ID</TableHead>
                <TableHead>Question</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-mono text-xs">#{entry.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{entry.question}</span>
                      <span className="line-clamp-1 max-w-md text-xs text-muted-foreground">
                        {entry.answer}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline">{entry.category}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-0.5">
                      <FaqFormDialog mode="edit" faq={entry} categories={categories} />
                      <DeleteFaqButton faq={entry} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="mt-6">
        <Link
          href="http://localhost:3000/support"
          target="_blank"
          rel="noreferrer"
          className="text-xs text-muted-foreground underline-offset-2 hover:underline"
        >
          View FAQ on the storefront ↗
        </Link>
      </div>
    </>
  );
}
