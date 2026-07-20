import { Loader2 } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface SubmitButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
}

export function SubmitButton({
  loading,
  loadingText,
  disabled,
  children,
  className,
  ...rest
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={disabled || loading}
      className={cn(className)}
      {...rest}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />}
      {loading && loadingText ? loadingText : children}
    </Button>
  );
}
