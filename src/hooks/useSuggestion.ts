import { useState, useCallback } from "react";
import debounce from "lodash.debounce";
import { getSearchSuggestions } from "@/apis/search";

export const useSuggestions = () => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [relatedResults, setRelatedResults] = useState<string[]>([]);
  const clearSuggestions = () => {
    setSuggestions([]);
    setRelatedResults([]);
  };

  const fetchSuggestions = useCallback(
    debounce(async (query: string) => {
      if (query.length < 3) return;
      try {
        const { data } = await getSearchSuggestions(query);
        const uniqueRelatedResults = (data?.relatedResults || []).filter(
          (result: string) => !data?.suggestions?.includes(result)
        );
        setSuggestions(data?.suggestions || []);
        setRelatedResults(uniqueRelatedResults);
      } catch (error) {
        console.error("Error fetching suggestions", error);
      }
    }, 300),
    []
  );

  return { suggestions, relatedResults, fetchSuggestions, clearSuggestions };
};
