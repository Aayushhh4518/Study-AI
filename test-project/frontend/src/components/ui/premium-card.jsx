/*
  PremiumCard — optimized
  Changes:
  - Removed backdrop-blur-xl from the card itself (most expensive single property)
  - Replaced box-shadow with border + subtle bg for the glass effect
  - No motion wrapper here — let parent decide if card needs animation
  - will-change removed (too broad; causes layer promotion for every card)
*/

export default function PremiumCard({ children, className = "" }) {
  return (
    <div
      className={`
        rounded-[20px]
        border border-white/[0.07]
        bg-[#0a0e1f]/80
        ${className}
      `}
    >
      {children}
    </div>
  );
}
