import React from 'react';
import PropTypes from 'prop-types';

const Checkbox = ({
  id,
  name,
  label,
  checked,
  onChange,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <label htmlFor={id} className="flex items-center cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            id={id}
            name={name}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="opacity-0 absolute h-[20px] w-[20px] z-10 cursor-pointer"
            {...props}
          />
          <div
            className={`h-[20px] w-[20px] rounded-[2px] flex items-center justify-center 
              border-0 transition-colors duration-200
              ${checked ? 'bg-[#090446]' : 'bg-[#09044633]'} 
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {checked && (
              <svg
                className="w-[12px] h-[12px] text-white pointer-events-none"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
              </svg>
            )}
          </div>
        </div>
        {label && (
          <span
            className={`ml-2 text-[20px] font-normal font-poppins text-[#090446] select-none 
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {label}
          </span>
        )}
      </label>
    </div>
  );
};

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default Checkbox;
