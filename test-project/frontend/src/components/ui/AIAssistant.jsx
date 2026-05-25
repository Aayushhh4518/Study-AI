import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, Sparkles, User, X } from "lucide-react";
import { useData } from "../../store/DataContext";

export default function AIAssistant() {
  const { data, stats } = useData();
  const { profile, settings } = data;

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      text: `Hi ${
        profile.name
      }! I'm your StudyAI assistant. How can I help you focus today?`,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    "Summarize my tasks",
    "How to beat procrastination?",
    "Generate a study schedule",
  ];

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isTyping, isOpen, scrollToBottom]);

  const handleSend = useCallback((text) => {
    if (!text.trim()) return;

    // Add user message
    const newMsg = { id: Date.now(), role: "user", text };
    setMessages((prev) => [...prev, newMsg]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI thinking and response
    setTimeout(() => {
      let reply = "I've noted that down. Let's keep focusing on your goals!";

      if (text.toLowerCase().includes("summarize")) {
        const pending = stats.pendingTasks;
        const high = stats.highPriorityTasks;
        if (pending > 0) {
          reply = `You have ${pending} pending task${pending > 1 ? "s" : ""}. ${
            high > 0
              ? `${high} of them are high priority.`
              : "No high priority tasks."
          } Keep up the great work!`;
        } else {
          reply =
            "You have no pending tasks. Great job staying on top of your work! 🎉";
        }
      } else if (text.toLowerCase().includes("procrastination")) {
        reply =
          "Try the Pomodoro Timer! Just 25 minutes of deep focus can break the cycle of procrastination.";
      } else if (text.toLowerCase().includes("schedule")) {
        reply =
          "I recommend studying Physics for 2 hours in the morning, followed by a 30-minute break, then Math.";
      }

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "assistant", text: reply },
      ]);
      setIsTyping(false);
    }, 1500);
  }, [stats.pendingTasks, stats.highPriorityTasks]);

  if (!settings.aiInsightsEnabled && !settings.smartRecommendations) {
    return null;
  }
  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        transition={{ duration: 0.2 }}
        onClick={() => setIsOpen(true)}
        className="
          fixed bottom-6 right-6 z-50 group
          h-[52px] w-[52px] rounded-2xl
          bg-gradient-to-br from-violet-500 via-indigo-500 to-cyan-500
          text-white shadow-[0_0_20px_rgba(139,92,246,0.35)]
          border border-white/20
          flex items-center justify-center
          hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:border-white/40
          transition-all duration-300
        "
      >
        <Sparkles
          size={22}
          className="group-hover:scale-110 transition-transform duration-300 drop-shadow-md"
        />
        <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 ring-2 ring-[#050816]"></span>
        </span>
      </motion.button>

      {/* Chat Window Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
            className="
              fixed bottom-24 right-6 z-50
              w-[360px] sm:w-[400px] h-[600px] max-h-[80vh]
              bg-[#0A0E1A]/95 backdrop-blur-2xl
              border border-white/[0.08] rounded-3xl
              shadow-[0_24px_60px_rgba(0,0,0,0.5)]
              flex flex-col overflow-hidden
            "
          >
            {/* Ambient background glow inside the panel */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 blur-[80px] rounded-full pointer-events-none" />

            {/* Header */}
            <div className="px-5 py-4 border-b border-white/[0.04] bg-white/[0.01] flex justify-between items-center z-10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-[0_0_12px_rgba(139,92,246,0.4)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]">
                  <Sparkles size={16} className="text-white drop-shadow-md" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-100 text-[14px] tracking-wide leading-none">
                    StudyAI Assistant
                  </h3>
                  <p className="text-[11px] text-zinc-400 flex items-center gap-1.5 mt-1 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                    System Active
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-zinc-500 hover:text-white transition-colors rounded-lg hover:bg-white/[0.05]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5 z-10 custom-scrollbar">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === "user" ? "bg-white/[0.05] border border-white/10 text-zinc-300" : "bg-gradient-to-br from-violet-500 to-indigo-500 text-white shadow-[0_0_12px_rgba(139,92,246,0.3)]"}`}
                  >
                    {msg.role === "user" ? (
                      <User size={14} />
                    ) : (
                      <Sparkles size={14} />
                    )}
                  </div>
                  <div
                    className={`
                    px-4 py-3 max-w-[82%] text-[13px] leading-relaxed shadow-sm font-medium tracking-wide
                    ${
                      msg.role === "user"
                        ? "bg-violet-500 text-white rounded-2xl rounded-tr-sm shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
                        : "bg-white/[0.03] border border-white/[0.05] text-zinc-200 rounded-2xl rounded-tl-sm"
                    }
                  `}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-white shadow-[0_0_12px_rgba(139,92,246,0.3)] flex items-center justify-center shrink-0">
                    <Sparkles size={14} />
                  </div>
                  <div className="px-4 py-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.05] rounded-tl-sm flex gap-1.5 items-center">
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.6,
                        ease: "easeInOut",
                        delay: 0,
                      }}
                      className="w-1.5 h-1.5 bg-zinc-500 rounded-full"
                    />
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.6,
                        ease: "easeInOut",
                        delay: 0.15,
                      }}
                      className="w-1.5 h-1.5 bg-zinc-500 rounded-full"
                    />
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.6,
                        ease: "easeInOut",
                        delay: 0.3,
                      }}
                      className="w-1.5 h-1.5 bg-zinc-500 rounded-full"
                    />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            {messages.length < 3 && !isTyping && (
              <div className="px-5 pb-3 pt-1 flex flex-wrap gap-2 shrink-0 z-10">
                {quickPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(prompt)}
                    className="text-[11px] font-medium bg-white/[0.03] hover:bg-white/[0.08] text-violet-300 border border-white/[0.06] hover:border-violet-500/30 px-3 py-1.5 rounded-lg transition-all duration-200 whitespace-nowrap"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 bg-[#0A0E1A] border-t border-white/[0.06] shrink-0 z-10">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(inputValue);
                }}
                className="flex items-center gap-2"
              >
                <div className="relative flex-1 group">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask StudyAI..."
                    className="
                      w-full bg-[#050812] border border-white/[0.06] text-zinc-200
                      rounded-xl pl-4 pr-10 py-3 text-[13px] font-medium
                      focus:outline-none focus:border-violet-500/40 focus:bg-violet-500/[0.02]
                      focus:ring-4 focus:ring-violet-500/10 focus:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]
                      transition-all duration-200 placeholder:text-zinc-600
                    "
                  />
                </div>
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="
                    p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-zinc-300
                    hover:bg-violet-500 hover:border-violet-500 hover:text-white
                    hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]
                    transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                    disabled:hover:bg-white/[0.04] disabled:hover:border-white/[0.08] disabled:hover:text-zinc-300 disabled:hover:shadow-none
                  "
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
