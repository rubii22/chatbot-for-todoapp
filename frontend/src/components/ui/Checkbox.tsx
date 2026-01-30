import React from 'react';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export default function Checkbox({ checked, onChange, label, disabled = false }: CheckboxProps) {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className={`h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      />
      {label && (
        <label className={`ml-2 block text-sm ${disabled ? 'text-gray-500' : 'text-gray-700'}`}>
          {label}
        </label>
      )}
    </div>
  );
}