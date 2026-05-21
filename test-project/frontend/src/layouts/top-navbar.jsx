import { Bell, Search, Sparkles } from "lucide-react";

export default function TopNavbar() {
  return (
    <header
      className="
        sticky
        top-0
        z-50
        w-full
        border-b
        border-white/10
        bg-[#070B14]/70
        backdrop-blur-2xl
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
          px-6
          py-4
        "
      >
        {/* LEFT */}
        <div>
          <h1
            className="
              text-3xl
              font-bold
              bg-gradient-to-r
              from-white
              via-violet-200
              to-blue-300
              bg-clip-text
              text-transparent
            "
          >
            StudyAI
          </h1>

          <p className="text-sm text-zinc-500">
            AI-powered productivity platform
          </p>
        </div>

        {/* CENTER SEARCH */}
        <div className="hidden lg:flex flex-1 justify-center px-10">
          <div
            className="
              flex
              items-center
              gap-3
              w-full
              max-w-xl
              rounded-2xl
              border border-white/10
              bg-white/[0.04]
              px-4
              py-3
              backdrop-blur-xl
            "
          >
            <Search size={18} className="text-zinc-500" />

            <input
              type="text"
              placeholder="Search tasks, subjects, analytics..."
              className="
                w-full
                bg-transparent
                outline-none
                text-sm
                placeholder:text-zinc-500
              "
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          {/* AI Button */}
          <button
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
              shadow-[0_0_35px_rgba(99,102,241,0.35)]
              transition-all
              hover:scale-105
            "
          >
            <Sparkles size={18} />
          </button>

          {/* Notification */}
          <button
            className="
              h-12
              w-12
              rounded-2xl
              border border-white/10
              bg-white/[0.04]
              backdrop-blur-xl
              flex
              items-center
              justify-center
              hover:bg-white/[0.08]
              transition-all
            "
          >
            <Bell size={18} />
          </button>

          {/* Profile */}
          <div
            className="
              h-12
              w-12
              rounded-2xl
              bg-gradient-to-br
              from-cyan-400
              to-blue-600
              shadow-[0_0_35px_rgba(59,130,246,0.35)]
            "
          />
        </div>
      </div>
    </header>
  );
}
