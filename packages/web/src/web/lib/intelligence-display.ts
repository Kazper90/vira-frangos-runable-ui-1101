/**
 * PRESENTATION-ONLY helpers for VF intelligence.
 *
 * Rules enforced here (and covered by tests):
 *  - Values are formatted, never computed. A missing value returns null — no 0 / 0.5 fallback.
 *  - Value tone is derived from the SIGN of the supplied value only.
 *  - Decisions and VF Score are exposed only for QUALIFIED markets.
 *  - Live matches are production intelligence only when explicitly authorised upstream.
 */
import type {
  MarketCode,
  MatchIntelligence,
  MatchSummary,
  QualificationStatus,
  SelectionKey,
  SelectionMap,
  Team,
} from "@/contracts";

/* ---------- Formatting (no arithmetic on scientific meaning) ---------- */

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

export function formatProbability(p: number | undefined): string | null {
  return isNum(p) ? `${(p * 100).toFixed(1)}%` : null;
}

export function formatOdds(o: number | undefined): string | null {
  return isNum(o) ? o.toFixed(2) : null;
}

export function formatValue(v: number | undefined): string | null {
  if (!isNum(v)) return null;
  const pct = (v * 100).toFixed(1);
  return `${v > 0 ? "+" : ""}${pct}%`;
}

export type ValueTone = "positive" | "negative" | "neutral" | "none";

export function valueTone(v: number | undefined): ValueTone {
  if (!isNum(v)) return "none";
  if (v > 0) return "positive";
  if (v < 0) return "negative";
  return "neutral";
}

/* ---------- Market structure ---------- */

export const MARKET_SELECTIONS: Record<MarketCode, SelectionKey[]> = {
  "1X2": ["home", "draw", "away"],
  "O2.5": ["over25"],
  BTTS: ["bttsYes"],
};

export const MARKET_LABELS: Record<MarketCode, string> = {
  "1X2": "Match Result",
  "O2.5": "Over 2.5 Goals",
  BTTS: "Both Teams To Score",
};

export function selectionLabel(key: SelectionKey, home: Team, away: Team): string {
  switch (key) {
    case "home":
      return home.shortName;
    case "away":
      return away.shortName;
    case "draw":
      return "Draw";
    case "over25":
      return "Over 2.5";
    case "bttsYes":
      return "BTTS — Yes";
  }
}

export function selectionTag(key: SelectionKey): string {
  return { home: "1", draw: "X", away: "2", over25: "O2.5", bttsYes: "YES" }[key];
}

export function hasAnySuppliedValue(m: SelectionMap): boolean {
  return Object.values(m).some(isNum);
}

export function hasSuppliedIntelligence(mi: MatchIntelligence): boolean {
  return [mi.probability, mi.fairOdds, mi.marketOdds, mi.value].some(hasAnySuppliedValue);
}

/* ---------- Qualification gates ---------- */

export function isProductionQualified(status: QualificationStatus | undefined): boolean {
  return status === "QUALIFIED";
}

/** Decision is production output — only rendered for QUALIFIED markets. */
export function canShowDecision(mi: MatchIntelligence): boolean {
  return isProductionQualified(mi.qualificationStatus) && typeof mi.decision === "string" && mi.decision.length > 0;
}

/** VF Score is production output — only rendered for QUALIFIED markets. */
export function canShowVfScore(mi: MatchIntelligence): boolean {
  return isProductionQualified(mi.qualificationStatus) && isNum(mi.vfScore);
}

/** Best price is only meaningful alongside a production decision. */
export function canShowBestPrice(mi: MatchIntelligence): boolean {
  return canShowDecision(mi) && !!mi.bestAvailablePrice && isNum(mi.bestAvailablePrice.odds);
}

/**
 * A LIVE match without explicit upstream authorisation must not surface any
 * production intelligence (pre-match values are not re-served in-play).
 */
export function isLiveBlocked(match: MatchSummary): boolean {
  return match.status === "LIVE" && match.liveIntelligenceAuthorized !== true;
}

export type MatchDisplayState =
  | "QUALIFIED"
  | "RESEARCH_ONLY"
  | "UNAVAILABLE"
  | "LIVE_QUALIFIED"
  | "LIVE_RESEARCH_ONLY"
  | "LIVE_UNAVAILABLE"
  | "FINISHED";

/**
 * Display state for a match row, for a given market (default 1X2).
 * LIVE states (brief §8 "LIVE / NOT QUALIFIED", §16 explicit labels):
 *  - LIVE_QUALIFIED      — live intelligence authorised upstream AND market QUALIFIED
 *  - LIVE_RESEARCH_ONLY  — live authorised, market RESEARCH_ONLY (no decision issued)
 *  - LIVE_UNAVAILABLE    — anything else (not authorised, or market unavailable)
 */
export function getMatchDisplayState(match: MatchSummary, market: MarketCode = "1X2"): MatchDisplayState {
  const status = match.markets[market] ?? "UNAVAILABLE";
  if (match.status === "FINISHED") return "FINISHED";
  if (match.status === "LIVE") {
    if (match.liveIntelligenceAuthorized !== true) return "LIVE_UNAVAILABLE";
    if (status === "QUALIFIED") return "LIVE_QUALIFIED";
    if (status === "RESEARCH_ONLY") return "LIVE_RESEARCH_ONLY";
    return "LIVE_UNAVAILABLE";
  }
  if (match.status === "POSTPONED") return "UNAVAILABLE";
  return status;
}

export interface StatusMeta {
  label: string;
  short: string;
  tone: "lime" | "amber" | "steel" | "live";
  description: string;
}

export const QUALIFICATION_META: Record<QualificationStatus, StatusMeta> = {
  QUALIFIED: {
    label: "Qualified",
    short: "QUALIFIED",
    tone: "lime",
    description: "Production-authorised VF intelligence.",
  },
  RESEARCH_ONLY: {
    label: "Research only",
    short: "RESEARCH ONLY",
    tone: "amber",
    description: "Not production intelligence. Shown for research transparency only — no decision is issued.",
  },
  UNAVAILABLE: {
    label: "Unavailable",
    short: "UNAVAILABLE",
    tone: "steel",
    description: "No VF intelligence is available for this market.",
  },
};

export const DISPLAY_STATE_META: Record<MatchDisplayState, StatusMeta> = {
  QUALIFIED: QUALIFICATION_META.QUALIFIED,
  RESEARCH_ONLY: QUALIFICATION_META.RESEARCH_ONLY,
  UNAVAILABLE: QUALIFICATION_META.UNAVAILABLE,
  LIVE_QUALIFIED: {
    label: "Live · Qualified",
    short: "LIVE · QUALIFIED",
    tone: "live",
    description: "Live intelligence authorised upstream.",
  },
  LIVE_RESEARCH_ONLY: {
    label: "Live · Research only",
    short: "LIVE · RESEARCH ONLY",
    tone: "amber",
    description: "Live, but this market is research only. No decision, score or price is issued.",
  },
  LIVE_UNAVAILABLE: {
    label: "Live intelligence unavailable",
    short: "LIVE INTELLIGENCE UNAVAILABLE",
    tone: "live",
    description: "In-play intelligence is not production-authorised upstream.",
  },
  FINISHED: {
    label: "Finished",
    short: "FT",
    tone: "steel",
    description: "Match finished.",
  },
};

/* ---------- Time ---------- */

export function formatKickoff(iso: string, locale = "en-GB"): { day: string; time: string } {
  const d = new Date(iso);
  return {
    day: d.toLocaleDateString(locale, { weekday: "short", day: "2-digit", month: "short" }),
    time: d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" }),
  };
}
