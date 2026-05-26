import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "flex flex-col gap-lg rounded-xl border bg-card text-card-foreground shadow-soft",
  {
    variants: {
      variant: {
        primary: "border-border",
        secondary: "border-border bg-secondary/60",
        ghost: "border-transparent bg-transparent shadow-none",
        danger: "border-danger/40 bg-danger/10",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

function Card({ className, variant, ...props }: React.ComponentProps<"div"> & VariantProps<typeof cardVariants>) {
  return (
    <div data-slot="card" className={cn(cardVariants({ variant }), className)} {...props} />
  );
}

const CardHeader = ({ className, ...props }: React.ComponentProps<"div">) => <div data-slot="card-header" className={cn("grid auto-rows-min gap-sm px-xl pt-xl", className)} {...props} />;
const CardTitle = ({ className, ...props }: React.ComponentProps<"div">) => <div data-slot="card-title" className={cn("leading-none font-semibold text-foreground", className)} {...props} />;
const CardDescription = ({ className, ...props }: React.ComponentProps<"div">) => <div data-slot="card-description" className={cn("text-sm text-muted-foreground", className)} {...props} />;
const CardAction = ({ className, ...props }: React.ComponentProps<"div">) => <div data-slot="card-action" className={cn("self-start justify-self-end", className)} {...props} />;
const CardContent = ({ className, ...props }: React.ComponentProps<"div">) => <div data-slot="card-content" className={cn("px-xl pb-xl", className)} {...props} />;
const CardFooter = ({ className, ...props }: React.ComponentProps<"div">) => <div data-slot="card-footer" className={cn("flex items-center gap-sm px-xl pb-xl", className)} {...props} />;

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent };
