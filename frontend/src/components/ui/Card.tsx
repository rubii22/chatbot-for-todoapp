import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export default function Card({ children, className = '', header, footer }: CardProps) {
  return (
    <div className={`glass-effect shadow overflow-hidden sm:rounded-lg ${className}`}>
      {header && <div className="px-4 py-5 sm:px-6 border-b border-[#C08552]/30 text-[#5E3023] dark:text-[#F3E9DC]">{header}</div>}
      <div className="px-4 py-5 sm:p-6 text-[#5E3023] dark:text-[#F3E9DC]">{children}</div>
      {footer && <div className="px-4 py-5 sm:px-6 border-t border-[#C08552]/30 text-[#5E3023] dark:text-[#F3E9DC]">{footer}</div>}
    </div>
  );
}