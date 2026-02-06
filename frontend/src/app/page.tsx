'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function HomePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="relative flex justify-center items-center bg-gradient-to-br from-black to-[#111111] overflow-hidden">
        {/* Minimal Background - 3 spheres */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="top-1/4 left-1/6 absolute bg-gradient-to-br from-[#333333] to-[#888888] opacity-30 shadow-lg blur-lg border border-white/10 rounded-full w-32 h-32 animate-float1" />
          <div className="top-2/3 left-3/4 absolute bg-gradient-to-br from-[#333333] to-[#888888] opacity-30 shadow-lg blur-md border border-white/10 rounded-full w-24 h-24 animate-float2" />
          <div className="top-1/2 left-1/2 absolute bg-gradient-to-br from-[#333333] to-[#888888] opacity-20 shadow-lg blur-lg border border-white/10 rounded-full w-28 h-28 animate-float3" />
        </div>

        <div className="z-10 relative flex flex-col items-center gap-4">
          <div className="border-4 border-white/20 border-t-white rounded-full w-12 h-12 animate-spin"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-br from-black to-[#111111] overflow-hidden">

      {/* Main Content */}
      <div className="z-10 relative flex flex-col">
        {/* Hero Section */}
        <div className="flex flex-grow justify-center items-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-md md:max-w-lg lg:max-w-xl">
            {/* Center Card */}
            <div className="bg-[#000000]/25 shadow-2xl backdrop-blur-xl p-6 sm:p-8 md:p-10 border border-gray-700/30 rounded-2xl text-center">
              <h1 className="mb-4 font-bold text-white text-4xl sm:text-5xl md:text-6xl">
                Todo App
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-gray-300 text-base sm:text-lg md:text-xl">
                Organize your tasks effortlessly and stay productive every day
              </p>

              <div className="flex sm:flex-row flex-col justify-center gap-4 mt-8">
                <Link href="/auth/signup">
                  <button
                    type="button"
                    className="bg-gradient-to-r from-[#222222] hover:from-[#333333] to-[#444444] hover:to-[#555555] hover-shadow-glow px-6 md:px-8 py-3 md:py-4 rounded-lg w-full sm:w-auto font-semibold text-white text-base md:text-lg transition-all duration-300 hover-scale"
                  >
                    Get Started
                  </button>
                </Link>

                <Link href="/auth/login">
                  <button
                    type="button"
                    className="hover:bg-white/10 px-6 md:px-8 py-3 md:py-4 border-2 border-white/30 hover:border-white/50 rounded-lg w-full sm:w-auto font-semibold text-white text-base md:text-lg transition-all duration-300 hover-scale"
                  >
                    Sign In
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards Section */}
        <div className="px-4 sm:px-6 lg:px-8 pb-12 lg:pb-16">
          <div className="gap-4 sm:gap-6 grid grid-cols-1 md:grid-cols-3 mx-auto max-w-6xl">
            {/* Smart Organization Card */}
            <div className="bg-black/15 hover:bg-black/20 shadow-lg backdrop-blur-lg p-5 sm:p-6 border border-gray-800/30 rounded-xl text-center transition-all duration-300">
              <div className="flex justify-center items-center bg-gradient-to-br from-[#444444] to-[#666666] mx-auto mb-4 rounded-lg w-12 h-12">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="mb-2 font-semibold text-white text-lg sm:text-xl">Smart Organization</h3>
              <p className="text-gray-300 text-sm sm:text-base">
                Intelligent categorization and prioritization of your tasks
              </p>
            </div>

            {/* Cross-Device Sync Card */}
            <div className="bg-black/15 hover:bg-black/20 shadow-lg backdrop-blur-lg p-5 sm:p-6 border border-gray-800/30 rounded-xl text-center transition-all duration-300">
              <div className="flex justify-center items-center bg-gradient-to-br from-[#444444] to-[#666666] mx-auto mb-4 rounded-lg w-12 h-12">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="mb-2 font-semibold text-white text-lg sm:text-xl">Cross-Device Sync</h3>
              <p className="text-gray-300 text-sm sm:text-base">
                Access your tasks from anywhere, on any device
              </p>
            </div>

            {/* Secure & Private Card */}
            <div className="bg-black/15 hover:bg-black/20 shadow-lg backdrop-blur-lg p-5 sm:p-6 border border-gray-800/30 rounded-xl text-center transition-all duration-300">
              <div className="flex justify-center items-center bg-gradient-to-br from-[#444444] to-[#666666] mx-auto mb-4 rounded-lg w-12 h-12">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="mb-2 font-semibold text-white text-lg sm:text-xl">Secure & Private</h3>
              <p className="text-gray-300 text-sm sm:text-base">
                Your data is encrypted and protected at all times
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}