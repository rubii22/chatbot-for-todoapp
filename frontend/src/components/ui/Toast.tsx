import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type = 'info', onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const typeClasses = {
    success: 'bg-green-500/20 dark:bg-green-500/30 text-green-700 dark:text-green-300',
    error: 'bg-red-500/20 dark:bg-red-500/30 text-red-700 dark:text-red-300',
    warning: 'bg-yellow-500/20 dark:bg-yellow-500/30 text-yellow-700 dark:text-yellow-300',
    info: 'bg-blue-500/20 dark:bg-blue-500/30 text-blue-700 dark:text-blue-300',
  };

  return (
    <div className={`fixed top-4 right-4 glass-effect ${typeClasses[type]} px-4 py-2 rounded-md shadow-lg z-50`}>
      <div className="flex items-center">
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-4 text-[#5E3023] dark:text-[#F3E9DC] hover:text-[#C08552] focus:outline-none"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}