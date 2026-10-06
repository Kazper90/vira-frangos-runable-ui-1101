import { describe, expect, test } from "bun:test";
import { ServiceError } from "@/contracts";
import { intelligenceFixtures } from "@/data/mocks/fixtures";
import { createApiProvider } from "./api-provider";
import { createMockProvider, type MockScenario } from "./mock-provider";

const mock = (scenario: MockScenario = "default") => createMockProvider({ latencyMs: 0, scenario: () => scenario });

describe("MockProvider", () => {
  test("tags every response as MOCK", async () => {
    const p = mock();
    expect((await p.getHomeFeed()).meta.source).toBe("MOCK");
    expect((await p.listMatches()).meta.source).toBe("MOCK");
    expect((await p.getMatchIntelligence("m-001")).meta.source).toBe("MOCK");
    expect((await p.getScientificStatus()).meta.source).toBe("MOCK");
  });

  test("scientific status: 1X2 QUALIFIED, O2.5 + BTTS RESEARCH_ONLY", async () => {
    const { data } = await mock().getScientificStatus();
    const byMarket = Object.fromEntries(data.markets.map((m) => [m.market, m.status]));
    expect(byMarket).toEqual({ "1X2": "QUALIFIED", "O2.5": "RESEARCH_ONLY", BTTS: "RESEARCH_ONLY" });
    expect(data.competitions.map((c) => c.id).sort()).toEqual(["epl", "ppl"]);
  });

  test("O2.5 and BTTS are never QUALIFIED in fixtures", () => {
    for (const markets of Object.values(intelligenceFixtures)) {
      for (const m of markets) {
        if (m.market !== "1X2") expect(m.qualificationStatus).not.toBe("QUALIFIED");
      }
    }
  });

  test("research/unavailable fixtures carry no decision or VF Score", () => {
    for (const markets of Object.values(intelligenceFixtures)) {
      for (const m of markets) {
        if (m.qualificationStatus !== "QUALIFIED") {
          expect(m.decision).toBeUndefined();
          expect(m.vfScore).toBeUndefined();
          expect(m.bestAvailablePrice).toBeUndefined();
        }
      }
    }
  });

  test("opportunities only contain QUALIFIED markets, in upstream order", async () => {
    const { data } = await mock().getHomeFeed();
    expect(data.opportunities.length).toBeGreaterThan(0);
    data.opportunities.forEach((o, i) => {
      expect(o.intelligence.qualificationStatus).toBe("QUALIFIED");
      expect(o.rank).toBe(i + 1);
    });
    expect(data.featured?.match.matchId).toBe(data.opportunities[0].match.matchId);
  });

  test("bundle joins match identity into each market contract", async () => {
    const { data } = await mock().getMatchIntelligence("m-001");
    expect(data.markets.map((m) => m.market)).toEqual(["1X2", "O2.5", "BTTS"]);
    for (const m of data.markets) {
      expect(m.matchId).toBe("m-001");
      expect(m.homeTeam.id).toBe(data.match.homeTeam.id);
    }
  });

  test("unknown match rejects with NOT_FOUND", async () => {
    await expect(mock().getMatchIntelligence("nope")).rejects.toMatchObject({ kind: "NOT_FOUND" });
  });

  test("scenarios: empty / error / unavailable", async () => {
    expect((await mock("empty").getHomeFeed()).data.opportunities).toEqual([]);
    await expect(mock("error").listMatches()).rejects.toBeInstanceOf(ServiceError);
    await expect(mock("unavailable").listMatches()).rejects.toMatchObject({ kind: "UNAVAILABLE" });
  });
});

describe("ApiProvider placeholder", () => {
  test("rejects with NOT_CONNECTED — invents no endpoints or data", async () => {
    const p = createApiProvider({ baseUrl: "https://example.invalid" });
    await expect(p.getHomeFeed()).rejects.toMatchObject({ kind: "NOT_CONNECTED" });
    await expect(p.getMatchIntelligence("m-001")).rejects.toMatchObject({ kind: "NOT_CONNECTED" });
  });
});
