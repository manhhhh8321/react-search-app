export interface ITextFormat {
  text: string;
  type: "bold" | "normal";
}

/**
 * Extracts highlighted text from a document given offset ranges.
 * Returns an array of text segments with "bold" or "normal" formatting.
 */
export const extractHighlightFromDocument = (
  text: string,
  highlights: { BeginOffset: number; EndOffset: number }[]
): ITextFormat[] => {
  if (!highlights?.length) return [{ text, type: "normal" }];

  const result: ITextFormat[] = [];
  let currentIndex = 0;

  for (const { BeginOffset, EndOffset } of highlights) {
    if (currentIndex < BeginOffset) {
      result.push({
        text: text.substring(currentIndex, BeginOffset),
        type: "normal",
      });
    }
    result.push({ text: text.substring(BeginOffset, EndOffset), type: "bold" });
    currentIndex = EndOffset;
  }

  if (currentIndex < text.length) {
    result.push({ text: text.substring(currentIndex), type: "normal" });
  }

  return result;
};

/**
 * Highlights occurrences of a keyword in a given text.
 * Returns an array of text segments with "bold" or "normal" formatting.
 */
export const extractHighlightByKeyword = (
  text: string,
  keyword: string
): ITextFormat[] => {
  if (!keyword.trim()) return [{ text, type: "normal" }];
  keyword = keyword.trim().toLowerCase();
  const result: ITextFormat[] = [];
  let index = 0;
  const keywordLength = keyword.length;

  while (index < text.length) {
    const indexOfKeyword = text.indexOf(keyword, index);
    if (indexOfKeyword === -1) break;

    if (index < indexOfKeyword) {
      result.push({
        text: text.substring(index, indexOfKeyword),
        type: "normal",
      });
    }

    result.push({
      text: text.substring(indexOfKeyword, indexOfKeyword + keywordLength),
      type: "bold",
    });
    index = indexOfKeyword + keywordLength;
  }

  if (index < text.length) {
    result.push({ text: text.substring(index), type: "normal" });
  }

  return result;
};
