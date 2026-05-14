import React from "react";

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;
  onClear?: () => void;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  onSearch,
  onClear,
  ...props
}: SearchBarProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e);
    }
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  const handleReset = () => {
    if (onClear) {
      onClear();
    }
  };

  return (
    <div className={`group relative flex items-center ${className}`}>
      {/* Simple Search Bar Container */}
      <div 
        className="
          relative flex items-center w-full max-w-[300px] h-10 px-2 
          bg-transparent
          transition-all duration-300 ease-in-out
          overflow-hidden
        "
      >
        {/* Search Icon */}
        <div className="flex items-center justify-center text-gray-400 group-focus-within:text-orange-500 transition-colors">
          <svg 
            width="17" 
            height="16" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9" 
              stroke="currentColor" 
              strokeWidth="1.333" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          </svg>
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="
            flex-1 h-full bg-transparent border-none outline-none px-3
            text-sm text-gray-900 dark:text-white
            placeholder:text-gray-400 dark:placeholder:text-gray-500
          "
          {...props}
        />

        {/* Reset Button */}
        {value && (
          <button
            type="button"
            onClick={handleReset}
            className="
              flex items-center justify-center p-1 rounded-full
              text-gray-400 hover:text-orange-500
              transition-all duration-200
            "
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Simple Bottom Line - Static */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gray-200 dark:bg-gray-800" />

        {/* Animated Bottom Border - Orange */}
        <div 
          className="
            absolute bottom-0 left-0 w-full h-[2px] bg-orange-500
            scale-x-0 group-focus-within:scale-x-100
            transition-transform duration-300 ease-in-out
            origin-center
          "
        />
      </div>
    </div>
  );
}
