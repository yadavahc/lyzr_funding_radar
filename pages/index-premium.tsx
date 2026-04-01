import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import { useToast } from "@/components/Toast";
import { DashboardStats, StartupData, FetchAndExtractResponse } from "@/types/index";
import { 
  TrendingUp, 
  Users, 
  Briefcase, 
  Sparkles, 
  Building2, 
  DollarSign, 
  Rocket,
  Zap,
  BarChart3,
  TrendingDown,
  Activity
} from "lucide-react";
import AetherFlowBackground from "@/components/ui/aether-flow-background";
import { FlowHoverButton } from "@/components/ui/flow-hover-button";
import { AnimatedStatCard } from "@/components/ui/animated-stat-card";
import { PremiumCard } from "@/components/ui/premium-card";
import AnimatedCounter from "@/components/AnimatedCounter";
import StartupTable from "@/components/StartupTable";
import FundingCharts from "@/components/FundingCharts";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentStartups, setRecentStartups] = useState<StartupData[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [status, setStatus] = useState("Initializing...");
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const statsRes = await fetch("/api/stats");
      if (statsRes.ok) {
        setStats(await statsRes.json());
      }

      const startupsRes = await fetch("/api/startups?page=1&pageSize=10");
      if (startupsRes.ok) {
        const data = await startupsRes.json();
        setRecentStartups(data.data || []);
      }
    } catch (err) {
      const errorMsg = "Failed to load data";
      setError(errorMsg);
      addToast(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFetchData = async () => {
    setFetching(true);
    setError(null);
    try {
      setStatus("🔍 Fetching articles...");
      addToast("Starting data extraction...", "info");

      const response = await fetch("/api/fetch-and-extract", { method: "POST" });
      if (!response.ok) throw new Error("Failed to fetch data");

      const result: FetchAndExtractResponse = await response.json();
      setStatus(`✅ Complete! Inserted: ${result.inserted}, Duplicates: ${result.duplicates}`);

      addToast(
        `✨ Success! Added ${result.inserted} startups (${result.duplicates} duplicates)`,
        "success"
      );

      setTimeout(() => {
        fetchData();
        setFetching(false);
      }, 1500);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      setError(errorMsg);
      setFetching(false);
      addToast(errorMsg, "error");
    }
  };

  return (
    <AetherFlowBackground>
      <div className="min-h-screen">
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-4"
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 backdrop-blur-sm">
                <Zap className="w-4 h-4 text-purple-400 animate-pulse" />
                <span className="text-sm font-medium text-purple-300">
                  AI-Powered Intelligence Platform
                </span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl sm:text-7xl font-black mb-6"
            >
              <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                AI Startup
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Intelligence Hub
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-400 max-w-3xl mx-auto mb-8"
            >
              Discover, analyze, and track recently funded AI developer tool startups
              with advanced intelligence and real-time insights
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <FlowHoverButton
                onClick={handleFetchData}
                disabled={fetching}
                icon={fetching ? <Activity className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                className="text-lg px-8 py-4"
              >
                {fetching ? "Processing..." : "Fetch Latest Data"}
              </FlowHoverButton>
            </motion.div>

            {fetching && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6"
              >
                <div className="inline-block px-6 py-3 rounded-full bg-purple-500/10 border border-purple-500/30 backdrop-blur-sm">
                  <p className="text-sm text-purple-300 font-medium">{status}</p>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-100 text-sm flex items-start gap-3 backdrop-blur-sm"
            >
              <span className="text-xl flex-shrink-0">❌</span>
              <p>{error}</p>
            </motion.div>
          )}

          {/* Stats Grid */}
          <div className="mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="h-12 w-1.5 rounded-full bg-gradient-to-b from-purple-500 via-pink-500 to-purple-500 shadow-lg shadow-purple-500/50" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Live Metrics
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <AnimatedStatCard
                icon={Building2}
                title="Total Companies"
                value={<AnimatedCounter value={stats?.totalCompanies || 0} />}
                trend={12}
                trendLabel="vs last month"
                description="Active startups tracked"
                delay={0}
                gradient="purple"
              />
              <AnimatedStatCard
                icon={DollarSign}
                title="Latest Funding"
                value={stats?.latestFundingAmount || "N/A"}
                trend={8}
                trendLabel="recent round"
                description="Most recent investment"
                delay={0.1}
                gradient="green"
              />
              <AnimatedStatCard
                icon={Briefcase}
                title="Top Category"
                value={stats?.topCategory || "N/A"}
                description="Leading industry"
                delay={0.2}
                gradient="pink"
              />
              <AnimatedStatCard
                icon={TrendingUp}
                title="This Week"
                value={<AnimatedCounter value={stats?.thisWeekCount || 0} />}
                trend={25}
                trendLabel="new entries"
                description="Fresh listings"
                delay={0.3}
                gradient="blue"
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Recent Companies */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-3 mb-6"
              >
                <Users className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  Recent Companies
                </h2>
              </motion.div>
              <PremiumCard variant="gradient" delay={0.5}>
                <StartupTable startups={recentStartups} loading={loading} />
              </PremiumCard>
            </div>

            {/* Quick Insights */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-3 mb-6"
              >
                <BarChart3 className="w-6 h-6 text-pink-400" />
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent">
                  Quick Insights
                </h2>
              </motion.div>

              <div className="space-y-4">
                {[
                  { icon: DollarSign, label: "Avg Funding", value: "$15.2M", trend: "+18%", color: "emerald" },
                  { icon: Rocket, label: "Most Active", value: "Q1 2026", trend: "32 deals", color: "blue" },
                  { icon: TrendingUp, label: "Success Rate", value: "94.2%", trend: "+5.3%", color: "purple" },
                  { icon: Activity, label: "Engagement", value: "High", trend: "+23%", color: "pink" },
                ].map((item, i) => (
                  <PremiumCard key={i} variant="glow" hover delay={0.5 + i * 0.1}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-${item.color}-500/20`}>
                          <item.icon className={`w-5 h-5 text-${item.color}-400`} />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 uppercase font-medium">{item.label}</p>
                          <p className="text-xl font-bold text-white">{item.value}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-emerald-400 text-sm font-bold">{item.trend}</span>
                      </div>
                    </div>
                  </PremiumCard>
                ))}
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Funding Analysis
              </h2>
            </div>
            <PremiumCard variant="gradient" delay={0.7}>
              <FundingCharts startups={recentStartups} loading={loading} />
            </PremiumCard>
          </motion.div>
        </main>
      </div>
    </AetherFlowBackground>
  );
}
