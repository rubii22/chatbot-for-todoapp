import React from 'react';
import { Task } from '@/types/tasks';
import TaskCard from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  onUpdateTask: (id: string, updatedTask: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
}

export default function TaskList({ tasks, onUpdateTask, onDeleteTask }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="py-12 text-center">
        <svg
          className="mx-auto w-12 h-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <h3 className="mt-2 font-medium text-white text-sm">No tasks</h3>
        <p className="mt-1 text-gray-400 text-sm">Get started by creating a new task.</p>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-2xl overflow-hidden">
      <ul className="divide-y divide-gray-600/30">
        {tasks.map((task) => (
          <li key={task.id}>
            <TaskCard
              task={task}
              onUpdate={(updatedTask) => onUpdateTask(task.id, updatedTask)}
              onDelete={() => onDeleteTask(task.id)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}