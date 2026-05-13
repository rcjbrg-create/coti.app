import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center font-medium rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent touch-target",
          variant === "primary" && "bg-primary text-white hover:bg-primary-light",
          variant === "secondary" && "bg-beige-dark text-text hover:bg-beige",
          variant === "outline" && "border-2 border-border text-text hover:bg-beige",
          variant === "ghost" && "text-text-muted hover:bg-beige hover:text-text",
          variant === "danger" && "bg-error text-white hover:bg-red-600",
          size === "sm" && "px-3 py-1.5 text-sm",
          size === "md" && "px-4 py-2.5 text-base",
          size === "lg" && "px-6 py-3 text-lg",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
export { Button };
