import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Message,
  MessageContent,
  Conversation,
  Suggestion,
  Suggestions,
} from "@bookstore/ui";

export default function HomePage() {
  return (
    <main className="p-8 space-y-6">
      <h1 className="text-2xl font-semibold">Bookstore</h1>

      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle>shadcn primitives</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Buttons, Cards, etc. from @bookstore/ui.
          </p>
          <div className="flex gap-2">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>AI Elements</CardTitle>
        </CardHeader>
        <CardContent>
          <Conversation className="gap-4">
            <Message from="user">
              <MessageContent>Do you have any sci-fi recommendations?</MessageContent>
            </Message>
            <Message from="assistant">
              <MessageContent>
                Based on your taste, you might love **Dune** by Frank Herbert or **The Martian** by Andy Weir.
                <Suggestions className="mt-3">
                  <Suggestion suggestion="Add Dune to cart">Add Dune to cart</Suggestion>
                  <Suggestion suggestion="More like this">More like this</Suggestion>
                </Suggestions>
              </MessageContent>
            </Message>
          </Conversation>
        </CardContent>
      </Card>
    </main>
  );
}
