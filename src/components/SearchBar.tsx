import { useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useSearch } from "../hooks/useSearch";
import { useSuggestions } from "../hooks/useSuggestion";
import SuggestionsDropdown from "./SuggestionDropdown";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const { fetchSearchResults } = useSearch();
  const { suggestions, fetchSuggestions, clearSuggestions } = useSuggestions();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    fetchSuggestions(value);
  };

  const handleSearch = () => {
    fetchSearchResults(query);
    clearSuggestions();
  };

  const handleBlur = () => {
    setTimeout(() => {
      clearSuggestions();
    }, 150);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    setQuery("");
    fetchSuggestions("");
    inputRef.current?.focus();
  };

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 w-full max-w-2xl z-50">
      {/* Search Bar */}
      <div className="relative flex items-center border border-gray-400 p-4 shadow-md bg-white focus-within:ring-2 focus-within:ring-blue-500">
        <input
          type="text"
          ref={inputRef}
          className="w-full px-4 text-lg outline-none text-gray-900 bg-transparent"
          value={query}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder="Search for something..."
        />
        {query.length > 0 && (
          <button
            onClick={handleClear}
            className="text-gray-500 mr-3"
          >
            <X size={20} />
          </button>
        )}
        <button onClick={handleSearch} className="text-gray-500 hover:text-gray-700">
          <Search size={24} />
        </button>
      </div>

      {/* Suggestions Dropdown */}
      <SuggestionsDropdown
        isVisible={suggestions!?.suggestions?.length > 0}
        suggestions={suggestions?.suggestions || []}
        onSelect={(selected) => {
          setQuery(selected);
          fetchSearchResults(selected);
          clearSuggestions();
        }}
      />
    </div>
  );
};

export default SearchBar;
