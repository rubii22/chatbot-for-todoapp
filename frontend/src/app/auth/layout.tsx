import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col justify-center bg-gray-50 sm:px-6 lg:px-8 py-12 min-h-screen">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 font-extrabold text-gray-900 text-3xl text-center">
          Todo App
        </h2>
        <p className="mt-2 text-gray-600 text-sm text-center">
          Sign in to your account
        </p>
      </div>

      <div className="sm:mx-auto mt-8 sm:w-full sm:max-w-md">
        {children}
      </div>
    </div>
  );
}