import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

const Dropdown = ({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select...',
  icon: Icon,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange(option.value);
    setIsOpen(false);
  };

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div ref={dropdownRef} className={cn("relative", className)}>
      <label className="block text-sm font-medium text-foreground mb-2">
        {label}
      </label>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between gap-3 px-4 py-3 bg-white border rounded-lg",
          "transition-all duration-200 hover:border-primary hover:shadow-sm",
          isOpen ? "border-primary ring-2 ring-primary/20" : "border-gray-300",
          "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        )}
      >
        <div className="flex items-center gap-3 flex-1">
          {Icon && <Icon className="w-5 h-5 text-gray-500" />}
          <span className={cn(
            "text-left",
            selectedOption ? "text-foreground" : "text-gray-400"
          )}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown
          className={cn(
            "w-5 h-5 text-gray-500 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg",
            "animate-in fade-in slide-in-from-top-2 duration-200",
            "max-h-60 overflow-y-auto"
          )}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option)}
              className={cn(
                "w-full px-4 py-3 text-left transition-colors duration-150",
                "hover:bg-primary/5 focus:bg-primary/5 focus:outline-none",
                value === option.value && "bg-primary/10 text-primary font-medium",
                "first:rounded-t-lg last:rounded-b-lg"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
