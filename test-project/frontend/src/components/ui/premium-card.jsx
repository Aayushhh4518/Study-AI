import clsx from "clsx";

export default function PremiumCard({
  children,
  className = "",
}) {
  return (
    <div
      className={clsx(
        `
          glass-card

          relative
          overflow-hidden
          rounded-[28px]

          border
          border-white/10

          bg-white/[0.04]

          backdrop-blur-2xl

          shadow-[0_10px_50px_rgba(0,0,0,0.35)]

          transition-all
          duration-500

          hover:border-violet-500/20
          hover:bg-white/[0.05]
          hover:shadow-[0_0_40px_rgba(99,102,241,0.15)]
          hover:-translate-y-1
        `,
        className,
      )}
    >
      {/* TOP LIGHT */}
      <div
        className="
          absolute
          inset-x-0
          top-0
          h-[1px]
          bg-gradient-to-r
          from-transparent
          via-white/40
          to-transparent
        "
      />

      {/* PURPLE GLOW */}
      <div
        className="
          absolute
          -top-20
          right-0
          h-40
          w-40
          rounded-full
          bg-violet-500/10
          blur-3xl
        "
      />

      {/* BLUE GLOW */}
      <div
        className="
          absolute
          bottom-0
          left-0
          h-32
          w-32
          rounded-full
          bg-blue-500/10
          blur-3xl
        "
      />

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
