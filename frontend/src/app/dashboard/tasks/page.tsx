'use client';

import { useState, useEffect } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { Task } from '@/types/tasks';
import TaskForm from '@/components/tasks/TaskForm';
import TaskList from '@/components/tasks/TaskList';
import TaskFilter from '@/components/tasks/TaskFilter';

export default function TasksPage() {
  const { tasks, loading, error, createTask, updateTask, deleteTask } = useTasks();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

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
        <div className="glass-effect p-6 rounded-lg">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-[#5E3023] dark:text-white">My Tasks</h1>

        <div className="glass-effect rounded-2xl p-6 mb-6 backdrop-blur-xl border border-white/20 shadow-xl">
          <TaskForm onCreateTask={handleCreateTask} />
        </div>

        <div className="glass-effect rounded-2xl p-4 mb-6 backdrop-blur-xl border border-white/20 shadow-xl">
           {/* FIX: updated TaskFilter props to match TaskFilterProps interface */}
           <TaskFilter
              currentFilter={filter}
              onFilterChange={setFilter}
              taskCount={filteredTasks.length}
            />
        </div>

        {error && (
          <div className="glass-effect bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg mb-6 backdrop-blur-sm">
            {error}
          </div>
        )}

        <div className="glass-effect rounded-2xl overflow-hidden backdrop-blur-xl border border-white/20 shadow-xl">
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