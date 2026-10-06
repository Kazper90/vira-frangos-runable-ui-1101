import * as React from "react";
import { Container } from "@/components/layout/container";
import { MatchRow } from "@/components/intelligence/match-row";
import { DataSourceBadge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/states";
import { useMatches } from "@/hooks/use-intelligence";

/**
 * Matches — Phase 1 minimal list so the route is functional.
 * Full discovery (date, market availability, qualification filters) is Phase 3.
 */
export default function MatchesPage() {
  const q = useMatches();
  const [comp, setComp] = React.useState<string>("all");

  const matches = q.data?.data ?? [];
  const competitions = Array.from(new Map(matches.map((m) => [m.competition.id, m.competition])).values());
  const visible = comp === "all" ? matches : matches.filter((m) => m.competition.id === comp);

  return (
    <Container className="py-8 md:py-12">
      <SectionHeader
        eyebrow="Phase 1 · minimal list"
        title="Matches"
        action={q.data && <DataSourceBadge source={q.data.meta.source} />}
      />

      {competitions.length > 0 && (
        <fieldset className="vf-scroll-x -mx-4 mb-5 flex gap-2 border-0 px-4 md:mx-0 md:px-0">
          <legend className="sr-only">Filter by competition</legend>
          <Pill active={comp === "all"} onClick={() => setComp("all")}>
            All
          </Pill>
          {competitions.map((c) => (
            <Pill key={c.id} active={comp === c.id} onClick={() => setComp(c.id)}>
              {c.name}
            </Pill>
          ))}
        </fieldset>
      )}

      {q.isLoading ? (
        <LoadingState rows={6} />
      ) : q.isError ? (
        <ErrorState error={q.error} onRetry={() => q.refetch()} />
      ) : visible.length === 0 ? (
        <EmptyState title="No matches" body="No matches in the feed for this filter." />
      ) : (
        <div className="space-y-2.5">
          {visible.map((m) => (
            <MatchRow key={m.matchId} match={m} />
          ))}
        </div>
      )}
    </Container>
  );
}
