import { useState, useEffect } from "react";
import StatCard from "@/components/StatCard";
import StartupTable from "@/components/StartupTable";
import LoadingStatus from "@/components/LoadingStatus";
import { DashboardStats, StartupData, FetchAndExtractResponse } from "@/types/index";
import Link from "next/link";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentStartups, setRecentStartups] = useState<StartupData[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [status, setStatus] = useState("Initializing...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch stats
      const statsRes = await fetch("/api/stats");
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      // Fetch recent startups
      const startupsRes = await fetch("/api/startups?page=1&pageSize=10");
      if (startupsRes.ok) {
        const data = await startupsRes.json();
        setRecentStartups(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleFetchData = async () => {
    setFetching(true);
    setError(null);
    try {
      setStatus("Fetching articles...");

      const response = await fetch("/api/fetch-and-extract", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result: FetchAndExtractResponse = await response.json();

      setStatus(
        `✅ Complete! Inserted: ${result.inserted}, Duplicates: ${result.duplicates}`
      );

      // Refresh data
      setTimeout(() => {
        fetchData();
        setFetching(false);
        setTimeout(() => setStatus(""), 2000);
      }, 1000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(errorMsg);
      setStatus("");
      setFetching(false);
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
                🎯 AI Funding Radar
              </h1>
              <p className="text-gray-500 mt-1">
                Track and analyze AI startup funding
              </p>
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
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            ❌ {error}
          </div>
        )}

        {/* Action Button */}
        <div className="mb-8">
          <button
            onClick={handleFetchData}
            disabled={fetching}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold"
          >
            {fetching ? "Processing..." : "🚀 Fetch & Extract Data"}
          </button>
          {fetching && (
            <p className="text-sm text-gray-600 mt-2">
              {status}
            </p>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Companies"
            value={stats?.totalCompanies || 0}
            icon="🏢"
            loading={loading}
          />
          <StatCard
            title="Latest Funding"
            value={stats?.latestFundingAmount || "N/A"}
            icon="💰"
            loading={loading}
          />
          <StatCard
            title="Top Category"
            value={stats?.topCategory || "N/A"}
            icon="🏷️"
            loading={loading}
          />
          <StatCard
            title="Trending This Week"
            value={stats?.thisWeekCount || 0}
            icon="📈"
            loading={loading}
          />
        </div>

        {/* Recent Startups */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Recent Companies
          </h2>
          <StartupTable startups={recentStartups} loading={loading} />
        </div>
      </main>

      {/* Loading Modal */}
      <LoadingStatus isLoading={fetching} status={status} />
    </div>
  );
}
