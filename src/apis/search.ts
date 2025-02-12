import axios from "axios";
import { filterSearchResult, filterSearchSuggestion } from "@/mock/mock-filter";
import { ISearchResultResponse, ISearchSuggestionResponse } from "@/types";

const SEARCH_API_URL =
  "https://gist.githubusercontent.com/yuhong90/b5544baebde4bfe9fe2d12e8e5502cbf/raw/44deafab00fc808ed7fa0e59a8bc959d255b9785/queryResult.json";

const SUGGESTION_API_URL =
  "https://gist.githubusercontent.com/yuhong90/b5544baebde4bfe9fe2d12e8e5502cbf/raw/e026dab444155edf2f52122aefbb80347c68de86/suggestion.json";

/**
 * Fetch search results from API and apply mock filtering
 * @param keyword - The search keyword
 * @returns Filtered search results or an error
 */
export const getSearchResults = async (keyword: string) => {
  try {
    const { data } = await axios.get<ISearchResultResponse>(SEARCH_API_URL);
    return { error: null, data: filterSearchResult(data, keyword) };
  } catch (error) {
    return { error, data: null };
  }
};

/**
 * Fetch search suggestions from API and apply mock filtering
 * @param keyword - The search keyword
 * @returns Filtered search suggestions or an error
 */
export const getSearchSuggestions = async (keyword: string) => {
  try {
    const { data } = await axios.get<ISearchSuggestionResponse>(
      SUGGESTION_API_URL
    );
    return { error: null, data: filterSearchSuggestion(data, keyword) };
  } catch (error) {
    return { error, data: null };
  }
};
