import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className = '', id, ...props }, ref) => {
        const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

        return (
            <div className="w-full">
                <label
                    htmlFor={inputId}
                    className="block mb-2 font-medium text-white text-sm"
                >
                    {label}
                </label>
                <input
                    ref={ref}
                    id={inputId}
                    className={`block w-full px-4 py-2.5 border rounded-lg text-white bg-white/10 backdrop-blur-sm text-sm placeholder-white/60 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${error
                            ? 'border-red-500/50 focus:ring-red-500/40'
                            : 'border-white/20 focus:ring-white/40'
                        } ${className}`}
                    {...props}
                />
                {error && (
                    <p className="mt-1.5 text-red-300 text-sm">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
