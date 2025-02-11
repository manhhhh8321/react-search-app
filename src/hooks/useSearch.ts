import { useState } from "react";
import axios from "axios";

export const useSearch = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSearchResults = async (query: string) => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        "https://gist.githubusercontent.com/yuhong90/b5544baebde4bfe9fe2d12e8e5502cbf/raw/44deafab00fc808ed7fa0e59a8bc959d255b9785/queryResult.json"
      );
      setResults(data);
    } catch (error) {
      console.error("Error fetching search results", error);
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, fetchSearchResults };
};
