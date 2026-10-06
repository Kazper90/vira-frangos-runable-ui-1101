import type * as React from "react";
import { cn } from "@/lib/utils";

/** Pill — selectable chip for filters (competition, date, market). */
export function Pill({
  active = false,
  className,
  children,
  ...props
}: React.ComponentProps<"button"> & { active?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        "inline-flex h-[31px] shrink-0 cursor-pointer items-center gap-1.5 rounded-vf-xs border px-3.5 text-[12px] transition-colors duration-200",
        active
          ? "border-transparent bg-vf-lime font-semibold text-vf-lime-ink"
          : "border-vf-line bg-transparent font-medium text-vf-text-4 hover:border-vf-line-strong hover:text-vf-text",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
