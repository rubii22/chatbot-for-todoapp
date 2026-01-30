import React, { useState } from 'react';
import { Task } from '@/types/tasks';

interface TaskCardProps {
  task: Task;
  onUpdate: (updatedTask: Partial<Task>) => void;
  onDelete: () => void;
}

export default function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');

  const handleSave = () => {
    onUpdate({ title, description });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitle(task.title);
    setDescription(task.description || '');
    setIsEditing(false);
  };

  const handleToggleComplete = () => {
    onUpdate({ completed: !task.completed });
  };

  return (
    <div className={`glass-effect bg-[#000000]/25 backdrop-blur-2xl border border-gray-600/30 rounded-2xl p-4 mb-3 ${task.completed ? 'bg-[#000000]/20' : ''}`}>
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white"
            autoFocus
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white"
            rows={2}
          />
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="bg-gradient-to-r from-[#222222] to-[#444444] inline-flex items-center px-3 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 font-medium text-white text-sm shadow-lg hover:from-[#444444] hover:to-[#666666] hover:scale-105 hover:shadow-glow transition-all duration-300"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="bg-[#000000]/25 inline-flex items-center px-3 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 font-medium text-white text-sm border border-gray-600/30 backdrop-blur-sm hover:bg-white/10"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={handleToggleComplete}
              className="mt-1 border-gray-600/30 rounded w-4 h-4 text-purple-500 focus:ring-purple-500 bg-white/10 backdrop-blur-sm"
            />
            <div className="flex-1 ml-3">
              <h3 className={`text-lg font-medium ${task.completed ? 'line-through text-gray-400' : 'text-white'}`}>
                {task.title}
              </h3>
              {task.description && (
                <p className={`mt-1 text-sm ${task.completed ? 'text-gray-500' : 'text-gray-300'}`}>
                  {task.description}
                </p>
              )}
              <p className="mt-2 text-gray-500 text-xs">
                Created: {new Date(task.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-3">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-[#000000]/25 inline-flex items-center px-3 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 font-medium text-white text-sm border border-gray-600/30 backdrop-blur-sm hover:bg-white/10 hover:scale-105 hover:shadow-glow transition-all duration-300"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="bg-gradient-to-r from-[#222222] to-[#444444] inline-flex items-center px-3 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 font-medium text-white text-sm shadow-lg hover:from-[#444444] hover:to-[#666666] hover:scale-105 hover:shadow-glow transition-all duration-300"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}