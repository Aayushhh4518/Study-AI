import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  BrainCircuit,
  Clock3,
  Loader2,
  MoonStar,
  Shield,
  Sparkles,
  Sun,
  User,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import PremiumCard from "../components/ui/premium-card";
import { useData } from "../store/DataContext";

/* ── UI Components & Constants ─────────────────────────────────── */
function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0E1A] ${
        checked ? "bg-violet-500" : "bg-zinc-700"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

const settingsCards = [
  {
    id: "profile",
    title: "Profile Settings",
    desc: "Manage your account information and preferences.",
    icon: User,
    color: "from-violet-500 to-indigo-500",
  },
  {
    id: "ai",
    title: "AI Preferences",
    desc: "Customize AI productivity recommendations.",
    icon: BrainCircuit,
    color: "from-cyan-500 to-blue-500",
  },
  {
    id: "notifications",
    title: "Notifications",
    desc: "Control reminders and smart alerts.",
    icon: Bell,
    color: "from-pink-500 to-rose-500",
  },
  {
    id: "productivity",
    title: "Productivity",
    desc: "Configure Pomodoro timers and study workflow.",
    icon: Clock3,
    color: "from-emerald-500 to-teal-500",
  },
];

const modalTitles = {
  profile: "Profile Settings",
  ai: "AI Preferences",
  notifications: "Notification Settings",
  productivity: "Productivity & Focus",
};

export default function Settings() {
  const { data, updateSettings, updateProfile } = useData();
  const theme = data.settings.theme;

  const [activeModal, setActiveModal] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const [localSettings, setLocalSettings] = useState(data.settings);
  const [localProfile, setLocalProfile] = useState(data.profile);

  // Sync local form state when opening modals
  useEffect(() => {
    if (activeModal) {
      setLocalSettings(data.settings);
      setLocalProfile(data.profile);
      setErrors({}); // Clear errors when modal opens
    }
  }, [activeModal, data.settings, data.profile]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    updateSettings({ theme: newTheme });
  };

  const validateProfile = useCallback(() => {
    const newErrors = {};
    if (!localProfile.name?.trim()) {
      newErrors.name = "Name cannot be empty.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(localProfile.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [localProfile]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    // Simulate network delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 750));

    if (activeModal === "profile") {
      if (!validateProfile()) {
        setIsSaving(false);
        return;
      }
      updateProfile(localProfile);
    } else {
      updateSettings(localSettings);
    }

    setIsSaving(false);
    setActiveModal(null);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setLocalProfile((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const renderModalContent = () => {
    switch (activeModal) {
      case "profile":
        return (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                Display Name
              </label>
              <input
                name="name"
                value={localProfile.name || ""}
                onChange={handleProfileChange}
                placeholder="Enter your name"
                className={`w-full bg-white/[0.03] border rounded-xl px-4 py-3 text-[15px] text-white focus:outline-none focus:ring-1 transition-all ${errors.name ? "border-rose-500/50 focus:border-rose-500" : "border-white/10 focus:border-violet-500"}`}
              />
              {errors.name && (
                <p className="text-rose-500 text-xs mt-1.5">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                value={localProfile.email || ""}
                onChange={handleProfileChange}
                placeholder="your.email@example.com"
                className={`w-full bg-white/[0.03] border rounded-xl px-4 py-3 text-[15px] text-white focus:outline-none focus:ring-1 transition-all ${errors.email ? "border-rose-500/50 focus:border-rose-500" : "border-white/10 focus:border-violet-500"}`}
              />
              {errors.email && (
                <p className="text-rose-500 text-xs mt-1.5">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                Avatar URL
              </label>
              <input
                name="avatar"
                type="url"
                value={localProfile.avatar || ""}
                onChange={handleProfileChange}
                placeholder="https://example.com/avatar.png"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-[15px] text-white focus:outline-none focus:border-violet-500 focus:ring-1 transition-all"
              />
            </div>
          </div>
        );
      case "ai":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-[15px] font-semibold text-white">
                  AI Insights
                </h4>
                <p className="text-sm text-zinc-400">
                  Receive smart productivity suggestions.
                </p>
              </div>
              <Toggle
                checked={localSettings.aiInsightsEnabled ?? true}
                onChange={(v) =>
                  setLocalSettings({ ...localSettings, aiInsightsEnabled: v })
                }
              />
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div>
                <h4 className="text-[15px] font-semibold text-white">
                  Smart Recommendations
                </h4>
                <p className="text-sm text-zinc-400">
                  AI-driven task and focus scheduling.
                </p>
              </div>
              <Toggle
                checked={localSettings.smartRecommendations ?? true}
                onChange={(v) =>
                  setLocalSettings({
                    ...localSettings,
                    smartRecommendations: v,
                  })
                }
              />
            </div>
            <div className="pt-2 border-t border-white/10">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2 mt-4">
                AI Strictness
              </label>
              <select
                value={localSettings.aiStrictness || "balanced"}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    aiStrictness: e.target.value,
                  })
                }
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-violet-500 focus:ring-1 transition-all appearance-none cursor-pointer"
              >
                <option value="relaxed" className="bg-[#0A0E1A]">
                  Relaxed - Gentle nudges
                </option>
                <option value="balanced" className="bg-[#0A0E1A]">
                  Balanced - Standard coaching
                </option>
                <option value="strict" className="bg-[#0A0E1A]">
                  Strict - Hardcore accountability
                </option>
              </select>
            </div>
          </div>
        );
      case "notifications":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-[15px] font-semibold text-white">
                  Push Notifications
                </h4>
                <p className="text-sm text-zinc-400">
                  Allow alerts for timers and tasks.
                </p>
              </div>
              <Toggle
                checked={localSettings.notificationsEnabled ?? true}
                onChange={(v) =>
                  setLocalSettings({
                    ...localSettings,
                    notificationsEnabled: v,
                  })
                }
              />
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div>
                <h4 className="text-[15px] font-semibold text-white">
                  Email Summaries
                </h4>
                <p className="text-sm text-zinc-400">
                  Weekly productivity reports.
                </p>
              </div>
              <Toggle
                checked={localSettings.emailNotifications ?? false}
                onChange={(v) =>
                  setLocalSettings({ ...localSettings, emailNotifications: v })
                }
              />
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div>
                <h4 className="text-[15px] font-semibold text-white">
                  Motivational Alerts
                </h4>
                <p className="text-sm text-zinc-400">
                  Daily streak and goal reminders.
                </p>
              </div>
              <Toggle
                checked={localSettings.motivationalAlerts ?? true}
                onChange={(v) =>
                  setLocalSettings({ ...localSettings, motivationalAlerts: v })
                }
              />
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div>
                <h4 className="text-[15px] font-semibold text-white">
                  Sound Effects
                </h4>
                <p className="text-sm text-zinc-400">
                  Play a chime when sessions complete.
                </p>
              </div>
              <Toggle
                checked={localSettings.soundEnabled ?? true}
                onChange={(v) =>
                  setLocalSettings({ ...localSettings, soundEnabled: v })
                }
              />
            </div>
          </div>
        );
      case "productivity":
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                  Focus Duration (m)
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={localSettings.pomodoroWorkTime || 25}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      pomodoroWorkTime: Number(e.target.value),
                    })
                  }
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-[15px] text-white focus:outline-none focus:border-violet-500 focus:ring-1 transition-all [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                  Break Length (m)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={localSettings.pomodoroBreakTime || 5}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      pomodoroBreakTime: Number(e.target.value),
                    })
                  }
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-[15px] text-white focus:outline-none focus:border-violet-500 focus:ring-1 transition-all [color-scheme:dark]"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                  Long Break (m)
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={localSettings.pomodoroLongBreak || 15}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      pomodoroLongBreak: Number(e.target.value),
                    })
                  }
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-[15px] text-white focus:outline-none focus:border-violet-500 focus:ring-1 transition-all [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                  Daily Goal (hrs)
                </label>
                <input
                  type="number"
                  min="1"
                  max="24"
                  value={localSettings.dailyGoalHours || 4}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      dailyGoalHours: Number(e.target.value),
                    })
                  }
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-[15px] text-white focus:outline-none focus:border-violet-500 focus:ring-1 transition-all [color-scheme:dark]"
                />
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-2">
              <div>
                <h4 className="text-[15px] font-semibold text-white">
                  Auto-start Breaks
                </h4>
                <p className="text-sm text-zinc-400">
                  Automatically begin break timer.
                </p>
              </div>
              <Toggle
                checked={localSettings.autoStartBreaks ?? false}
                onChange={(v) =>
                  setLocalSettings({ ...localSettings, autoStartBreaks: v })
                }
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

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
            <p className="text-sm font-medium text-white">Smart Settings</p>

            <p className="text-xs text-zinc-400">AI personalization enabled</p>
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

                    <p className="text-zinc-400 mt-3 max-w-sm">{card.desc}</p>
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
                  onClick={() => setActiveModal(card.id)}
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

      {/* SYSTEM PANELS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* APPEARANCE PANEL */}
        <PremiumCard className="p-6 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 h-32 w-32 rounded-full blur-3xl opacity-20 bg-gradient-to-br from-emerald-500 to-cyan-500 pointer-events-none" />
          <div className="relative z-10 flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-white">
                  Appearance
                </h2>
                <p className="text-zinc-400 mt-2 max-w-sm">
                  Switch between premium dark and light themes.
                </p>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.25)]">
                {theme === "dark" ? <MoonStar size={24} /> : <Sun size={24} />}
              </div>
            </div>

            <div className="mt-8 flex flex-col xl:flex-row items-start xl:items-center gap-4">
              <button
                onClick={toggleTheme}
                className="rounded-2xl bg-gradient-to-r from-violet-500 to-blue-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(99,102,241,0.35)] whitespace-nowrap"
              >
                {theme === "dark"
                  ? "Switch to Light Mode"
                  : "Switch to Dark Mode"}
              </button>
              <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-zinc-300">
                Active Theme:
                <span className="ml-2 font-semibold capitalize text-white">
                  {theme}
                </span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
              <div>
                <h4 className="text-[15px] font-semibold text-white">
                  Reduced Motion
                </h4>
                <p className="text-sm text-zinc-400">
                  Disable complex background animations.
                </p>
              </div>
              <Toggle
                checked={data.settings.reducedMotion ?? false}
                onChange={(v) => updateSettings({ reducedMotion: v })}
              />
            </div>
          </div>
        </PremiumCard>

        {/* SECURITY PANEL */}
        <PremiumCard className="p-6 h-full flex flex-col">
          <div className="flex items-center gap-4">
            <div
              className="
                h-16 w-16 rounded-3xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shadow-[0_0_35px_rgba(99,102,241,0.35)] flex-shrink-0
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

          <div className="grid grid-cols-1 gap-4 mt-8 flex-1">
            {[
              { label: "Two-factor Authentication", value: "Enabled" },
              { label: "Cloud Sync", value: "Active" },
              { label: "AI Data Protection", value: "Secured" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <p className="text-zinc-400 text-sm">{item.label}</p>
                <h4 className="text-[15px] font-semibold text-emerald-400">
                  {item.value}
                </h4>
              </div>
            ))}
          </div>
        </PremiumCard>
      </div>

      {/* ── MODALS ── */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => !isSaving && setActiveModal(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#0A0E1A] border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col"
            >
              <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                <h3 className="text-lg font-bold text-white tracking-wide">
                  {modalTitles[activeModal]}
                </h3>
                <button
                  onClick={() => !isSaving && setActiveModal(null)}
                  className="text-zinc-500 hover:text-white transition-colors disabled:opacity-50"
                  disabled={isSaving}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-6">
                {renderModalContent()}

                <div className="pt-6 border-t border-white/10 flex items-center justify-end gap-3 mt-8">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    disabled={isSaving}
                    className="px-5 py-2.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all flex items-center justify-center gap-2 w-32 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
