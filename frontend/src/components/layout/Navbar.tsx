'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useTheme } from 'next-themes';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 glass-effect z-10 backdrop-blur-xl border-b border-white/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-gray-300">Todo App</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <>
                <span className="text-[#e0e0e0] dark:text-gray-200">Welcome, {user.name || user.email}</span>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700/50 hover:from-gray-800 hover:to-gray-700 hover:shadow-lg hover:shadow-gray-900/50 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          <div className="-mr-2 flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 dark:text-gray-200 hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
            >
              <span className="sr-only">Open main menu</span>
              {/* Mobile menu button */}
              <svg
                className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, toggle classes based on menu state */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          {user && (
            <div className="px-4 py-2 border-t border-white/20">
              <p className="text-base font-medium text-gray-400 dark:text-gray-400">Signed in as:</p>
              <p className="text-base font-medium text-gray-200 dark:text-gray-200">{user.email}</p>
              <button
                onClick={handleLogout}
                className="mt-2 w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700/50 hover:from-gray-800 hover:to-gray-700 hover:shadow-lg hover:shadow-gray-900/50 hover:scale-105 transition-all duration-300"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}


