import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { formatValue, valueTone } from "@/lib/intelligence-display";
import { cn } from "@/lib/utils";

/** Renders the SUPPLIED value. Colour follows the sign only — no thresholds invented here. */
export function ValueIndicator({
  value,
  size = "md",
  muted = false,
  className,
}: {
  value: number | undefined;
  size?: "sm" | "md" | "lg";
  muted?: boolean;
  className?: string;
}) {
  const tone = valueTone(value);
  const text = formatValue(value);
  if (text === null) {
    return (
      <span className={cn("vf-num text-vf-text-3", className)} title="Value not supplied">
        —
      </span>
    );
  }
  const Icon = tone === "positive" ? TrendingUp : tone === "negative" ? TrendingDown : Minus;
  return (
    <span
      className={cn(
        "vf-num inline-flex items-center gap-1 font-medium",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        size === "lg" && "text-2xl",
        muted
          ? "text-vf-text-2"
          : tone === "positive"
            ? "text-vf-positive"
            : tone === "negative"
              ? "text-vf-negative"
              : "text-vf-text-2",
        className,
      )}
      data-value-tone={tone}
    >
      <Icon className={cn(size === "lg" ? "size-5" : "size-3.5")} aria-hidden />
      {text}
    </span>
  );
}
