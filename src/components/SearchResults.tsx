import { useSearch } from "../hooks/useSearch";

const SearchResults = () => {
  const { results, loading } = useSearch();

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {results.length ? (
        results.map((result, index) => (
          <div key={index}>
            {/* <h3>{result.title}</h3>
            <p>{result.content}</p> */}
          </div>
        ))
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default SearchResults;
