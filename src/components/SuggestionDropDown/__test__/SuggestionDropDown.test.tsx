import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { extractHighlightByKeyword } from "@/utils/highlight-text";
import SuggestionDropdown from "..";

jest.mock("@/utils/highlight-text", () => ({
  extractHighlightByKeyword: jest.fn((text) => [{ text, type: "normal" }]),
}));

describe("SuggestionDropdown Component", () => {
  const mockOnSelect = jest.fn();
  const mockOnHover = jest.fn();
  const suggestions = ["child care", "child support", "child protection"];

  test("renders suggestions correctly", () => {
    render(
      <SuggestionDropdown
        suggestions={suggestions}
        activeIndex={-1}
        inputValue="child"
        onSelect={mockOnSelect}
        onHover={mockOnHover}
      />
    );

    suggestions.forEach((suggestion) => {
      expect(screen.getByText(suggestion)).toBeInTheDocument();
    });
  });

  test("highlights active suggestion", () => {
    render(
      <SuggestionDropdown
        suggestions={suggestions}
        activeIndex={1}
        inputValue="child"
        onSelect={mockOnSelect}
        onHover={mockOnHover}
      />
    );

    const activeItem = screen.getByText("child support").closest("li");
    expect(activeItem).toHaveClass("bg-slate-100");
  });

  test("calls onHover when hovering over a suggestion", () => {
    render(
      <SuggestionDropdown
        suggestions={suggestions}
        activeIndex={-1}
        inputValue="child"
        onSelect={mockOnSelect}
        onHover={mockOnHover}
      />
    );

    const secondSuggestion = screen.getByText("child support");
    fireEvent.mouseEnter(secondSuggestion);

    expect(mockOnHover).toHaveBeenCalledWith(1);
  });

  test("calls onSelect when clicking a suggestion", () => {
    render(
      <SuggestionDropdown
        suggestions={suggestions}
        activeIndex={-1}
        inputValue="child"
        onSelect={mockOnSelect}
        onHover={mockOnHover}
      />
    );

    const firstSuggestion = screen.getByText("child care");
    fireEvent.click(firstSuggestion);

    expect(mockOnSelect).toHaveBeenCalledWith("child care");
  });

  test("renders highlighted text", () => {
    render(
      <SuggestionDropdown
        suggestions={suggestions}
        activeIndex={-1}
        inputValue="child"
        onSelect={mockOnSelect}
        onHover={mockOnHover}
      />
    );

    expect(extractHighlightByKeyword).toHaveBeenCalledWith("child care", "child");
    expect(extractHighlightByKeyword).toHaveBeenCalledWith("child support", "child");
  });
});
