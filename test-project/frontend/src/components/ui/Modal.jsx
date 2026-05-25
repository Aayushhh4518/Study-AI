import { AnimatePresence, motion } from "framer-motion";
import { Loader2, X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";

const ModalContext = createContext({
  onClose: () => {},
  loading: false,
});

// eslint-disable-next-line react-refresh/only-export-components
export function useModal() {
  return useContext(ModalContext);
}

/* ─────────────────────────────────────────────────────────────
   ANIMATION VARIANTS
   Defined outside component — never re-created on render
───────────────────────────────────────────────────────────── */
const backdropVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.18, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: "easeIn" } },
};

const panelVariants = {
  hidden: { opacity: 0, scale: 0.97, y: 10 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 6,
    transition: { duration: 0.16, ease: "easeIn" },
  },
};

/* ─────────────────────────────────────────────────────────────
   MODAL FOOTER
   Exported so consumers can compose their own action rows
───────────────────────────────────────────────────────────── */
export function ModalFooter({ children, className = "" }) {
  return (
    <div
      className={`
      flex-shrink-0 flex items-center justify-end gap-2.5
      px-6 py-4
      border-t border-white/[0.07]
      ${className}
    `}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MODAL CANCEL BUTTON
───────────────────────────────────────────────────────────── */
export function ModalCancelButton({ onClick, children = "Cancel", disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="
        px-4 py-2 rounded-[10px] text-[13px] font-medium
        border border-white/[0.08] bg-white/[0.04] text-zinc-300
        hover:bg-white/[0.07] hover:text-white
        disabled:opacity-40 disabled:cursor-not-allowed
        transition-colors duration-150
      "
    >
      {children}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────
   MODAL PRIMARY BUTTON
───────────────────────────────────────────────────────────── */
export function ModalPrimaryButton({
  onClick,
  children = "Confirm",
  loading = false,
  disabled = false,
  destructive = false,
  type = "button",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        relative flex items-center gap-2
        px-4 py-2 rounded-[10px] text-[13px] font-semibold text-white
        border transition-colors duration-150
        disabled:opacity-50 disabled:cursor-not-allowed
        ${
          destructive
            ? "bg-rose-500/80 border-rose-500/40 hover:bg-rose-500/95"
            : "bg-gradient-to-r from-violet-500/80 to-indigo-500/80 border-violet-500/30 hover:from-violet-500/95 hover:to-indigo-500/95"
        }
      `}
    >
      {loading && (
        <Loader2
          size={13}
          className="animate-spin text-white/70 flex-shrink-0"
        />
      )}
      {children}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN MODAL COMPONENT
───────────────────────────────────────────────────────────── */

const SIZE = {
  xs: "max-w-sm",
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-3xl",
  full: "max-w-[95vw]",
};

export default function Modal({
  /* Core */
  isOpen,
  onClose,
  title,
  description,
  children,

  /* Layout */
  size = "sm", // xs | sm | md | lg | xl | full
  maxHeight = "85vh", // CSS max-height for the panel

  /* Footer (optional convenience props) */
  footer, // ReactNode — renders in sticky footer
  onConfirm, // if provided, renders default Cancel + Confirm footer
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  confirmDisabled = false,
  destructive = false,

  /* Behaviour */
  closeOnOverlayClick = true,
  showCloseButton = true,

  /* Style */
  className = "",
  contentClassName = "",
}) {
  const panelRef = useRef(null);
  const previousFocus = useRef(null);

  /* ── Body scroll lock ── */
  useEffect(() => {
    if (!isOpen) return;
    const scrollY = window.scrollY;
    const scrollbarW = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarW}px`;
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  /* ── Focus management ── */
  useEffect(() => {
    if (isOpen) {
      previousFocus.current = document.activeElement;
      // Defer so the panel is rendered before focusing
      const raf = requestAnimationFrame(() => {
        const el = panelRef.current?.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        el?.focus();
      });
      return () => cancelAnimationFrame(raf);
    } else {
      previousFocus.current?.focus();
    }
  }, [isOpen]);

  /* ── Escape key close ── */
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  /* ── Overlay click ── */
  const handleOverlayClick = useCallback(() => {
    if (closeOnOverlayClick) onClose();
  }, [closeOnOverlayClick, onClose]);

  /* ── Prevent clicks inside panel from closing ── */
  const stopPropagation = useCallback((e) => e.stopPropagation(), []);

  const sizeClass = SIZE[size] ?? SIZE.sm;

  return (
    <ModalContext.Provider value={{ onClose, loading }}>
      <AnimatePresence>
        {isOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {/* ── Backdrop ── */}
            <motion.div
              key="backdrop"
              variants={backdropVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              onClick={handleOverlayClick}
              className="absolute inset-0 bg-black/60 backdrop-blur-[3px]"
            />

            {/* ── Panel ── */}
            <motion.div
              key="panel"
              ref={panelRef}
              variants={panelVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              onClick={stopPropagation}
              style={{ maxHeight }}
              className={`
                relative z-10 w-full ${sizeClass}
                flex flex-col
                rounded-[18px]
                border border-white/[0.09]
                bg-[#0c1028]/97
                shadow-[0_24px_64px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.04)]
                overflow-hidden
                ${className}
              `}
            >
              {/* Ambient top glow */}
              <div
                aria-hidden
                className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-32 w-64 rounded-full bg-violet-500/[0.07] blur-3xl"
              />

              {/* ── Header ── */}
              <div
                className="
                relative z-10 flex-shrink-0
                flex items-start justify-between
                px-6 pt-5 pb-4
                border-b border-white/[0.07]
              "
              >
                <div className="pr-8">
                  <h2
                    id="modal-title"
                    className="text-[15.5px] font-bold text-white tracking-tight leading-snug"
                  >
                    {title}
                  </h2>
                  {description && (
                    <p className="text-[12.5px] text-zinc-500 mt-1 leading-relaxed">
                      {description}
                    </p>
                  )}
                </div>

                {showCloseButton && (
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close modal"
                    className="
                      absolute top-4 right-4
                      h-7 w-7 rounded-[8px]
                      flex items-center justify-center
                      text-zinc-600 hover:text-zinc-200
                      hover:bg-white/[0.06]
                      border border-transparent hover:border-white/[0.08]
                      transition-colors duration-150
                      focus:outline-none focus:ring-1 focus:ring-violet-500/50
                    "
                  >
                    <X size={14} strokeWidth={2.5} />
                  </button>
                )}
              </div>

              {/* ── Scrollable content body ── */}
              <div
                className={`
                  relative z-10 flex-1 overflow-y-auto
                  px-6 py-5
                  scrollbar-thin
                  ${contentClassName}
                `}
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgba(99,102,241,0.25) transparent",
                }}
              >
                {children}
              </div>

              {/* ── Footer ── */}
              {(footer || onConfirm) && (
                <div
                  className="
                  relative z-10 flex-shrink-0
                  flex items-center justify-end gap-2.5
                  px-6 py-4
                  border-t border-white/[0.07]
                  bg-white/[0.015]
                "
                >
                  {footer ?? (
                    <>
                      <ModalCancelButton onClick={onClose} disabled={loading}>
                        {cancelLabel}
                      </ModalCancelButton>
                      <ModalPrimaryButton
                        onClick={onConfirm}
                        loading={loading}
                        disabled={confirmDisabled}
                        destructive={destructive}
                      >
                        {confirmLabel}
                      </ModalPrimaryButton>
                    </>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ModalContext.Provider>
  );
}
