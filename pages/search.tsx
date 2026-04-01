import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/Layout";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { SearchResult } from "@/types/index";
import { Search, Sparkles, ExternalLink, TrendingUp, Users, DollarSign } from "lucide-react";

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
    <Layout>
      <Container size="md">
        {/* Hero Section */}
        <Section padding="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4 text-center"
          >
            <Badge variant="primary" size="md" icon={<Sparkles className="h-3.5 w-3.5" />}>
              AI-Powered Search
            </Badge>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-white">
              Smart Search
            </h1>
            
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Find similar startups using AI-powered semantic search
            </p>
          </motion.div>
        </Section>

        {/* Search Form */}
        <Section padding="md">
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card variant="gradient" padding="sm">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for a startup (e.g., 'AI inference platform')"
                    className="w-full pl-12 pr-4 py-3 bg-black/40 text-white placeholder-gray-500 rounded-lg border border-white/10 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  variant="primary"
                  size="lg"
                  loading={loading}
                >
                  <Search className="h-4 w-4" />
                  Search
                </Button>
              </div>
            </Card>
          </motion.form>
        </Section>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card variant="bordered" className="border-red-500/30 bg-red-500/10">
              <p className="text-sm text-red-200">❌ {error}</p>
            </Card>
          </motion.div>
        )}

        {/* Results */}
        <Section padding="md">
          <AnimatePresence mode="wait">
            {searched ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-violet-400" />
                    Similar Startups
                  </h2>
                  <p className="text-sm text-gray-400">
                    Found {results.length} {results.length === 1 ? 'result' : 'results'}
                  </p>
                </div>

                {results.length === 0 ? (
                  <Card padding="lg">
                    <div className="text-center py-12">
                      <Search className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400 text-lg">No similar startups found.</p>
                      <p className="text-gray-500 text-sm mt-2">Try a different search term</p>
                    </div>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {results.map((result, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <Card variant="gradient" hover padding="lg" className="relative overflow-visible">
                          {/* Match Badge */}
                          <div className="absolute -top-3 right-6">
                            <Badge variant="success" size="md">
                              {(result.similarity * 100).toFixed(1)}% match
                            </Badge>
                          </div>

                          <div className="space-y-4">
                            {/* Company Name */}
                            <div>
                              <h3 className="text-xl font-bold text-white mb-2">
                                {result.company.companyName}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-gray-400">
                                <Users className="h-4 w-4" />
                                <span>Founders: {result.company.founderNames?.join(", ") || "N/A"}</span>
                              </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                                  Funding Total
                                </p>
                                <div className="flex items-center gap-2">
                                  <DollarSign className="h-4 w-4 text-emerald-400" />
                                  <p className="text-lg font-bold text-emerald-400">
                                    {result.company.fundingTotal}
                                  </p>
                                </div>
                              </div>

                              <div className="space-y-1">
                                <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                                  Category
                                </p>
                                <Badge variant="primary" size="sm">
                                  {result.company.category}
                                </Badge>
                              </div>
                            </div>

                            {/* Source Link */}
                            <a
                              href={result.company.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 text-sm font-medium transition-colors group"
                            >
                              <span>View Source</span>
                              <ExternalLink className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </a>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : !loading && (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card padding="lg">
                  <div className="text-center py-12">
                    <div className="p-4 rounded-full bg-violet-500/10 w-fit mx-auto mb-4">
                      <Search className="h-8 w-8 text-violet-400" />
                    </div>
                    <p className="text-white text-lg font-medium mb-2">
                      Enter a query above to find similar startups
                    </p>
                    <p className="text-gray-400 text-sm">
                      Try searching for{" "}
                      <span className="text-violet-400 font-semibold">"LLM"</span>,{" "}
                      <span className="text-violet-400 font-semibold">"AI inference"</span>, or{" "}
                      <span className="text-violet-400 font-semibold">"Agent platform"</span>
                    </p>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </Section>
      </Container>
    </Layout>
  );
}
