import type * as React from "react";
import { AlertTriangle, FlaskConical, Inbox, PlugZap, RotateCw, ShieldOff } from "lucide-react";
import { isServiceError } from "@/contracts";
import { cn } from "@/lib/utils";
import { Button } from "./button";

function StateFrame({
  icon,
  title,
  body,
  action,
  tone = "neutral",
  className,
  compact,
}: {
  icon: React.ReactNode;
  title: React.ReactNode;
  body?: React.ReactNode;
  action?: React.ReactNode;
  tone?: "neutral" | "amber" | "steel" | "error";
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center rounded-vf-lg border border-dashed text-center",
        compact ? "gap-2 px-4 py-6" : "gap-3 px-6 py-12",
        tone === "neutral" && "border-vf-line-strong",
        tone === "amber" && "vf-hatch border-[rgba(255,181,71,0.3)]",
        tone === "steel" && "border-vf-line-strong bg-vf-steel-dim/30",
        tone === "error" && "border-[rgba(255,122,122,0.35)] bg-[rgba(255,122,122,0.04)]",
        className,
      )}
    >
      <div
        className={cn(
          "grid size-11 place-items-center rounded-full border",
          tone === "amber" ? "border-[rgba(255,181,71,0.4)] text-vf-amber" : tone === "error" ? "border-[rgba(255,122,122,0.4)] text-vf-negative" : "border-vf-line-strong text-vf-text-2",
        )}
      >
        {icon}
      </div>
      <div className="vf-display text-xl text-vf-text">{title}</div>
      {body && <p className="max-w-sm text-sm leading-relaxed text-vf-text-2">{body}</p>}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}

export function EmptyState(props: { title?: string; body?: React.ReactNode; action?: React.ReactNode; className?: string; compact?: boolean }) {
  return <StateFrame icon={<Inbox className="size-5" />} title={props.title ?? "Nothing here yet"} {...props} />;
}

export function UnavailableState(props: { title?: string; body?: React.ReactNode; className?: string; compact?: boolean }) {
  return (
    <StateFrame
      tone="steel"
      icon={<ShieldOff className="size-5" />}
      title={props.title ?? "Intelligence unavailable"}
      body={props.body ?? "VF intelligence is not available for this selection. Nothing is shown rather than an unqualified estimate."}
      className={props.className}
      compact={props.compact}
    />
  );
}

export function ResearchOnlyNotice({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <StateFrame
      tone="amber"
      compact={compact}
      className={className}
      icon={<FlaskConical className="size-5" />}
      title="Research only"
      body="This market is not production-qualified. No decision, VF Score, or price recommendation is issued."
    />
  );
}

export function ErrorState({
  error,
  onRetry,
  className,
  compact,
}: {
  error?: unknown;
  onRetry?: () => void;
  className?: string;
  compact?: boolean;
}) {
  if (isServiceError(error) && error.kind === "NOT_CONNECTED") {
    return (
      <StateFrame
        tone="steel"
        compact={compact}
        className={className}
        icon={<PlugZap className="size-5" />}
        title="Backend not connected"
        body="The VF intelligence API adapter is not connected yet. No data is shown."
      />
    );
  }
  if (isServiceError(error) && error.kind === "UNAVAILABLE") {
    return <UnavailableState className={className} compact={compact} />;
  }
  return (
    <StateFrame
      tone="error"
      compact={compact}
      className={className}
      icon={<AlertTriangle className="size-5" />}
      title="Something went wrong"
      body={error instanceof Error ? error.message : "The request failed."}
      action={
        onRetry && (
          <Button variant="secondary" size="sm" onClick={onRetry}>
            <RotateCw /> Retry
          </Button>
        )
      }
    />
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("vf-skeleton rounded-vf-sm", className)} aria-hidden />;
}

export function LoadingState({ label = "Loading intelligence", rows = 3, className }: { label?: string; rows?: number; className?: string }) {
  return (
    <div className={cn("space-y-3", className)} aria-live="polite" aria-busy="true">
      <span className="sr-only">{label}…</span>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  );
}
