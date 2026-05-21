import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Book, Target, Flame, Play, MoreVertical, Sparkles, CheckCircle2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import PomodoroTimer from '../components/dashboard/PomodoroTimer';
import { useData } from '../store/DataContext';
import { Card } from '../components/ui/Card';
import TasksWidget from '../components/dashboard/TasksWidget';
import AIWidget from '../components/dashboard/AIWidget';

const chartData = [
  { name: 'Mon', focus: 2 },
  { name: 'Tue', focus: 3.5 },
  { name: 'Wed', focus: 4 },
  { name: 'Thu', focus: 3 },
  { name: 'Fri', focus: 5 },
  { name: 'Sat', focus: 2.5 },
  { name: 'Sun', focus: 4.5 },
];

// Stagger animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Dashboard() {
  // Safely handle data in case context is still initializing
  const { data } = useData() || {};
  const tasks = data?.tasks || [];
  const activeTasksCount = tasks.filter(t => !t?.completed).length;
  const focusHours = data?.focusSessions ? (data.focusSessions * 25 / 60).toFixed(1) : '0.0';
  const subjectsCount = data?.subjects?.length || 0;

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-8 w-full pb-12"
    >
      {/* Hero Section */}
      <motion.header variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 relative">
        <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> AI Ready
            </span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            Welcome back, Alex
          </h1>
          <p className="text-slate-400 text-lg max-w-xl">
            You have <strong className="text-white">{activeTasksCount} pending tasks</strong> today. Let's make it a productive session.
          </p>
        </div>
        <div className="flex gap-4">
          <button className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-6 py-3 rounded-xl font-medium transition-all">
            View Schedule
          </button>
          <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all transform hover:-translate-y-0.5">
            <BrainCircuit className="w-5 h-5" />
            Start AI Session
          </button>
        </div>
      </motion.header>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Study Streak', value: '14 Days', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'group-hover:border-orange-500/30' },
          { label: 'Focus Hours', value: `${focusHours}h`, icon: Target, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'group-hover:border-emerald-500/30' },
          { label: 'Active Subjects', value: subjectsCount, icon: Book, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'group-hover:border-purple-500/30' },
          { label: 'Pending Tasks', value: activeTasksCount, icon: CheckCircle2, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'group-hover:border-blue-500/30' },
        ].map((stat, i) => (
          <Card key={i} className={`p-6 relative overflow-hidden group cursor-pointer transition-all duration-300 ${stat.border}`}>
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity ${stat.bg}`} />
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-white mb-1 tracking-tight">{stat.value}</h3>
              <p className="text-sm font-medium text-slate-400">{stat.label}</p>
            </div>
          </Card>
        ))}
      </motion.div>

      {/* Main Grid Row 1 */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pomodoro Timer */}
        <div className="lg:col-span-1 h-full">
          <PomodoroTimer />
        </div>

        {/* Main Chart */}
        <Card className="lg:col-span-2 p-6 flex flex-col group">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight mb-1">Productivity Flow</h2>
              <p className="text-sm text-slate-400">Your focus hours over the last 7 days</p>
            </div>
            <select className="bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl px-4 py-2 text-sm outline-none transition-colors cursor-pointer appearance-none pr-8 relative">
              <option>This Week</option>
              <option>Last Week</option>
              <option>This Month</option>
            </select>
          </div>
          <div className="h-[280px] w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} dx={-10} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', backdropFilter: 'blur(8px)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: 'white', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: 'white' }}
                />
                <Area type="monotone" dataKey="focus" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorFocus)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>

      {/* Main Grid Row 2 */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-full">
          <TasksWidget tasks={tasks} />
        </div>
        <div className="lg:col-span-1 h-full">
          <AIWidget />
        </div>
      </motion.div>

    </motion.div>
  );
}
