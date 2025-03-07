import SearchPageBanner from "@/components/common/Banner";
import SearchBar from "@/components/SearchBar";
import SearchResult from "@/components/SearchResult";
import { useSearch } from "@/hooks/useSearch";

function SearchPage() {
  const {
    results: searchResult,
    searchKeyword,
    fetchSearchResults,
    error,
  } = useSearch();

  const onSearch = (keyword: string) => {
    fetchSearchResults(keyword);
  };

  return (
    <>
      <div className="shadow-general sticky top-0 bg-white z-10">
        <div>
          <SearchPageBanner />
        </div>
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
