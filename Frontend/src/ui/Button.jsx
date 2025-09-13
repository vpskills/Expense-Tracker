const Button = ({
  children,
  type = "button",
  isLoading = false,
  className = "",
  onClick,
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading}
      className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all ${
        isLoading ? "opacity-70 cursor-not-allowed" : ""
      } ${className}`}
      {...props}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
};

export default Button;