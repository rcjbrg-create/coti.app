import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";
import Image from "next/image";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export function Card({ className, hoverable = false, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-surface rounded-2xl border border-border overflow-hidden",
        hoverable && "transition-shadow hover:shadow-md active:scale-[0.98]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

type CardImageProps = Omit<React.ComponentProps<typeof Image>, "fill">;

export function CardImage({ className, alt = "", sizes = "(max-width: 768px) 100vw, 33vw", ...props }: CardImageProps) {
  return (
    <div className="relative aspect-[4/3] overflow-hidden bg-beige-dark">
      <Image
        fill
        alt={alt}
        sizes={sizes}
        className={cn("object-cover", className)}
        {...props}
      />
    </div>
  );
}

export function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-4", className)} {...props}>
      {children}
    </div>
  );
}
