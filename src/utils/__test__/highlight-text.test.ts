import {
  extractHighlightFromDocument,
  extractHighlightByKeyword,
} from "@/utils/highlight-text";
import { IHighlight } from "@/types";

describe("extractHighlightFromDocument", () => {
  test("returns normal text when there are no highlights", () => {
    const result = extractHighlightFromDocument("Hello world", []);
    expect(result).toEqual([{ text: "Hello world", type: "normal" }]);
  });

  test("extracts and highlights the correct text", () => {
    const highlights: IHighlight[] = [{ BeginOffset: 6, EndOffset: 11 }];
    const result = extractHighlightFromDocument("Hello world", highlights);

    expect(result).toEqual([
      { text: "Hello ", type: "normal" },
      { text: "world", type: "bold" },
    ]);
  });

  test("handles multiple highlights correctly", () => {
    const highlights: IHighlight[] = [
      { BeginOffset: 0, EndOffset: 5 },
      { BeginOffset: 6, EndOffset: 11 },
    ];
    const result = extractHighlightFromDocument("Hello world", highlights);

    expect(result).toEqual([
      { text: "Hello", type: "bold" },
      { text: " ", type: "normal" },
      { text: "world", type: "bold" },
    ]);
  });

  test("handles highlight at the end", () => {
    const highlights: IHighlight[] = [{ BeginOffset: 6, EndOffset: 11 }];
    const result = extractHighlightFromDocument("Hello world!", highlights);

    expect(result).toEqual([
      { text: "Hello ", type: "normal" },
      { text: "world", type: "bold" },
      { text: "!", type: "normal" },
    ]);
  });
});

describe("extractHighlightByKeyword", () => {
  test("returns normal text when keyword is not found", () => {
    const result = extractHighlightByKeyword("Hello world", "test");
    expect(result).toEqual([{ text: "Hello world", type: "normal" }]);
  });

  test("highlights the keyword within the text", () => {
    const result = extractHighlightByKeyword("Hello world", "world");
    expect(result).toEqual([
      { text: "Hello ", type: "normal" },
      { text: "world", type: "bold" },
    ]);
  });

  test("handles multiple occurrences of the keyword", () => {
    const result = extractHighlightByKeyword("Hello world, world!", "world");
    expect(result).toEqual([
      { text: "Hello ", type: "normal" },
      { text: "world", type: "bold" },
      { text: ", ", type: "normal" },
      { text: "world", type: "bold" },
      { text: "!", type: "normal" },
    ]);
  });

  test("handles keyword at the start of text", () => {
    const result = extractHighlightByKeyword("world is beautiful", "world");
    expect(result).toEqual([
      { text: "world", type: "bold" },
      { text: " is beautiful", type: "normal" },
    ]);
  });

  test("handles keyword at the end of text", () => {
    const result = extractHighlightByKeyword("Hello world", "world");
    expect(result).toEqual([
      { text: "Hello ", type: "normal" },
      { text: "world", type: "bold" },
    ]);
  });

  test("ignores leading/trailing spaces in keyword", () => {
    const result = extractHighlightByKeyword("Hello world", " world ");
    expect(result).toEqual([
      { text: "Hello ", type: "normal" },
      { text: "world", type: "bold" },
    ]);
  });
});
