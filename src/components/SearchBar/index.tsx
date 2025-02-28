import { useRef, useEffect, useState } from "react";
import { useSuggestions } from "@/hooks/useSuggestion";
import CrossIcon from "@/assets/icons/CrossIcon";
import SearchIcon from "@/assets/icons/SearchIcon";
import SuggestionDropdown from "../SuggestionDropDown";
import DOMPurify from "dompurify";

interface ISearchBoxProps {
  onSearch: (keyword: string) => void;
}

const MAX_INPUT_LENGTH = 100;

function SearchBar({ onSearch }: ISearchBoxProps) {
  const { suggestions, fetchSuggestions, clearSuggestions } = useSuggestions();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isDropdownOpen) setActiveSuggestionIndex(-1);
  }, [isDropdownOpen]);

  const sanitizeInput = (input: string) => {
    return DOMPurify.sanitize(input).replace(/[^a-zA-Z0-9\s]/g, "");
  };

  const handleInputChange = (input: string) => {
    if (input.length > MAX_INPUT_LENGTH) {
      setError("Input is too long");
      return;
    } else {
      setError(null);
    }

    const sanitizedInput = sanitizeInput(input);
    setInputValue(sanitizedInput);

    if (sanitizedInput.length > 2) {
      fetchSuggestions(sanitizedInput);
      setIsDropdownOpen(true);
    } else {
      clearSuggestions();
      setIsDropdownOpen(false);
    }
  };

  const handleSubmit = () => {
    if (!inputValue) return;

    clearSuggestions();
    setIsDropdownOpen(false);
    onSearch(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (activeSuggestionIndex >= 0) {
        return selectSuggestion(suggestions[activeSuggestionIndex]);
      }
      return handleSubmit();
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestionIndex((prev) =>
        prev + 1 < suggestions.length ? prev + 1 : prev
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestionIndex((prev) => (prev > 0 ? prev - 1 : 0));
    }
  };

  const selectSuggestion = (suggestion: string) => {
    setInputValue(suggestion);
    if (inputRef.current) inputRef.current.value = suggestion;
    handleSubmit();
  };

  const clearSearch = () => {
    setInputValue("");
    if (inputRef.current) inputRef.current.value = "";
    inputRef?.current?.focus();
    clearSuggestions();
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex rounded-lg border-2 focus-within:border-primary-blue">
      <div className="flex-grow relative">
        <input
          type="text"
          ref={inputRef}
          className="w-full h-full rounded-lg focus:outline-none focus:ring-0 pl-4 pr-10"
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsDropdownOpen(true)}
          aria-label="search-textfield"
        />
        {error && <div className="text-red-500 text-sm pt-2">{error}</div>}

        {inputValue.length > 0 && (
          <button
            className="absolute top-2/4 right-2 -translate-y-2/4"
            aria-label="clear-search"
            onClick={clearSearch}
          >
            <CrossIcon />
          </button>
        )}

        {isDropdownOpen && suggestions.length > 0 && (
          <SuggestionDropdown
            suggestions={suggestions}
            activeIndex={activeSuggestionIndex}
            inputValue={inputValue}
            onSelect={selectSuggestion}
            onHover={setActiveSuggestionIndex}
          />
        )}
      </div>

      <button
        className="bg-primary-blue flex justify-center items-center gap-2 text-white py-2 px-5 rounded-md"
        aria-label="search-btn"
        onClick={handleSubmit}
      >
        <SearchIcon />
        <span className="hidden sm:block">Search</span>
      </button>
    </div>
  );
}

export default SearchBar;
