export interface IHighlight {
  BeginOffset: number;
  EndOffset: number;
}

export interface ISearchResultItem {
  DocumentId: string;
  DocumentTitle: {
    Text: string;
    Highlights: IHighlight[];
  };
  DocumentExcerpt: {
    Text: string;
    Highlights: IHighlight[];
  };
  DocumentURI: string;
}

export interface ISearchResultResponse {
  Page: number;
  PageSize: number;
  TotalNumberOfResults: number;
  ResultItems: ISearchResultItem[];
}

export interface ISearchSuggestionResponse {
  suggestions: Record<string, number>;
  synonyms: Record<string, string[]>;
}
