import React, { useState, useRef, useEffect } from 'react';
import { DollarSign, ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

const BudgetSlider = ({ label, value, onChange, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempValue, setTempValue] = useState(value || 50000);
  const sliderRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sliderRef.current && !sliderRef.current.contains(event.target)) {
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

  const handleSliderChange = (e) => {
    const newValue = parseInt(e.target.value);
    setTempValue(newValue);
  };

  const handleApply = () => {
    onChange(tempValue);
    setIsOpen(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const displayValue = value ? formatCurrency(value) : '';

  const getSliderBackground = () => {
    const percentage = ((tempValue - 0) / (500000 - 0)) * 100;
    return `linear-gradient(to right, #2563eb 0%, #2563eb ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`;
  };

  return (
    <div ref={sliderRef} className={cn("relative", className)}>
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
          <DollarSign className="w-5 h-5 text-gray-500" />
          <span className={cn(
            "text-left",
            displayValue ? "text-foreground" : "text-gray-400"
          )}>
            {displayValue || 'Set budget...'}
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
              <span className="text-sm font-medium text-gray-700">Budget Amount</span>
              <span className="text-lg font-bold text-primary">{formatCurrency(tempValue)}</span>
            </div>

            <div className="relative pt-2">
              <input
                type="range"
                min="0"
                max="500000"
                step="5000"
                value={tempValue}
                onChange={handleSliderChange}
                className="w-full h-2 rounded-full appearance-none cursor-pointer slider-thumb"
                style={{
                  background: getSliderBackground(),
                }}
              />

              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>₹0</span>
                <span>₹5L</span>
              </div>
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

      <style>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: transform 0.15s ease;
        }

        .slider-thumb::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }

        .slider-thumb::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: transform 0.15s ease;
        }

        .slider-thumb::-moz-range-thumb:hover {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
};

export default BudgetSlider;
