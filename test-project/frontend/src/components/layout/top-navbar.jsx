export default function TopNavbar() {
  return (
    <header className="h-20 border-b border-white/10 bg-black/30 backdrop-blur-xl flex items-center justify-between px-6 lg:px-10">
      <div>
        <h1 className="text-2xl font-bold">StudyAI</h1>

        <p className="text-sm text-zinc-400">
          AI-powered productivity platform
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500" />
      </div>
    </header>
  );
}
