import { renderHook, act } from "@testing-library/react";
import { getSearchSuggestions } from "@/apis/search";
import { useSuggestions } from "../useSuggestion";

jest.mock("@/apis/search", () => ({
  getSearchSuggestions: jest.fn(),
}));

jest.useFakeTimers(); // Simulates time for debounce

beforeEach(() => {
  jest.clearAllMocks();
});

describe("useSuggestions Hook", () => {
  it("should initialize with empty suggestions", () => {
    const { result } = renderHook(() => useSuggestions());
    expect(result.current.suggestions).toEqual([]);
  });

  it("should fetch and update suggestions", async () => {
    const mockData = { suggestions: ["apple", "apricot", "avocado"] };
    (getSearchSuggestions as jest.Mock).mockResolvedValueOnce({
      data: mockData,
    });

    const { result } = renderHook(() => useSuggestions());

    act(() => {
      result.current.fetchSuggestions("app");
      jest.runAllTimers(); // Fast-forward debounce
    });

    await act(async () => {}); // Wait for async updates

    expect(getSearchSuggestions).toHaveBeenCalledWith("app");
    expect(result.current.suggestions).toEqual(mockData.suggestions);
  });

  it("should not fetch suggestions if query length < 3", async () => {
    const { result } = renderHook(() => useSuggestions());

    act(() => {
      result.current.fetchSuggestions("ap"); // Less than 3 characters
      jest.runAllTimers();
    });

    expect(getSearchSuggestions).not.toHaveBeenCalled();
  });

  it("should handle API errors", async () => {
    (getSearchSuggestions as jest.Mock).mockRejectedValueOnce(
      new Error("Network error")
    );

    const { result } = renderHook(() => useSuggestions());

    act(() => {
      result.current.fetchSuggestions("app");
      jest.runAllTimers();
    });

    await act(async () => {}); // Wait for async updates

    expect(getSearchSuggestions).toHaveBeenCalledWith("app");
    expect(result.current.suggestions).toEqual([]); // Should remain empty on failure
  });

  it("should clear suggestions", () => {
    const { result } = renderHook(() => useSuggestions());

    act(() => {
      result.current.clearSuggestions();
    });

    expect(result.current.suggestions).toEqual([]);
  });
});
