import React, { useState, useRef, useEffect } from 'react';
import { Users, ChevronDown, Plus, Minus } from 'lucide-react';
import { cn } from '../../utils/cn';

const NumberInput = ({ label, value, onChange, className, min = 1, max = 1000 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempValue, setTempValue] = useState(value || 50);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (value !== undefined) {
      setTempValue(value);
    }
  }, [value]);

  const handleIncrement = () => {
    setTempValue(prev => Math.min(prev + 10, max));
  };

  const handleDecrement = () => {
    setTempValue(prev => Math.max(prev - 10, min));
  };

  const handleInputChange = (e) => {
    const newValue = parseInt(e.target.value) || min;
    setTempValue(Math.min(Math.max(newValue, min), max));
  };

  const handleApply = () => {
    onChange(tempValue);
    setIsOpen(false);
  };

  const displayValue = value ? `${value} people` : '';

  return (
    <div ref={inputRef} className={cn("relative", className)}>
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
          <Users className="w-5 h-5 text-gray-500" />
          <span className={cn(
            "text-left",
            displayValue ? "text-foreground" : "text-gray-400"
          )}>
            {displayValue || 'Select number...'}
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
            "absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-6",
            "animate-in fade-in slide-in-from-top-2 duration-200"
          )}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Number of People</span>
              <span className="text-lg font-bold text-primary">{tempValue}</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleDecrement}
                className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-150"
              >
                <Minus className="w-5 h-5 text-gray-700" />
              </button>

              <input
                type="number"
                min={min}
                max={max}
                value={tempValue}
                onChange={handleInputChange}
                className={cn(
                  "flex-1 px-4 py-2 text-center text-lg font-semibold border border-gray-300 rounded-lg",
                  "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                )}
              />

              <button
                type="button"
                onClick={handleIncrement}
                className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-150"
              >
                <Plus className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-150"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors duration-150"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NumberInput;
