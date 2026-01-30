import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export default function TextArea({
  label,
  error,
  helperText,
  className = '',
  ...props
}: TextAreaProps) {
  const errorOrHelper = error || helperText;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={props.id} className="block text-sm font-medium text-[#5E3023] dark:text-[#F3E9DC] mb-1">
          {label}
        </label>
      )}
      <textarea
        {...props}
        className={`glass-effect shadow-sm block w-full sm:text-sm rounded-md ${
          error
            ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500'
            : 'border-[#C08552] text-[#5E3023] dark:text-[#F3E9DC] placeholder-[#5E3023]/50 dark:placeholder-[#F3E9DC]/50 focus:outline-none focus:ring-[#C08552] focus:border-[#C08552]'
        } ${props.disabled ? 'bg-[#F3E9DC]/30 dark:bg-[#5E3023]/30' : ''} ${className}`}
      />
      {errorOrHelper && (
        <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-[#5E3023]/70 dark:text-[#F3E9DC]/70'}`}>
          {errorOrHelper}
        </p>
      )}
    </div>
  );
}