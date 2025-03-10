import HighlightText from "../common/HighlightText";
import { extractHighlightByKeyword } from "@/utils/highlight-text";

interface SuggestionDropdownProps {
  suggestions: string[];
  relatedResults?: string[];
  activeIndex: number;
  inputValue: string;
  onSelect: (suggestion: string) => void;
  onHover: (index: number) => void;
}

function SuggestionDropdown({
  suggestions,
  relatedResults = [],
  activeIndex,
  inputValue,
  onSelect,
  onHover,
}: SuggestionDropdownProps) {
  return (
    <div className="absolute w-full py-3 rounded-b-lg shadow-general bg-white flex flex-col translate-y-0.5">
      <ul aria-label="suggestion-dropdown">
        {suggestions.map((suggestion, index) => {
          const highlightedText = extractHighlightByKeyword(suggestion, inputValue);
          return (
            <li
              key={index}
              className={`cursor-pointer p-2 px-5 rounded-sm ${
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

      {relatedResults.length > 0 && (
        <div className="mt-3 border-t pt-2">
          <h3 className="px-5 text-gray-600 text-sm">Related Results</h3>
          <ul>
            {relatedResults.map((result, index) => {
              const relatedIndex = suggestions.length + index; // Offset index for related results
              return (
                <li
                  key={`related-${index}`}
                  className={`cursor-pointer p-2 px-5 rounded-sm text-gray-500 hover:bg-gray-100 ${
                    activeIndex === relatedIndex ? "bg-slate-100" : ""
                  }`}
                  onMouseEnter={() => onHover(relatedIndex)}
                  onClick={() => onSelect(result)}
                >
                  {result}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SuggestionDropdown;
