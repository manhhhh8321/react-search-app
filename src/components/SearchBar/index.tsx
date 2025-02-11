import { fetchSuggestion } from "@/utils/api";
import { extractHighlightByKeyword } from "@/utils/highlight-text";
import debounce from "lodash.debounce";
import { CrossIcon, SearchIcon } from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import HighlightText from "../common/HighlightText";

interface ISearchBoxProps {
  onSearch: (keyword: string) => void;
}

function SearchBar(props: ISearchBoxProps) {
  const { onSearch } = props;

  const [suggestions, setSuggestions] = useState<string[]>();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] =
    useState<number>(-1);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const getInputVal = () => inputRef?.current?.value || "";

  useEffect(() => {
    if (!isDropdownOpen) {
      setActiveSuggestionIndex(-1);
    }
  }, [isDropdownOpen]);

  const handleSubmit = () => {
    setIsDropdownOpen(false);
    debouncedInput.cancel();
    const inputVal = getInputVal();
    if (inputVal) {
      onSearch(inputVal);
    }
  };

  const debouncedInput = useMemo(
    () =>
      debounce((searchInput) => {
        fetchSuggestion(searchInput).then(({ error, data }) => {
          if (error) {
            console.error(error);
          } else if (data) {
            setSuggestions(data.suggestions);
            if (data.suggestions.length) {
              setIsDropdownOpen(true);
            }
          }
        });
      }, 300),
    []
  );

  const handleInputChange = (newInput: string) => {
    if (newInput.length > 2) {
      debouncedInput(newInput);
    } else {
      debouncedInput.cancel();
      setSuggestions([]);
      setIsDropdownOpen(false);
    }
  };

  const handleSearchFieldOnKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    switch (e.key) {
      case "Enter":
        if (activeSuggestionIndex >= 0) {
          return selectSuggestion(suggestions?.[activeSuggestionIndex] || "");
        }
        return handleSubmit();
      case "ArrowDown":
        e.preventDefault();
        return setActiveSuggestionIndex((prev) =>
          prev + 1 < (suggestions?.length || 0) ? prev + 1 : prev
        );
      case "ArrowUp":
        e.preventDefault();
        return setActiveSuggestionIndex((prev) =>
          prev - 1 >= 0 ? prev - 1 : prev
        );
    }
  };

  /**
   * When user clicks a suggestion or presses enter on an active suggestion, invoke this method.
   * It will set the input value to the selected suggestion and perform search.
   * @param suggestion
   */
  const selectSuggestion = (suggestion: string) => {
    if (inputRef.current) {
      inputRef.current.value = suggestion;
    }
    handleSubmit();
  };

  const onClickClearBtn = () => {
    inputRef?.current?.focus();
    setIsDropdownOpen(false);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const shouldDropdownBeDisplayed = isDropdownOpen && !!suggestions?.length;

  return (
    <div
      className={
        "flex rounded-lg border-2 focus-within:border-primary-blue" +
        (shouldDropdownBeDisplayed ? " rounded-bl-none" : "")
      }
    >
      <div className="flex-grow relative">
        <input
          type="text"
          className={
            "w-full h-full rounded-lg focus:outline-none focus:ring-0 pl-4 pr-10" +
            (shouldDropdownBeDisplayed ? " rounded-b-none" : "")
          }
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleSearchFieldOnKeyDown}
          onFocus={() => setIsDropdownOpen(true)}
          ref={inputRef}
          aria-label="search-textfield"
        />
        {!!getInputVal().length && (
          <button
            className="absolute top-2/4 right-2 -translate-y-2/4"
            aria-label="search-clear-btn"
            onClick={onClickClearBtn}
          >
            <CrossIcon />
          </button>
        )}
        {shouldDropdownBeDisplayed && (
          <ul
            className="absolute w-full py-3 rounded-b-lg shadow-general bg-white flex flex-col translate-y-0.5"
            aria-label="suggestion-dropdown"
          >
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className={
                  "cursor-default p-2 px-5 rounded-sm" +
                  (activeSuggestionIndex === index ? " bg-slate-100" : "")
                }
                onMouseEnter={() => {
                  setActiveSuggestionIndex(index);
                }}
                onClick={() => selectSuggestion(suggestion)}
              >
                <HighlightText
                  textFormats={extractHighlightByKeyword(
                    suggestion,
                    getInputVal()
                  )}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
      <button
        className="bg-primary-blue flex justify-center items-center gap-2 text-white py-2 px-5 rounded-md"
        aria-label="search-btn"
        onClick={() => handleSubmit()}
      >
        <SearchIcon />
        <div className="hidden sm:block">Search</div>
      </button>
    </div>
  );
}

export default SearchBar;
