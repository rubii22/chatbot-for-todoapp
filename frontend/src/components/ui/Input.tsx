import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export default function Input({
  label,
  error,
  helperText,
  className = '',
  ...props
}: InputProps) {
  const errorOrHelper = error || helperText;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={props.id} className="block text-sm font-medium text-[#5E3023] dark:text-[#F3E9DC] mb-1">
          {label}
        </label>
      )}
      <input
        {...props}
        className={`glass-effect appearance-none block w-full px-3 py-2 border ${
          error
            ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500'
            : 'border-[#C08552] text-[#5E3023] dark:text-[#F3E9DC] placeholder-[#5E3023]/50 dark:placeholder-[#F3E9DC]/50 focus:outline-none focus:ring-[#C08552] focus:border-[#C08552]'
        } rounded-md shadow-sm ${
          props.disabled ? 'bg-[#F3E9DC]/30 dark:bg-[#5E3023]/30' : ''
        } sm:text-sm ${className}`}
      />
      {errorOrHelper && (
        <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-[#5E3023]/70 dark:text-[#F3E9DC]/70'}`}>
          {errorOrHelper}
        </p>
      )}
    </div>
  );
}