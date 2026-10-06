import { cn } from "@/lib/utils";

/**
 * VF Score ring. Renders the SUPPLIED score; assumes a 0–100 scale
 * (pending confirmation from the governance contract — adjust `max` if different).
 * Undefined renders an empty ring with "—".
 */
export function ScoreIndicator({
  score,
  max = 100,
  size = 112,
  label = "VF Score",
  className,
}: {
  score: number | undefined;
  max?: number;
  size?: number;
  label?: string;
  className?: string;
}) {
  const stroke = Math.max(6, size * 0.07);
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const has = typeof score === "number" && Number.isFinite(score);
  const frac = has ? Math.min(Math.max((score as number) / max, 0), 1) : 0;

  return (
    <div
      className={cn("relative inline-grid shrink-0 place-items-center", className)}
      style={{ width: size, height: size }}
    >
      <span className="sr-only">{has ? `${label} ${score} of ${max}` : `${label} not supplied`}</span>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--vf-track)" strokeWidth={stroke} />
        {has && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--vf-lime)"
            strokeWidth={stroke}
            strokeLinecap="butt"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - frac)}
            style={{ transition: "stroke-dashoffset 900ms var(--vf-ease)" }}
          />
        )}
      </svg>
      <div className="absolute inset-0 grid place-content-center text-center" aria-hidden>
        <div className={cn("vf-num font-semibold leading-none", has ? "text-vf-text" : "text-vf-text-3")} style={{ fontSize: size * 0.3 }}>
          {has ? score : "—"}
        </div>
        <div className="vf-eyebrow mt-1" style={{ fontSize: Math.max(8, size * 0.075) }}>
          {label}
        </div>
      </div>
    </div>
  );
}
