import { ISearchResultResponse, ISearchSuggestionResponse } from "@/types";

export const filterSearchResult = (
  result: ISearchResultResponse,
  keyword: string
) => {
  if (!keyword.trim()) return result;
  // Split the keyword and filter out words with length ≤ 3
  const words = keyword
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 3);
  if (words.length === 0) return result;

  result.ResultItems = result.ResultItems.filter((resultItem) => {
    const title = resultItem.DocumentTitle.Text.toLowerCase();
    const text = resultItem.DocumentExcerpt.Text.toLowerCase();
    return words.every((word) => title.includes(word) || text.includes(word));
  });

  result.TotalNumberOfResults = result.ResultItems.length;
  return result;
};


export const filterSearchSuggestion = (
  result: ISearchSuggestionResponse,
  keyword: string
) => {
  const words = keyword.toLowerCase().trim().split(/\s+/);
  const isSingleWord = words.length === 1;

  const filteredSuggestions = Object.entries(result.suggestions)
    .filter(([suggestion]) => {
      const suggestionLower = suggestion.toLowerCase();

      if (isSingleWord) {
        return suggestionLower.includes(words[0]);
      } else {
        return words.every(word => new RegExp(`\\b${word}\\b`, "i").test(suggestionLower));
      }
    })
    .sort((a, b) => Number(b[1]) - Number(a[1]))
    .map(([suggestion]) => suggestion);

  return filteredSuggestions;
};

export const getRelatedResults = (
  result: ISearchSuggestionResponse,
  keyword: string
) => {
  const words = keyword.toLowerCase().trim().split(/\s+/);
  const relatedResults = new Set<string>();

  words.forEach((word) => {
    if (result.synonyms[word]) {
      result.synonyms[word].forEach((synonym) => {
        Object.keys(result.suggestions).forEach((suggestion) => {
          if (suggestion.toLowerCase().includes(synonym)) {
            relatedResults.add(suggestion);
          }
        });
      });
    }
  });

  return Array.from(relatedResults);
};
