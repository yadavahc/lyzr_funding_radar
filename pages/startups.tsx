import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import StartupTable from "@/components/StartupTable";
import { StartupData, PaginatedResponse } from "@/types/index";
import { Filter, ChevronLeft, ChevronRight, Rocket } from "lucide-react";

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
    <Layout>
      <Container>
        {/* Hero Section */}
        <Section padding="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <Badge variant="primary" size="md" icon={<Rocket className="h-3.5 w-3.5" />}>
              Startup Directory
            </Badge>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-white">
              All Startups
            </h1>
            
            <p className="text-lg text-gray-400 max-w-2xl">
              Browse and filter all tracked AI companies in our database
            </p>
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
              <p className="text-sm text-red-200">❌ {error}</p>
            </Card>
          </motion.div>
        )}

        {/* Filter Section */}
        <Section padding="md">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-violet-500/10">
                <Filter className="h-5 w-5 text-violet-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Filter by Category</h2>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setCategoryFilter(cat);
                  setPage(1);
                }}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                  ${
                    categoryFilter === cat
                      ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30 border border-violet-400/50"
                      : "bg-white/5 text-gray-300 border border-white/10 hover:border-white/20 hover:bg-white/10"
                  }
                `}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </Section>

        {/* Startups Table */}
        <Section padding="md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card padding="lg">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-1">
                  {categoryFilter === "All" ? "All Companies" : `${categoryFilter} Companies`}
                </h3>
                <p className="text-sm text-gray-400">
                  {startups.length} {startups.length === 1 ? 'startup' : 'startups'} found
                </p>
              </div>
              <StartupTable startups={startups} loading={loading} />
            </Card>
          </motion.div>
        </Section>

        {/* Pagination */}
        {totalPages > 1 && (
          <Section padding="md">
            <div className="flex justify-center items-center gap-4">
              <Button
                variant="secondary"
                disabled={page === 1 || loading}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <Card padding="sm" className="min-w-[120px] text-center">
                <span className="text-sm font-semibold">
                  <span className="text-violet-400">{page}</span>
                  {" / "}
                  <span className="text-gray-400">{totalPages}</span>
                </span>
              </Card>

              <Button
                variant="secondary"
                disabled={page === totalPages || loading}
                onClick={() => setPage(page + 1)}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </Section>
        )}
      </Container>
    </Layout>
  );
}
