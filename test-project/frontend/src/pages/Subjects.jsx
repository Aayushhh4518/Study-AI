import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Plus, Trash2 } from 'lucide-react';
import { useData } from '../store/DataContext';
import Modal from '../components/ui/Modal';

export default function Subjects() {
  const { data, addSubject, deleteSubject, updateSubjectProgress, searchQuery } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSubject, setNewSubject] = useState({ title: '', color: 'bg-indigo-500' });

  const filteredSubjects = data.subjects.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newSubject.title.trim()) return;
    addSubject(newSubject);
    setNewSubject({ title: '', color: 'bg-indigo-500' });
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
          <h1 className="text-3xl font-bold text-white mb-2">Subjects</h1>
          <p className="text-slate-400">Manage your courses and learning materials.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-full font-medium flex items-center gap-2 shadow-lg shadow-indigo-500/25 hover:bg-indigo-500 transition-colors"
        >
          <Plus className="w-5 h-5" /> Add Subject
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredSubjects.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-400 bg-slate-800/20 rounded-3xl border border-slate-700/50">
            No subjects found.
          </div>
        ) : (
          filteredSubjects.map((subject) => (
            <motion.div layout key={subject.id} className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 p-6 rounded-3xl shadow-xl flex flex-col gap-4 group cursor-pointer hover:bg-slate-800/60 transition-colors relative">
              <button
                onClick={(e) => { e.stopPropagation(); deleteSubject(subject.id); }}
                className="absolute top-4 right-4 p-2 text-slate-500 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-slate-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl ${subject.color}/10 text-${subject.color.split('-')[1]}-500`}>
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white pr-8">{subject.title}</h3>
              </div>
              <div className="w-full mt-4 flex flex-col gap-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={subject.progress}
                  onChange={(e) => updateSubjectProgress(subject.id, parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700/50 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50 accent-indigo-500"
                />
                <div className="w-full bg-slate-700/50 rounded-full h-2 relative pointer-events-none mt-1">
                  <div className={`h-2 rounded-full transition-all duration-300 ${subject.color}`} style={{ width: `${subject.progress}%` }}></div>
                </div>
              </div>
              <p className="text-sm text-slate-400 text-right mt-1">{subject.progress}% Completed</p>
            </motion.div>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Subject">
        <form onSubmit={handleAdd} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-slate-300">Subject Name</label>
            <input
              type="text"
              required
              value={newSubject.title}
              onChange={e => setNewSubject({ ...newSubject, title: e.target.value })}
              className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="E.g., Quantum Physics"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-slate-300">Color Theme</label>
            <div className="flex gap-3">
              {['bg-indigo-500', 'bg-emerald-500', 'bg-rose-500', 'bg-amber-500', 'bg-purple-500'].map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setNewSubject({ ...newSubject, color })}
                  className={`w-8 h-8 rounded-full ${color} ${newSubject.color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900' : ''}`}
                />
              ))}
            </div>
          </div>
          <button type="submit" className="mt-4 bg-indigo-600 text-white py-2.5 rounded-xl font-medium hover:bg-indigo-500 transition-colors">
            Create Subject
          </button>
        </form>
      </Modal>
    </motion.div>
  );
}
