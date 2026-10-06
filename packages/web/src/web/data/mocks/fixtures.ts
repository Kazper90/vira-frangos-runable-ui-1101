/**
 * MOCK FIXTURES — development only.
 *
 * Every number in this file is a STATIC PLACEHOLDER typed by hand to exercise the UI
 * contract. None of it is VF model output, none of it is a prediction, and none of it
 * is computed at runtime. Do not import this file from UI components — only the
 * MockProvider may read it.
 */
import type {
  Competition,
  MatchIntelligence,
  MatchSummary,
  ScientificStatus,
  Team,
} from "@/contracts";

/* ---------- Reference data ---------- */

export const competitions = {
  epl: { id: "epl", name: "Premier League", shortName: "EPL", country: "England" },
  ppl: { id: "ppl", name: "Primeira Liga", shortName: "Liga PT", country: "Portugal" },
  ucl: { id: "ucl", name: "Champions League", shortName: "UCL", country: "Europe" },
} satisfies Record<string, Competition>;

const t = (id: string, name: string, shortName: string, code: string, color: string): Team => ({
  id,
  name,
  shortName,
  code,
  color,
});

export const teams = {
  ars: t("ars", "Arsenal", "Arsenal", "ARS", "#EF0107"),
  che: t("che", "Chelsea", "Chelsea", "CHE", "#034694"),
  liv: t("liv", "Liverpool", "Liverpool", "LIV", "#C8102E"),
  avl: t("avl", "Aston Villa", "Villa", "AVL", "#670E36"),
  new: t("new", "Newcastle United", "Newcastle", "NEW", "#241F20"),
  mun: t("mun", "Manchester United", "Man United", "MUN", "#DA291C"),
  mci: t("mci", "Manchester City", "Man City", "MCI", "#6CABDD"),
  tot: t("tot", "Tottenham Hotspur", "Spurs", "TOT", "#132257"),
  slb: t("slb", "SL Benfica", "Benfica", "SLB", "#E83030"),
  scp: t("scp", "Sporting CP", "Sporting", "SCP", "#008057"),
  fcp: t("fcp", "FC Porto", "Porto", "FCP", "#00428C"),
  scb: t("scb", "SC Braga", "Braga", "SCB", "#D21F2B"),
  vsc: t("vsc", "Vitória SC", "Vitória", "VSC", "#BBBBBB"),
  fam: t("fam", "FC Famalicão", "Famalicão", "FAM", "#1C3F94"),
  rma: t("rma", "Real Madrid", "Real Madrid", "RMA", "#FEBE10"),
  bay: t("bay", "Bayern München", "Bayern", "BAY", "#DC052D"),
} satisfies Record<string, Team>;

/* ---------- Matches ----------
 * kickoffOffsetH is relative to "now" so fixtures stay upcoming in development.
 */

interface MatchFixture extends Omit<MatchSummary, "kickoff"> {
  kickoffOffsetH: number;
}

const STD_MARKETS = { "1X2": "QUALIFIED", "O2.5": "RESEARCH_ONLY", BTTS: "RESEARCH_ONLY" } as const;
const NO_MARKETS = { "1X2": "UNAVAILABLE", "O2.5": "UNAVAILABLE", BTTS: "UNAVAILABLE" } as const;

export const matchFixtures: MatchFixture[] = [
  { matchId: "m-001", homeTeam: teams.ars, awayTeam: teams.che, competition: competitions.epl, kickoffOffsetH: 26, status: "SCHEDULED", markets: STD_MARKETS },
  { matchId: "m-004", homeTeam: teams.fcp, awayTeam: teams.scb, competition: competitions.ppl, kickoffOffsetH: 5, status: "SCHEDULED", markets: STD_MARKETS },
  { matchId: "m-005", homeTeam: teams.new, awayTeam: teams.mun, competition: competitions.epl, kickoffOffsetH: -1, status: "LIVE", score: { home: 1, away: 0, minute: 63 }, markets: STD_MARKETS, liveIntelligenceAuthorized: false },
  { matchId: "m-003", homeTeam: teams.liv, awayTeam: teams.avl, competition: competitions.epl, kickoffOffsetH: 29, status: "SCHEDULED", markets: STD_MARKETS },
  { matchId: "m-002", homeTeam: teams.slb, awayTeam: teams.scp, competition: competitions.ppl, kickoffOffsetH: 50, status: "SCHEDULED", markets: STD_MARKETS },
  { matchId: "m-006", homeTeam: teams.rma, awayTeam: teams.bay, competition: competitions.ucl, kickoffOffsetH: 54, status: "SCHEDULED", markets: NO_MARKETS },
  { matchId: "m-007", homeTeam: teams.mci, awayTeam: teams.tot, competition: competitions.epl, kickoffOffsetH: 74, status: "SCHEDULED", markets: STD_MARKETS },
  { matchId: "m-008", homeTeam: teams.vsc, awayTeam: teams.fam, competition: competitions.ppl, kickoffOffsetH: 98, status: "SCHEDULED", markets: STD_MARKETS },
];

/* ---------- Intelligence payloads (static placeholders) ----------
 * Shape mirrors MatchIntelligence minus match identity fields, which the provider joins in.
 */

type IntelFixture = Omit<MatchIntelligence, "matchId" | "homeTeam" | "awayTeam" | "competition" | "kickoff">;

export const intelligenceFixtures: Record<string, IntelFixture[]> = {
  "m-001": [
    {
      market: "1X2",
      qualificationStatus: "QUALIFIED",
      probability: { home: 0.512, draw: 0.262, away: 0.226 },
      fairOdds: { home: 1.95, draw: 3.82, away: 4.42 },
      marketOdds: { home: 2.1, draw: 3.6, away: 3.75 },
      value: { home: 0.075, draw: -0.057, away: -0.152 },
      vfScore: 78,
      decision: "BACK HOME",
      decisionSelection: "home",
      explanation: [
        "MOCK — placeholder copy. Real explanations are supplied by the VF intelligence layer.",
        "Supplied VF probability for the home side sits above the market-implied price.",
        "Draw and away prices carry negative supplied value and are filtered out.",
      ],
      bestAvailablePrice: { selection: "home", odds: 2.14, bookmaker: "Mock Book A" },
    },
    {
      market: "O2.5",
      qualificationStatus: "RESEARCH_ONLY",
      probability: { over25: 0.574 },
      fairOdds: { over25: 1.74 },
      marketOdds: { over25: 1.8 },
      value: { over25: 0.033 },
    },
    {
      market: "BTTS",
      qualificationStatus: "RESEARCH_ONLY",
      probability: { bttsYes: 0.561 },
      fairOdds: { bttsYes: 1.78 },
      marketOdds: { bttsYes: 1.75 },
      value: { bttsYes: -0.018 },
    },
  ],
  "m-002": [
    {
      market: "1X2",
      qualificationStatus: "QUALIFIED",
      probability: { home: 0.448, draw: 0.276, away: 0.276 },
      fairOdds: { home: 2.23, draw: 3.62, away: 3.62 },
      marketOdds: { home: 2.3, draw: 3.3, away: 3.1 },
      value: { home: 0.03, draw: -0.089, away: -0.144 },
      vfScore: 61,
      decision: "BACK HOME",
      decisionSelection: "home",
      explanation: [
        "MOCK — placeholder copy. Real explanations are supplied by the VF intelligence layer.",
        "Thin supplied edge on the home side; the remaining outcomes are priced below fair.",
      ],
      bestAvailablePrice: { selection: "home", odds: 2.32, bookmaker: "Mock Book B" },
    },
    { market: "O2.5", qualificationStatus: "RESEARCH_ONLY", probability: {}, fairOdds: {}, marketOdds: {}, value: {} },
    { market: "BTTS", qualificationStatus: "RESEARCH_ONLY", probability: {}, fairOdds: {}, marketOdds: {}, value: {} },
  ],
  "m-003": [
    {
      market: "1X2",
      qualificationStatus: "QUALIFIED",
      probability: { home: 0.583, draw: 0.231, away: 0.186 },
      fairOdds: { home: 1.72, draw: 4.33, away: 5.38 },
      marketOdds: { home: 1.65, draw: 4.1, away: 5.25 },
      value: { home: -0.038, draw: -0.053, away: -0.023 },
      vfScore: 34,
      decision: "NO BET",
      explanation: [
        "MOCK — placeholder copy. Real explanations are supplied by the VF intelligence layer.",
        "Every outcome is priced at or below its supplied fair odds. Nothing passes the filter.",
      ],
    },
    { market: "O2.5", qualificationStatus: "RESEARCH_ONLY", probability: {}, fairOdds: {}, marketOdds: {}, value: {} },
    { market: "BTTS", qualificationStatus: "RESEARCH_ONLY", probability: {}, fairOdds: {}, marketOdds: {}, value: {} },
  ],
  "m-004": [
    {
      market: "1X2",
      qualificationStatus: "QUALIFIED",
      probability: { home: 0.551, draw: 0.258, away: 0.191 },
      fairOdds: { home: 1.81, draw: 3.88, away: 5.24 },
      marketOdds: { home: 1.95, draw: 3.5, away: 4.4 },
      value: { home: 0.074, draw: -0.097, away: -0.16 },
      vfScore: 74,
      decision: "BACK HOME",
      decisionSelection: "home",
      explanation: [
        "MOCK — placeholder copy. Real explanations are supplied by the VF intelligence layer.",
        "Home price is above supplied fair odds; draw and away are not.",
      ],
      bestAvailablePrice: { selection: "home", odds: 1.98, bookmaker: "Mock Book C" },
    },
    { market: "O2.5", qualificationStatus: "RESEARCH_ONLY", probability: {}, fairOdds: {}, marketOdds: {}, value: {} },
    { market: "BTTS", qualificationStatus: "RESEARCH_ONLY", probability: {}, fairOdds: {}, marketOdds: {}, value: {} },
  ],
  "m-005": [
    {
      market: "1X2",
      qualificationStatus: "QUALIFIED",
      probability: {},
      fairOdds: {},
      marketOdds: {},
      value: {},
      explanation: ["MOCK — live intelligence is not authorised. Pre-match intelligence is not re-served in-play."],
    },
    { market: "O2.5", qualificationStatus: "RESEARCH_ONLY", probability: {}, fairOdds: {}, marketOdds: {}, value: {} },
    { market: "BTTS", qualificationStatus: "RESEARCH_ONLY", probability: {}, fairOdds: {}, marketOdds: {}, value: {} },
  ],
  "m-006": [
    { market: "1X2", qualificationStatus: "UNAVAILABLE", probability: {}, fairOdds: {}, marketOdds: {}, value: {} },
    { market: "O2.5", qualificationStatus: "UNAVAILABLE", probability: {}, fairOdds: {}, marketOdds: {}, value: {} },
    { market: "BTTS", qualificationStatus: "UNAVAILABLE", probability: {}, fairOdds: {}, marketOdds: {}, value: {} },
  ],
  "m-007": [
    {
      market: "1X2",
      qualificationStatus: "QUALIFIED",
      probability: { home: 0.604, draw: 0.214, away: 0.182 },
      fairOdds: { home: 1.66, draw: 4.67, away: 5.49 },
      marketOdds: { home: 1.55, draw: 4.4, away: 5.6 },
      value: { home: -0.064, draw: -0.058, away: 0.019 },
      vfScore: 48,
      decision: "WATCH",
      explanation: [
        "MOCK — placeholder copy. Real explanations are supplied by the VF intelligence layer.",
        "Marginal supplied value on the away side; below the threshold for a production decision.",
      ],
      bestAvailablePrice: { selection: "away", odds: 5.7, bookmaker: "Mock Book A" },
    },
    { market: "O2.5", qualificationStatus: "RESEARCH_ONLY", probability: {}, fairOdds: {}, marketOdds: {}, value: {} },
    { market: "BTTS", qualificationStatus: "RESEARCH_ONLY", probability: {}, fairOdds: {}, marketOdds: {}, value: {} },
  ],
  "m-008": [
    {
      market: "1X2",
      qualificationStatus: "QUALIFIED",
      probability: { home: 0.437, draw: 0.296, away: 0.267 },
      fairOdds: { home: 2.29, draw: 3.38, away: 3.75 },
      marketOdds: { home: 2.2, draw: 3.2, away: 3.7 },
      value: { home: -0.039, draw: -0.053, away: -0.012 },
      vfScore: 29,
      decision: "NO BET",
      explanation: ["MOCK — placeholder copy. Real explanations are supplied by the VF intelligence layer."],
    },
    { market: "O2.5", qualificationStatus: "RESEARCH_ONLY", probability: {}, fairOdds: {}, marketOdds: {}, value: {} },
    { market: "BTTS", qualificationStatus: "RESEARCH_ONLY", probability: {}, fairOdds: {}, marketOdds: {}, value: {} },
  ],
};

/** Upstream-ranked opportunity order (static). The UI must not re-rank. */
export const opportunityOrder: { matchId: string; market: "1X2" }[] = [
  { matchId: "m-001", market: "1X2" },
  { matchId: "m-004", market: "1X2" },
  { matchId: "m-002", market: "1X2" },
];

export const scientificStatusFixture: ScientificStatus = {
  modelVersion: "M3.0 (mock label)",
  competitions: [competitions.epl, competitions.ppl],
  markets: [
    { market: "1X2", label: "Match Result", status: "QUALIFIED" },
    { market: "O2.5", label: "Over 2.5 Goals", status: "RESEARCH_ONLY" },
    { market: "BTTS", label: "Both Teams To Score", status: "RESEARCH_ONLY" },
  ],
};
