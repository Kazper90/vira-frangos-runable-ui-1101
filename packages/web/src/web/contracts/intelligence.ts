/**
 * VF API/UI CONTRACTS — Experience Layer.
 *
 * These types describe the shape the UI CONSUMES from the VF intelligence backend.
 * They are NOT a scientific specification. Every numeric value here is produced
 * upstream (VF model / M3.0 governed pipeline) and rendered verbatim by the UI.
 *
 * The frontend must never compute, infer, default, or fall back any of these values.
 * A missing value is rendered as "not supplied" — never as 0, 0.5, or a derived number.
 *
 * Fields marked [UI-EXT] are presentation extensions requested by the Experience Layer
 * and are pending governance confirmation before the real backend contract is frozen.
 */

export type MarketCode = "1X2" | "O2.5" | "BTTS";

export type QualificationStatus = "QUALIFIED" | "RESEARCH_ONLY" | "UNAVAILABLE";

export type MatchStatus = "SCHEDULED" | "LIVE" | "FINISHED" | "POSTPONED";

/** Keys of the per-selection maps in the contract. */
export type SelectionKey = "home" | "draw" | "away" | "over25" | "bttsYes";

export type SelectionMap = Partial<Record<SelectionKey, number>>;

export interface Team {
  id: string;
  name: string;
  shortName: string;
  /** 3-letter code used by the team badge. */
  code: string;
  /** [UI-EXT] Optional brand colour for the badge chip. Purely cosmetic. */
  color?: string;
}

export interface Competition {
  id: string;
  name: string;
  shortName: string;
  country: string;
}

/** Lightweight match descriptor for lists (Home, Matches). */
export interface MatchSummary {
  matchId: string;
  homeTeam: Team;
  awayTeam: Team;
  competition: Competition;
  /** ISO-8601 kickoff timestamp. */
  kickoff: string;
  status: MatchStatus;
  /** [UI-EXT] Live/final score if supplied by the backend. */
  score?: { home: number; away: number; minute?: number };
  /** Qualification per market, as supplied by governance. Never derived in UI. */
  markets: Partial<Record<MarketCode, QualificationStatus>>;
  /**
   * [UI-EXT] Whether live intelligence is authorised for this match.
   * Absent / false => the UI must render "LIVE INTELLIGENCE UNAVAILABLE".
   */
  liveIntelligenceAuthorized?: boolean;
}

/** [UI-EXT] Best price is shown AFTER the decision and never affects it. */
export interface BestAvailablePrice {
  selection: SelectionKey;
  odds: number;
  bookmaker: string;
}

/**
 * Core contract, as defined in the VF Master Implementation Brief §11.
 * One object per (match, market).
 */
export interface MatchIntelligence {
  matchId: string;
  homeTeam: Team;
  awayTeam: Team;
  competition: string;
  kickoff: string;
  market: MarketCode;
  qualificationStatus: QualificationStatus;
  probability: SelectionMap;
  fairOdds: SelectionMap;
  marketOdds: SelectionMap;
  value: SelectionMap;
  vfScore?: number;
  decision?: string;
  /**
   * [UI-EXT] Selection the decision refers to, as supplied upstream. Used only to
   * visually highlight that selection; the UI never infers it (e.g. from max probability).
   */
  decisionSelection?: SelectionKey;
  /** [UI-EXT] "Why" explanation lines supplied by the intelligence layer. */
  explanation?: string[];
  /** [UI-EXT] Best available price — rendered separately; Best Odd ≠ Value. */
  bestAvailablePrice?: BestAvailablePrice;
}

/** Bundle returned for the Match Intelligence page. */
export interface MatchIntelligenceBundle {
  match: MatchSummary;
  markets: MatchIntelligence[];
}

/** High-signal opportunity as ranked UPSTREAM. The UI never re-ranks. */
export interface Opportunity {
  rank: number;
  match: MatchSummary;
  intelligence: MatchIntelligence;
}

/** Governance-supplied scientific status of the MVP. Displayed, never edited. */
export interface ScientificStatus {
  modelVersion: string;
  competitions: Competition[];
  markets: { market: MarketCode; label: string; status: QualificationStatus }[];
}
