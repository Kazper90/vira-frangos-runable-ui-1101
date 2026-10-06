/**
 * MockProvider — serves static fixtures through the real service interface.
 * Tagged source: "MOCK" so the UI can never present it as live intelligence.
 *
 * Dev-only scenarios (append ?vfMock=<scenario> to the URL) let QA exercise states:
 *   default | empty | error | unavailable | slow
 */
import {
  ServiceError,
  type Envelope,
  type MatchIntelligence,
  type MatchIntelligenceBundle,
  type MatchSummary,
  type Opportunity,
  type ScientificStatus,
} from "@/contracts";
import {
  intelligenceFixtures,
  matchFixtures,
  opportunityOrder,
  scientificStatusFixture,
} from "@/data/mocks/fixtures";
import type { HomeFeed, VfDataService } from "../vf-data-service";

export type MockScenario = "default" | "empty" | "error" | "unavailable" | "slow";

export interface MockProviderOptions {
  latencyMs?: number;
  scenario?: () => MockScenario;
  now?: () => number;
}

const HOUR = 3_600_000;

export function createMockProvider(opts: MockProviderOptions = {}): VfDataService {
  const scenario = opts.scenario ?? (() => "default" as MockScenario);
  const now = opts.now ?? (() => Date.now());
  const baseLatency = opts.latencyMs ?? 450;

  const envelope = <T>(data: T): Envelope<T> => ({
    data,
    meta: { source: "MOCK", generatedAt: new Date(now()).toISOString() },
  });

  async function respond<T>(build: () => T, emptyValue: () => T): Promise<Envelope<T>> {
    const s = scenario();
    const latency = s === "slow" ? 4000 : baseLatency;
    if (latency > 0) await new Promise((r) => setTimeout(r, latency));
    if (s === "error") throw new ServiceError("UNKNOWN", "Mock scenario: simulated service failure.");
    if (s === "unavailable") throw new ServiceError("UNAVAILABLE", "Mock scenario: VF intelligence unavailable.");
    if (s === "empty") return envelope(emptyValue());
    return envelope(build());
  }

  const summaries = (): MatchSummary[] =>
    matchFixtures.map(({ kickoffOffsetH, ...m }) => ({
      ...m,
      kickoff: new Date(now() + kickoffOffsetH * HOUR).toISOString(),
    }));

  const intelFor = (m: MatchSummary): MatchIntelligence[] =>
    (intelligenceFixtures[m.matchId] ?? []).map((i) => ({
      ...i,
      matchId: m.matchId,
      homeTeam: m.homeTeam,
      awayTeam: m.awayTeam,
      competition: m.competition.name,
      kickoff: m.kickoff,
    }));

  const opportunities = (): Opportunity[] => {
    const all = summaries();
    return opportunityOrder.flatMap(({ matchId, market }, idx) => {
      const match = all.find((m) => m.matchId === matchId);
      const intelligence = match && intelFor(match).find((i) => i.market === market);
      return match && intelligence ? [{ rank: idx + 1, match, intelligence }] : [];
    });
  };

  return {
    name: "MockProvider",

    getHomeFeed: () =>
      respond<HomeFeed>(
        () => {
          const opps = opportunities();
          return {
            featured: opps[0] ?? null,
            opportunities: opps,
            upcoming: summaries().filter((m) => m.status !== "FINISHED"),
          };
        },
        () => ({ featured: null, opportunities: [], upcoming: [] }),
      ),

    listMatches: () => respond(summaries, () => []),

    getMatchIntelligence: async (matchId: string) => {
      const res = await respond<MatchIntelligenceBundle | null>(
        () => {
          const match = summaries().find((m) => m.matchId === matchId);
          return match ? { match, markets: intelFor(match) } : null;
        },
        () => null,
      );
      if (!res.data) throw new ServiceError("NOT_FOUND", `Match ${matchId} not found.`);
      return { ...res, data: res.data };
    },

    getScientificStatus: () =>
      respond<ScientificStatus>(
        () => scientificStatusFixture,
        () => ({ ...scientificStatusFixture, competitions: [], markets: [] }),
      ),
  };
}
