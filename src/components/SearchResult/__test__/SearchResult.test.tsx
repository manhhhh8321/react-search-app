import { render, screen } from "@testing-library/react";
import SearchResult from "@/components/SearchResult";
import "@testing-library/jest-dom";
import { ISearchResultItem } from "@/types";
import { extractHighlightFromDocument } from "@/utils/highlight-text";

jest.mock("@/utils/highlight-text", () => ({
  extractHighlightFromDocument: jest.fn((text) => [{ text, type: "normal" }]),
}));

describe("SearchResult Component", () => {
  const mockItems: ISearchResultItem[] = [
    {
      DocumentId: "1",
      DocumentTitle: { Text: "Test Title 1", Highlights: [] },
      DocumentExcerpt: { Text: "Excerpt 1", Highlights: [] },
      DocumentURI: "http://example.com/1",
    },
    {
      DocumentId: "2",
      DocumentTitle: { Text: "Test Title 2", Highlights: [] },
      DocumentExcerpt: { Text: "Excerpt 2", Highlights: [] },
      DocumentURI: "http://example.com/2",
    },
  ];

  test("renders search results correctly", () => {
    render(
      <SearchResult
        items={mockItems}
        total={10}
        page={1}
        pageSize={5}
        searchKeyword="test"
      />
    );

    expect(screen.getByText("Showing 1 - 2 of 10 results")).toBeInTheDocument();

    expect(screen.getByText("Test Title 1")).toBeInTheDocument();
    expect(screen.getByText("Test Title 2")).toBeInTheDocument();

    expect(screen.getByText("Excerpt 1")).toBeInTheDocument();
    expect(screen.getByText("Excerpt 2")).toBeInTheDocument();

    expect(screen.getByText("http://example.com/1")).toBeInTheDocument();
    expect(screen.getByText("http://example.com/2")).toBeInTheDocument();
  });

  test("displays correct number range in results", () => {
    render(
      <SearchResult
        items={mockItems}
        total={50}
        page={2}
        pageSize={10}
        searchKeyword="test"
      />
    );

    expect(
      screen.getByText("Showing 11 - 12 of 50 results")
    ).toBeInTheDocument();
  });

  test("renders no results message when items are empty", () => {
    render(
      <SearchResult
        items={[]}
        total={0}
        page={1}
        pageSize={5}
        searchKeyword="test"
      />
    );

    expect(screen.getByTestId("error-msg")).toHaveTextContent(
      'No results found for your search "test".'
    );
  });

  test("renders highlighted text in title and excerpt", () => {
    render(
      <SearchResult
        items={mockItems}
        total={10}
        page={1}
        pageSize={5}
        searchKeyword="test"
      />
    );

    expect(extractHighlightFromDocument).toHaveBeenCalledWith(
      "Test Title 1",
      "test"
    );
    expect(extractHighlightFromDocument).toHaveBeenCalledWith(
      "Excerpt 1",
      "test"
    );
    expect(extractHighlightFromDocument).toHaveBeenCalledWith(
      "Test Title 2",
      "test"
    );
  });
});
