import { AlertCircleIcon } from "lucide-react";
import { CardShell } from "./card-shell";

export function ErrorCard({ toolName, message }: { toolName?: string; message?: string }) {
  const text =
    message ?? (toolName ? `Tool \`${toolName}\` failed to run.` : "Tool failed to run.");
  return (
    <CardShell icon={AlertCircleIcon} title="Error" tone="danger">
      <p className="text-sm text-muted-foreground">{text}</p>
    </CardShell>
  );
}
