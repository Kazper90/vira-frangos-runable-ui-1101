import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { FlaskConical, ShieldCheck, ShieldOff, Database } from "lucide-react";
import type { DataSource, QualificationStatus } from "@/contracts";
import {
  DISPLAY_STATE_META,
  QUALIFICATION_META,
  type MatchDisplayState,
} from "@/lib/intelligence-display";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-vf-xs border font-mono text-[10px] font-medium uppercase leading-none tracking-[0.12em] [&_svg]:size-3 [&_svg]:shrink-0",
  {
    variants: {
      tone: {
        lime: "border-vf-lime-line bg-vf-lime-dim text-vf-lime",
        amber: "border-[rgba(255,181,71,0.35)] bg-vf-amber-dim text-vf-amber",
        steel: "border-vf-line-strong bg-vf-steel-dim text-vf-steel",
        live: "border-[rgba(255,90,54,0.4)] bg-[rgba(255,90,54,0.12)] text-vf-live",
        red: "border-vf-red-line bg-vf-red-dim text-vf-red-text",
        neutral: "border-vf-line bg-transparent text-vf-text-3",
      },
      size: {
        sm: "h-5 px-2",
        md: "h-6 px-2.5",
      },
    },
    defaultVariants: { tone: "neutral", size: "md" },
  },
);

export type BadgeProps = React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>;

export function Badge({ className, tone, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone, size }), className)} {...props} />;
}

export function LiveDot({ className }: { className?: string }) {
  return (
    <span className={cn("relative inline-flex size-1.5", className)} aria-hidden>
      <span className="vf-pulse absolute inset-0 rounded-full bg-vf-live" />
    </span>
  );
}

const QUAL_ICON: Record<QualificationStatus, React.ReactNode> = {
  QUALIFIED: <ShieldCheck />,
  RESEARCH_ONLY: <FlaskConical />,
  UNAVAILABLE: <ShieldOff />,
};

/** Mandatory qualification label for any market-level intelligence. */
export function QualificationBadge({
  status,
  size = "md",
  className,
}: {
  status: QualificationStatus;
  size?: "sm" | "md";
  className?: string;
}) {
  const meta = QUALIFICATION_META[status];
  return (
    <Badge tone={meta.tone} size={size} className={className} title={meta.description} data-qualification={status}>
      {QUAL_ICON[status]}
      {meta.short}
    </Badge>
  );
}

/** Match-level display state, incl. the explicit LIVE states. */
export function DisplayStateBadge({
  state,
  size = "sm",
  className,
}: {
  state: MatchDisplayState;
  size?: "sm" | "md";
  className?: string;
}) {
  const meta = DISPLAY_STATE_META[state];
  const isLive = state.startsWith("LIVE_");
  const icon =
    state === "QUALIFIED" ? <ShieldCheck /> : state === "RESEARCH_ONLY" ? <FlaskConical /> : isLive ? <LiveDot /> : <ShieldOff />;
  return (
    <Badge tone={meta.tone} size={size} className={className} title={meta.description} data-display-state={state}>
      {icon}
      {meta.short}
    </Badge>
  );
}

/** Provenance marker. MOCK must always be visible when mock data is rendered. */
export function DataSourceBadge({ source, className }: { source: DataSource; className?: string }) {
  return source === "MOCK" ? (
    <Badge tone="amber" size="sm" className={className} title="Development mock data — not live VF intelligence">
      <Database />
      Mock data
    </Badge>
  ) : (
    <Badge tone="neutral" size="sm" className={className} title="Served by the VF backend">
      <Database />
      VF API
    </Badge>
  );
}
