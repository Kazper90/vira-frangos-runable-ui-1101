import { Info, Radio, Store } from "lucide-react";
import type { DataSource, MatchIntelligence, MatchSummary, QualificationStatus } from "@/contracts";
import { Badge, DataSourceBadge, QualificationBadge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ProbabilityBar } from "@/components/ui/probability-bar";
import { ScoreIndicator } from "@/components/ui/score-indicator";
import { EmptyState, ResearchOnlyNotice, UnavailableState } from "@/components/ui/states";
import {
  MARKET_LABELS,
  QUALIFICATION_META,
  canShowBestPrice,
  canShowDecision,
  canShowVfScore,
  formatOdds,
  hasSuppliedIntelligence,
  isLiveBlocked,
  selectionLabel,
} from "@/lib/intelligence-display";
import { cn } from "@/lib/utils";
import { DecisionChip, probabilitySegments } from "./intel-cards";
import { OddsTable } from "./odds-table";
import { PipelineStrip } from "./pipeline-strip";

export const MATCH_INTELLIGENCE_CHAIN = [
  "VF Model",
  "Probability",
  "Fair Odds",
  "Market Odds",
  "Value Detection",
  "Decision Engine",
  "VF Score",
  "Best Available Price",
] as const;

/**
 * Market panel — routes a single (match, market) contract to the right state:
 *   UNAVAILABLE | LIVE-BLOCKED | RESEARCH_ONLY | QUALIFIED (with / without supplied data).
 */
export function MarketPanel({
  match,
  intel,
  source,
}: {
  match: MatchSummary;
  intel: MatchIntelligence | undefined;
  source: DataSource;
}) {
  if (!intel || intel.qualificationStatus === "UNAVAILABLE") {
    return <UnavailableState body="No VF intelligence is available for this market. Nothing is estimated in its place." />;
  }

  if (isLiveBlocked(match)) {
    return (
      <div className="space-y-4">
        <Card pad="md" className="border-[rgba(255,90,54,0.35)]">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="live">
              <Radio /> Live intelligence unavailable
            </Badge>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-vf-text-3">
            Pre-match status <QualificationBadge status={intel.qualificationStatus} />
          </div>
          <h3 className="vf-display mt-4 text-3xl">Live intelligence unavailable</h3>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-vf-text-2">
            In-play intelligence is not production-authorised for this match. Pre-match values are
            not re-served while the match is live, and no live decision is issued.
          </p>
        </Card>
      </div>
    );
  }

  const research = intel.qualificationStatus === "RESEARCH_ONLY";
  const supplied = hasSuppliedIntelligence(intel);

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_420px] lg:gap-5">
      {/* Decision — first on mobile (intelligence first), right column on desktop */}
      <div className="lg:col-start-2 lg:row-start-1 lg:self-start">
        {research ? <ResearchOnlyNotice /> : <DecisionPanel intel={intel} />}
      </div>

      {/* Chain + numbers */}
      <Card
        tone={research ? "research" : "default"}
        pad="none"
        className="min-w-0 lg:col-start-1 lg:row-span-2 lg:row-start-1"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-vf-line px-5 py-4 md:px-6">
          <div className="min-w-0">
            <div className="vf-eyebrow mb-1">
              {intel.market} · {MARKET_LABELS[intel.market]}
            </div>
            <h3 className="vf-display text-2xl">
              {research ? "Research values" : "Intelligence chain"}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <DataSourceBadge source={source} />
            <QualificationBadge status={intel.qualificationStatus} />
          </div>
        </div>

        <div className="px-5 py-5 md:px-6">
          {!research && <PipelineStrip steps={MATCH_INTELLIGENCE_CHAIN} className="-mx-5 mb-6 px-5 md:mx-0 md:px-0" />}
          {research && (
            <p className="mb-5 flex gap-2 rounded-vf-sm border border-[rgba(255,181,71,0.3)] bg-vf-amber-dim px-3.5 py-2.5 text-[13px] leading-relaxed text-vf-amber">
              <Info className="mt-0.5 size-4 shrink-0" />
              {QUALIFICATION_META.RESEARCH_ONLY.description}
            </p>
          )}

          {supplied ? (
            <>
              <div className="mb-6">
                <div className="vf-eyebrow mb-2.5">VF Probability</div>
                <ProbabilityBar segments={probabilitySegments(intel)} tone={research ? "amber" : "lime"} />
              </div>
              <OddsTable intel={intel} />
            </>
          ) : (
            <EmptyState
              compact
              title="No values supplied"
              body={
                research
                  ? "No research values were supplied for this market."
                  : "The intelligence layer has not supplied values for this market yet."
              }
            />
          )}
        </div>
      </Card>

      {/* Price — strictly after decision; never influences it */}
      {!research && (
        <div className="lg:col-start-2 lg:row-start-2 lg:self-start">
          <BestPriceCard intel={intel} />
        </div>
      )}

      {/* Why */}
      {intel.explanation && intel.explanation.length > 0 && (
        <Card pad="md" className="min-w-0 lg:col-start-1 lg:row-start-3">
          <div className="vf-eyebrow mb-1.5">Why</div>
          <h3 className="vf-display mb-4 text-2xl">Match Intelligence</h3>
          <ul className="space-y-3">
            {intel.explanation.map((line, i) => (
              <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-vf-text-2">
                <span className="vf-num mt-0.5 text-xs text-vf-lime">{String(i + 1).padStart(2, "0")}</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

function DecisionPanel({ intel }: { intel: MatchIntelligence }) {
  const showDecision = canShowDecision(intel);
  const showScore = canShowVfScore(intel);
  return (
    <Card tone={showDecision ? "intelligence" : "default"} pad="md" className="overflow-hidden">
      <div className="vf-eyebrow mb-4">Decision engine</div>
      <div className="flex items-center gap-5">
        <ScoreIndicator score={showScore ? intel.vfScore : undefined} size={116} />
        <div className="min-w-0">
          <div className="vf-eyebrow mb-2">Decision</div>
          {showDecision ? (
            <DecisionChip intel={intel} size="lg" />
          ) : (
            <div className="text-sm text-vf-text-3">No decision supplied.</div>
          )}
          <div className="mt-3 text-xs text-vf-text-3">{intel.market} · production-qualified</div>
        </div>
      </div>
    </Card>
  );
}

function BestPriceCard({ intel }: { intel: MatchIntelligence }) {
  const show = canShowBestPrice(intel);
  const bp = intel.bestAvailablePrice;
  return (
    <Card pad="md">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="vf-eyebrow">Best available price</div>
        <Store className="size-4 text-vf-text-3" aria-hidden />
      </div>
      {show && bp ? (
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <div className="truncate text-[15px] font-semibold">
              {selectionLabel(bp.selection, intel.homeTeam, intel.awayTeam)}
            </div>
            <div className="truncate text-sm text-vf-text-3">{bp.bookmaker}</div>
          </div>
          <div className="vf-num text-3xl font-medium text-vf-text">{formatOdds(bp.odds)}</div>
        </div>
      ) : (
        <div className="text-sm text-vf-text-3">No price shown — no production decision to price.</div>
      )}
      <p className="mt-4 border-t border-vf-line pt-3 text-xs leading-relaxed text-vf-text-3">
        Best odd ≠ value. Bookmaker selection never influences probability, ranking, decision or VF Score.
      </p>
    </Card>
  );
}

/** Small tab adornment showing a market's qualification. */
export function MarketTabDot({ status }: { status: QualificationStatus | undefined }) {
  const s = status ?? "UNAVAILABLE";
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={cn(
          "size-1.5 rounded-full",
          s === "QUALIFIED" && "bg-vf-lime",
          s === "RESEARCH_ONLY" && "bg-vf-amber",
          s === "UNAVAILABLE" && "bg-vf-steel/50",
        )}
        aria-hidden
      />
      <span className="hidden text-[10px] font-medium uppercase tracking-[0.1em] text-vf-text-3 sm:inline">
        {QUALIFICATION_META[s].short}
      </span>
      <span className="sr-only sm:hidden">{QUALIFICATION_META[s].label}</span>
    </span>
  );
}
