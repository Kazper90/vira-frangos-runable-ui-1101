import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Modal + Drawer built on native <dialog> (focus trap, Esc, inert background for free).
 */
function useDialog(open: boolean, onClose: () => void) {
  const ref = React.useRef<HTMLDialogElement>(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleClose = () => onClose();
    // Backdrop click: the click target is the <dialog> itself (content lives in an inner div).
    const handleClick = (e: MouseEvent) => {
      if (e.target === el) onClose();
    };
    el.addEventListener("close", handleClose);
    el.addEventListener("click", handleClick);
    return () => {
      el.removeEventListener("close", handleClose);
      el.removeEventListener("click", handleClick);
    };
  }, [onClose]);
  return { ref };
}

interface DialogBaseProps {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, children, className }: DialogBaseProps) {
  const { ref } = useDialog(open, onClose);
  return (
    <dialog
      ref={ref}
      aria-labelledby="vf-modal-title"
      className={cn(
        "vf-dialog m-auto w-[min(92vw,460px)] rounded-vf-lg border border-vf-line-strong bg-vf-surface p-0 text-vf-text",
        className,
      )}
    >
      {open && (
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 id="vf-modal-title" className="vf-display text-2xl">
              {title}
            </h2>
            <CloseButton onClick={onClose} />
          </div>
          {children}
        </div>
      )}
    </dialog>
  );
}

export function Drawer({
  open,
  onClose,
  title,
  children,
  side = "bottom",
  className,
}: DialogBaseProps & { side?: "bottom" | "right" }) {
  const { ref } = useDialog(open, onClose);
  return (
    <dialog
      ref={ref}
      aria-labelledby="vf-drawer-title"
      className={cn(
        "vf-dialog max-h-none max-w-none border-vf-line-strong bg-vf-carbon p-0 text-vf-text",
        side === "bottom" &&
          "vf-safe-bottom mt-auto mb-0 w-full rounded-t-vf-xl border-t animate-in slide-in-from-bottom duration-300",
        side === "right" && "mr-0 ml-auto h-dvh w-[min(92vw,400px)] border-l animate-in slide-in-from-right duration-300",
        className,
      )}
    >
      {open && (
        <div className="p-5">
          {side === "bottom" && <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-vf-line-strong" aria-hidden />}
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 id="vf-drawer-title" className="vf-display text-2xl">
              {title}
            </h2>
            <CloseButton onClick={onClose} />
          </div>
          {children}
        </div>
      )}
    </dialog>
  );
}

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Close"
      className="grid size-9 cursor-pointer place-items-center rounded-vf-xs border border-vf-line-strong text-vf-text-2 hover:text-vf-text"
    >
      <X className="size-4" />
    </button>
  );
}
