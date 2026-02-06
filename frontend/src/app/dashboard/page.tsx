'use client';

import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useAuth } from '@/hooks/useAuth';
import TaskList from '@/components/tasks/TaskList';
import TaskForm from '@/components/tasks/TaskForm';
import TaskFilter from '@/components/tasks/TaskFilter';
import ChatbotButton from '../../../chatbot/ChatbotButton';
import ChatWindow from '../../../chatbot/ChatWindowSimple';

export default function DashboardPage() {
  const {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask
  } = useTasks();

  const { user } = useAuth();

  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const activeTasks = tasks.filter(t => !t.completed).length;
  const completedTasks = tasks.filter(t => t.completed).length;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="mb-2 font-bold text-white text-3xl">My Tasks</h1>
        <p className="text-gray-400 text-sm">
          {activeTasks} active · {completedTasks} completed
        </p>
      </div>

      {/* Stats Cards */}
      <div className="gap-4 grid grid-cols-1 md:grid-cols-3 mb-8">
        <div className="bg-white/5 hover:bg-white/10 backdrop-blur-sm p-4 border border-white/10 rounded-xl transition-all">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">Total Tasks</p>
              <p className="mt-1 font-bold text-white text-2xl">{tasks.length}</p>
            </div>
            <div className="flex justify-center items-center bg-blue-500/20 rounded-lg w-12 h-12">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white/5 hover:bg-white/10 backdrop-blur-sm p-4 border border-white/10 rounded-xl transition-all">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">Active</p>
              <p className="mt-1 font-bold text-white text-2xl">{activeTasks}</p>
            </div>
            <div className="flex justify-center items-center bg-yellow-500/20 rounded-lg w-12 h-12">
              <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white/5 hover:bg-white/10 backdrop-blur-sm p-4 border border-white/10 rounded-xl transition-all">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">Completed</p>
              <p className="mt-1 font-bold text-white text-2xl">{completedTasks}</p>
            </div>
            <div className="flex justify-center items-center bg-green-500/20 rounded-lg w-12 h-12">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Create Task Section */}
      <div className="bg-white/5 backdrop-blur-sm mb-6 p-6 border border-white/10 rounded-xl">
        <h2 className="mb-4 font-semibold text-white text-lg">Create New Task</h2>
        <TaskForm onCreateTask={createTask} />
      </div>

      {/* Filter and Tasks Section */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        {/* Filter Header */}
        <div className="p-4 border-white/10 border-b">
          <TaskFilter
            currentFilter={filter}
            onFilterChange={setFilter}
            taskCount={filteredTasks.length}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 px-6 py-4 border-red-500/30 border-b text-red-200">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Task List */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-16">
            <div className="mb-4 border-4 border-white/20 border-t-white rounded-full w-12 h-12 animate-spin"></div>
            <p className="text-gray-400">Loading tasks...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="flex flex-col justify-center items-center py-16">
            <div className="flex justify-center items-center bg-white/5 mb-4 rounded-full w-16 h-16">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-400 text-lg">No tasks found</p>
            <p className="mt-1 text-gray-500 text-sm">
              {filter === 'all' ? 'Create your first task to get started' : `No ${filter} tasks`}
            </p>
          </div>
        ) : (
          <TaskList
            tasks={filteredTasks}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
          />
        )}
      </div>

      {/* Chatbot Integration */}
      {user && (
        <>
          <ChatbotButton onClick={toggleChat} />
          <ChatWindow
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            userId={user.id}
            apiUrl={process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}
          />
        </>
      )}
    </div>
  );
}