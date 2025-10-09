import React, { useState, useRef, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '../../utils/cn';

const TimePicker = ({ label, value, onChange, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTimeChange = (e) => {
    onChange(e.target.value);
    setIsOpen(false);
  };

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const displayValue = formatTime(value);

  return (
    <div ref={pickerRef} className={cn("relative", className)}>
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
          <Clock className="w-5 h-5 text-gray-500" />
          <span className={cn(
            "text-left",
            displayValue ? "text-foreground" : "text-gray-400"
          )}>
            {displayValue || 'Select time...'}
          </span>
        </div>
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4",
            "animate-in fade-in slide-in-from-top-2 duration-200"
          )}
        >
          <input
            type="time"
            value={value || ''}
            onChange={handleTimeChange}
            className={cn(
              "w-full px-4 py-3 border border-gray-300 rounded-lg",
              "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
              "transition-all duration-200"
            )}
          />
        </div>
      )}
    </div>
  );
};

export default TimePicker;
