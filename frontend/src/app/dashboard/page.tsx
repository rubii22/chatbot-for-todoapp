'use client';

import { useState, useEffect } from 'react';
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

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-white">My Tasks</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <div className="glass-effect bg-[#000000]/25 backdrop-blur-2xl border border-gray-600/30 rounded-2xl p-6 mb-6">
            <TaskForm onCreateTask={createTask} />
          </div>

          <div className="mt-8">
            <div className="glass-effect bg-[#000000]/25 backdrop-blur-2xl border border-gray-600/30 rounded-2xl p-4 mb-6">
              <TaskFilter
                currentFilter={filter}
                onFilterChange={setFilter}
                taskCount={filteredTasks.length}
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg backdrop-blur-sm mb-6">
                <div className="text-sm">{error}</div>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center h-32">
                <p className="text-white">Loading tasks...</p>
              </div>
            ) : (
              <div className="glass-effect bg-[#000000]/25 backdrop-blur-2xl border border-gray-600/30 rounded-2xl overflow-hidden">
                <TaskList
                  tasks={filteredTasks}
                  onUpdateTask={updateTask}
                  onDeleteTask={deleteTask}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chatbot Integration - Only show if user is authenticated */}
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