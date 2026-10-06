import type * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Stat — label + value. If `value` is null the stat renders a "not supplied"
 * placeholder; it never substitutes a number.
 */
export function Stat({
  label,
  value,
  hint,
  emphasis = "default",
  className,
}: {
  label: React.ReactNode;
  value: React.ReactNode | null;
  hint?: React.ReactNode;
  emphasis?: "default" | "lime" | "muted";
  className?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <div className="vf-eyebrow mb-1.5 truncate">{label}</div>
      {value === null || value === undefined ? (
        <div className="vf-num text-lg text-vf-text-3" title="Not supplied by the VF intelligence layer">
          —
        </div>
      ) : (
        <div
          className={cn(
            "vf-num text-xl font-medium md:text-2xl",
            emphasis === "lime" && "text-vf-lime",
            emphasis === "muted" && "text-vf-text-2",
            emphasis === "default" && "text-vf-text",
          )}
        >
          {value}
        </div>
      )}
      {hint && <div className="mt-1 text-xs text-vf-text-3">{hint}</div>}
    </div>
  );
}
