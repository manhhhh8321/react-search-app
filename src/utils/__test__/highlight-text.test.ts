import { extractHighlightFromDocument } from "@/utils/highlight-text";

describe("extractHighlightFromDocument", () => {
  test("returns normal text when there is no match", () => {
    const result = extractHighlightFromDocument("Hello world", "test");
    expect(result).toEqual([{ text: "Hello world", type: "normal" }]);
  });

  test("highlights a single keyword in text", () => {
    const result = extractHighlightFromDocument("Hello world", "world");
    expect(result).toEqual([
      { text: "Hello ", type: "normal" },
      { text: "world", type: "bold" },
    ]);
  });

  test("highlights multiple occurrences of the keyword", () => {
    const result = extractHighlightFromDocument("world Hello world!", "world");
    expect(result).toEqual([
      { text: "world", type: "bold" },
      { text: " Hello ", type: "normal" },
      { text: "world", type: "bold" },
      { text: "!", type: "normal" },
    ]);
  });

  test("highlights multiple words separately", () => {
    const result = extractHighlightFromDocument("Hello big world", "hello world");
    expect(result).toEqual([
      { text: "Hello", type: "bold" },
      { text: " big ", type: "normal" },
      { text: "world", type: "bold" },
    ]);
  });

  test("ignores case sensitivity", () => {
    const result = extractHighlightFromDocument("Hello WORLD", "world");
    expect(result).toEqual([
      { text: "Hello ", type: "normal" },
      { text: "WORLD", type: "bold" },
    ]);
  });

  test("handles special characters in text", () => {
    const result = extractHighlightFromDocument("Hello, world!", "world");
    expect(result).toEqual([
      { text: "Hello, ", type: "normal" },
      { text: "world", type: "bold" },
      { text: "!", type: "normal" },
    ]);
  });

  test("handles keyword at the beginning of text", () => {
    const result = extractHighlightFromDocument("world is beautiful", "world");
    expect(result).toEqual([
      { text: "world", type: "bold" },
      { text: " is beautiful", type: "normal" },
    ]);
  });

  test("handles keyword at the end of text", () => {
    const result = extractHighlightFromDocument("Hello world", "world");
    expect(result).toEqual([
      { text: "Hello ", type: "normal" },
      { text: "world", type: "bold" },
    ]);
  });
});
