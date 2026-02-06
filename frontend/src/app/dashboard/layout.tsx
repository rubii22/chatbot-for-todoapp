'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="relative flex justify-center items-center bg-gradient-to-br from-black to-[#111111] min-h-screen overflow-hidden">
        {/* Minimal Background - 3 spheres */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="top-1/4 left-1/6 absolute bg-gradient-to-br from-[#333333] to-[#888888] opacity-20 shadow-lg blur-lg border border-white/10 rounded-full w-32 h-32 animate-float1" />
          <div className="top-2/3 left-3/4 absolute bg-gradient-to-br from-[#333333] to-[#888888] opacity-20 shadow-lg blur-md border border-white/10 rounded-full w-24 h-24 animate-float2" />
          <div className="top-1/2 left-1/2 absolute bg-gradient-to-br from-[#333333] to-[#888888] opacity-15 shadow-lg blur-lg border border-white/10 rounded-full w-28 h-28 animate-float3" />
        </div>

        <div className="z-10 relative flex flex-col items-center gap-4">
          <div className="border-4 border-white/20 border-t-white rounded-full w-12 h-12 animate-spin"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Redirect happens in useEffect
  }

  return (
    <div className="relative bg-gradient-to-br from-black to-[#111111] min-h-screen overflow-hidden">
      {/* Minimal Background - 3 spheres */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="top-1/4 left-1/6 absolute bg-gradient-to-br from-[#333333] to-[#888888] opacity-20 shadow-lg blur-lg border border-white/10 rounded-full w-32 h-32 animate-float1" />
        <div className="top-2/3 left-3/4 absolute bg-gradient-to-br from-[#333333] to-[#888888] opacity-20 shadow-lg blur-md border border-white/10 rounded-full w-24 h-24 animate-float2" />
        <div className="top-1/2 left-1/2 absolute bg-gradient-to-br from-[#333333] to-[#888888] opacity-15 shadow-lg blur-lg border border-white/10 rounded-full w-28 h-28 animate-float3" />
      </div>

      <div className="z-10 relative">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 pt-16 pr-4 pb-8 pl-4 md:pl-64">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}