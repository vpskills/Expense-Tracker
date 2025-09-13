const SelectField = ({ label, value, onChange, options = [], placeholder = 'Select an option', className = '', ...props }) => {
  return (
    <div className={`w-full ${className}`}>
      {label && <label className="block text-sm font-semibold mb-2">{label}</label>}

      <select value={value} onChange={onChange} className="w-full p-4 rounded-lg border-2 border-neutral-800 bg-neutral-900 font-medium outline-none transition-all duration-200" {...props}>
        <option value="" disabled>
          {placeholder}
        </option>
        
        {options.map((option) => (
          <option key={option.id || option.value} value={option.id || option.value}>
            {option.emoji ? `${option.emoji} ${option.label}` : option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectField;
