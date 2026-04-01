import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import StatsGrid from "@/components/StatsGrid";
import StatCard from "@/components/StatCard";
import { useToast } from "@/components/Toast";
import { DashboardStats, StartupData, FetchAndExtractResponse } from "@/types/index";
import { 
  TrendingUp, 
  Users, 
  Briefcase, 
  Sparkles, 
  Building2, 
  DollarSign, 
  Activity,
  LineChart,
  Radar,
  BarChart3,
  ArrowUpRight,
} from "lucide-react";
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
    <Layout>
      <Container>
        {/* Hero Section */}
        <Section padding="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card variant="gradient" padding="lg">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl space-y-4">
                  <Badge variant="primary" size="md" icon={<Radar className="h-3.5 w-3.5" />}>
                    Real-time AI funding intelligence
                  </Badge>
                  
                  <h1 className="text-4xl font-bold tracking-tight text-white lg:text-5xl">
                    Track Funded AI Startups
                  </h1>
                  
                  <p className="max-w-2xl text-base text-gray-400 lg:text-lg">
                    Explore live metrics, investor momentum, and funding round distribution from a single, modern dashboard.
                  </p>
                </div>

                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                  <Button
                    onClick={handleFetchData}
                    disabled={fetching}
                    variant="primary"
                    size="lg"
                    loading={fetching}
                  >
                    <Sparkles className="h-4 w-4" />
                    {fetching ? "Processing" : "Fetch Latest Data"}
                  </Button>
                  
                  <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm px-4 py-3 text-sm text-gray-300">
                    {fetching ? status : "Data refresh available"}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </Section>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card variant="bordered" className="border-red-500/30 bg-red-500/10">
              <p className="text-sm text-red-200">{error}</p>
            </Card>
          </motion.div>
        )}

        {/* Key Metrics Section */}
        <Section padding="md">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-violet-500/10">
                <BarChart3 className="h-5 w-5 text-violet-400" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-white">Key Metrics</h2>
            </div>
            <p className="text-sm text-gray-400">Real-time statistics and insights</p>
          </div>

          <StatsGrid columns={4}>
            <StatCard
              title="Total Companies"
              value={<AnimatedCounter value={stats?.totalCompanies || 0} />}
              icon={Building2}
              trend={12}
              subtitle="Active startups tracked"
              delay={0}
            />
            <StatCard
              title="Latest Funding"
              value={stats?.latestFundingAmount || "N/A"}
              icon={DollarSign}
              trend={8}
              subtitle="Most recent investment"
              delay={0.1}
            />
            <StatCard
              title="Top Category"
              value={stats?.topCategory || "N/A"}
              icon={Briefcase}
              subtitle="Leading industry"
              delay={0.2}
            />
            <StatCard
              title="This Week"
              value={<AnimatedCounter value={stats?.thisWeekCount || 0} />}
              icon={TrendingUp}
              trend={25}
              subtitle="Fresh listings"
              delay={0.3}
              isTrending
            />
          </StatsGrid>
        </Section>

        {/* Recent Companies & Insights Section */}
        <Section padding="md">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Recent Companies */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-violet-500/10">
                    <Users className="h-5 w-5 text-violet-400" />
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-white">Recent Companies</h2>
                </div>
                <p className="text-sm text-gray-400">Latest funded startups in our database</p>
              </div>
              
              <Card padding="md">
                <StartupTable startups={recentStartups} loading={loading} />
              </Card>
            </div>

            {/* Quick Insights */}
            <div>
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-violet-500/10">
                    <LineChart className="h-5 w-5 text-violet-400" />
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-white">Insights</h2>
                </div>
                <p className="text-sm text-gray-400">Quick overview highlights</p>
              </div>

              <div className="space-y-4">
                {[
                  { icon: DollarSign, label: "Total Funding", value: stats?.totalFunding || "N/A", trend: "Uptrend" },
                  { icon: ArrowUpRight, label: "Momentum", value: `${stats?.thisWeekCount || 0} this week`, trend: "Active" },
                  { icon: BarChart3, label: "Top Category", value: stats?.topCategory || "N/A", trend: "Leading" },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                  >
                    <Card hover padding="md">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 shadow-md">
                            <item.icon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wider text-gray-400">{item.label}</p>
                            <p className="text-base font-semibold text-white">{item.value}</p>
                          </div>
                        </div>
                        <Badge variant="primary" size="sm">
                          {item.trend}
                        </Badge>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Funding Analysis Section */}
        <Section padding="md">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-violet-500/10">
                <BarChart3 className="h-5 w-5 text-violet-400" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-white">Funding Analysis</h2>
            </div>
            <p className="text-sm text-gray-400">Visualize funding trends and distributions</p>
          </div>

          <Card padding="lg">
            <FundingCharts startups={recentStartups} loading={loading} />
          </Card>
        </Section>
      </Container>
    </Layout>
  );
}
