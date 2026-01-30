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

        <div className="text-white text-2xl z-10">Loading...</div>

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
        `}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Redirect happens in useEffect
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

      <div className="relative z-10">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 pb-8 pt-16 pl-4 pr-4 md:pl-64">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
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
      `}</style>
    </div>
  );
}