import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { useSearch } from "@/hooks/useSearch";
import "@testing-library/jest-dom";
import SearchPage from "..";

jest.mock("@/hooks/useSearch");

describe("SearchPage Component", () => {
  const mockFetchSearchResults = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useSearch as jest.Mock).mockReturnValue({
      results: null,
      searchKeyword: "",
      fetchSearchResults: mockFetchSearchResults,
      error: null,
    });
  });

  test("renders the search page with banner and search bar", () => {
    render(<SearchPage />);

    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  test("calls fetchSearchResults when a search is performed", async () => {
    render(<SearchPage />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "child care" } });

    fireEvent.keyDown(input, { key: "Enter" });

    await waitFor(() => {
      expect(mockFetchSearchResults).toHaveBeenCalledWith("child care");
    });
  });

  test("displays search results when available", async () => {
    (useSearch as jest.Mock).mockReturnValue({
      results: {
        ResultItems: [
          {
            DocumentId: "1",
            DocumentTitle: { Text: "Child Care Services", Highlights: [] },
            DocumentExcerpt: {
              Text: "Find the best child care services.",
              Highlights: [],
            },
            DocumentURI: "https://example.com/child-care",
          },
        ],
        TotalNumberOfResults: 1,
        Page: 1,
        PageSize: 10,
      },
      searchKeyword: "child care",
      fetchSearchResults: mockFetchSearchResults,
      error: null,
    });

    render(<SearchPage />);

    expect(
      await screen.findByText(/Showing 1 - 1 of 1 results/i)
    ).toBeInTheDocument();

    const resultItem = await screen.findByTestId("search-item-1");

    expect(
      within(resultItem).getAllByText(
        (_, element) =>
          element?.textContent?.includes("Child Care Services") ?? false
      )
    ).toHaveLength(2);

    const excerptElements = within(resultItem).getAllByText(
      (_, element) =>
        element?.textContent?.includes("Find the best child care services.") ??
        false
    );
    expect(excerptElements).toHaveLength(2);
    expect(excerptElements[0]).toBeInTheDocument();
  });

  test("displays error message when there is an error", async () => {
    (useSearch as jest.Mock).mockReturnValue({
      results: null,
      searchKeyword: "child care",
      fetchSearchResults: mockFetchSearchResults,
      error: "Network error",
    });

    render(<SearchPage />);

    expect(
      await screen.findByText("Network error. Please try again later!")
    ).toBeInTheDocument();
  });
});
