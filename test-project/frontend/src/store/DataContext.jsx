import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

const initialData = {
  tasks: [
    { id: '1', title: 'Complete Physics Lab Report', due: 'Today, 11:59 PM', priority: 'High', color: 'bg-rose-500', completed: false },
    { id: '2', title: 'Read Chapter 4: Data Structures', due: 'Tomorrow, 9:00 AM', priority: 'Medium', color: 'bg-amber-500', completed: false },
  ],
  subjects: [
    { id: '1', title: 'Computer Science 101', progress: 75, color: 'bg-indigo-500' },
    { id: '2', title: 'Advanced Mathematics', progress: 40, color: 'bg-emerald-500' },
  ],
  events: [
    { id: '1', title: 'Math Midterm', date: '2026-05-25', time: '10:00 AM' }
  ],
  focusSessions: 14,
};

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('studyai_data');
    return saved ? JSON.parse(saved) : initialData;
  });

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    localStorage.setItem('studyai_data', JSON.stringify(data));
  }, [data]);

  // Tasks
  const addTask = (task) => {
    setData(prev => ({ ...prev, tasks: [...prev.tasks, { ...task, id: uuidv4(), completed: false }] }));
    toast.success('Task added successfully!');
  };

  const toggleTask = (id) => {
    setData(prev => {
      const isCompleting = !prev.tasks.find(t => t.id === id).completed;
      if (isCompleting) toast.success('Task completed! Great job 🎉');
      return {
        ...prev,
        tasks: prev.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
      };
    });
  };

  const deleteTask = (id) => {
    setData(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) }));
    toast.error('Task deleted.');
  };

  // Subjects
  const addSubject = (subject) => {
    setData(prev => ({ ...prev, subjects: [...prev.subjects, { ...subject, id: uuidv4(), progress: 0 }] }));
    toast.success('Subject added!');
  };

  const deleteSubject = (id) => {
    setData(prev => ({ ...prev, subjects: prev.subjects.filter(s => s.id !== id) }));
  };

  const updateSubjectProgress = (id, progress) => {
    setData(prev => ({
      ...prev,
      subjects: prev.subjects.map(s => s.id === id ? { ...s, progress } : s)
    }));
  };

  // Events
  const addEvent = (event) => {
    setData(prev => ({ ...prev, events: [...prev.events, { ...event, id: uuidv4() }] }));
    toast.success('Event scheduled!');
  };

  const deleteEvent = (id) => {
    setData(prev => ({ ...prev, events: prev.events.filter(e => e.id !== id) }));
  };

  const recordFocusSession = () => {
    setData(prev => ({ ...prev, focusSessions: prev.focusSessions + 1 }));
  };

  return (
    <DataContext.Provider value={{
      data, addTask, toggleTask, deleteTask,
      addSubject, deleteSubject, updateSubjectProgress,
      addEvent, deleteEvent,
      recordFocusSession,
      searchQuery, setSearchQuery
    }}>
      {children}
    </DataContext.Provider>
  );
};
