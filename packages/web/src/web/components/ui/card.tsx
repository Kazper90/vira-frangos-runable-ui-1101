import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva("relative rounded-none border", {
  variants: {
    tone: {
      default: "border-vf-line bg-vf-surface",
      raised: "border-vf-line bg-vf-carbon",
      /** Figma: lime stroke @0.22 on #111 — no glow. */
      intelligence: "border-vf-lime-line bg-vf-surface",
      research: "vf-hatch border-[rgba(255,181,71,0.25)] bg-vf-surface",
      /** Community — red identity, never lime. */
      community: "border-vf-red-line bg-vf-surface",
      ghost: "border-vf-line bg-transparent",
    },
    pad: {
      none: "",
      sm: "p-4",
      md: "p-5 md:p-6",
      lg: "p-6 md:p-8",
    },
  },
  defaultVariants: { tone: "default", pad: "md" },
});

export function Card({
  className,
  tone,
  pad,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof cardVariants>) {
  return <div className={cn(cardVariants({ tone, pad }), className)} {...props} />;
}

export function CardHeader({
  eyebrow,
  title,
  action,
  className,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-4 flex items-start justify-between gap-3", className)}>
      <div className="min-w-0">
        {eyebrow && <div className="vf-eyebrow mb-1.5">{eyebrow}</div>}
        <h3 className="vf-display text-[22px] text-vf-text md:text-[26px]">{title}</h3>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  action,
  className,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-5 flex items-end justify-between gap-4", className)}>
      <div className="min-w-0">
        {eyebrow && <div className="vf-eyebrow mb-2.5 text-vf-lime">{eyebrow}</div>}
        <h2 className="vf-display text-[26px] text-vf-text md:text-[30px] lg:text-[34px]">{title}</h2>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
