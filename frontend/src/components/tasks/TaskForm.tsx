import React, { useState } from 'react';
import { CreateTaskRequest } from '@/types/tasks';

interface TaskFormProps {
  onCreateTask: (taskData: CreateTaskRequest) => void;
}

export default function TaskForm({ onCreateTask }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    onCreateTask({ title: title.trim(), description: description.trim() });

    // Reset form
    setTitle('');
    setDescription('');
    setError('');
  };

  return (
    <div className="glass-effect bg-[#000000]/25 backdrop-blur-2xl border border-gray-600/30 rounded-2xl p-6 sm:rounded-2xl overflow-hidden">
      <h2 className="mb-4 font-medium text-white text-lg">Create New Task</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg backdrop-blur-sm">
            <div className="text-sm">{error}</div>
          </div>
        )}

        <div>
          <label htmlFor="title" className="block font-medium text-white text-sm">
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError(''); // Clear error when user starts typing
            }}
            className="block mt-1 px-3 py-2 rounded-lg w-full bg-white/10 backdrop-blur-sm sm:text-sm text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
            placeholder="What needs to be done?"
          />
        </div>

        <div>
          <label htmlFor="description" className="block font-medium text-white text-sm">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="block mt-1 px-3 py-2 rounded-lg w-full bg-white/10 backdrop-blur-sm sm:text-sm text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
            placeholder="Add details about this task..."
          />
        </div>

        <div>
          <button
            type="submit"
            className="bg-gradient-to-r from-[#222222] to-[#444444] inline-flex items-center px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 font-medium text-white text-sm shadow-lg hover:from-[#444444] hover:to-[#666666] hover:scale-105 hover:shadow-glow transition-all duration-300"
          >
            Add Task
          </button>
        </div>
      </form>
    </div>
  );
}