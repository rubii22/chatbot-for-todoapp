'use client';

import React from 'react';

export type FilterType = 'all' | 'active' | 'completed';

interface TaskFilterProps {
  currentFilter: FilterType;
  onFilterChange: React.Dispatch<React.SetStateAction<FilterType>>;
  taskCount: number;
}

export default function TaskFilter({
  currentFilter,
  onFilterChange,
  taskCount,
}: TaskFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4">
      <div className="text-sm text-white mb-2 sm:mb-0">
        Filter tasks ({taskCount})
      </div>

      <div className="flex space-x-1">
        {(['all', 'active', 'completed'] as FilterType[]).map((type) => (
          <button
            key={type}
            onClick={() => onFilterChange(type)}
            className={`px-3 py-1 text-sm rounded-md transition ${
              currentFilter === type
                ? 'bg-gradient-to-r from-[#222222] to-[#444444] text-white shadow-lg'
                : 'bg-[#000000]/25 text-white border border-gray-600/30 backdrop-blur-sm hover:bg-white/10'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
