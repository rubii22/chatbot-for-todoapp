'use client';

import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { Task } from '@/types/tasks';
import TaskForm from '@/components/tasks/TaskForm';
import TaskList from '@/components/tasks/TaskList';
import TaskFilter from '@/components/tasks/TaskFilter';

export default function MyTasksPage() {
  const { tasks, loading, error, createTask, updateTask, deleteTask } = useTasks();

  // FIX: State type matches TaskFilter expected prop
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Filter tasks based on current filter state
  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const handleCreateTask = async (taskData: { title: string; description?: string }) => {
    try {
      await createTask(taskData);
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  const handleUpdateTask = async (id: string, updatedTask: Partial<Task>) => {
    try {
      await updateTask(id, updatedTask);
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id);
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="glass-effect bg-[#000000]/25 backdrop-blur-2xl border border-gray-600/30 rounded-2xl p-6">
          Loading tasks...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-white">My Tasks</h1>

        <div className="glass-effect bg-[#000000]/25 backdrop-blur-2xl border border-gray-600/30 rounded-2xl p-6 mb-6">
          <TaskForm onCreateTask={handleCreateTask} />
        </div>

        <div className="glass-effect bg-[#000000]/25 backdrop-blur-2xl border border-gray-600/30 rounded-2xl p-4 mb-6">
          {/*
            FIX: Updated TaskFilter props to match TaskFilterProps interface
            ✅ currentFilter instead of filter
            ✅ taskCount added
          */}
          <TaskFilter
            currentFilter={filter}
            onFilterChange={setFilter}
            taskCount={filteredTasks.length}
          />
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg backdrop-blur-sm mb-6">
            {error}
          </div>
        )}

        <div className="glass-effect bg-[#000000]/25 backdrop-blur-2xl border border-gray-600/30 rounded-2xl overflow-hidden">
          <TaskList
            tasks={filteredTasks}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        </div>
      </div>
    </div>
  );
}
