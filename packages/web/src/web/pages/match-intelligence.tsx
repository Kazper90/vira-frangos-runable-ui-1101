import * as React from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "wouter";
import type { MarketCode } from "@/contracts";
import { isServiceError } from "@/contracts";
import { Container } from "@/components/layout/container";
import { MarketPanel, MarketTabDot } from "@/components/intelligence/market-panel";
import { DataSourceBadge, DisplayStateBadge, LiveDot } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TeamBadge } from "@/components/ui/team-badge";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/states";
import { Tabs, tabPanelProps } from "@/components/ui/tabs";
import { formatKickoff, getMatchDisplayState } from "@/lib/intelligence-display";
import { useMatchIntelligence } from "@/hooks/use-intelligence";
import { paths } from "@/routes";

const MARKETS: MarketCode[] = ["1X2", "O2.5", "BTTS"];

export default function MatchIntelligencePage() {
  const { id = "" } = useParams<{ id: string }>();
  const q = useMatchIntelligence(id);
  const [market, setMarket] = React.useState<MarketCode>("1X2");

  if (q.isLoading) return <MatchSkeleton />;

  if (q.isError) {
    const notFound = isServiceError(q.error) && q.error.kind === "NOT_FOUND";
    return (
      <Container className="py-12">
        <BackLink />
        {notFound ? (
          <EmptyState
            title="Match not found"
            body="This match is not in the VF intelligence feed."
            action={
              <Button variant="secondary" size="sm" asChild>
                <Link to={paths.matches}>Back to matches</Link>
              </Button>
            }
          />
        ) : (
          <ErrorState error={q.error} onRetry={() => q.refetch()} />
        )}
      </Container>
    );
  }

  if (!q.data) return null;

  const { match, markets } = q.data.data;
  const source = q.data.meta.source;
  // Header status follows the active market tab, so a RESEARCH ONLY tab never sits under a QUALIFIED badge.
  const state = getMatchDisplayState(match, market);
  const k = formatKickoff(match.kickoff);
  const intel = markets.find((m) => m.market === market);
  const isLive = match.status === "LIVE";

  return (
    <>
      {/* MATCH HEADER */}
      {/* Figma design system: flat black surfaces, no glows/grid (frame 1:6). Match Intelligence
          frame itself was not inspectable — layout unchanged. */}
      <section className="relative overflow-hidden border-b border-vf-line bg-vf-ink">
        <Container className="relative py-6 md:py-10">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <BackLink />
            <div className="flex flex-wrap items-center gap-2">
              <DataSourceBadge source={source} />
              <span className="vf-num text-[11px] font-semibold text-vf-text-3">{market}</span>
              <DisplayStateBadge state={state} size="md" />
            </div>
          </div>

          <div className="vf-eyebrow mb-5 text-center md:mb-8">
            {match.competition.name} · {k.day} · {k.time}
          </div>

          <div className="vf-rise grid grid-cols-[1fr_auto_1fr] items-center gap-3 md:gap-10">
            <div className="flex min-w-0 flex-col items-center gap-3 text-center md:flex-row md:justify-end md:gap-5 md:text-right">
              <span className="vf-display order-2 min-w-0 max-w-full text-[28px] break-words sm:text-4xl md:order-1 md:text-6xl xl:text-7xl">
                {match.homeTeam.shortName}
              </span>
              <TeamBadge team={match.homeTeam} size={64} className="order-1 md:order-2 md:size-[84px]!" />
            </div>

            <div className="flex flex-col items-center">
              {isLive && match.score ? (
                <>
                  <span className="vf-num text-3xl font-semibold md:text-5xl">
                    {match.score.home}–{match.score.away}
                  </span>
                  <span className="vf-num mt-1 flex items-center gap-1.5 text-xs text-vf-live">
                    <LiveDot /> {match.score.minute ?? "—"}'
                  </span>
                </>
              ) : (
                <span className="vf-display text-2xl text-vf-text-3 md:text-4xl">vs</span>
              )}
            </div>

            <div className="flex min-w-0 flex-col items-center gap-3 text-center md:flex-row md:gap-5 md:text-left">
              <TeamBadge team={match.awayTeam} size={64} className="md:size-[84px]!" />
              <span className="vf-display min-w-0 max-w-full text-[28px] break-words sm:text-4xl md:text-6xl xl:text-7xl">
                {match.awayTeam.shortName}
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* MARKETS */}
      <Container className="py-6 md:py-10">
        <div className="mb-5 flex flex-col gap-3 md:mb-6 md:flex-row md:items-center md:justify-between">
          <h2 className="vf-display text-[28px] md:text-4xl">Match Intelligence</h2>
          <Tabs
            idBase="vf-market"
            ariaLabel="Market"
            value={market}
            onChange={setMarket}
            className="md:w-[460px]"
            items={MARKETS.map((m) => ({
              key: m,
              label: m,
              adornment: <MarketTabDot status={match.markets[m] ?? markets.find((x) => x.market === m)?.qualificationStatus} />,
            }))}
          />
        </div>

        <div {...tabPanelProps("vf-market", market)} className="outline-none" key={market}>
          <MarketPanel match={match} intel={intel} source={source} />
        </div>
      </Container>
    </>
  );
}

function BackLink() {
  return (
    <Link to={paths.matches} className="inline-flex items-center gap-1.5 text-sm font-semibold text-vf-text-2 hover:text-vf-text">
      <ArrowLeft className="size-4" /> Matches
    </Link>
  );
}

function MatchSkeleton() {
  return (
    <div aria-live="polite" aria-busy="true">
      <span className="sr-only">Loading match intelligence…</span>
      <div className="border-b border-vf-line">
        <Container className="py-10">
          <Skeleton className="mx-auto mb-8 h-4 w-56" />
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6">
            <Skeleton className="h-20" />
            <Skeleton className="size-12 rounded-full" />
            <Skeleton className="h-20" />
          </div>
        </Container>
      </div>
      <Container className="grid gap-5 py-10 lg:grid-cols-[1fr_400px]">
        <Skeleton className="h-[420px] rounded-vf-lg" />
        <Skeleton className="h-[220px] rounded-vf-lg" />
      </Container>
    </div>
  );
}
