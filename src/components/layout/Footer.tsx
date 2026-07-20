import { APP_LABELS } from "@/constants/labels";

export function Footer() {
  return (
    <footer className="border-t bg-background px-4 py-4 text-xs text-muted-foreground sm:px-6">
      <div className="flex flex-col items-start justify-between gap-1 sm:flex-row sm:items-center">
        <p>{APP_LABELS.COPYRIGHT}</p>
        <p>{APP_LABELS.APP_FULL_NAME}</p>
      </div>
    </footer>
  );
}
