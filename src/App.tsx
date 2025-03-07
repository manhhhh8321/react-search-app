import ErrorBoundary from "./components/common/ErrorBoundary";
import SearchPage from "./page/Home";

function App() {
  return (
    <>
      <ErrorBoundary>
        <SearchPage />
      </ErrorBoundary>
    </>
  );
}

export default App;
