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
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-[#111111] overflow-hidden">
        {/* Floating Spheres Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Metallic gray spheres with subtle white highlight for metallic shine */}
          <div className="absolute rounded-full w-24 h-24 top-1/5 left-1/6 opacity-50 bg-gradient-to-br from-[#333333] to-[#888888] border border-white/10 shadow-lg blur-md animate-float1 scale-100 hover:scale-105" />
          <div className="absolute rounded-full w-32 h-32 top-2/3 left-1/4 opacity-50 bg-gradient-to-br from-[#333333] to-[#888888] border border-white/10 shadow-lg blur-lg animate-float2 scale-100 hover:scale-105" />
          <div className="absolute rounded-full w-20 h-20 top-1/3 left-3/4 opacity-50 bg-gradient-to-br from-[#333333] to-[#888888] border border-white/10 shadow-lg blur-md animate-float3 scale-100 hover:scale-105" />
          <div className="absolute rounded-full w-28 h-28 top-3/4 left-3/5 opacity-50 bg-gradient-to-br from-[#333333] to-[#888888] border border-white/10 shadow-lg blur-lg animate-float4 scale-100 hover:scale-105" />
          <div className="absolute rounded-full w-26 h-26 top-1/4 left-2/5 opacity-50 bg-gradient-to-br from-[#333333] to-[#888888] border border-white/10 shadow-lg blur-md animate-float5 scale-100 hover:scale-105" />
          <div className="absolute rounded-full w-30 h-30 top-2/5 left-4/5 opacity-50 bg-gradient-to-br from-[#333333] to-[#888888] border border-white/10 shadow-lg blur-lg animate-float6 scale-100 hover:scale-105" />
        </div>
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black to-[#111111] overflow-hidden">
      {/* Floating Spheres Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Metallic gray spheres with subtle white highlight for metallic shine */}
        <div className="absolute rounded-full w-24 h-24 top-1/5 left-1/6 opacity-50 bg-gradient-to-br from-[#333333] to-[#888888] border border-white/10 shadow-lg blur-md animate-float1 scale-100 hover:scale-105" />
        <div className="absolute rounded-full w-32 h-32 top-2/3 left-1/4 opacity-50 bg-gradient-to-br from-[#333333] to-[#888888] border border-white/10 shadow-lg blur-lg animate-float2 scale-100 hover:scale-105" />
        <div className="absolute rounded-full w-20 h-20 top-1/3 left-3/4 opacity-50 bg-gradient-to-br from-[#333333] to-[#888888] border border-white/10 shadow-lg blur-md animate-float3 scale-100 hover:scale-105" />
        <div className="absolute rounded-full w-28 h-28 top-3/4 left-3/5 opacity-50 bg-gradient-to-br from-[#333333] to-[#888888] border border-white/10 shadow-lg blur-lg animate-float4 scale-100 hover:scale-105" />
        <div className="absolute rounded-full w-26 h-26 top-1/4 left-2/5 opacity-50 bg-gradient-to-br from-[#333333] to-[#888888] border border-white/10 shadow-lg blur-md animate-float5 scale-100 hover:scale-105" />
        <div className="absolute rounded-full w-30 h-30 top-2/5 left-4/5 opacity-50 bg-gradient-to-br from-[#333333] to-[#888888] border border-white/10 shadow-lg blur-lg animate-float6 scale-100 hover:scale-105" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Hero Section */}
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="w-full max-w-md md:max-w-lg lg:max-w-xl">
            {/* Center frosted glass card */}
            <div className="bg-[#000000]/25 backdrop-blur-xl border border-gray-700/30 rounded-3xl shadow-2xl p-8 md:p-10 text-center">
              <h1 className="text-5xl font-bold text-white mb-4">
                Welcome to Todo App
              </h1>
              <p className="mt-4 text-xl text-gray-300 max-w-2xl mx-auto">
                Organize your tasks effortlessly and stay productive every day!
              </p>

              <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/auth/signup">
                  <button
                    type="button"
                    className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 rounded-lg text-base md:text-lg font-bold text-white bg-gradient-to-r from-[#222222] to-[#444444] hover:from-[#444444] hover:to-[#666666] hover:scale-105 hover:shadow-glow transition-all duration-300"
                  >
                    Sign Up
                  </button>
                </Link>

                <Link href="/auth/login">
                  <button
                    type="button"
                    className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 rounded-lg text-base md:text-lg font-bold text-white bg-gradient-to-r from-[#222222] to-[#444444] hover:from-[#444444] hover:to-[#666666] hover:scale-105 hover:shadow-glow transition-all duration-300"
                  >
                    Sign In
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards Section */}
        <div className="pb-12 px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Smart Organization Card */}
            <div className="bg-black/15 backdrop-blur-lg border border-gray-800/30 rounded-xl shadow-lg p-6 text-center">
              <h3 className="text-xl font-bold text-white mb-2">Smart Organization</h3>
              <p className="text-gray-300">
                Intelligent categorization and prioritization of your tasks.
              </p>
            </div>

            {/* Cross-Device Sync Card */}
            <div className="bg-black/15 backdrop-blur-lg border border-gray-800/30 rounded-xl shadow-lg p-6 text-center">
              <h3 className="text-xl font-bold text-white mb-2">Cross-Device Sync</h3>
              <p className="text-gray-300">
                Access your tasks from anywhere, on any device.
              </p>
            </div>

            {/* Secure & Private Card */}
            <div className="bg-black/15 backdrop-blur-lg border border-gray-800/30 rounded-xl shadow-lg p-6 text-center">
              <h3 className="text-xl font-bold text-white mb-2">Secure & Private</h3>
              <p className="text-gray-300">
                Military-grade encryption to keep your data safe.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx global>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, 20px) scale(1.05); }
          50% { transform: translate(0, 20px) scale(1.03); }
          75% { transform: translate(-20px, 10px) scale(1.04); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(-15px, -15px) scale(1.04); }
          50% { transform: translate(-20px, 0) scale(1.02); }
          75% { transform: translate(10px, -20px) scale(1.05); }
        }
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(25px, -10px) scale(1.03); }
          50% { transform: translate(15px, 25px) scale(1.04); }
          75% { transform: translate(-10px, 15px) scale(1.02); }
        }
        @keyframes float4 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(-20px, 25px) scale(1.05); }
          50% { transform: translate(25px, -20px) scale(1.03); }
          75% { transform: translate(0, -15px) scale(1.04); }
        }
        @keyframes float5 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(15px, -25px) scale(1.02); }
          50% { transform: translate(-25px, -15px) scale(1.04); }
          75% { transform: translate(-15px, 25px) scale(1.03); }
        }
        @keyframes float6 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(-25px, 15px) scale(1.05); }
          50% { transform: translate(20px, 25px) scale(1.02); }
          75% { transform: translate(25px, -10px) scale(1.04); }
        }

        .animate-float1 { animation: float1 17s ease-in-out infinite; }
        .animate-float2 { animation: float2 19s ease-in-out infinite; }
        .animate-float3 { animation: float3 21s ease-in-out infinite; }
        .animate-float4 { animation: float4 23s ease-in-out infinite; }
        .animate-float5 { animation: float5 18s ease-in-out infinite; }
        .animate-float6 { animation: float6 20s ease-in-out infinite; }

        .hover\\:scale-105:hover { transform: scale(1.05); }
        .hover\\:shadow-glow:hover { box-shadow: 0 0 20px rgba(100, 100, 100, 0.5); }
      `}</style>
    </div>
  );
}