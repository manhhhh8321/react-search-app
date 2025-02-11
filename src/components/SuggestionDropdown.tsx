import React from "react";

interface SuggestionsDropdownProps {
  isVisible: boolean;
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}

const SuggestionsDropdown: React.FC<SuggestionsDropdownProps> = ({
  isVisible,
  suggestions,
  onSelect,
}) => {
  if (!isVisible) return null;

  return (
    <ul className="absolute left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-60">
      {suggestions.map((s, i) => (
        <li
          key={i}
          className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-gray-900"
          onClick={() => onSelect(s)}
        >
          {s}
        </li>
      ))}
    </ul>
  );
};

export default SuggestionsDropdown;
