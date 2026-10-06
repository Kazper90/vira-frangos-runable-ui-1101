/**
 * ApiProvider — adapter placeholder for the real VF intelligence backend.
 *
 * Deliberately NOT implemented: the VF backend endpoints are owned by the
 * backend/governance track and have not been specified to the Experience Layer.
 * Inventing endpoint paths here would create a fake contract, so every method
 * rejects with NOT_CONNECTED and the UI renders its "unavailable" state.
 *
 * To connect: implement each method against the agreed endpoints, map the
 * response to the types in `@/contracts`, and tag `meta.source = "API"`.
 * Do not compute or default any scientific value in this adapter.
 */
import { ServiceError } from "@/contracts";
import type { VfDataService } from "../vf-data-service";

export interface ApiProviderOptions {
  /** Base URL of the VF backend (e.g. from VITE_VF_API_BASE_URL). No secrets here. */
  baseUrl?: string;
}

export function createApiProvider(opts: ApiProviderOptions = {}): VfDataService {
  const notConnected = (op: string) =>
    Promise.reject(
      new ServiceError(
        "NOT_CONNECTED",
        `VF backend adapter not connected (${op}${opts.baseUrl ? ` @ ${opts.baseUrl}` : ""}).`,
      ),
    );

  return {
    name: "ApiProvider",
    getHomeFeed: () => notConnected("getHomeFeed"),
    listMatches: () => notConnected("listMatches"),
    getMatchIntelligence: (id) => notConnected(`getMatchIntelligence:${id}`),
    getScientificStatus: () => notConnected("getScientificStatus"),
  };
}
