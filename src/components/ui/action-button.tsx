"use client";

import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { VariantProps } from "class-variance-authority";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";

interface props
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  isPending: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "submit" | "reset" | "button";
}

export default function ActionButton({
  children,
  isPending,
  variant,
  size,
  className,
  onClick,
  type = "submit",
}: props) {
  return (
    <Button
      onClick={onClick}
      type={type}
      disabled={isPending}
      variant={variant}
      size={size}
      className={cn(
        className,
        "inline-grid place-items-center [grid-template-areas:'stack']"
      )}
    >
      <span
        className={cn(
          isPending && "invisible",
          "flex items-center gap-2 [grid-area:stack]"
        )}
      >
        {children}
      </span>
      <LoaderCircle
        aria-label="Submitting"
        className={cn(
          isPending ? "visible" : "invisible",
          "w-5 h-5 animate-spin transition-opacity [grid-area:stack]"
        )}
      />
    </Button>
  );
}
