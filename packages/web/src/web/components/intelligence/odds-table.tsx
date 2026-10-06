import type { MatchIntelligence, SelectionKey } from "@/contracts";
import { ValueIndicator } from "@/components/ui/value-indicator";
import {
  MARKET_SELECTIONS,
  formatOdds,
  formatProbability,
  isProductionQualified,
  selectionLabel,
  selectionTag,
} from "@/lib/intelligence-display";
import { cn } from "@/lib/utils";

/**
 * Odds table — VF Probability · Fair Odds · Market Odds · Value, per selection.
 * Desktop: table. Mobile: stacked OddsRow cards. All values rendered verbatim.
 */
export function OddsTable({ intel }: { intel: MatchIntelligence }) {
  const keys = MARKET_SELECTIONS[intel.market];
  const research = !isProductionQualified(intel.qualificationStatus);

  return (
    <div data-market={intel.market} data-qualification={intel.qualificationStatus}>
      {/* Desktop */}
      <table className="hidden w-full border-separate border-spacing-0 md:table">
        <caption className="sr-only">
          {intel.market} intelligence — {intel.qualificationStatus}
        </caption>
        <thead>
          <tr className="text-left">
            {["Selection", "VF Probability", "Fair Odds", "Market Odds", "Value"].map((h, i) => (
              <th
                key={h}
                scope="col"
                className={cn("vf-eyebrow border-b border-vf-line pb-3 font-normal", i > 0 && "text-right")}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {keys.map((k) => (
            <tr key={k} className="group">
              <td className="border-b border-vf-line py-4 pr-4">
                <SelectionCell k={k} intel={intel} />
              </td>
              <NumCell>{formatProbability(intel.probability[k])}</NumCell>
              {/* Figma: fair odds in VF lime, market odds in grey (frame 1:6 › MatchCard). */}
              <NumCell tone={research ? "default" : "lime"}>{formatOdds(intel.fairOdds[k])}</NumCell>
              <NumCell tone="muted">{formatOdds(intel.marketOdds[k])}</NumCell>
              <td className="border-b border-vf-line py-4 text-right">
                <ValueIndicator value={intel.value[k]} muted={research} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile */}
      <div className="space-y-2.5 md:hidden">
        {keys.map((k) => (
          <OddsRow key={k} k={k} intel={intel} research={research} />
        ))}
      </div>
    </div>
  );
}

export function OddsRow({ k, intel, research }: { k: SelectionKey; intel: MatchIntelligence; research: boolean }) {
  return (
    <div className="rounded-vf-md border border-vf-line bg-vf-carbon p-3.5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <SelectionCell k={k} intel={intel} />
        <ValueIndicator value={intel.value[k]} muted={research} />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <MiniStat label="VF Prob" value={formatProbability(intel.probability[k])} />
        <MiniStat label="Fair" value={formatOdds(intel.fairOdds[k])} tone={research ? "default" : "lime"} />
        <MiniStat label="Market" value={formatOdds(intel.marketOdds[k])} tone="muted" />
      </div>
    </div>
  );
}

function SelectionCell({ k, intel }: { k: SelectionKey; intel: MatchIntelligence }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="vf-num grid h-7 min-w-7 place-items-center rounded-vf-xs border border-vf-line-strong px-1.5 text-[11px] text-vf-text-2">
        {selectionTag(k)}
      </span>
      <span className="truncate text-[15px] font-semibold text-vf-text">
        {selectionLabel(k, intel.homeTeam, intel.awayTeam)}
      </span>
    </div>
  );
}

type NumTone = "default" | "lime" | "muted";
const NUM_TONE: Record<NumTone, string> = { default: "text-vf-text", lime: "text-vf-lime", muted: "text-vf-text-2" };

function NumCell({ children, tone = "default" }: { children: string | null; tone?: NumTone }) {
  return (
    <td className={cn("vf-num border-b border-vf-line py-4 text-right text-[15px]", NUM_TONE[tone])}>
      {children ?? <span className="text-vf-text-3" title="Not supplied">—</span>}
    </td>
  );
}

function MiniStat({ label, value, tone = "default" }: { label: string; value: string | null; tone?: NumTone }) {
  return (
    <div>
      <div className="vf-eyebrow mb-1 text-[10px]">{label}</div>
      <div className={cn("vf-num text-[15px]", value === null ? "text-vf-text-3" : NUM_TONE[tone])}>
        {value ?? "—"}
      </div>
    </div>
  );
}
