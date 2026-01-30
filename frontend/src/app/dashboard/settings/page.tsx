'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { useTheme } from 'next-themes';

export default function SettingsPage() {
  const [taskSorting, setTaskSorting] = useState<'date' | 'priority' | 'alphabetical'>('date');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { theme, setTheme } = useTheme();

  const handleSaveSettings = () => {
    // Save settings logic would go here
    alert('Settings saved successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-white">Task Settings</h1>

      <div className="glass-effect bg-[#000000]/25 backdrop-blur-2xl border border-gray-600/30 rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Display Preferences</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-white">
            Task Sorting Order
          </label>
          <select
            value={taskSorting}
            onChange={(e) => setTaskSorting(e.target.value as 'date' | 'priority' | 'alphabetical')}
            className="w-full p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            <option value="date" className="bg-[#000000]/25">Sort by Date</option>
            <option value="priority" className="bg-[#000000]/25">Sort by Priority</option>
            <option value="alphabetical" className="bg-[#000000]/25">Sort Alphabetically</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              className="form-checkbox h-5 w-5 text-purple-500 focus:ring-purple-500 bg-white/10 backdrop-blur-sm border border-white/20"
            />
            <span className="text-white">Enable Task Notifications</span>
          </label>
        </div>
      </div>

      <div className="glass-effect bg-[#000000]/25 backdrop-blur-2xl border border-gray-600/30 rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Appearance</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-white">
            Theme
          </label>
          <div className="flex space-x-4">
            <button
              onClick={() => setTheme('light')}
              className={`px-4 py-2 rounded-lg ${
                theme === 'light'
                  ? 'bg-gradient-to-r from-[#222222] to-[#444444] text-white shadow-lg'
                  : 'bg-[#000000]/25 text-white border border-gray-600/30 backdrop-blur-sm'
              }`}
            >
              Light
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`px-4 py-2 rounded-lg ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-[#222222] to-[#444444] text-white shadow-lg'
                  : 'bg-[#000000]/25 text-white border border-gray-600/30 backdrop-blur-sm'
              }`}
            >
              Dark
            </button>
            <button
              onClick={() => setTheme('system')}
              className={`px-4 py-2 rounded-lg ${
                theme === 'system'
                  ? 'bg-gradient-to-r from-[#222222] to-[#444444] text-white shadow-lg'
                  : 'bg-[#000000]/25 text-white border border-gray-600/30 backdrop-blur-sm'
              }`}
            >
              System
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} variant="primary">
          Save Settings
        </Button>
      </div>
    </div>
  );
}