import { describe, expect, test } from "bun:test";
import type { MatchIntelligence, MatchSummary } from "@/contracts";
import {
  DISPLAY_STATE_META,
  canShowBestPrice,
  canShowDecision,
  canShowVfScore,
  formatOdds,
  formatProbability,
  formatValue,
  getMatchDisplayState,
  hasSuppliedIntelligence,
  isLiveBlocked,
  valueTone,
} from "./intelligence-display";

const team = (id: string) => ({ id, name: id, shortName: id, code: id.toUpperCase().slice(0, 3) });

const baseMatch: MatchSummary = {
  matchId: "t-1",
  homeTeam: team("home"),
  awayTeam: team("away"),
  competition: { id: "epl", name: "Premier League", shortName: "EPL", country: "England" },
  kickoff: "2026-10-05T15:00:00.000Z",
  status: "SCHEDULED",
  markets: { "1X2": "QUALIFIED", "O2.5": "RESEARCH_ONLY", BTTS: "RESEARCH_ONLY" },
};

const intel = (over: Partial<MatchIntelligence> = {}): MatchIntelligence => ({
  matchId: "t-1",
  homeTeam: baseMatch.homeTeam,
  awayTeam: baseMatch.awayTeam,
  competition: "Premier League",
  kickoff: baseMatch.kickoff,
  market: "1X2",
  qualificationStatus: "QUALIFIED",
  probability: { home: 0.5, draw: 0.3, away: 0.2 },
  fairOdds: { home: 2, draw: 3.33, away: 5 },
  marketOdds: { home: 2.1, draw: 3.2, away: 4.8 },
  value: { home: 0.05, draw: -0.04, away: -0.04 },
  vfScore: 70,
  decision: "BACK HOME",
  bestAvailablePrice: { selection: "home", odds: 2.12, bookmaker: "X" },
  ...over,
});

describe("formatting never fabricates values", () => {
  test("missing values return null — no 0 / 0.5 fallback", () => {
    expect(formatProbability(undefined)).toBeNull();
    expect(formatOdds(undefined)).toBeNull();
    expect(formatValue(undefined)).toBeNull();
    expect(formatProbability(Number.NaN)).toBeNull();
    expect(valueTone(undefined)).toBe("none");
  });

  test("supplied values are formatted verbatim", () => {
    expect(formatProbability(0.512)).toBe("51.2%");
    expect(formatOdds(2.1)).toBe("2.10");
    expect(formatValue(0.075)).toBe("+7.5%");
    expect(formatValue(-0.152)).toBe("-15.2%");
    expect(formatValue(0)).toBe("0.0%");
  });

  test("value tone follows sign only", () => {
    expect(valueTone(0.001)).toBe("positive");
    expect(valueTone(-0.001)).toBe("negative");
    expect(valueTone(0)).toBe("neutral");
  });
});

describe("qualification gates", () => {
  test("QUALIFIED 1X2 exposes decision, VF Score and best price", () => {
    const i = intel();
    expect(canShowDecision(i)).toBe(true);
    expect(canShowVfScore(i)).toBe(true);
    expect(canShowBestPrice(i)).toBe(true);
  });

  test("RESEARCH_ONLY never exposes decision/score/price even if supplied", () => {
    for (const market of ["O2.5", "BTTS"] as const) {
      const i = intel({ market, qualificationStatus: "RESEARCH_ONLY" });
      expect(canShowDecision(i)).toBe(false);
      expect(canShowVfScore(i)).toBe(false);
      expect(canShowBestPrice(i)).toBe(false);
    }
  });

  test("UNAVAILABLE never exposes production output", () => {
    const i = intel({ qualificationStatus: "UNAVAILABLE" });
    expect(canShowDecision(i)).toBe(false);
    expect(canShowVfScore(i)).toBe(false);
  });

  test("missing decision / score is not invented", () => {
    const i = intel({ decision: undefined, vfScore: undefined });
    expect(canShowDecision(i)).toBe(false);
    expect(canShowVfScore(i)).toBe(false);
    expect(canShowBestPrice(i)).toBe(false);
  });

  test("hasSuppliedIntelligence detects empty contracts", () => {
    expect(hasSuppliedIntelligence(intel())).toBe(true);
    expect(hasSuppliedIntelligence(intel({ probability: {}, fairOdds: {}, marketOdds: {}, value: {} }))).toBe(false);
  });
});

describe("match display state", () => {
  test("live labels are exactly the brief §16 states", () => {
    expect(DISPLAY_STATE_META.LIVE_QUALIFIED.short).toBe("LIVE · QUALIFIED");
    expect(DISPLAY_STATE_META.LIVE_RESEARCH_ONLY.short).toBe("LIVE · RESEARCH ONLY");
    expect(DISPLAY_STATE_META.LIVE_UNAVAILABLE.short).toBe("LIVE INTELLIGENCE UNAVAILABLE");
  });

  test("scheduled match mirrors supplied 1X2 status", () => {
    expect(getMatchDisplayState(baseMatch)).toBe("QUALIFIED");
    expect(getMatchDisplayState(baseMatch, "O2.5")).toBe("RESEARCH_ONLY");
    expect(getMatchDisplayState({ ...baseMatch, markets: {} })).toBe("UNAVAILABLE");
  });

  test("live without authorisation is LIVE_UNAVAILABLE for every market, and blocked", () => {
    const live = { ...baseMatch, status: "LIVE" as const };
    expect(getMatchDisplayState(live)).toBe("LIVE_UNAVAILABLE");
    expect(getMatchDisplayState(live, "O2.5")).toBe("LIVE_UNAVAILABLE");
    expect(isLiveBlocked(live)).toBe(true);
  });

  test("live is qualified only with explicit authorisation and a QUALIFIED market", () => {
    const live = { ...baseMatch, status: "LIVE" as const, liveIntelligenceAuthorized: true };
    expect(getMatchDisplayState(live)).toBe("LIVE_QUALIFIED");
    expect(getMatchDisplayState(live, "BTTS")).toBe("LIVE_RESEARCH_ONLY");
    expect(getMatchDisplayState({ ...live, markets: {} })).toBe("LIVE_UNAVAILABLE");
    expect(isLiveBlocked(live)).toBe(false);
  });
});
