import { ConfirmDialog } from "@/components/ConfirmDialog";

export interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
}

export function DeleteConfirmDialog({
  title = "Delete this item?",
  description = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  ...rest
}: DeleteConfirmDialogProps) {
  return (
    <ConfirmDialog
      title={title}
      description={description}
      confirmText={confirmText}
      cancelText={cancelText}
      destructive
      {...rest}
    />
  );
}
