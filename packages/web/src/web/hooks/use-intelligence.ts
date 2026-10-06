/**
 * Data hooks for VF intelligence. Components use these hooks only — never the
 * service or providers directly. Retries are disabled for typed service errors so
 * NOT_FOUND / UNAVAILABLE / NOT_CONNECTED surface immediately as UI states.
 */
import { useQuery } from "@tanstack/react-query";
import { isServiceError } from "@/contracts";
import { vfService } from "@/services";

const retry = (count: number, err: unknown) => !isServiceError(err) && count < 2;

export const vfKeys = {
  home: ["vf", "home"] as const,
  matches: ["vf", "matches"] as const,
  match: (id: string) => ["vf", "match", id] as const,
  status: ["vf", "scientific-status"] as const,
};

export function useHomeFeed() {
  return useQuery({ queryKey: vfKeys.home, queryFn: () => vfService.getHomeFeed(), retry, staleTime: 60_000 });
}

export function useMatches() {
  return useQuery({ queryKey: vfKeys.matches, queryFn: () => vfService.listMatches(), retry, staleTime: 60_000 });
}

export function useMatchIntelligence(matchId: string) {
  return useQuery({
    queryKey: vfKeys.match(matchId),
    queryFn: () => vfService.getMatchIntelligence(matchId),
    retry,
    staleTime: 60_000,
    enabled: matchId.length > 0,
  });
}

export function useScientificStatus() {
  return useQuery({
    queryKey: vfKeys.status,
    queryFn: () => vfService.getScientificStatus(),
    retry,
    staleTime: 5 * 60_000,
  });
}
