import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SearchBar from "@/components/SearchBar";
import "@testing-library/jest-dom";
import mockData from "@/mock/suggestion.json";

const mockOnSearch = jest.fn();
let mockSuggestions: typeof mockData;

// Mock useSuggestions hook
jest.mock("@/hooks/useSuggestion", () => ({
  useSuggestions: () => ({
    suggestions: mockSuggestions.suggestions,
    fetchSuggestions: jest.fn(),
    clearSuggestions: jest.fn(),
  }),
}));

describe("SearchBar Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSuggestions = JSON.parse(JSON.stringify(mockData));
  });

  test("renders the search input", () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByRole("textbox", { name: /search-textfield/i });
    expect(input).toBeInTheDocument();
  });

  test("displays suggestions when typing more than two characters", async () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByRole("textbox");

    fireEvent.change(input, { target: { value: "chi" } });

    await waitFor(() => {
      expect(
        screen.getByText(
          (_, element) => element?.textContent?.trim() === "child care"
        )
      ).toBeInTheDocument();
    });
  });

  test("selects a suggestion when clicked", async () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByLabelText("search-textfield");

    fireEvent.change(input, { target: { value: "child care" } });

    await waitFor(() => {
      expect(screen.getAllByText("child")[0]).toBeInTheDocument();
      expect(screen.getAllByText("care")[0]).toBeInTheDocument();
    });

    const firstSuggestion = screen.getAllByText(
      (_, element) => element?.textContent?.trim() === "child care"
    );

    fireEvent.click(firstSuggestion[0]);

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith("child care");
    });
  });

  test("navigates suggestions with keyboard and selects with Enter", async () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByRole("textbox");

    fireEvent.change(input, { target: { value: "child care" } });

    await waitFor(() => {
      expect(screen.getAllByText("child")[0]).toBeInTheDocument();
      expect(screen.getAllByText("care")[0]).toBeInTheDocument();
    });

    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(mockOnSearch).toHaveBeenCalledWith("child care");
    expect(input).toHaveValue("child care");
  });

  test("clears input when clicking clear button", async () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByRole("textbox");

    fireEvent.change(input, { target: { value: "chi" } });
    expect(input).toHaveValue("chi");

    const clearButton = await screen.findByRole("button", {
      name: /clear-search/i,
    });

    fireEvent.click(clearButton);
    expect(input).toHaveValue("");
  });

  test("does not trigger search when input is empty", async () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const searchButton = screen.getByRole("button", { name: /search-btn/i });

    fireEvent.click(searchButton);

    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  test("will sanitize the input value", async () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByRole("textbox");

    fireEvent.change(input, { target: { value: "child care$#@" } });

    await waitFor(() => {
      expect(screen.getAllByText("child")[0]).toBeInTheDocument();
      expect(screen.getAllByText("care")[0]).toBeInTheDocument();
    });

    fireEvent.keyDown(input, { key: "Enter" });

    expect(mockOnSearch).toHaveBeenCalledWith("child care");
  });

  it("will not trigger search if the input value is more than 100 characters", async () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByRole("textbox");

    fireEvent.change(input, {
      target: { value: "child care".repeat(20) },
    });

    fireEvent.keyDown(input, { key: "Enter" });

    expect(mockOnSearch).not.toHaveBeenCalled();
  });
});
