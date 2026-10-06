import { ArrowUpRight, FlaskConical } from "lucide-react";
import { Link } from "wouter";
import type { MatchIntelligence, Opportunity, ScientificStatus } from "@/contracts";
import { Badge, DataSourceBadge, QualificationBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProbabilityBar } from "@/components/ui/probability-bar";
import { ScoreIndicator } from "@/components/ui/score-indicator";
import { TeamBadge, TeamLockup } from "@/components/ui/team-badge";
import { ValueIndicator } from "@/components/ui/value-indicator";
import type { DataSource } from "@/contracts";
import {
  MARKET_SELECTIONS,
  canShowDecision,
  canShowVfScore,
  formatKickoff,
  selectionLabel,
  selectionTag,
} from "@/lib/intelligence-display";
import { cn } from "@/lib/utils";
import { paths } from "@/routes";

export function probabilitySegments(intel: MatchIntelligence) {
  return MARKET_SELECTIONS[intel.market].map((k) => ({
    key: k,
    label: selectionLabel(k, intel.homeTeam, intel.awayTeam),
    probability: intel.probability[k],
    // Highlight only the selection named upstream, and only when a decision may be shown.
    highlight: canShowDecision(intel) && intel.decisionSelection === k,
  }));
}

/** Decision chip — only rendered when the market is QUALIFIED (gate in canShowDecision). */
export function DecisionChip({ intel, size = "md" }: { intel: MatchIntelligence; size?: "md" | "lg" }) {
  if (!canShowDecision(intel)) return null;
  return (
    <span
      className={cn(
        // Figma "VF DECISION" chip: solid lime, #0A0A0A text, near-square.
        "inline-flex items-center rounded-vf-xs bg-vf-lime text-vf-lime-ink",
        size === "md" && "h-[26px] px-2.5 text-[12px] font-bold tracking-[0.02em] uppercase",
        size === "lg" && "vf-display h-11 px-4 text-[26px]",
      )}
      data-decision
    >
      {intel.decision}
    </span>
  );
}

/* ---------- Featured intelligence (Home hero) ---------- */

export function FeaturedIntelligenceCard({ opp, source }: { opp: Opportunity; source: DataSource }) {
  const { match, intelligence: intel } = opp;
  const k = formatKickoff(match.kickoff);
  return (
    <Card tone="intelligence" pad="none" className="overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-vf-line px-5 py-3.5 md:px-6">
        <div className="vf-eyebrow truncate">
          Featured · {match.competition.shortName} · {k.day} {k.time}
        </div>
        <div className="flex items-center gap-2">
          <DataSourceBadge source={source} className="hidden sm:inline-flex" />
          <QualificationBadge status={intel.qualificationStatus} size="sm" />
        </div>
      </div>

      <div className="px-5 pt-6 pb-5 md:px-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 flex-col items-start gap-3">
            <TeamBadge team={match.homeTeam} size={52} />
            <span className="vf-display max-w-full truncate text-[26px] md:text-[30px]">{match.homeTeam.shortName}</span>
          </div>
          <span className="vf-display text-xl text-vf-text-3">vs</span>
          <div className="flex min-w-0 flex-1 flex-col items-end gap-3 text-right">
            <TeamBadge team={match.awayTeam} size={52} />
            <span className="vf-display max-w-full truncate text-[26px] md:text-[30px]">{match.awayTeam.shortName}</span>
          </div>
        </div>

        <div className="mt-6">
          <div className="vf-eyebrow mb-2.5">VF Probability · {intel.market}</div>
          <ProbabilityBar segments={probabilitySegments(intel)} />
        </div>
      </div>

      <div className="grid grid-cols-[auto_1fr] items-center gap-5 border-t border-vf-line bg-vf-carbon/60 px-5 py-5 md:px-6">
        {canShowVfScore(intel) ? <ScoreIndicator score={intel.vfScore} size={92} /> : <ScoreIndicator score={undefined} size={92} />}
        <div className="min-w-0">
          <div className="vf-eyebrow mb-2">Decision</div>
          <DecisionChip intel={intel} />
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
            {MARKET_SELECTIONS[intel.market].map((s) => (
              <span key={s} className="flex items-center gap-1.5 text-xs text-vf-text-3">
                <span className="vf-num">{selectionTag(s)}</span>
                <ValueIndicator value={intel.value[s]} size="sm" />
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 md:px-6">
        <Button size="lg" className="w-full" asChild>
          <Link to={paths.match(match.matchId)}>
            Open Match Intelligence <ArrowUpRight />
          </Link>
        </Button>
      </div>
    </Card>
  );
}

/* ---------- Opportunity card (upstream-ranked) ---------- */

export function OpportunityCard({ opp }: { opp: Opportunity }) {
  const { match, intelligence: intel } = opp;
  const k = formatKickoff(match.kickoff);
  return (
    <Link
      to={paths.match(match.matchId)}
      className="group block rounded-vf-lg border border-vf-line bg-vf-surface p-5 transition-[border,background] duration-200 hover:border-vf-lime-line hover:bg-vf-raised"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="vf-num text-[11px] text-vf-text-3">
          #{String(opp.rank).padStart(2, "0")} · {match.competition.shortName} · {k.day}
        </span>
        <QualificationBadge status={intel.qualificationStatus} size="sm" />
      </div>
      <div className="space-y-2.5">
        <TeamLockup team={match.homeTeam} size="sm" />
        <TeamLockup team={match.awayTeam} size="sm" />
      </div>
      <div className="mt-5 flex items-end justify-between gap-3 border-t border-vf-line pt-4">
        <div className="min-w-0">
          <div className="vf-eyebrow mb-1.5">Decision · {intel.market}</div>
          <DecisionChip intel={intel} />
        </div>
        {canShowVfScore(intel) && <ScoreIndicator score={intel.vfScore} size={64} label="Score" />}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {MARKET_SELECTIONS[intel.market].map((s) => (
          <div key={s} className="rounded-vf-sm border border-vf-line bg-vf-carbon/60 px-2.5 py-2">
            <div className="vf-num text-[10px] text-vf-text-3">{selectionTag(s)} · value</div>
            <ValueIndicator value={intel.value[s]} size="sm" />
          </div>
        ))}
      </div>
    </Link>
  );
}

/* ---------- Scientific status (governance-supplied) ---------- */

export function ScientificStatusPanel({ status, source }: { status: ScientificStatus; source: DataSource }) {
  return (
    <Card pad="md">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <div className="vf-eyebrow mb-1.5">Scientific status</div>
          <h3 className="vf-display text-2xl">What VF covers</h3>
        </div>
        <DataSourceBadge source={source} />
      </div>
      <div className="vf-eyebrow mb-2">Competitions</div>
      <div className="mb-5 flex flex-wrap gap-2">
        {status.competitions.map((c) => (
          <Badge key={c.id} tone="neutral">
            {c.name}
          </Badge>
        ))}
      </div>
      <div className="vf-eyebrow mb-2">Markets</div>
      <ul className="divide-y divide-vf-line rounded-vf-md border border-vf-line">
        {status.markets.map((m) => (
          <li key={m.market} className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <div className="vf-num text-sm text-vf-text">{m.market}</div>
              <div className="truncate text-xs text-vf-text-3">{m.label}</div>
            </div>
            <QualificationBadge status={m.status} size="sm" />
          </li>
        ))}
      </ul>
      <p className="mt-4 flex gap-2 text-xs leading-relaxed text-vf-text-3">
        <FlaskConical className="mt-0.5 size-3.5 shrink-0 text-vf-amber" />
        Research-only markets are shown for transparency and never issue a decision.
        Status is set by VF governance ({status.modelVersion}).
      </p>
    </Card>
  );
}
