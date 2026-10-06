import type { Team } from "@/contracts";
import { cn } from "@/lib/utils";

/**
 * Team badge — crest placeholder until licensed crests are supplied. Figma (frame 1:6):
 * flat square tile in the club colour with a white Inter Bold monogram. Purely cosmetic.
 */
export function TeamBadge({ team, size = 40, className }: { team: Team; size?: number; className?: string }) {
  return (
    <span
      className={cn("relative inline-grid shrink-0 place-items-center overflow-hidden rounded-vf-xs", className)}
      style={{ width: size, height: size, background: team.color ?? "#2d2d2d" }}
      title={team.name}
      aria-hidden
    >
      <span className="font-sans font-bold text-white" style={{ fontSize: Math.max(8, size * 0.3), letterSpacing: "-0.01em" }}>
        {team.code}
      </span>
    </span>
  );
}

/** Team name + badge lockup. Figma team names: Barlow Condensed Black 17px, #E0E0E0. */
export function TeamLockup({
  team,
  align = "left",
  size = "md",
  className,
}: {
  team: Team;
  align?: "left" | "right";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const badge = size === "lg" ? 64 : size === "md" ? 34 : 28;
  return (
    <div className={cn("flex min-w-0 items-center gap-2.5", align === "right" && "flex-row-reverse text-right", className)}>
      <TeamBadge team={team} size={badge} />
      <span
        className={cn(
          "vf-display min-w-0 truncate text-vf-text",
          size === "lg" && "text-3xl md:text-5xl",
          size === "md" && "text-xl",
          size === "sm" && "text-[17px]",
        )}
      >
        {size === "lg" ? team.name : team.shortName}
      </span>
    </div>
  );
}
