import * as React from "react";
import { Link, useLocation } from "wouter";
import { LayoutGrid } from "lucide-react";
import { Drawer } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { isActivePath, navItems } from "@/routes";
import { useSessionUi } from "./session-context";

/** Mobile bottom navigation: primary tabs + "More" drawer with the remaining routes. */
export function BottomTabBar() {
  const [location] = useLocation();
  const [moreOpen, setMoreOpen] = React.useState(false);
  const { openAuth } = useSessionUi();
  const tabs = navItems.filter((n) => n.mobileTab);
  const more = navItems.filter((n) => !n.mobileTab);
  const moreActive = more.some((n) => isActivePath(n.path, location));

  React.useEffect(() => setMoreOpen(false), [location]);

  return (
    <>
      <nav
        aria-label="Primary"
        className="vf-safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-vf-line bg-vf-ink/90 backdrop-blur-xl lg:hidden"
      >
        <ul className="mx-auto grid h-[var(--vf-tabbar-h)] max-w-[520px] grid-cols-5 px-2">
          {tabs.map((item) => {
            const active = isActivePath(item.path, location);
            const Icon = item.icon;
            const jarvis = item.identity === "jarvis";
            return (
              <li key={item.key} className="flex">
                <Link
                  to={item.path}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex flex-1 flex-col items-center justify-center gap-1 text-[10.5px] font-semibold transition-colors",
                    active ? "text-vf-lime" : "text-vf-text-3",
                  )}
                >
                  {jarvis ? (
                    <span
                      className={cn(
                        "-mt-5 grid size-12 place-items-center rounded-full border-4 border-vf-ink",
                        active ? "bg-vf-lime text-vf-lime-ink" : "bg-vf-raised text-vf-text",
                      )}
                    >
                      <Icon className="size-5" />
                    </span>
                  ) : (
                    <Icon className="size-[21px]" />
                  )}
                  {item.label}
                </Link>
              </li>
            );
          })}
          <li className="flex">
            <button
              type="button"
              onClick={() => setMoreOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={moreOpen}
              className={cn(
                "flex flex-1 cursor-pointer flex-col items-center justify-center gap-1 text-[10.5px] font-semibold",
                moreActive ? "text-vf-lime" : "text-vf-text-3",
              )}
            >
              <LayoutGrid className="size-[21px]" />
              More
            </button>
          </li>
        </ul>
      </nav>

      <Drawer open={moreOpen} onClose={() => setMoreOpen(false)} title="More">
        <ul className="grid grid-cols-1 gap-2">
          {more.map((item) => {
            const Icon = item.icon;
            const active = isActivePath(item.path, location);
            return (
              <li key={item.key}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 rounded-vf-md border px-4 py-3.5 font-semibold",
                    active ? "border-vf-lime-line bg-vf-lime-dim text-vf-lime" : "border-vf-line bg-vf-surface text-vf-text",
                    item.identity === "community" && !active && "border-vf-red-line",
                  )}
                >
                  <Icon className={cn("size-5", item.identity === "community" && "text-vf-red")} />
                  {item.label}
                </Link>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              onClick={() => {
                setMoreOpen(false);
                openAuth();
              }}
              className="w-full cursor-pointer rounded-vf-md border border-vf-line-strong px-4 py-3.5 text-left font-semibold text-vf-text-2"
            >
              Sign in / Create account
            </button>
          </li>
        </ul>
      </Drawer>
    </>
  );
}
