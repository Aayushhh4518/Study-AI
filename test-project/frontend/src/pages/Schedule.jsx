import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Plus, Trash2, Clock } from 'lucide-react';
import { useData } from '../store/DataContext';
import Modal from '../components/ui/Modal';

export default function Schedule() {
  const { data, addEvent, deleteEvent, searchQuery } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '' });

  const filteredEvents = data.events.filter(e => e.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newEvent.title.trim()) return;
    addEvent(newEvent);
    setNewEvent({ title: '', date: '', time: '' });
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
          <h1 className="text-3xl font-bold text-white mb-2">Schedule</h1>
          <p className="text-slate-400">Plan your week and never miss a study session.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-full font-medium flex items-center gap-2 shadow-lg shadow-indigo-500/25 hover:bg-indigo-500 transition-colors"
        >
          <Plus className="w-5 h-5" /> Add Event
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredEvents.length === 0 ? (
          <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 p-8 rounded-3xl shadow-xl flex flex-col items-center justify-center min-h-[400px]">
            <div className="p-4 rounded-full bg-slate-700/50 text-indigo-500 mb-4">
              <CalendarIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No upcoming events</h3>
            <p className="text-slate-400 max-w-sm text-center">Your schedule is clear. Enjoy your time or add new sessions.</p>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <motion.div layout key={event.id} className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 p-6 rounded-2xl shadow-lg flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="bg-indigo-500/10 text-indigo-500 p-3 rounded-xl">
                  <CalendarIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">{event.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1"><CalendarIcon className="w-3 h-3"/> {event.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {event.time}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => deleteEvent(event.id)}
                className="p-2 text-slate-500 hover:text-rose-500 transition-all rounded-lg hover:bg-slate-700"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </motion.div>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Event">
        <form onSubmit={handleAdd} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-slate-300">Event Title</label>
            <input 
              type="text" 
              required
              value={newEvent.title}
              onChange={e => setNewEvent({...newEvent, title: e.target.value})}
              className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors" 
              placeholder="E.g., Group Study Session"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-slate-300">Date</label>
              <input 
                type="date" 
                required
                value={newEvent.date}
                onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors" 
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-slate-300">Time</label>
              <input 
                type="time" 
                required
                value={newEvent.time}
                onChange={e => setNewEvent({...newEvent, time: e.target.value})}
                className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors" 
              />
            </div>
          </div>
          <button type="submit" className="mt-4 bg-indigo-600 text-white py-2.5 rounded-xl font-medium hover:bg-indigo-500 transition-colors">
            Save Event
          </button>
        </form>
      </Modal>
    </motion.div>
  );
}
