import { HelpCircleIcon, LifeBuoyIcon, MessageSquareIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  EmptyState,
  Separator,
  StatusBadge,
  formatRelativeTime,
} from "@bookstore/ui";
import { CUSTOMER_USER_ID, getUserTickets, listFaqCategories, searchFaq } from "@bookstore/db";
import { TicketForm } from "./ticket-form";
import { ChatTriggerButton } from "@/components/chat-trigger-button";

export const dynamic = "force-dynamic";

export default async function SupportPage() {
  const [faq, tickets] = [searchFaq({}), getUserTickets(CUSTOMER_USER_ID)];
  const categories = listFaqCategories();
  const faqByCategory = categories.map((c) => ({
    category: c,
    entries: faq.filter((f) => f.category === c),
  }));

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Support</h1>
        <p className="text-sm text-muted-foreground">
          Quick answers, ticket history, and Paige ready to help.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <section className="space-y-3">
            <SectionHeader icon={HelpCircleIcon} eyebrow="FAQ" title="Frequently asked questions" />
            <div className="space-y-4">
              {faqByCategory.map(({ category, entries }) =>
                entries.length === 0 ? null : (
                  <Card key={category}>
                    <CardHeader>
                      <CardTitle className="text-sm font-semibold text-foreground">
                        {category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="divide-y">
                        {entries.map((entry) => (
                          <li key={entry.id}>
                            <Collapsible>
                              <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 py-2.5 text-left text-sm font-medium hover:underline">
                                {entry.question}
                              </CollapsibleTrigger>
                              <CollapsibleContent className="pb-2.5 text-sm text-muted-foreground">
                                {entry.answer}
                              </CollapsibleContent>
                            </Collapsible>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ),
              )}
            </div>
          </section>

          <Separator />

          <section className="space-y-3">
            <SectionHeader
              icon={MessageSquareIcon}
              eyebrow="History"
              title="Your support tickets"
            />
            {tickets.length === 0 ? (
              <EmptyState
                title="No tickets yet"
                description="If you open a ticket it will appear here with its current status."
              />
            ) : (
              <ul className="space-y-2">
                {tickets.map((ticket) => (
                  <li
                    key={ticket.id}
                    className="rounded-lg border bg-card p-3 text-card-foreground"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold">Ticket #{ticket.id}</p>
                      <StatusBadge status={ticket.status} kind="ticket" />
                    </div>
                    <p className="mt-1 text-sm font-medium">{ticket.subject}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                      {ticket.body}
                    </p>
                    <p className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                      opened {formatRelativeTime(ticket.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-1.5 text-sm uppercase tracking-wide text-muted-foreground">
                <LifeBuoyIcon className="size-3.5" />
                Open a ticket
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TicketForm />
            </CardContent>
          </Card>

          <Card className="bg-muted/30">
            <CardContent className="space-y-3 p-4">
              <p className="text-sm font-medium">Prefer to chat?</p>
              <p className="text-xs text-muted-foreground">
                Paige can answer questions, look up orders, and open a ticket for you inside the
                chat.
              </p>
              <ChatTriggerButton />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  eyebrow,
  title,
}: {
  icon: typeof HelpCircleIcon;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="space-y-1">
      <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <Icon className="size-3.5" />
        {eyebrow}
      </p>
      <h2 className="text-lg font-semibold tracking-tight sm:text-xl">{title}</h2>
    </div>
  );
}
