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
  const { suggestions, relatedResults, fetchSuggestions, clearSuggestions } =
    useSuggestions();
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
    setActiveSuggestionIndex(-1);
    if (sanitizedInput.length > 2) {
      fetchSuggestions(sanitizedInput);
      setIsDropdownOpen(true);
    } else {
      clearSuggestions();
      setIsDropdownOpen(false);
    }
  };

  const handleSubmit = (keyword?: string) => {
    const searchValue = keyword ?? inputValue;
    if (!searchValue) return;

    clearSuggestions();
    setIsDropdownOpen(false);
    onSearch(searchValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const totalItems = suggestions.length + relatedResults.length;
    if (e.key === "Enter") {
      if (activeSuggestionIndex >= 0) {
        if (activeSuggestionIndex < suggestions.length) {
          selectSuggestion(suggestions[activeSuggestionIndex]);
        } else {
          const relatedIndex = activeSuggestionIndex - suggestions.length;
          selectSuggestion(relatedResults[relatedIndex]);
        }
      } else {
        handleSubmit();
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestionIndex((prev) =>
        prev + 1 < totalItems ? prev + 1 : prev
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestionIndex((prev) => (prev > 0 ? prev - 1 : 0));
    }
  };

  const selectSuggestion = (suggestion: string) => {
    setInputValue(suggestion);
    handleSubmit(suggestion);
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
          value={inputValue}
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

        {isDropdownOpen && (suggestions.length > 0 || relatedResults.length > 0) && (
          <SuggestionDropdown
            suggestions={suggestions}
            relatedResults={relatedResults}
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
        onClick={() => handleSubmit()}
      >
        <SearchIcon />
        <span className="hidden sm:block">Search</span>
      </button>
    </div>
  );
}

export default SearchBar;
