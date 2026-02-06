'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import AuthLayout from '@/components/AuthLayout';
import Input from '@/components/Input';

export default function LoginPage() {
  const router = useRouter();
  const { login, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearError();

    try {
      await login(email, password);
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      // Error is handled by the auth context
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to your account to continue">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Field */}
        <Input
          label="Email address"
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />

        {/* Password Field */}
        <Input
          label="Password"
          type="password"
          name="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 backdrop-blur-sm px-4 py-3 border border-red-500/30 rounded-lg text-red-200">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="flex justify-center items-center bg-gradient-to-r from-[#222222] hover:from-[#333333] to-[#444444] hover:to-[#555555] disabled:opacity-50 hover-shadow-glow px-6 py-3 rounded-lg w-full font-semibold text-white text-base transition-all duration-300 disabled:cursor-not-allowed hover-scale"
        >
          {loading ? (
            <>
              <svg className="mr-3 -ml-1 w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </button>

        {/* Footer Links */}
        <div className="space-y-3 text-sm text-center">
          <div className="text-gray-300">
            <Link href="/auth/forgot-password" className="font-medium text-white hover:text-gray-200 transition-colors">
              Forgot password?
            </Link>
          </div>

          <div className="text-gray-300">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="font-medium text-white hover:text-gray-200 transition-colors">
              Sign up
            </Link>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
}
