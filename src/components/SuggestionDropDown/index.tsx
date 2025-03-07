import HighlightText from "../common/HighlightText";
import { extractHighlightByKeyword } from "@/utils/highlight-text";

interface SuggestionDropdownProps {
  suggestions: string[];
  activeIndex: number;
  inputValue: string;
  onSelect: (suggestion: string) => void;
  onHover: (index: number) => void;
}

function SuggestionDropdown({
  suggestions,
  activeIndex,
  inputValue,
  onSelect,
  onHover,
}: SuggestionDropdownProps) {
  return (
    <ul
      className="absolute w-full py-3 rounded-b-lg shadow-general bg-white flex flex-col translate-y-0.5"
      aria-label="suggestion-dropdown"
    >
      {suggestions.map((suggestion, index) => {
        const highlightedText = extractHighlightByKeyword(suggestion, inputValue);
        return (
          <li
            key={index}
            className={`cursor-default p-2 px-5 rounded-sm ${
              activeIndex === index ? "bg-slate-100" : ""
            }`}
            onMouseEnter={() => onHover(index)}
            onClick={() => onSelect(suggestion)}
          >
            <HighlightText textFormats={highlightedText} />
          </li>
        );
      })}
    </ul>
  );
}

export default SuggestionDropdown;
