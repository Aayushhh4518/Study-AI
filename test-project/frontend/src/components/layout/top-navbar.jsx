import { Bell, Command, Search, Settings, Sparkles } from "lucide-react";

export default function TopNavbar() {
  return (
    <header
      className="
        sticky
        top-0
        z-40
        h-20
        border-b
        border-white/10
        bg-[#070B14]/70
        backdrop-blur-2xl
        flex
        items-center
        justify-between
        px-6
        lg:px-10
      "
    >
      {/* LEFT */}
      <div>
        <h1
          className="
            text-3xl
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
          StudyAI
        </h1>

        <p className="text-sm text-zinc-400 mt-1">
          AI-powered productivity platform
        </p>
      </div>

      {/* CENTER SEARCH */}
      <div className="hidden lg:flex flex-1 justify-center px-10">
        <div
          className="
            w-full
            max-w-2xl
            h-14
            rounded-2xl
            border
            border-white/10
            bg-white/[0.04]
            backdrop-blur-xl
            flex
            items-center
            px-5
            gap-4
            transition-all
            duration-300
            hover:border-violet-500/30
            hover:bg-white/[0.06]
          "
        >
          <Search size={20} className="text-zinc-400" />

          <input
            type="text"
            placeholder="Search subjects, tasks, AI insights..."
            className="
              flex-1
              bg-transparent
              outline-none
              text-sm
              text-white
              placeholder:text-zinc-500
            "
          />

          <div
            className="
              flex
              items-center
              gap-1
              px-2.5
              py-1
              rounded-lg
              border
              border-white/10
              bg-black/20
              text-xs
              text-zinc-400
            "
          >
            <Command size={12} />K
          </div>
        </div>
      </div>

      {/* RIGHT ACTIONS */}
      <div className="flex items-center gap-4">
        {/* AI BUTTON */}
        <button
          className="
            hidden
            md:flex
            items-center
            gap-2
            px-4
            py-3
            rounded-2xl
            border
            border-violet-500/20
            bg-gradient-to-r
            from-violet-500/10
            to-blue-500/10
            text-sm
            text-violet-200
            transition-all
            duration-300
            hover:scale-[1.02]
            hover:border-violet-500/40
          "
        >
          <Sparkles size={16} />
          AI Mode
        </button>

        {/* NOTIFICATION */}
        <button
          className="
            h-12
            w-12
            rounded-2xl
            border
            border-white/10
            bg-white/[0.04]
            flex
            items-center
            justify-center
            text-zinc-400
            transition-all
            duration-300
            hover:bg-white/[0.08]
            hover:text-white
          "
        >
          <Bell size={18} />
        </button>

        {/* SETTINGS */}
        <button
          className="
            h-12
            w-12
            rounded-2xl
            border
            border-white/10
            bg-white/[0.04]
            flex
            items-center
            justify-center
            text-zinc-400
            transition-all
            duration-300
            hover:bg-white/[0.08]
            hover:text-white
          "
        >
          <Settings size={18} />
        </button>

        {/* PROFILE */}
        <div
          className="
            h-12
            w-12
            rounded-2xl
            bg-gradient-to-br
            from-violet-500
            to-blue-500
            flex
            items-center
            justify-center
            text-sm
            font-bold
            shadow-[0_0_35px_rgba(99,102,241,0.35)]
          "
        >
          A
        </div>
      </div>
    </header>
  );
}
