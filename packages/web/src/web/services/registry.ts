/**
 * Provider selection. The UI imports `vfService` and never knows which provider is active.
 *
 * VITE_VF_DATA_SOURCE = "mock" (default) | "api"
 * VITE_VF_API_BASE_URL = backend base URL (api mode only)
 */
import type { DataSource } from "@/contracts";
import { createApiProvider } from "./providers/api-provider";
import { createMockProvider, type MockScenario } from "./providers/mock-provider";
import type { VfDataService } from "./vf-data-service";

const SCENARIOS: MockScenario[] = ["default", "empty", "error", "unavailable", "slow"];

function readMockScenario(): MockScenario {
  if (!import.meta.env.DEV || typeof window === "undefined") return "default";
  const v = new URLSearchParams(window.location.search).get("vfMock") as MockScenario | null;
  return v && SCENARIOS.includes(v) ? v : "default";
}

export const configuredSource: DataSource =
  import.meta.env.VITE_VF_DATA_SOURCE === "api" ? "API" : "MOCK";

export const vfService: VfDataService =
  configuredSource === "API"
    ? createApiProvider({ baseUrl: import.meta.env.VITE_VF_API_BASE_URL })
    : createMockProvider({ scenario: readMockScenario });
