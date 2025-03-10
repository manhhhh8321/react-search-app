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
    relatedResults: mockSuggestions.relatedResults,
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

  test("displays suggestions and related results when typing more than two characters", async () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByRole("textbox");

    fireEvent.change(input, { target: { value: "childcare" } });

    await waitFor(() => {
      expect(screen.getByText("childcare")).toBeInTheDocument();
      expect(screen.getByText("Related Results")).toBeInTheDocument(); // Ensure related results appear
    });
  });

  test("selects a suggestion when clicked", async () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByLabelText("search-textfield");

    fireEvent.change(input, { target: { value: "childcare" } });

    await waitFor(() => {
      expect(screen.getByText("childcare")).toBeInTheDocument();
    });

    const firstSuggestion = screen.getByText("childcare");
    fireEvent.click(firstSuggestion);

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith("register childcare");
    });
  });

  test("navigates with keyboard and selects a related result with Enter", async () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByRole("textbox");

    fireEvent.change(input, { target: { value: "childcare" } });

    await waitFor(() => {
      expect(screen.getByText("childcare")).toBeInTheDocument();
      expect(screen.getByText("Related Results")).toBeInTheDocument();
    });

    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(mockOnSearch).toHaveBeenCalledWith("child vaccination");
    expect(input).toHaveValue("child vaccination");
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

  test("sanitizes the input value", async () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByRole("textbox");

    fireEvent.change(input, { target: { value: "childcare$#@" } });

    await waitFor(() => {
      expect(screen.getByText("childcare")).toBeInTheDocument();
    });

    fireEvent.keyDown(input, { key: "Enter" });

    expect(mockOnSearch).toHaveBeenCalledWith("childcare");
  });

  test("does not trigger search if input value exceeds 100 characters", async () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByRole("textbox");

    fireEvent.change(input, {
      target: { value: "child care".repeat(20) },
    });

    fireEvent.keyDown(input, { key: "Enter" });

    expect(mockOnSearch).not.toHaveBeenCalled();
  });
});
