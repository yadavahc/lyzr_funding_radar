import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import StatsGrid from "@/components/StatsGrid";
import StatCard from "@/components/StatCard";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { StartupData, DashboardStats } from "@/types/index";
import { TrendingUp, Users, Briefcase, DollarSign, Award, Target, BarChart3 } from "lucide-react";
import AnimatedCounter from "@/components/AnimatedCounter";

const COLORS = ["#6366f1", "#a855f7", "#ec4899", "#f43f5e", "#f97316", "#eab308", "#22c55e", "#06b6d4"];

export default function StatsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentStartups, setRecentStartups] = useState<StartupData[]>([]);
  const [fundingByCategory, setFundingByCategory] = useState([]);
  const [fundingTrend, setFundingTrend] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const statsRes = await fetch("/api/stats");
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      const startupsRes = await fetch("/api/startups?page=1&pageSize=50");
      if (startupsRes.ok) {
        const data = await startupsRes.json();
        const startups = data.data || [];
        setRecentStartups(startups);

        // Process funding by category
        const categoryMap = new Map();
        startups.forEach((s: StartupData) => {
          const category = s.category || "Other";
          const amount = parseFloat(s.fundingAmount?.replace(/[^0-9.]/g, "") || "0");
          if (categoryMap.has(category)) {
            categoryMap.set(category, {
              name: category,
              value: categoryMap.get(category).value + amount,
              count: categoryMap.get(category).count + 1,
            });
          } else {
            categoryMap.set(category, { name: category, value: amount, count: 1 });
          }
        });
        setFundingByCategory(Array.from(categoryMap.values()).sort((a, b) => b.value - a.value).slice(0, 8));

        // Generate mock trend data
        const trend = [];
        for (let i = 0; i < 12; i++) {
          trend.push({
            month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
            funding: Math.floor(Math.random() * 500) + 200,
            companies: Math.floor(Math.random() * 30) + 10,
          });
        }
        setFundingTrend(trend);
      }
    } catch (err) {
      console.error(err);
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
            className="space-y-4"
          >
            <Badge variant="primary" size="md" icon={<BarChart3 className="h-3.5 w-3.5" />}>
              Advanced Analytics
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold text-white">
              Analytics & <span className="text-gradient">Insights</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl">
              Deep dive into AI startup funding trends and patterns
            </p>
          </motion.div>
        </Section>

        {/* Key Metrics Grid */}
        <Section padding="md">
          <StatsGrid columns={4}>
            <StatCard
              icon={Users}
              title="Total Companies"
              value={<AnimatedCounter value={stats?.totalCompanies || 0} />}
              trend={12}
              subtitle="Active startups"
            />
            <StatCard
              icon={DollarSign}
              title="Total Funding"
              value={`$${(stats?.totalCompanies || 0) * 100}M+`}
              trend={8}
              subtitle="Capital raised"
            />
            <StatCard
              icon={Target}
              title="Categories"
              value={fundingByCategory.length}
              trend={5}
              subtitle="Industry sectors"
            />
            <StatCard
              icon={Award}
              title="This Week"
              value={<AnimatedCounter value={stats?.thisWeekCount || 0} />}
              trend={23}
              subtitle="New entries"
              isTrending
            />
          </StatsGrid>
        </Section>

        {/* Charts Grid */}
        <Section padding="md">
          <div className="mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">Detailed Analysis</h2>
            <p className="text-sm text-gray-400">Visualize funding distributions and trends</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Funding by Category - Pie Chart */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <Card variant="gradient" padding="lg">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-violet-400" />
                    Funding by Category
                  </h3>
                  <p className="text-sm text-gray-400">Distribution across sectors</p>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={fundingByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={90}
                      innerRadius={50}
                      fill="#8884d8"
                      dataKey="value"
                      paddingAngle={2}
                    >
                      {fundingByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                      contentStyle={{
                        background: "rgba(0, 0, 0, 0.95)",
                        border: "1px solid rgba(139, 92, 246, 0.3)",
                        borderRadius: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>

            {/* Funding Trend - Area Chart */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <Card variant="gradient" padding="lg">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-violet-400" />
                    Funding Trend
                  </h3>
                  <p className="text-sm text-gray-400">Monthly funding activity</p>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={fundingTrend}>
                    <defs>
                      <linearGradient id="colorFunding" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="month" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(0, 0, 0, 0.95)",
                        border: "1px solid rgba(139, 92, 246, 0.3)",
                        borderRadius: "12px",
                      }}
                    />
                    <Area type="monotone" dataKey="funding" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#colorFunding)" />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>

            {/* Companies per Month - Bar Chart */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <Card variant="gradient" padding="lg">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
                    <Users className="w-5 h-5 text-violet-400" />
                    Companies Per Month
                  </h3>
                  <p className="text-sm text-gray-400">New startup activity</p>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={fundingTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="month" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(0, 0, 0, 0.95)",
                        border: "1px solid rgba(139, 92, 246, 0.3)",
                        borderRadius: "12px",
                      }}
                    />
                    <Bar dataKey="companies" fill="#a855f7" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>

            {/* Top Categories - Progress Bars */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <Card variant="gradient" padding="lg">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
                    <Award className="w-5 h-5 text-violet-400" />
                    Top Categories
                  </h3>
                  <p className="text-sm text-gray-400">Leading by funding volume</p>
                </div>
                <div className="space-y-4">
                  {fundingByCategory.slice(0, 5).map((cat, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300 font-medium">{cat.name}</span>
                        <span className="text-violet-400 font-bold">${(cat.value / 1000000).toFixed(1)}M</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(cat.value / (fundingByCategory[0]?.value || 1)) * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: "easeOut", delay: idx * 0.1 }}
                          className="h-full bg-gradient-to-r from-violet-600 to-purple-500 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </Section>

        {/* Recent Activity */}
        <Section padding="md">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Card variant="gradient" padding="lg">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-violet-400" />
                  Recent Funded Startups
                </h3>
                <p className="text-sm text-gray-400">Latest funding announcements</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto">
                {recentStartups.slice(0, 12).map((startup, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.03 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/5 hover:border-violet-500/30 group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate group-hover:text-violet-300 transition-colors">{startup.name}</p>
                      <p className="text-xs text-gray-400">{startup.category}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-bold text-violet-400">{startup.fundingAmount}</p>
                      <p className="text-xs text-gray-500">{startup.fundingDate}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </Section>
      </Container>
    </Layout>
  );
}
