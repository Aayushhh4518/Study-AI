import { motion } from "framer-motion";

export default function PremiumCard({ children, className = "" }) {
  return (
    <motion.div
      whileHover={{
        y: -4,
        scale: 1.01,
      }}
      transition={{
        duration: 0.2,
      }}
      className={`
        relative
        overflow-hidden
        rounded-3xl
        border
        border-white/10
        bg-white/[0.04]
        backdrop-blur-2xl
        shadow-[0_0_40px_rgba(0,0,0,0.35)]
        before:absolute
        before:inset-0
        before:bg-gradient-to-br
        before:from-white/[0.08]
        before:to-transparent
        before:pointer-events-none
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
