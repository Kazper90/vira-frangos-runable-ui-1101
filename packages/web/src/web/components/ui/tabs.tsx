import * as React from "react";
import { cn } from "@/lib/utils";

export interface TabItem<K extends string> {
  key: K;
  label: React.ReactNode;
  adornment?: React.ReactNode;
}

/**
 * Accessible tablist with roving focus (Arrow keys / Home / End).
 * Panels are rendered by the caller using `tabPanelProps(key)`.
 */
export function Tabs<K extends string>({
  items,
  value,
  onChange,
  idBase,
  className,
  ariaLabel,
}: {
  items: TabItem<K>[];
  value: K;
  onChange: (key: K) => void;
  idBase: string;
  className?: string;
  ariaLabel: string;
}) {
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: React.KeyboardEvent, idx: number) => {
    let next = -1;
    if (e.key === "ArrowRight") next = (idx + 1) % items.length;
    if (e.key === "ArrowLeft") next = (idx - 1 + items.length) % items.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = items.length - 1;
    if (next >= 0) {
      e.preventDefault();
      refs.current[next]?.focus();
      onChange(items[next].key);
    }
  };

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn("vf-scroll-x flex gap-1 rounded-vf-md border border-vf-line bg-vf-carbon p-1", className)}
    >
      {items.map((item, idx) => {
        const selected = item.key === value;
        return (
          <button
            key={item.key}
            ref={(el) => {
              refs.current[idx] = el;
            }}
            type="button"
            role="tab"
            id={`${idBase}-tab-${item.key}`}
            aria-selected={selected}
            aria-controls={`${idBase}-panel-${item.key}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(item.key)}
            onKeyDown={(e) => onKeyDown(e, idx)}
            className={cn(
              "flex min-w-0 flex-1 cursor-pointer items-center justify-center gap-2 rounded-vf-sm px-3 py-2.5 text-sm font-bold whitespace-nowrap transition-colors duration-200",
              selected ? "bg-vf-raised text-vf-text-strong" : "text-vf-text-3 hover:text-vf-text-2",
            )}
          >
            <span className="vf-num">{item.label}</span>
            {item.adornment}
          </button>
        );
      })}
    </div>
  );
}

export function tabPanelProps(idBase: string, key: string) {
  return {
    role: "tabpanel" as const,
    id: `${idBase}-panel-${key}`,
    "aria-labelledby": `${idBase}-tab-${key}`,
    tabIndex: 0,
  };
}
