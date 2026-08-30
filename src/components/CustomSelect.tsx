import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';

export interface Option {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: any) => void;
  options: Option[];
  className?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ value, onChange, options, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full bg-[#141414] border border-white/10 hover:border-white/20 rounded-full text-xs px-4 py-2 text-[#919191] focus:outline-none transition-colors whitespace-nowrap"
      >
        <span className="flex items-center gap-2">
          {selectedOption?.icon && <span className="text-[#C5C5C5]">{selectedOption.icon}</span>}
          {selectedOption?.label}
        </span>
        <FiChevronDown className={`ml-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 min-w-full bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`flex items-center gap-2 w-full text-left px-4 py-2 text-xs transition-colors whitespace-nowrap ${
                value === option.value 
                  ? 'bg-white/10 text-white font-bold' 
                  : 'text-[#919191] hover:bg-white/5 hover:text-[#C5C5C5]'
              }`}
            >
              {option.icon}
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
