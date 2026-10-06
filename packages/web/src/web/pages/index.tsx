import * as React from "react";
import { ArrowRight, FlaskConical } from "lucide-react";
import { Link } from "wouter";
import { Container } from "@/components/layout/container";
import { ScientificStatusPanel } from "@/components/intelligence/intel-cards";
import { MatchIntelCard } from "@/components/intelligence/match-intel-card";
import { MatchRow } from "@/components/intelligence/match-row";
import { PipelineBoxes } from "@/components/intelligence/pipeline-strip";
import { Badge, DataSourceBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { EmptyState, ErrorState, LoadingState, Skeleton } from "@/components/ui/states";
import type { ScientificStatus } from "@/contracts";
import { useHomeFeed, useScientificStatus } from "@/hooks/use-intelligence";
import { cn } from "@/lib/utils";
import { paths } from "@/routes";

/**
 * Home — structure and visual language reconciled against Figma file
 * uzqWJXIwPZBcjY6lusXPJC, frame 1:6 "App" (Hero → Philosophy & pipeline → Today's Match
 * Intelligence → Community → Frango progression → Footer). Figma's illustrative numbers are
 * NOT reproduced; every figure here is either governance-supplied or static product copy.
 */
export default function HomePage() {
  const feed = useHomeFeed();
  const status = useScientificStatus();
  const source = feed.data?.meta.source ?? "MOCK";

  return (
    <>
      <Hero status={status.data?.data} />
      <Philosophy />

      {/* TODAY'S MATCH INTELLIGENCE — upstream-ranked opportunities, never re-ranked */}
      <section className="border-t border-vf-line">
        <Container className="py-10 md:py-12">
          <TodayIntelligence
            loading={feed.isLoading}
            error={feed.isError ? feed.error : null}
            onRetry={() => feed.refetch()}
            opportunities={feed.data?.data.opportunities ?? []}
            competitions={status.data?.data.competitions ?? []}
            source={source}
          />
        </Container>
      </section>

      {/* UPCOMING + SCIENTIFIC STATUS (Phase 1 surfaces; not in the inspected Figma frame) */}
      <section className="border-t border-vf-line">
        <Container className="grid grid-cols-[minmax(0,1fr)] gap-8 py-10 md:py-12 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="min-w-0">
            <SectionHeader eyebrow="Next kick-offs" title="Upcoming matches" />
            {feed.isLoading ? (
              <LoadingState rows={5} />
            ) : feed.isError ? (
              <ErrorState error={feed.error} onRetry={() => feed.refetch()} />
            ) : feed.data && feed.data.data.upcoming.length > 0 ? (
              <div className="space-y-2">
                {feed.data.data.upcoming.slice(0, 6).map((m) => (
                  <MatchRow key={m.matchId} match={m} />
                ))}
              </div>
            ) : (
              <EmptyState title="No upcoming matches" />
            )}
          </div>
          <aside className="min-w-0 lg:pt-[68px]">
            {status.isLoading ? (
              <Skeleton className="h-[380px]" />
            ) : status.isError ? (
              <ErrorState error={status.error} compact />
            ) : status.data ? (
              <ScientificStatusPanel status={status.data.data} source={status.data.meta.source} />
            ) : null}
          </aside>
        </Container>
      </section>

      <CommunitySection />
      <FrangoProgression />
    </>
  );
}

/* ---------------------------------------------------------------- HERO */

function Hero({ status }: { status: ScientificStatus | undefined }) {
  const qualified = status?.markets.filter((m) => m.status === "QUALIFIED").map((m) => m.market) ?? [];
  return (
    <Container as="section" className="pt-4 md:pt-5">
      <div className="relative overflow-hidden border border-vf-line bg-vf-ink">
        {/* Stadium plate + Figma gradients (#0A0A0A @0.97 → @0.55 → @0.10, plus bottom fade) */}
        <img
          src="/vf-stadium.jpg"
          alt=""
          aria-hidden
          className="absolute inset-0 size-full object-cover object-[70%_40%] opacity-90"
          fetchPriority="high"
        />
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background:
              "linear-gradient(90deg, rgba(10,10,10,0.97) 0%, rgba(10,10,10,0.97) 32%, rgba(10,10,10,0.55) 65%, rgba(10,10,10,0.10) 100%)",
          }}
          aria-hidden
        />
        <div
          className="absolute inset-0 md:hidden"
          style={{ background: "linear-gradient(180deg, rgba(10,10,10,0.35) 0%, rgba(10,10,10,0.85) 45%, rgba(10,10,10,0.98) 70%)" }}
          aria-hidden
        />
        <div
          className="absolute inset-x-0 bottom-0 h-20"
          style={{ background: "linear-gradient(180deg, rgba(10,10,10,0) 0%, rgba(10,10,10,1) 100%)" }}
          aria-hidden
        />
        <img
          src="/vf-player.webp"
          alt=""
          aria-hidden
          className="pointer-events-none absolute right-[3.4%] bottom-0 hidden h-[86%] w-auto select-none md:block"
        />

        <div className="relative px-5 pt-[180px] pb-6 sm:px-8 md:max-w-[58%] md:px-10 md:pt-12 md:pb-8 lg:max-w-[52%] lg:px-[60px] lg:pt-14 xl:max-w-[620px]">
          <div className="vf-eyebrow text-vf-lime">More than tips. It's intelligence.</div>
          <h1 className="vf-display mt-4 text-[44px] text-vf-text-strong sm:text-[54px] lg:text-[66px] 2xl:text-[76px]">
            Turn football data into better <span className="text-vf-lime">decisions.</span>
          </h1>
          <p className="mt-5 max-w-[420px] text-[14px] leading-[1.75] text-vf-text-2">
            Football data, probabilities, fair odds and market intelligence — transformed into clearer decisions.
          </p>
          <div className="mt-7 flex flex-wrap gap-2.5">
            <Button size="lg" asChild>
              <Link to={paths.matches}>
                Explore Matches <ArrowRight className="size-[13px]" />
              </Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link to={paths.community}>Enter Community</Link>
            </Button>
          </div>

          {/* Stats — governance-supplied scope only. Figma's "3,430+ historical matches" has no
              contract source and is not reproduced (proposed UI requirement). */}
          <dl className="mt-10 flex flex-wrap gap-x-9 gap-y-4 border-t border-vf-line pt-7">
            <HeroStat value={status ? String(status.competitions.length) : "—"} label="Leagues in MVP" />
            <HeroStat value={qualified.length ? qualified.join(" · ") : "—"} label="Qualified market" />
            <HeroStat value="Statistical" label="Models" />
          </dl>
        </div>
      </div>
    </Container>
  );
}

function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="sr-only">{label}</dt>
      <dd className="font-display text-[22px] leading-none font-extrabold text-vf-lime uppercase">{value}</dd>
      <dd className="vf-num mt-1.5 text-[9.5px] uppercase tracking-[0.06em] text-vf-text-4">{label}</dd>
    </div>
  );
}

/* ---------------------------------------------------------------- PHILOSOPHY */

function Philosophy() {
  return (
    <Container as="section" className="py-5">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 border-t border-vf-line py-10 md:gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        <h2 className="vf-display text-[30px] text-vf-text-strong md:text-[36px]">
          The market gives you a price. <span className="text-vf-lime">We give you a reason.</span>
        </h2>
        <div className="space-y-3 text-[14px] leading-[1.75]">
          <p className="text-vf-text-2">
            Every price in the market encodes a probability opinion. VF builds independent models to calculate what
            that probability <em>should</em> be — then compares it to what the market implies.
          </p>
          <p className="text-vf-text-4">The gap between those two numbers is where intelligence lives.</p>
        </div>
      </div>
      <PipelineBoxes />
    </Container>
  );
}

/* ---------------------------------------------------------------- TODAY */

function TodayIntelligence({
  loading,
  error,
  onRetry,
  opportunities,
  competitions,
  source,
}: {
  loading: boolean;
  error: unknown;
  onRetry: () => void;
  opportunities: import("@/contracts").Opportunity[];
  competitions: import("@/contracts").Competition[];
  source: import("@/contracts").DataSource;
}) {
  const [comp, setComp] = React.useState<string>("all");
  // Display filter only — order is the upstream rank, untouched.
  const visible = comp === "all" ? opportunities : opportunities.filter((o) => o.match.competition.id === comp);

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <div className="vf-eyebrow text-vf-lime">Intelligence</div>
          <h2 className="vf-display mt-2.5 text-[24px] text-vf-text md:text-[26px]">Today's Match Intelligence</h2>
        </div>
        <Link
          to={paths.matches}
          className="inline-flex shrink-0 items-center gap-1.5 text-[12px] font-medium text-vf-lime hover:underline"
        >
          See all matches <ArrowRight className="size-3" aria-hidden />
        </Link>
      </div>

      {/* Scope chips: governance competitions only (Figma's La Liga / Serie A / Bundesliga are out of scope) */}
      <fieldset className="vf-scroll-x -mx-4 mt-5 flex gap-1 border-0 px-4 md:mx-0 md:px-0">
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

      <div className="mt-[18px]">
        {loading ? (
          <div className="grid gap-px md:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-[380px]" />
            ))}
          </div>
        ) : error ? (
          <ErrorState error={error as Error} onRetry={onRetry} />
        ) : visible.length > 0 ? (
          <div className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-3">
            {visible.map((o) => (
              <MatchIntelCard key={`${o.match.matchId}-${o.intelligence.market}`} opp={o} source={source} />
            ))}
          </div>
        ) : (
          <EmptyState title="Nothing passes the filter" body="No qualified opportunity right now. VF shows nothing rather than a weak signal." />
        )}
      </div>

      <div className="mt-6 border-t-2 border-vf-lime pt-2.5">
        <div className="vf-strip-label flex flex-wrap justify-between gap-2 text-vf-lime">
          <span>VF Probability • Fair Odds • Market Odds • Value</span>
          <DataSourceBadge source={source} />
        </div>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------- COMMUNITY (red identity) */

/**
 * Community — red language only (Figma: "COMMUNITY SIGNAL" strip, #EF0107 rules). Figma's
 * discussion cards and "1,284 Frangos online / 42 active rooms" counts are illustrative and
 * have no data source in Phase 1, so they are NOT reproduced. Never presented as VF intelligence.
 */
function CommunitySection() {
  return (
    <section className="border-t border-vf-line" aria-labelledby="vf-community-h">
      <Container className="py-10 md:py-12">
        <StripRule tone="red" left="Community signal" right="Discussion • Reputation • Match rooms" />
        <div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="min-w-0">
            <div className="vf-eyebrow text-vf-red-text">Community</div>
            <h2 id="vf-community-h" className="vf-display mt-2.5 max-w-[760px] text-[24px] text-vf-text md:text-[26px]">
              Intelligence isn't just in the data. It's in the people who question it.
            </h2>
            <p className="mt-3 max-w-[560px] text-[14px] leading-[1.75] text-vf-text-2">
              Match Rooms, discussion and reputation live in Community — opinions from people, kept separate from VF
              model intelligence.
            </p>
          </div>
          <Button variant="community" size="lg" asChild>
            <Link to={paths.community}>
              Enter Community <ArrowRight className="size-[13px]" />
            </Link>
          </Button>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border border-vf-red-line bg-vf-red-dim px-5 py-3.5">
          <span className="vf-strip-label text-vf-red-text">Live community</span>
          <span className="text-[12px] text-vf-text-2">Match Rooms open with Community · Phase 8</span>
          <Badge tone="neutral" size="sm" className="ml-auto">
            Not yet implemented
          </Badge>
        </div>
      </Container>
    </section>
  );
}

/* ---------------------------------------------------------------- FRANGO PROGRESSION */

/** Frango Levels — taxonomy copy from Figma (frame 1:6 › FrangoLevels). Community progression,
 * not part of the scientific engine; rendered in the community (red) identity. No user level shown. */
const FRANGO_LEVELS = [
  { icon: "🥚", name: "Ovo", range: "Lv. 0", text: "Starting point. Every Frango begins here." },
  { icon: "🐣", name: "Pintainho", range: "Lv. 1–5", text: "Learning the basics of football intelligence." },
  { icon: "🐔", name: "Frango", range: "Lv. 6–15", text: "Understanding probabilities and fair odds." },
  { icon: "🎓", name: "Analista", range: "Lv. 16–30", text: "Reading value and market inefficiencies." },
  { icon: "👑", name: "Galo", range: "Lv. 31–50", text: "Consistent, disciplined decision-making." },
  { icon: "🏆", name: "Mestre", range: "Lv. 51–100", text: "Mastery of models and methodology." },
  { icon: "⚡", name: "Lendário", range: "Lv. 100+", text: "Legend. The top of the intelligence hierarchy." },
] as const;

function FrangoProgression() {
  const last = FRANGO_LEVELS.length - 1;
  return (
    <section className="border-t border-vf-line" aria-labelledby="vf-levels-h">
      <Container className="py-10 md:py-12">
        <StripRule tone="red" left="Frango progression" right="Analyse → Learn → Evolve" />
        <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="vf-eyebrow text-vf-red-text">Progression</div>
            <h2 id="vf-levels-h" className="vf-display mt-2.5 text-[24px] text-vf-text md:text-[26px]">
              Evolve your Frango.
            </h2>
            <p className="mt-3 text-[13px] text-vf-text-2">Analyse. Learn. Evolve. Part of the flock.</p>
          </div>
          <Badge tone="red" size="sm">
            Frango League · Phase 8 preview
          </Badge>
        </div>
        <ol className="mt-7 grid grid-cols-2 gap-px border border-vf-line bg-vf-line sm:grid-cols-3 lg:grid-cols-7">
          {FRANGO_LEVELS.map((l, i) => (
            <li
              key={l.name}
              className={cn("flex min-w-0 flex-col items-center px-3 py-5 text-center", i === last ? "bg-vf-red-dim" : "bg-vf-surface")}
            >
              <span className="text-[24px] leading-none" aria-hidden>
                {l.icon}
              </span>
              <span className={cn("mt-3 text-[12px] font-semibold", i === last ? "text-vf-red-text" : "text-vf-text")}>{l.name}</span>
              <span className={cn("vf-num mt-0.5 text-[9px]", i === last ? "text-vf-red-text" : "text-vf-text-4")}>{l.range}</span>
              <span className="mt-2 text-[10.5px] leading-snug text-vf-text-3">{l.text}</span>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

function StripRule({ tone, left, right }: { tone: "red" | "lime"; left: string; right: string }) {
  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-2 border-t-2 pt-2.5", tone === "red" ? "border-vf-red" : "border-vf-lime")}>
      <span className={cn("vf-strip-label", tone === "red" ? "text-vf-red-text" : "text-vf-lime")}>{left}</span>
      <span className="vf-strip-label hidden text-[#7a7a7a] sm:inline">{right}</span>
    </div>
  );
}

export { FlaskConical as _unusedIcon };
