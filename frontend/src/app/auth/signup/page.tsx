// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { useAuth } from '@/hooks/useAuth';

// export default function SignupPage() {
//   const router = useRouter();
//   const { register, error, clearError } = useAuth();
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     clearError();

//     try {
//       await register(name, email, password);
//       router.push('/dashboard');
//       router.refresh(); // Refresh to update the UI
//     } catch (err) {
//       // Error is handled by the auth context
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="relative min-h-screen bg-gradient-to-br from-black to-[#111111] overflow-hidden">
//       {/* Floating Spheres Background */}
//       <div className="absolute inset-0 overflow-hidden">
//         {/* Metallic gray spheres with subtle white highlight for metallic shine */}
//         <div className="absolute rounded-full w-24 h-24 top-1/5 left-1/6 opacity-50 bg-gradient-to-br from-[#333333] to-[#888888] border border-white/10 shadow-lg blur-md animate-float1 scale-100 hover:scale-105" />
//         <div className="absolute rounded-full w-32 h-32 top-2/3 left-1/4 opacity-50 bg-gradient-to-br from-[#333333] to-[#888888] border border-white/10 shadow-lg blur-lg animate-float2 scale-100 hover:scale-105" />
//         <div className="absolute rounded-full w-20 h-20 top-1/3 left-3/4 opacity-50 bg-gradient-to-br from-[#333333] to-[#888888] border border-white/10 shadow-lg blur-md animate-float3 scale-100 hover:scale-105" />
//         <div className="absolute rounded-full w-28 h-28 top-3/4 left-3/5 opacity-50 bg-gradient-to-br from-[#333333] to-[#888888] border border-white/10 shadow-lg blur-lg animate-float4 scale-100 hover:scale-105" />
//         <div className="absolute rounded-full w-26 h-26 top-1/4 left-2/5 opacity-50 bg-gradient-to-br from-[#333333] to-[#888888] border border-white/10 shadow-lg blur-md animate-float5 scale-100 hover:scale-105" />
//         <div className="absolute rounded-full w-30 h-30 top-2/5 left-4/5 opacity-50 bg-gradient-to-br from-[#333333] to-[#888888] border border-white/10 shadow-lg blur-lg animate-float6 scale-100 hover:scale-105" />
//       </div>

//       {/* Main Content */}
//       <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
//         <div className="w-full max-w-md">
//           {/* Center frosted glass card */}
//           <div className="bg-[#000000]/25 backdrop-blur-2xl border border-gray-600/30 rounded-3xl shadow-2xl p-8 text-center">
//             <h2 className="text-5xl font-bold text-white mb-4">SIGN UP</h2>
//             <p className="mt-4 text-lg text-[#d1d5db] mb-8">
//               Create your account to get started
//             </p>

//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div>
//                 <label htmlFor="name" className="block font-medium text-white text-sm mb-2">
//                   Full Name
//                 </label>
//                 <div className="mt-1">
//                   <input
//                     id="name"
//                     name="name"
//                     type="text"
//                     autoComplete="name"
//                     required
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     className="block px-3 py-2 border border-white/20 rounded-lg w-full text-white bg-white/10 backdrop-blur-sm sm:text-sm placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30"
//                     placeholder="Enter your full name"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label htmlFor="email" className="block font-medium text-white text-sm mb-2">
//                   Email address
//                 </label>
//                 <div className="mt-1">
//                   <input
//                     id="email"
//                     name="email"
//                     type="email"
//                     autoComplete="email"
//                     required
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="block px-3 py-2 border border-white/20 rounded-lg w-full text-white bg-white/10 backdrop-blur-sm sm:text-sm placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30"
//                     placeholder="Enter your email"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label htmlFor="password" className="block font-medium text-white text-sm mb-2">
//                   Password
//                 </label>
//                 <div className="mt-1">
//                   <input
//                     id="password"
//                     name="password"
//                     type="password"
//                     autoComplete="new-password"
//                     required
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="block px-3 py-2 border border-white/20 rounded-lg w-full text-white bg-white/10 backdrop-blur-sm sm:text-sm placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30"
//                     placeholder="Enter your password"
//                   />
//                 </div>
//               </div>

//               {error && (
//                 <div className="bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg backdrop-blur-sm">
//                   <div className="text-sm">{error}</div>
//                 </div>
//               )}

//               <div>
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="flex justify-center px-6 py-3 rounded-lg text-base font-bold text-white bg-gradient-to-r from-[#222222] to-[#444444] hover:from-[#444444] hover:to-[#666666] hover:scale-105 hover:shadow-glow transition-all duration-300 w-full shadow-lg"
//                 >
//                   {loading ? 'Creating account...' : 'SIGN UP'}
//                 </button>
//               </div>

//               <div className="text-[#d1d5db] text-sm text-center">
//                 Already have an account?{' '}
//                 <Link href="/auth/login" className="font-medium text-white hover:text-white">
//                   Sign in
//                 </Link>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>

//       {/* Custom CSS for animations */}
//       <style jsx global>{`
//         @keyframes float1 {
//           0%, 100% { transform: translate(0, 0) scale(1); }
//           25% { transform: translate(20px, 20px) scale(1.05); }
//           50% { transform: translate(0, 20px) scale(1.03); }
//           75% { transform: translate(-20px, 10px) scale(1.04); }
//         }
//         @keyframes float2 {
//           0%, 100% { transform: translate(0, 0) scale(1); }
//           25% { transform: translate(-15px, -15px) scale(1.04); }
//           50% { transform: translate(-20px, 0) scale(1.02); }
//           75% { transform: translate(10px, -20px) scale(1.05); }
//         }
//         @keyframes float3 {
//           0%, 100% { transform: translate(0, 0) scale(1); }
//           25% { transform: translate(25px, -10px) scale(1.03); }
//           50% { transform: translate(15px, 25px) scale(1.04); }
//           75% { transform: translate(-10px, 15px) scale(1.02); }
//         }
//         @keyframes float4 {
//           0%, 100% { transform: translate(0, 0) scale(1); }
//           25% { transform: translate(-20px, 25px) scale(1.05); }
//           50% { transform: translate(25px, -20px) scale(1.03); }
//           75% { transform: translate(0, -15px) scale(1.04); }
//         }
//         @keyframes float5 {
//           0%, 100% { transform: translate(0, 0) scale(1); }
//           25% { transform: translate(15px, -25px) scale(1.02); }
//           50% { transform: translate(-25px, -15px) scale(1.04); }
//           75% { transform: translate(-15px, 25px) scale(1.03); }
//         }
//         @keyframes float6 {
//           0%, 100% { transform: translate(0, 0) scale(1); }
//           25% { transform: translate(-25px, 15px) scale(1.05); }
//           50% { transform: translate(20px, 25px) scale(1.02); }
//           75% { transform: translate(25px, -10px) scale(1.04); }
//         }

//         .animate-float1 { animation: float1 17s ease-in-out infinite; }
//         .animate-float2 { animation: float2 19s ease-in-out infinite; }
//         .animate-float3 { animation: float3 21s ease-in-out infinite; }
//         .animate-float4 { animation: float4 23s ease-in-out infinite; }
//         .animate-float5 { animation: float5 18s ease-in-out infinite; }
//         .animate-float6 { animation: float6 20s ease-in-out infinite; }

//         .hover\\:scale-105:hover { transform: scale(1.05); }
//         .hover\\:shadow-glow:hover { box-shadow: 0 0 20px rgba(100, 100, 100, 0.5); }
//       `}</style>
//     </div>
//   );
// }


'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function SignupPage() {
  const router = useRouter();
  const { register, error, clearError } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearError();

    try {
      await register(name, email, password);
      router.push('/dashboard');
      router.refresh(); // Refresh to update the UI
    } catch (err) {
      // Error is handled by the auth context
    } finally {
      setLoading(false);
    }
  };

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
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Center frosted glass card */}
          <div className="bg-[#000000]/25 backdrop-blur-2xl border border-gray-600/30 rounded-3xl shadow-2xl p-8 text-center">
            <h2 className="text-5xl font-bold text-white mb-4">SIGN UP</h2>
            <p className="mt-4 text-lg text-[#d1d5db] mb-8">
              Create your account to get started
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block font-medium text-white text-sm mb-2">
                  Full Name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block px-3 py-2 border border-white/20 rounded-lg w-full text-white bg-white/10 backdrop-blur-sm sm:text-sm placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block font-medium text-white text-sm mb-2">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block px-3 py-2 border border-white/20 rounded-lg w-full text-white bg-white/10 backdrop-blur-sm sm:text-sm placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block font-medium text-white text-sm mb-2">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block px-3 py-2 border border-white/20 rounded-lg w-full text-white bg-white/10 backdrop-blur-sm sm:text-sm placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg backdrop-blur-sm">
                  <div className="text-sm">{error}</div>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex justify-center px-6 py-3 rounded-lg text-base font-bold text-white bg-gradient-to-r from-[#222222] to-[#444444] hover:from-[#444444] hover:to-[#666666] hover:scale-105 hover:shadow-glow transition-all duration-300 w-full shadow-lg"
                >
                  {loading ? 'Creating account...' : 'SIGN UP'}
                </button>
              </div>

              <div className="text-[#d1d5db] text-sm text-center">
                Already have an account?{' '}
                <Link href="/auth/login" className="font-medium text-white hover:text-white">
                  Sign in
                </Link>
              </div>
            </form>
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
