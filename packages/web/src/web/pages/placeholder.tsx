import type * as React from "react";
import { ArrowRight, Radio } from "lucide-react";
import { Link } from "wouter";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { navItems, paths } from "@/routes";

/**
 * Functional route placeholder for surfaces scheduled after Phase 1.
 * Keeps the route live and states clearly that the surface is not built yet.
 */
function PhasePlaceholder({
  routeKey,
  title,
  lead,
  identity = "core",
  children,
}: {
  routeKey: string;
  title: string;
  lead: string;
  identity?: "core" | "community" | "jarvis";
  children?: React.ReactNode;
}) {
  const item = navItems.find((n) => n.key === routeKey);
  const Icon = item?.icon;
  return (
    <Container className="py-10 md:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <Badge tone={identity === "community" ? "red" : "lime"}>Phase {item?.phase ?? "—"}</Badge>
          <Badge tone="neutral">Not yet implemented</Badge>
        </div>
        <div className="flex items-center gap-4">
          {Icon && (
            <span
              className={cn(
                "grid size-14 shrink-0 place-items-center rounded-vf-md border",
                identity === "community" ? "border-vf-red-line text-vf-red" : "border-vf-lime-line text-vf-lime",
              )}
            >
              <Icon className="size-6" />
            </span>
          )}
          <h1 className="vf-display text-5xl md:text-7xl">{title}</h1>
        </div>
        <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-vf-text-2">{lead}</p>
        {children && <div className="mt-8">{children}</div>}
        <Button variant="secondary" className="mt-8" asChild>
          <Link to={paths.home}>
            Back to Home <ArrowRight />
          </Link>
        </Button>
      </div>
    </Container>
  );
}

export function MyBetsPage() {
  return (
    <PhasePlaceholder
      routeKey="my-bets"
      title="My Bets"
      lead="Active and past bets, the Decision Journal and performance overview. Performance will only be shown from real recorded bets — never from fabricated data."
    />
  );
}

export function JarvisPage() {
  return (
    <PhasePlaceholder
      routeKey="jarvis"
      identity="jarvis"
      title="JARVIS"
      lead="The VF intelligence layer, conversational. It will surface supplied intelligence — it does not reason scientifically in the browser."
    />
  );
}

export function LivePage() {
  return (
    <PhasePlaceholder
      routeKey="live"
      title="Live"
      lead="Live match tracking. Live intelligence respects qualification and is shown only when authorised upstream."
    >
      <Card pad="md" className="border-[rgba(255,90,54,0.35)]">
        <div className="flex items-center gap-2">
          <Badge tone="live">
            <Radio /> Live
          </Badge>
          <Badge tone="steel">Intelligence unavailable</Badge>
        </div>
        <p className="mt-3 text-sm text-vf-text-2">
          No live market is production-authorised today. When authorised, the UI will show
          LIVE · QUALIFIED or LIVE · RESEARCH ONLY explicitly.
        </p>
      </Card>
    </PhasePlaceholder>
  );
}

export function CommunityPage() {
  return (
    <PhasePlaceholder
      routeKey="community"
      identity="community"
      title="Community"
      lead="Profiles, reputation, XP, Frango Levels, missions, badges, My Picks, leaderboards and Match Rooms. Community opinion is never presented as VF model intelligence."
    />
  );
}

export function PricingPage() {
  return (
    <PhasePlaceholder
      routeKey="pricing"
      title="Pricing"
      lead="Free, Pro and Pro Live tiers. Proposed values only — pricing will be driven from a separate configuration, not hard-coded in components."
    />
  );
}

export function NotFoundPage() {
  return (
    <Container className="py-20 text-center">
      <div className="vf-eyebrow mb-3">404</div>
      <h1 className="vf-display text-6xl">Off the pitch</h1>
      <p className="mt-4 text-vf-text-2">This page doesn't exist.</p>
      <Button className="mt-8" asChild>
        <Link to={paths.home}>Go home</Link>
      </Button>
    </Container>
  );
}
