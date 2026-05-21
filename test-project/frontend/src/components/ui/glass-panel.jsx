export default function GlassPanel({ children, className = "" }) {
  return (
    <div
      className={`
        rounded-3xl
        border border-white/10
        bg-white/[0.03]
        backdrop-blur-xl
        shadow-[0_0_40px_rgba(99,102,241,0.08)]
        ${className}
      `}
    >
      {children}
    </div>
  );
}
