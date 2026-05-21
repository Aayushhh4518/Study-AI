import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, MoreHorizontal, ArrowRight } from 'lucide-react';
import { Card } from '../ui/Card';

export default function TasksWidget({ tasks = [] }) {
  // Mock tasks if empty to show off the UI
  const displayTasks = tasks.length > 0 ? tasks.slice(0, 4) : [
    { id: 1, title: 'Complete AI Lab Report', priority: 'High', subject: 'Machine Learning', time: '2h' },
    { id: 2, title: 'Read Chapter 4', priority: 'Medium', subject: 'Physics', time: '4h' },
    { id: 3, title: 'Math Assignment', priority: 'High', subject: 'Mathematics', time: 'Tomorrow' },
  ];

  return (
    <Card className="h-full flex flex-col relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10" />
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Upcoming Tasks</h2>
          <p className="text-sm text-slate-400 mt-1">You have {displayTasks.length} tasks due soon</p>
        </div>
        <button className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 space-y-3">
        {displayTasks.map((task, i) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group/item flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="text-slate-500 group-hover/item:text-blue-400 transition-colors">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-slate-200 font-medium group-hover/item:text-white transition-colors">{task.title}</h4>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-white/5 text-slate-400">{task.subject}</span>
                  <span className={`text-xs font-medium ${task.priority === 'High' ? 'text-rose-400' : 'text-amber-400'}`}>
                    {task.priority} Priority
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Clock className="w-4 h-4" />
              <span>{task.time}</span>
            </div>
          </motion.div>
        ))}
      </div>
      
      <button className="w-full mt-4 py-3 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all flex items-center justify-center gap-2 font-medium">
        View All Tasks <ArrowRight className="w-4 h-4" />
      </button>
    </Card>
  );
}