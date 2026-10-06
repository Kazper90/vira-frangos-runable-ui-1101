import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const VF_PIPELINE = ["Data", "Probability", "Fair Odds", "Value", "Decision", "Intelligence"] as const;

/**
 * Figma (frame 1:6 › PhilosophyAndPipeline): six bordered boxes, title + mono caption,
 * "→" connectors, the final "Decision" step lime-tinted. Static copy — computes nothing.
 */
export const VF_PIPELINE_STEPS = [
  { title: "Data", caption: "Football data" },
  { title: "Models", caption: "Statistical models" },
  { title: "Probability", caption: "VF probability" },
  { title: "Fair Odds", caption: "Model price" },
  { title: "Value", caption: "Edge detected" },
  { title: "Decision", caption: "Better decision" },
] as const;

export function PipelineBoxes({ className }: { className?: string }) {
  const last = VF_PIPELINE_STEPS.length - 1;
  return (
    <ol
      className={cn("grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-[repeat(5,minmax(0,1fr))_minmax(0,1.16fr)] lg:gap-0", className)}
      aria-label="VF intelligence pipeline"
    >
      {VF_PIPELINE_STEPS.map((s, i) => (
        <li key={s.title} className="flex min-w-0 items-center">
          <div
            className={cn(
              "min-w-0 flex-1 border px-4 py-[13px]",
              i === last ? "border-[rgba(200,241,53,0.18)] bg-vf-lime-faint" : "border-vf-line bg-vf-surface",
            )}
          >
            <div className={cn("text-[12px] font-semibold", i === last ? "text-vf-lime" : "text-vf-text")}>{s.title}</div>
            <div className="vf-num mt-0.5 truncate text-[9.5px] uppercase tracking-[0.08em] text-vf-text-4">{s.caption}</div>
          </div>
          {i < last && (
            <span className="vf-num hidden w-[15px] shrink-0 text-center text-[14px] text-vf-text-mute lg:block" aria-hidden>
              →
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}

/** Compact chain used inside Match Intelligence panels. Square chips per Figma radius language. */
export function PipelineStrip({
  steps = VF_PIPELINE as readonly string[],
  active,
  className,
}: {
  steps?: readonly string[];
  active?: number;
  className?: string;
}) {
  return (
    <ol className={cn("vf-scroll-x flex items-center gap-2 md:gap-3", className)} aria-label="VF intelligence pipeline">
      {steps.map((s, i) => (
        <li key={s} className="flex shrink-0 items-center gap-2 md:gap-3">
          <span
            className={cn(
              "vf-num rounded-vf-xs border px-3 py-1.5 text-[10px] uppercase tracking-[0.1em]",
              i === steps.length - 1 || i === active
                ? "border-[rgba(200,241,53,0.18)] bg-vf-lime-faint text-vf-lime"
                : "border-vf-line bg-vf-surface text-vf-text-2",
            )}
          >
            <span className="mr-1.5 text-vf-text-4">{String(i + 1).padStart(2, "0")}</span>
            {s}
          </span>
          {i < steps.length - 1 && <ArrowRight className="size-3.5 text-vf-text-mute" aria-hidden />}
        </li>
      ))}
    </ol>
  );
}
