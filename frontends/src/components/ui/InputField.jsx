import React, { useState } from 'react';
import PropTypes from 'prop-types';

const InputField = ({
  label,
  type = 'text',
  id,
  name,
  value,
  onChange,
  placeholder = '',
  required = false,
  disabled = false,
  error = '',
  className = '',
  inputClassName = '',
  toggleVisibility = false,
  autoFocus = false,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const handleToggle = () => setShowPassword(!showPassword);

  const actualType = toggleVisibility ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="mb-2 text-[20px] font-normal text-[#090446] font-poppins"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          type={actualType}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoFocus={autoFocus}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`w-full px-4 py-2 text-[18px] text-[#090446] bg-[#09044633] rounded-[12px] font-poppins
            focus:outline-none transition
            ${error ? 'border border-red-500' : isFocused ? 'ring-2 ring-[#09044680]' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${inputClassName}`}
          {...props}
        />

        {toggleVisibility && (
          <button
            type="button"
            onClick={handleToggle}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#090446] text-xl focus:outline-none"
            tabIndex={-1}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-500 font-poppins">
          {error}
        </p>
      )}
    </div>
  );
};

InputField.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  toggleVisibility: PropTypes.bool,
  autoFocus: PropTypes.bool,
};

export default InputField;
