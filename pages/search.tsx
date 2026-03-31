import { useState, FormEvent } from "react";
import Link from "next/link";
import LoadingStatus from "@/components/LoadingStatus";
import { SearchResult } from "@/types/index";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();
      setResults(data.results || []);
      setSearched(true);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🔍 Search</h1>
              <p className="text-gray-500 mt-1">Find similar startups</p>
            </div>
            <nav className="flex gap-4">
              <Link href="/">
                <button className="px-4 py-2 text-gray-700 hover:text-gray-900">
                  Dashboard
                </button>
              </Link>
              <Link href="/search">
                <button className="px-4 py-2 text-gray-700 hover:text-gray-900 border-b-2 border-blue-600">
                  Search
                </button>
              </Link>
              <Link href="/startups">
                <button className="px-4 py-2 text-gray-700 hover:text-gray-900">
                  All Startups
                </button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for a startup (e.g., 'AI inference platform')"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </form>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            ❌ {error}
          </div>
        )}

        {/* Results */}
        {searched && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Similar Startups ({results.length})
            </h2>

            {results.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                No similar startups found. Try a different search term.
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((result, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {result.company.companyName}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Founders: {result.company.founderNames?.join(", ") || "-"}
                        </p>
                      </div>
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                        {(result.similarity * 100).toFixed(1)}% match
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Funding</p>
                        <p className="font-semibold text-gray-900">
                          {result.company.fundingTotal}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Category</p>
                        <p className="font-semibold text-gray-900">
                          {result.company.category}
                        </p>
                      </div>
                    </div>

                    <a
                      href={result.company.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View Source →
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!searched && !loading && (
          <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
            <p className="text-lg">Enter a query above to find similar startups</p>
            <p className="text-sm mt-2">
              Try searching for company types, technologies, or terms like
              "LLM", "AI inference", "Agent platform", etc.
            </p>
          </div>
        )}
      </main>

      <LoadingStatus isLoading={loading} status="Searching..." />
    </div>
  );
}
