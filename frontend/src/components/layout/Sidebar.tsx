import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
export default function Sidebar() {
  const { user } = useAuth();
  return (
    <div className="left-0 z-10 fixed inset-y-0 bg-[#000000]/25 backdrop-blur-2xl border-r border-gray-600/30 w-64">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-600/30">
          <h2 className="font-semibold text-white text-lg">Todo App</h2>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          <nav>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="flex items-center hover:bg-white/10 p-2 rounded-lg text-white transition-all duration-200 hover:scale-105 hover:shadow-glow">
                  <svg className="mr-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                  </svg>
                  <span>Dashboard</span>
                </Link>
              </li>

              <li>
                <Link href="/dashboard/mytasks" className="flex items-center hover:bg-white/10 p-2 rounded-lg text-white transition-all duration-200 hover:scale-105 hover:shadow-glow">
                  <svg className="mr-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                  <span>My Tasks</span>
                </Link>
              </li>

              <li>
                <Link href="/dashboard/settings" className="flex items-center hover:bg-white/10 p-2 rounded-lg text-white transition-all duration-200 hover:scale-105 hover:shadow-glow">
                  <svg className="mr-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span>Settings</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="p-4 border-t border-gray-600/30">
          <div className="flex items-center">
            <div className="flex justify-center items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl w-16 h-16">
              <div className='font-extrabold text-white text-3xl capitalize'>
                {user?.name?.charAt(0)}
              </div>
            </div>
            <div className="ml-3">
              <p className="font-medium text-white text-sm">
                {user?.name}
              </p>
              <p className="font-medium text-gray-400 text-xs">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}