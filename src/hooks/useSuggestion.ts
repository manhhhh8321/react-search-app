import { useState, useCallback } from "react";
import debounce from "lodash.debounce";
import { getSearchSuggestions } from "@/apis/search";

export const useSuggestions = () => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const clearSuggestions = () => setSuggestions([]);

  const fetchSuggestions = useCallback(
    debounce(async (query: string) => {
      if (query.length < 3) return;
      try {
        const { data } = await getSearchSuggestions(query);
        setSuggestions(data?.suggestions || []);
      } catch (error) {
        console.error("Error fetching suggestions", error);
      }
    }, 300),
    []
  );
  return { suggestions, fetchSuggestions, clearSuggestions };
};
