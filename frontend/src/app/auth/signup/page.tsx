'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import AuthLayout from '@/components/AuthLayout';
import Input from '@/components/Input';

export default function SignupPage() {
  const router = useRouter();
  const { register, error, clearError } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearError();

    try {
      await register(name, email, password);
      setSuccess(true);

      // Show success message for 2 seconds before redirecting
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (err) {
      // Error is handled by the auth context
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create Account" subtitle="Sign up to get started with your tasks">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name Field */}
        <Input
          label="Full Name"
          type="text"
          name="name"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
        />

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
          autoComplete="new-password"
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

        {/* Success Message */}
        {success && (
          <div className="bg-green-500/20 backdrop-blur-sm px-4 py-3 border border-green-500/30 rounded-lg text-green-200">
            <p className="text-sm">✅ Account created successfully! Redirecting to login...</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || success}
          className="flex justify-center items-center bg-gradient-to-r from-[#222222] hover:from-[#333333] to-[#444444] hover:to-[#555555] disabled:opacity-50 hover-shadow-glow px-6 py-3 rounded-lg w-full font-semibold text-white text-base transition-all duration-300 disabled:cursor-not-allowed hover-scale"
        >
          {loading ? (
            <>
              <svg className="mr-3 -ml-1 w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </>
          ) : success ? (
            '✅ Account Created!'
          ) : (
            'Create Account'
          )}
        </button>

        {/* Footer Link */}
        <div className="text-gray-300 text-sm text-center">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-medium text-white hover:text-gray-200 transition-colors">
            Sign in
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
