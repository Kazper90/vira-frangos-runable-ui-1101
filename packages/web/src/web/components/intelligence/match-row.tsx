import { ChevronRight } from "lucide-react";
import { Link } from "wouter";
import type { MarketCode, MatchSummary, QualificationStatus } from "@/contracts";
import { DisplayStateBadge, LiveDot } from "@/components/ui/badge";
import { TeamBadge } from "@/components/ui/team-badge";
import { QUALIFICATION_META, formatKickoff, getMatchDisplayState } from "@/lib/intelligence-display";
import { cn } from "@/lib/utils";
import { paths } from "@/routes";

const MARKET_ORDER: MarketCode[] = ["1X2", "O2.5", "BTTS"];

/**
 * Match row — list item for Home / Matches. Shows match identity, kickoff or live score,
 * the match-level display state, and per-market qualification on wider screens.
 */
export function MatchRow({ match, className }: { match: MatchSummary; className?: string }) {
  const state = getMatchDisplayState(match);
  const k = formatKickoff(match.kickoff);
  const isLive = match.status === "LIVE";

  return (
    <Link
      to={paths.match(match.matchId)}
      className={cn(
        "group grid grid-cols-[1fr_auto] items-center gap-3 rounded-vf-md border border-vf-line bg-vf-surface px-4 py-3.5 transition-colors duration-200 hover:border-vf-line-strong hover:bg-vf-raised md:grid-cols-[96px_1fr_auto_auto] md:gap-5 md:px-5",
        className,
      )}
      data-match-id={match.matchId}
    >
      {/* Time / live — desktop column */}
      <div className="hidden md:block">
        {isLive ? (
          <div className="flex items-center gap-1.5 text-vf-live">
            <LiveDot />
            <span className="vf-num text-sm font-semibold">{match.score?.minute ?? "—"}'</span>
          </div>
        ) : (
          <>
            <div className="vf-num text-sm text-vf-text">{k.time}</div>
            <div className="text-xs text-vf-text-3">{k.day}</div>
          </>
        )}
      </div>

      {/* Teams */}
      <div className="min-w-0">
        <div className="mb-2 flex items-center gap-2 md:hidden">
          <span className="vf-eyebrow">{match.competition.shortName}</span>
          <span className="text-vf-text-3">·</span>
          {isLive ? (
            <span className="vf-num flex items-center gap-1 text-[11px] text-vf-live">
              <LiveDot /> {match.score?.minute ?? "—"}'
            </span>
          ) : (
            <span className="vf-num text-[11px] text-vf-text-3">
              {k.day} · {k.time}
            </span>
          )}
        </div>
        <TeamLine team={match.homeTeam} score={match.score?.home} />
        <TeamLine team={match.awayTeam} score={match.score?.away} className="mt-1.5" />
        <div className="vf-eyebrow mt-2 hidden md:block">{match.competition.name}</div>
      </div>

      {/* Market qualification — desktop */}
      <div className="hidden items-center gap-3 lg:flex" aria-label="Market qualification">
        {MARKET_ORDER.map((m) => {
          const s = match.markets[m];
          return s ? <MarketStatusChip key={m} market={m} status={s} /> : null;
        })}
      </div>

      <div className="flex items-center gap-2">
        <DisplayStateBadge state={state} />
        <ChevronRight className="size-4 text-vf-text-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-vf-lime" aria-hidden />
      </div>
    </Link>
  );
}

function TeamLine({ team, score, className }: { team: MatchSummary["homeTeam"]; score?: number; className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <TeamBadge team={team} size={22} />
      <span className="min-w-0 flex-1 truncate text-[15px] font-semibold text-vf-text">{team.shortName}</span>
      {typeof score === "number" && <span className="vf-num text-[15px] font-semibold text-vf-text">{score}</span>}
    </div>
  );
}

const DOT: Record<QualificationStatus, string> = {
  QUALIFIED: "bg-vf-lime",
  RESEARCH_ONLY: "bg-vf-amber",
  UNAVAILABLE: "bg-vf-steel/50",
};

export function MarketStatusChip({ market, status }: { market: MarketCode; status: QualificationStatus }) {
  return (
    <span
      className="vf-num inline-flex items-center gap-1.5 text-[11px] text-vf-text-2"
      title={`${market}: ${QUALIFICATION_META[status].label}`}
      data-qualification={status}
    >
      <span className={cn("size-1.5 rounded-full", DOT[status])} aria-hidden />
      {market}
      <span className="sr-only">{QUALIFICATION_META[status].label}</span>
    </span>
  );
}
