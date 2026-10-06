import { User } from "lucide-react";
import { cn } from "@/lib/utils";

export function Avatar({
  name,
  src,
  size = 36,
  ring = "none",
  className,
}: {
  name?: string;
  src?: string;
  size?: number;
  ring?: "none" | "lime" | "red";
  className?: string;
}) {
  const initials = name
    ?.split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span
      className={cn(
        "relative inline-grid shrink-0 place-items-center overflow-hidden rounded-full bg-vf-raised font-semibold text-vf-text-2",
        ring === "lime" && "ring-2 ring-vf-lime ring-offset-2 ring-offset-vf-ink",
        ring === "red" && "ring-2 ring-vf-red ring-offset-2 ring-offset-vf-ink",
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      title={name ?? "Guest"}
      aria-hidden
    >
      {src ? (
        <img src={src} alt="" className="size-full object-cover" />
      ) : initials ? (
        initials
      ) : (
        <User className="size-1/2" aria-hidden />
      )}
    </span>
  );
}
