import { useEffect, useState } from "react";
import Link from "next/link";
import StartupTable from "@/components/StartupTable";
import LoadingStatus from "@/components/LoadingStatus";
import { StartupData, PaginatedResponse } from "@/types/index";

export default function StartupsPage() {
  const [startups, setStartups] = useState<StartupData[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [error, setError] = useState<string | null>(null);

  const categories = [
    "All",
    "AI Infra",
    "AI Dev Tools",
    "LLM Tools",
    "Agent Platform",
    "Other",
  ];

  useEffect(() => {
    fetchStartups();
  }, [page, categoryFilter]);

  const fetchStartups = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/startups?page=${page}&pageSize=20`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch startups");
      }

      const data: PaginatedResponse<StartupData> = await response.json();

      let filtered = data.data || [];
      if (categoryFilter !== "All") {
        filtered = filtered.filter((s) => s.category === categoryFilter);
      }

      setStartups(filtered);
      setTotalPages(Math.ceil(data.total / data.pageSize));
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
              <h1 className="text-3xl font-bold text-gray-900">
                📊 All Startups
              </h1>
              <p className="text-gray-500 mt-1">Browse all tracked companies</p>
            </div>
            <nav className="flex gap-4">
              <Link href="/">
                <button className="px-4 py-2 text-gray-700 hover:text-gray-900">
                  Dashboard
                </button>
              </Link>
              <Link href="/search">
                <button className="px-4 py-2 text-gray-700 hover:text-gray-900">
                  Search
                </button>
              </Link>
              <Link href="/startups">
                <button className="px-4 py-2 text-gray-700 hover:text-gray-900 border-b-2 border-blue-600">
                  All Startups
                </button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            ❌ {error}
          </div>
        )}

        {/* Filter */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategoryFilter(cat);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                categoryFilter === cat
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-gray-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Startups Table */}
        <div className="mb-8">
          <StartupTable startups={startups} loading={loading} />
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <button
              disabled={page === 1 || loading}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages || loading}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </main>

      <LoadingStatus isLoading={loading} status="Loading..." />
    </div>
  );
}
