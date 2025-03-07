import { useState } from "react";
import { getSearchResults } from "@/apis/search";
import { ISearchResultResponse } from "@/types";

export const useSearch = () => {
  const [results, setResults] = useState<ISearchResultResponse | null>();
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [error, setError] = useState<unknown | null>();

  const fetchSearchResults = async (query: string) => {
    setLoading(true);
    try {
      const { data } = await getSearchResults(query);
      setResults(data);
      setSearchKeyword(query);
    } catch (error) {
      setError(error);
      console.error("Error fetching search results", error);
    } finally {
      setLoading(false);
    }
  };

  return { results, searchKeyword, error, loading, fetchSearchResults };
};
