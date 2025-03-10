import { ISearchResultResponse, ISearchSuggestionResponse } from "@/types";
import { filterSearchResult, filterSearchSuggestion, getRelatedResults } from "./mock-filter";

let mockSuggestions: ISearchSuggestionResponse;

beforeEach(() => {
  mockSuggestions = {
    suggestions: {
      "baby bonus": 0.5,
      "baby support grant": 0.4,
      "baby bonus account services": 0.3,
      "baby bonus application status": 0.37,
      "baby bonus cash gift": 0.38,
      "baby bonus eligibility": 0.39,
      "care for a new baby": 0.34,
      "care for a child": 0.23,
      "child care and kindergartens": 0.26,
      "childcare and preschool": 0.28,
      "government-paid childcare": 0.25,
      "infant care": 0.16,
      "infant and child care": 0.17,
      "preschool enrolment": 0.92
    },
    synonyms: {
      "infant": ["child", "baby"],
      "child": ["infant", "baby"],
      "preschool": ["childcare"],
      "childcare": ["preschool"]
    }
  };
});

describe("filterSearchResult", () => {
  it("should filter results based on keyword", () => {
    const mockResult: ISearchResultResponse = {
      ResultItems: [
        {
          DocumentId: "1",
          DocumentURI: "https://example.com/child-care",
          DocumentTitle: { Text: "Child Care Services", Highlights: [] },
          DocumentExcerpt: { Text: "Find the best child care services.", Highlights: [] }
        },
        {
          DocumentId: "2",
          DocumentURI: "https://example.com/elderly-care",
          DocumentTitle: { Text: "Elderly Care Support", Highlights: [] },
          DocumentExcerpt: { Text: "Support services for elderly care.", Highlights: [] }
        }
      ],
      TotalNumberOfResults: 2,
      Page: 1,
      PageSize: 10
    };

    const filtered = filterSearchResult(mockResult, "child care");
    expect(filtered.ResultItems.length).toBe(1);
    expect(filtered.ResultItems[0].DocumentTitle.Text).toBe("Child Care Services");
  });
});

describe("filterSearchSuggestion", () => {
  it("should return suggestions containing the keyword", () => {
    const filtered = filterSearchSuggestion(mockSuggestions, "child");
    expect(filtered).toEqual([
      "childcare and preschool",
      "child care and kindergartens",
      "government-paid childcare",
      "care for a child",
      "infant and child care"
    ]);
  });
});

describe("getRelatedResults", () => {
  it("should return related results based on synonyms", () => {
    const relatedResults = getRelatedResults(mockSuggestions, "childcare");

    expect(relatedResults).toEqual([
      "childcare and preschool",
      "preschool enrolment"
    ]);
  });

  it("should return an empty array when no related results are found", () => {
    mockSuggestions = {
      suggestions: {
        "tax benefits": 0.5,
        "income tax rebate": 0.4
      },
      synonyms: {
        "tax": ["levy", "duty"]
      }
    };

    const relatedResults = getRelatedResults(mockSuggestions, "education");
    expect(relatedResults).toEqual([]);
  });
});