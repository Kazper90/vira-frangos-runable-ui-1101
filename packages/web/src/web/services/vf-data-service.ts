/**
 * VfDataService — the ONLY interface the UI talks to for VF data.
 *
 *   UI  →  queries/ hooks  →  VfDataService  →  provider (Mock | Api adapter)  →  VF backend
 *
 * Providers must return contract-shaped data verbatim. They must not compute,
 * rank, default, or "repair" scientific values.
 */
import type {
  Envelope,
  MatchIntelligenceBundle,
  MatchSummary,
  Opportunity,
  ScientificStatus,
} from "@/contracts";

export interface HomeFeed {
  /** Upstream-chosen featured opportunity, or null when nothing qualifies. */
  featured: Opportunity | null;
  /** Upstream-ranked opportunities (QUALIFIED markets only). */
  opportunities: Opportunity[];
  upcoming: MatchSummary[];
}

export interface VfDataService {
  readonly name: string;
  getHomeFeed(): Promise<Envelope<HomeFeed>>;
  listMatches(): Promise<Envelope<MatchSummary[]>>;
  getMatchIntelligence(matchId: string): Promise<Envelope<MatchIntelligenceBundle>>;
  getScientificStatus(): Promise<Envelope<ScientificStatus>>;
}
