import { cn } from "@/lib/utils";
import { formatProbability } from "@/lib/intelligence-display";

export interface ProbabilitySegment {
  key: string;
  label: string;
  probability: number | undefined;
  highlight?: boolean;
}

/**
 * Renders SUPPLIED probabilities. Figma (frame 1:6, MatchCard › ProbRow): one column per
 * selection — mono label, value, then a 2px bar on a #1E1E1E track whose fill width is a
 * direct visual mapping of the supplied number. If any value is missing, no bars are drawn
 * (we never fill gaps or normalise).
 */
export function ProbabilityBar({
  segments,
  className,
  tone = "lime",
  showLabels = true,
}: {
  segments: ProbabilitySegment[];
  className?: string;
  tone?: "lime" | "amber" | "muted";
  showLabels?: boolean;
}) {
  const complete = segments.every((s) => typeof s.probability === "number");
  const fill = tone === "lime" ? "bg-vf-lime" : tone === "amber" ? "bg-vf-amber" : "bg-[#2d2d2d]";

  return (
    <div
      className={cn("grid w-full gap-3", className)}
      style={{ gridTemplateColumns: `repeat(${segments.length}, minmax(0, 1fr))` }}
    >
      {!showLabels && (
        <span className="sr-only">
          {segments.map((s) => `${s.label} ${formatProbability(s.probability) ?? "not supplied"}`).join(", ")}
        </span>
      )}
      {segments.map((s) => (
        <div key={s.key} className="min-w-0">
          {showLabels && (
            <>
              <div className="vf-num truncate text-[10px] text-vf-text-4">{s.label}</div>
              <div
                className={cn(
                  "mt-0.5 text-[13px] font-semibold tabular-nums",
                  s.highlight ? (tone === "amber" ? "text-vf-amber" : "text-vf-lime") : tone === "muted" ? "text-vf-text-4" : "text-vf-text",
                )}
              >
                {formatProbability(s.probability) ?? "—"}
              </div>
            </>
          )}
          <div
            className={cn(
              "mt-1.5 h-[2px] w-full overflow-hidden rounded-[1px]",
              complete ? "bg-vf-track" : "border-t border-dashed border-vf-line-strong",
            )}
            aria-hidden
          >
            {complete && (
              <div
                className={cn("h-full transition-[width] duration-700 ease-vf", fill)}
                style={{ width: `${(s.probability as number) * 100}%` }}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
