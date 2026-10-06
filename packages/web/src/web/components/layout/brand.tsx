import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { paths } from "@/routes";

/** VF symbol (lime "VF" mark), cropped from the Figma logo asset (frame 1:6 › Nav). */
export function VfMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <img
      src="/vf-mark.png"
      alt=""
      aria-hidden
      width={Math.round(size * 1.97)}
      height={size}
      className={cn("shrink-0 object-contain", className)}
      style={{ height: size, width: "auto" }}
    />
  );
}

/** Full wordmark — "VF | VIRA FRANGOS · FOOTBALL INTELLIGENCE" (Figma logo image). */
export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link to={paths.home} className="flex shrink-0 items-center" aria-label="Vira Frangos — Home">
      <img
        src="/vf-logo.png"
        alt="Vira Frangos — Football Intelligence"
        width={900}
        height={133}
        className={cn("w-auto select-none", compact ? "h-[19px]" : "h-[22px]")}
        draggable={false}
      />
    </Link>
  );
}
