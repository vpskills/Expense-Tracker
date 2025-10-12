import { forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const InputField = forwardRef(
  (
    {
      label = '',
      type = 'text',
      placeholder,
      icon: Icon,
      className = '',
      showPasswordToggle = false,
      onTogglePassword,
      showPassword = false,
      mendatory = false,
      ...props
    },
    ref
  ) => {
    return (
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}

        {label && <label className="block text-sm font-semibold mb-2 dark:text-neutral-200">{label}{mendatory?"*":""}</label>}

        <input
          type={type}
          placeholder={placeholder}
          ref={ref}
          className={`block w-full ${
            Icon ? 'pl-10' : 'pl-3'
          } w-full text-sm md:text-md px-4 py-3 outline-none border text-gray-300 font-nunito bg-neutral-900 border-neutral-800 md:rounded-lg rounded-md focus:ring-4 focus:ring-gray-600 transition-all ${className}`}
          {...props}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPassword ? (
              <Eye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
            ) : (
              <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
            )}
          </button>
        )}
      </div>
    );
  }
);

export default InputField;
