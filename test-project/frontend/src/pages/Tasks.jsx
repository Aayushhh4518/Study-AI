import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Plus, Trash2 } from 'lucide-react';
import { useData } from '../store/DataContext';
import Modal from '../components/ui/Modal';

export default function Tasks() {
  const { data, addTask, toggleTask, deleteTask, searchQuery } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', due: '', priority: 'Medium', color: 'bg-indigo-500' });

  const filteredTasks = data.tasks.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    addTask(newTask);
    setNewTask({ title: '', due: '', priority: 'Medium', color: 'bg-indigo-500' });
    setIsModalOpen(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto flex flex-col gap-8 pb-12"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Tasks</h1>
          <p className="text-slate-400">Track your assignments and upcoming deadlines.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-full font-medium flex items-center gap-2 shadow-lg shadow-indigo-500/25 hover:bg-indigo-500 transition-colors"
        >
          <Plus className="w-5 h-5" /> Add Task
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 text-slate-400 bg-slate-800/20 rounded-3xl border border-slate-700/50">
            No tasks found. Enjoy your free time!
          </div>
        ) : (
          filteredTasks.map((task) => (
            <motion.div 
              layout
              key={task.id} 
              className={`bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 p-6 rounded-2xl shadow-lg flex items-center justify-between group transition-colors ${task.completed ? 'opacity-50 grayscale' : 'hover:bg-slate-800/60'}`}
            >
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => toggleTask(task.id)}
                  className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${task.completed ? 'bg-indigo-500 border-indigo-500' : 'border-2 border-slate-600 hover:border-indigo-500 group-hover:bg-indigo-500/10'}`}
                >
                  {task.completed && <CheckSquare className="w-4 h-4 text-white" />}
                </button>
                <div>
                  <h3 className={`font-bold mb-1 transition-all ${task.completed ? 'text-slate-500 line-through' : 'text-white'}`}>
                    {task.title}
                  </h3>
                  <p className="text-sm text-slate-400">Due: {task.due}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className={`px-3 py-1 rounded-full text-xs font-bold text-white ${task.color}`}>
                  {task.priority}
                </div>
                <button 
                  onClick={() => deleteTask(task.id)}
                  className="p-2 text-slate-500 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-slate-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Task">
        <form onSubmit={handleAdd} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-slate-300">Task Title</label>
            <input 
              type="text" 
              required
              value={newTask.title}
              onChange={e => setNewTask({...newTask, title: e.target.value})}
              className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors" 
              placeholder="E.g., Complete Math Assignment"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-slate-300">Due Date/Time</label>
            <input 
              type="text" 
              value={newTask.due}
              onChange={e => setNewTask({...newTask, due: e.target.value})}
              className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors" 
              placeholder="E.g., Tomorrow, 5:00 PM"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-slate-300">Priority</label>
              <select 
                value={newTask.priority}
                onChange={e => {
                  const val = e.target.value;
                  const color = val === 'High' ? 'bg-rose-500' : val === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500';
                  setNewTask({...newTask, priority: val, color});
                }}
                className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
          <button type="submit" className="mt-4 bg-indigo-600 text-white py-2.5 rounded-xl font-medium hover:bg-indigo-500 transition-colors">
            Create Task
          </button>
        </form>
      </Modal>
    </motion.div>
  );
}
