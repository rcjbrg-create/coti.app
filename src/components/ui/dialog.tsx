"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Dialog({ open, onClose, title, children, className }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className={cn(
        "backdrop:bg-black/50 rounded-2xl p-0 w-full max-w-lg bg-surface shadow-xl",
        className
      )}
    >
      <div className="p-6">
        {title && <h2 className="text-xl font-bold text-text mb-4">{title}</h2>}
        {children}
      </div>
    </dialog>
  );
}
