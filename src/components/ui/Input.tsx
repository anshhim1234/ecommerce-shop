import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = true, className = '', ...props }, ref) => {
    const inputClasses = `px-3 py-2 rounded-md border ${
      error ? 'border-red-500' : 'border-gray-300'
    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
      fullWidth ? 'w-full' : ''
    } ${className}`;

    return (
      <div className={`${fullWidth ? 'w-full' : ''} space-y-1`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <input ref={ref} className={inputClasses} {...props} />
        {error && (
          <p className="text-sm text-red-600 mt-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;