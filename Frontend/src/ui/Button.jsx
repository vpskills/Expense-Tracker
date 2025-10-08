import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  type = 'button',
  isLoading = false,
  className = '',
  onClick,
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading}
      className={`w-full flex justify-center py-3 px-4 border border-transparent md:rounded-lg rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ${
        isLoading ? 'opacity-70 cursor-not-allowed' : ''
      } ${className}`}
      {...props}
    >
      {isLoading ? <Loader2 className="animate-spin mx-auto" /> : children}
    </button>
  );
};

export default Button;
