import { useState, useEffect } from 'react';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '@/types/tasks';
import { apiClient } from '@/lib/api';

interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  createTask: (taskData: CreateTaskRequest) => void;
  updateTask: (id: string, updatedTask: UpdateTaskRequest) => void;
  deleteTask: (id: string) => void;
}

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();

    // Listen for task-updated events to refresh tasks
    const handleTaskUpdated = () => {
      loadTasks();
    };

    window.addEventListener('task-updated', handleTaskUpdated);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('task-updated', handleTaskUpdated);
    };
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.get<{ tasks: any[]; }>('/tasks/');
      // Convert numeric IDs to strings to match frontend types
      const formattedTasks: Task[] = data.tasks.map(task => ({
        ...task,
        id: task.id.toString(),
        userId: task.user_id
      }));
      setTasks(formattedTasks);
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: CreateTaskRequest) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.post<any>('/tasks/', taskData);
      const newTask: Task = {
        ...data,
        id: data.id.toString(),
        userId: data.user_id
      };
      setTasks([newTask, ...tasks]);
    } catch (err) {
      setError('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id: string, updatedTask: UpdateTaskRequest) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.put<any>(`/tasks/${id}`, updatedTask);
      const updated: Task = {
        ...data,
        id: data.id.toString(),
        userId: data.user_id
      };
      setTasks(tasks.map(task => task.id === id ? updated : task));
    } catch (err) {
      setError('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await apiClient.delete(`/tasks/${id}`);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err) {
      setError('Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
  };
}