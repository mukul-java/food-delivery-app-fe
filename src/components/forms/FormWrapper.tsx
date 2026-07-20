import type { FormHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface FormWrapperProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
  spacing?: "sm" | "md" | "lg";
}

const SPACING = {
  sm: "space-y-3",
  md: "space-y-4",
  lg: "space-y-6",
} as const;

export function FormWrapper({
  children,
  spacing = "md",
  className,
  noValidate = true,
  ...rest
}: FormWrapperProps) {
  return (
    <form
      noValidate={noValidate}
      className={cn(SPACING[spacing], className)}
      {...rest}
    >
      {children}
    </form>
  );
}
