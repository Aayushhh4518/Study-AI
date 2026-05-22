import { motion } from "framer-motion";

import {
  Bell,
  BrainCircuit,
  MoonStar,
  Shield,
  Sparkles,
  User,
} from "lucide-react";

import PremiumCard from "../components/ui/premium-card";

const settingsCards = [
  {
    title: "Profile Settings",
    desc: "Manage your account information and preferences.",
    icon: User,
    color: "from-violet-500 to-indigo-500",
  },
  {
    title: "AI Preferences",
    desc: "Customize AI productivity recommendations.",
    icon: BrainCircuit,
    color: "from-cyan-500 to-blue-500",
  },
  {
    title: "Notifications",
    desc: "Control reminders and smart alerts.",
    icon: Bell,
    color: "from-pink-500 to-rose-500",
  },
  {
    title: "Appearance",
    desc: "Manage themes and dashboard visuals.",
    icon: MoonStar,
    color: "from-emerald-500 to-green-500",
  },
];

export default function Settings() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="
              text-5xl
              font-bold
              tracking-tight
              bg-gradient-to-r
              from-white
              via-violet-200
              to-blue-200
              bg-clip-text
              text-transparent
            "
          >
            Settings
          </h1>

          <p className="text-zinc-400 mt-3 text-lg">
            Customize your AI productivity experience.
          </p>
        </div>

        {/* BADGE */}
        <div
          className="
            flex items-center gap-3
            rounded-2xl
            border border-white/10
            bg-white/[0.04]
            px-5 py-3
            backdrop-blur-xl
          "
        >
          <div
            className="
              h-10 w-10
              rounded-xl
              bg-gradient-to-br
              from-violet-500
              to-blue-500
              flex items-center justify-center
              shadow-[0_0_35px_rgba(99,102,241,0.35)]
            "
          >
            <Sparkles size={18} />
          </div>

          <div>
            <p className="text-sm font-medium text-white">
              Smart Settings
            </p>

            <p className="text-xs text-zinc-400">
              AI personalization enabled
            </p>
          </div>
        </div>
      </div>

      {/* SETTINGS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingsCards.map((card) => {
          const Icon = card.icon;

          return (
            <PremiumCard
              key={card.title}
              className="
                p-6
                relative
                overflow-hidden
              "
            >
              {/* GLOW */}
              <div
                className={`
                  absolute
                  top-0
                  right-0
                  h-32
                  w-32
                  rounded-full
                  blur-3xl
                  opacity-20
                  bg-gradient-to-br
                  ${card.color}
                `}
              />

              <div className="relative z-10">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-white">
                      {card.title}
                    </h2>

                    <p className="text-zinc-400 mt-3 max-w-sm">
                      {card.desc}
                    </p>
                  </div>

                  <div
                    className={`
                      h-14
                      w-14
                      rounded-2xl
                      bg-gradient-to-br
                      ${card.color}
                      flex items-center justify-center
                      shadow-[0_0_30px_rgba(99,102,241,0.25)]
                    `}
                  >
                    <Icon size={24} />
                  </div>
                </div>

                <button
                  className="
                    mt-8
                    rounded-2xl
                    border border-white/10
                    bg-white/[0.04]
                    px-5 py-3
                    text-sm
                    font-medium
                    text-white
                    transition-all
                    hover:bg-white/[0.08]
                    hover:border-white/20
                  "
                >
                  Configure
                </button>
              </div>
            </PremiumCard>
          );
        })}
      </div>

      {/* SECURITY PANEL */}
      <PremiumCard className="p-6">
        <div className="flex items-center gap-4">
          <div
            className="
              h-16
              w-16
              rounded-3xl
              bg-gradient-to-br
              from-violet-500
              to-blue-500
              flex items-center justify-center
              shadow-[0_0_35px_rgba(99,102,241,0.35)]
            "
          >
            <Shield size={28} />
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-white">
              Security & Privacy
            </h3>

            <p className="text-zinc-400 mt-1">
              Your AI productivity data is securely encrypted.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
          {[
            {
              label: "Two-factor Authentication",
              value: "Enabled",
            },
            {
              label: "Cloud Sync",
              value: "Active",
            },
            {
              label: "AI Data Protection",
              value: "Secured",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="
                rounded-2xl
                border border-white/10
                bg-white/[0.03]
                p-5
              "
            >
              <p className="text-zinc-400 text-sm">
                {item.label}
              </p>

              <h4 className="text-xl font-semibold mt-2">
                {item.value}
              </h4>
            </div>
          ))}
        </div>
      </PremiumCard>
    </motion.div>
  );
}
