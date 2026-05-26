import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-sm whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background [&_svg]:pointer-events-none [&_svg]:size-4 shrink-0",
  {
    variants: {
      variant: {
        default:
          "border border-primary/45 bg-primary text-primary-foreground shadow-glow-primary hover:bg-primary/90",
        primary:
          "border border-primary/45 bg-primary text-primary-foreground shadow-glow-primary hover:bg-primary/90",
        secondary:
          "border border-border bg-secondary text-foreground shadow-soft hover:bg-secondary/90",
        outline: "border border-border bg-background text-foreground hover:bg-secondary",
        ghost: "border border-transparent bg-transparent text-foreground hover:bg-secondary",
        link: "border border-transparent bg-transparent text-primary underline-offset-4 hover:underline",
        destructive: "border border-danger/50 bg-danger text-primary-foreground hover:bg-danger/90",
        danger: "border border-danger/50 bg-danger text-primary-foreground hover:bg-danger/90",
      },
      size: {
        sm: "h-8 px-md",
        md: "h-9 px-lg",
        lg: "h-10 px-xl",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
