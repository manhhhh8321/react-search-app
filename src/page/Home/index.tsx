import SearchBar from "@/components/SearchBar";
import SearchResult from "@/components/SearchResult";
import { ISearchResultResponse } from "@/types";
import { fetchSearchResult } from "@/utils/api";
import { useState } from "react";

function SearchPage() {
  const [searchResult, setSearchResult] =
    useState<ISearchResultResponse | null>();
  const [error, setError] = useState<unknown | null>();
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  const onSearch = (keyword: string) => {
    fetchSearchResult(keyword).then(({ error, data }) => {
      setSearchKeyword(keyword);
      setSearchResult(data);
      setError(error);
    });
  };

  return (
    <>
      <div className="shadow-general sticky top-0 bg-white z-10">
        <div className="py-10 w-4/5 mx-auto">
          <SearchBar onSearch={onSearch} />
        </div>
      </div>
      <div className="pb-20 w-4/5 mx-auto">
        {searchResult && (
          <SearchResult
            items={searchResult.ResultItems}
            total={searchResult.TotalNumberOfResults}
            page={searchResult.Page}
            pageSize={searchResult.PageSize}
            searchKeyword={searchKeyword}
          />
        )}
        {!!error && (
          <div className="text-red-500 text-base my-10">
            Network error. Please try again later!
          </div>
        )}
      </div>
    </>
  );
}

export default SearchPage;
