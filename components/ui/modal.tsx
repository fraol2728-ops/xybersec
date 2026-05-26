import type * as React from "react";
import { cn } from "@/lib/utils";

type ModalProps = React.ComponentProps<"div"> & { open?: boolean };

export function Modal({ open = true, className, children, ...props }: ModalProps) {
  if (!open) return null;
  return (
    <div className={cn("fixed inset-0 z-50 grid place-items-center bg-background/70 p-lg", className)} {...props}>
      {children}
    </div>
  );
}

export function ModalContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "w-full max-w-lg rounded-xl border border-border bg-card p-xl text-card-foreground shadow-glow-accent",
        className,
      )}
      {...props}
    />
  );
}
