import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import type { DataSource, Opportunity } from "@/contracts";
import { QualificationBadge } from "@/components/ui/badge";
import { ProbabilityBar } from "@/components/ui/probability-bar";
import { TeamBadge } from "@/components/ui/team-badge";
import {
  MARKET_SELECTIONS,
  canShowDecision,
  formatKickoff,
  formatOdds,
  formatValue,
  selectionLabel,
  selectionTag,
} from "@/lib/intelligence-display";
import { cn } from "@/lib/utils";
import { paths } from "@/routes";
import { DecisionChip, probabilitySegments } from "./intel-cards";

/**
 * Match intelligence card — visual structure from Figma (frame 1:6 › TodayMatches › MatchCard):
 * header strip (competition · kickoff), team row, VF Probability panel with 2px bars, odds
 * panel, value chip, VF Decision row, "Analysis →" and a provenance footer.
 *
 * Every number is rendered verbatim from the upstream contract. Deliberate deviations from
 * the Figma frame (see design.md):
 *  - Figma's "Market Probability" panel is replaced by Fair vs Market ODDS: the contract
 *    carries no market-implied probability and the UI must not derive one (1/odds).
 *  - Figma's "High / Medium / Low" confidence chip is omitted: no confidence field exists in
 *    the contract (proposed UI requirement, pending governance).
 *  - The value chip shows only the value of the upstream decisionSelection, and only when a
 *    decision may be shown (QUALIFIED). The UI never picks a selection itself.
 */
export function MatchIntelCard({ opp, source }: { opp: Opportunity; source: DataSource }) {
  const { match, intelligence: intel } = opp;
  const k = formatKickoff(match.kickoff);
  const keys = MARKET_SELECTIONS[intel.market];
  const showDecision = canShowDecision(intel);
  const sel = showDecision ? intel.decisionSelection : undefined;
  const selValue = sel ? formatValue(intel.value[sel]) : null;

  return (
    <article className="flex min-w-0 flex-col border border-vf-line bg-vf-surface" data-match-id={match.matchId}>
      {/* Header strip */}
      <div className="flex items-center justify-between gap-3 border-b border-vf-line bg-vf-carbon px-[18px] py-[9px]">
        <span className="vf-num min-w-0 truncate text-[10px] uppercase tracking-[0.06em] text-vf-text-4">
          {match.competition.name}
        </span>
        <span className="flex shrink-0 items-center gap-2">
          <span className="vf-num text-[10px] text-vf-text-3">
            {k.day} · {k.time}
          </span>
        </span>
      </div>

      {/* Teams */}
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 px-[18px] py-[18px]">
        <div className="flex min-w-0 items-center gap-2.5">
          <TeamBadge team={match.homeTeam} size={34} />
          <span className="vf-display min-w-0 truncate text-[17px] text-vf-text">{match.homeTeam.shortName}</span>
        </div>
        <span className="vf-num px-2 text-[10px] text-vf-text-4">vs</span>
        <div className="flex min-w-0 flex-row-reverse items-center gap-2.5 text-right">
          <TeamBadge team={match.awayTeam} size={34} />
          <span className="vf-display min-w-0 truncate text-[17px] text-vf-text">{match.awayTeam.shortName}</span>
        </div>
      </div>

      {/* Panels */}
      <div className="grid grid-cols-2 border-y border-vf-line">
        <div className="min-w-0 border-r border-vf-line bg-vf-carbon p-[13px]">
          <div className="vf-num text-[9px] uppercase tracking-[0.08em] text-vf-lime">VF Probability · {intel.market}</div>
          <ProbabilityBar
            className="mt-2.5 gap-2"
            tone={intel.qualificationStatus === "QUALIFIED" ? "lime" : "amber"}
            segments={probabilitySegments(intel).map((s) => ({ ...s, label: selectionTag(s.key) }))}
          />
        </div>
        <div className="min-w-0 bg-vf-carbon p-[13px]">
          <div className="grid grid-cols-[auto_1fr_1fr] items-baseline gap-x-2 gap-y-1">
            <span />
            <span className="vf-num text-right text-[9px] uppercase tracking-[0.08em] text-vf-lime">Fair</span>
            <span className="vf-num text-right text-[9px] uppercase tracking-[0.08em] text-vf-text-4">Market</span>
            {keys.map((key) => (
              <OddsLine
                key={key}
                tag={selectionTag(key)}
                fair={formatOdds(intel.fairOdds[key])}
                market={formatOdds(intel.marketOdds[key])}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Chips + decision */}
      <div className="flex flex-1 flex-col gap-3 px-[18px] pt-3.5 pb-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <QualificationBadge status={intel.qualificationStatus} size="sm" />
          {selValue && (
            <span className="vf-num inline-flex h-5 items-center rounded-vf-xs bg-vf-lime-dim px-2 text-[10px] font-medium text-vf-lime">
              {selValue} Value
            </span>
          )}
        </div>

        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <div className="vf-num mb-1.5 text-[9px] uppercase tracking-[0.08em] text-vf-text-4">VF Decision</div>
            {showDecision ? (
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <DecisionChip intel={intel} />
                {sel && (
                  <span className="truncate text-[12px] text-vf-text-2">
                    {selectionLabel(sel, intel.homeTeam, intel.awayTeam)}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-[12px] text-vf-text-3">No decision supplied</span>
            )}
          </div>
          <Link
            to={paths.match(match.matchId)}
            className="inline-flex h-[33px] shrink-0 items-center gap-1.5 rounded-vf-xs border border-vf-lime-line px-[15px] text-[11px] font-medium text-vf-lime transition-colors hover:bg-vf-lime-dim"
            aria-label={`Analysis — ${match.homeTeam.name} vs ${match.awayTeam.name}`}
          >
            Analysis <ArrowRight className="size-3" aria-hidden />
          </Link>
        </div>
      </div>

      {/* Provenance footer (Figma: "Sample data — illustrative prototype, not live predictions") */}
      <div
        className={cn(
          "flex items-center gap-1.5 border-t border-vf-line px-[18px] py-2 text-[11px]",
          source === "MOCK" ? "text-vf-amber/80" : "text-vf-text-4",
        )}
      >
        <span aria-hidden>○</span>
        {source === "MOCK" ? "Mock data — development fixtures, not live predictions" : "VF API · upstream intelligence"}
      </div>
    </article>
  );
}

function OddsLine({ tag, fair, market }: { tag: string; fair: string | null; market: string | null }) {
  return (
    <>
      <span className="vf-num text-[10px] text-vf-text-4">{tag}</span>
      <span className={cn("vf-num text-right text-[12px]", fair ? "text-vf-lime" : "text-vf-text-3")}>{fair ?? "—"}</span>
      <span className={cn("vf-num text-right text-[12px]", market ? "text-vf-text-2" : "text-vf-text-3")}>{market ?? "—"}</span>
    </>
  );
}
