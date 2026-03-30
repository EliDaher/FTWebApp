import { useEffect, type MouseEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import BodyCard from "./BodyCard";

type PopupFormProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
};

export default function PopupForm({ isOpen, onClose, title, children }: PopupFormProps) {
  useEffect(() => {
    if (!isOpen) return;

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
      onMouseDown={onClose}
      role="dialog"
      aria-modal="true"
    >
      <BodyCard
        className="relative max-h-[calc(100vh-2rem)] w-full max-w-lg overflow-y-auto border-white/30 p-6 md:p-7"
        onMouseDown={(event: MouseEvent<HTMLDivElement>) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 h-9 w-9 rounded-full border border-white/20 bg-white/5 text-slate-200 hover:bg-white/15"
          aria-label="إغلاق"
        >
          ×
        </button>

        {title ? <h2 className="mb-5 text-center text-2xl font-bold text-white">{title}</h2> : null}

        <div>{children}</div>
      </BodyCard>
    </div>,
    document.body
  );
}
