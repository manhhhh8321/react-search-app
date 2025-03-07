import { renderHook, act } from "@testing-library/react";
import { useSearch } from "@/hooks/useSearch";
import { getSearchResults } from "@/apis/search";

jest.mock("@/apis/search", () => ({
  getSearchResults: jest.fn(),
}));

describe("useSearch Hook", () => {
  it("should initialize with default values", () => {
    const { result } = renderHook(() => useSearch());
    expect(result.current.results).toBeUndefined();
    expect(result.current.loading).toBe(false);
    expect(result.current.searchKeyword).toBe("");
    expect(result.current.error).toBeUndefined();
  });

  it("should fetch search results successfully", async () => {
    const mockData = { ResultItems: [{ title: "Test Result" }], TotalNumberOfResults: 1 };
    (getSearchResults as jest.Mock).mockResolvedValueOnce({ error: null, data: mockData });

    const { result } = renderHook(() => useSearch());

    await act(async () => {
      await result.current.fetchSearchResults("test");
    });

    expect(getSearchResults).toHaveBeenCalledWith("test");
    expect(result.current.results).toEqual(mockData);
    expect(result.current.searchKeyword).toBe("test");
    expect(result.current.error).toBeUndefined();
    expect(result.current.loading).toBe(false);
  });

  it("should handle API errors", async () => {
    const mockError = new Error("Network error");
    (getSearchResults as jest.Mock).mockResolvedValueOnce({ error: mockError, data: null });

    const { result } = renderHook(() => useSearch());

    await act(async () => {
      await result.current.fetchSearchResults("test");
    });

    expect(getSearchResults).toHaveBeenCalledWith("test");
    expect(result.current.results).toBeNull();
    expect(result.current.searchKeyword).toBe("test");
    expect(result.current.loading).toBe(false);
  });
});
