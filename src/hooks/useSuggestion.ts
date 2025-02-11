import { useState } from "react";
import axios from "axios";
import debounce from "lodash.debounce";

export const useSuggestions = () => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const clearSuggestions = () => setSuggestions([]);

  const fetchSuggestions = debounce(async (query: string) => {
    if (query.length < 3) return;
    try {
      const { data } = await axios.get(
        "https://gist.githubusercontent.com/yuhong90/b5544baebde4bfe9fe2d12e8e5502cbf/raw/e026dab444155edf2f52122aefbb80347c68de86/suggestion.json"
      );
      setSuggestions(data?.suggestions || []);
    } catch (error) {
      console.error("Error fetching suggestions", error);
    }
  }, 300);

  return { suggestions, fetchSuggestions, clearSuggestions };
};
