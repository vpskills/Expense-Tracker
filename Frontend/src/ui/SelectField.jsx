const SelectField = ({
  label,
  value,
  onChange,
  options = [],
  isLoading = true,
  placeholder = 'Select an option',
  className = '',
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && <label className="block text-sm font-semibold mb-2">{label}</label>}

      <select
        value={value}
        onChange={onChange}
        className="w-full font-mon text-sm md:text-md p-3 md:rounded-lg rounded-md border-2 border-neutral-800 bg-neutral-900 font-semibold outline-none transition-all duration-200"
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>

        {options.map((option) => (
          <option key={option.id || option.value} value={option.id || option.value} className="font-semibold font-mon ">
            {isLoading
              ? 'loading...'
              : option.emoji
              ? `${option.emoji} ${option.label}`
              : option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectField;
