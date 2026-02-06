'use client';

import { ReactNode } from 'react';

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    subtitle: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    return (
        <div className="relative bg-black rounded-2xl overflow-hidden">
            {/* Main Content */}
            <div className="z-10 relative flex justify-center items-center p-4 sm:p-6 lg:p-8">
                <div className="w-full">
                    {/* Card */}
                    <div className="backdrop-blur-2xl p-6 sm:p-8">
                        {/* Header */}
                        <div className="mb-6 sm:mb-8 text-center">
                            <h2 className="mb-2 font-bold text-white text-3xl sm:text-4xl">
                                {title}
                            </h2>
                            <p className="text-gray-300 text-sm sm:text-base">
                                {subtitle}
                            </p>
                        </div>

                        {/* Form Content */}
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
