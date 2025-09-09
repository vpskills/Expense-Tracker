const InputField = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  className = "",
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-semibold mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-4 outline-none border bg-neutral-900 border-neutral-800 rounded-xl focus:ring-4 focus:ring-gray-600 transition-all"
        {...props}
      />
    </div>
  );
};

export default InputField

