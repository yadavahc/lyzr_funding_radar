import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { StartupData } from "@/types/index";

interface FundingChartsProps {
  startups: StartupData[];
  loading?: boolean;
}

export default function FundingCharts({ startups, loading }: FundingChartsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <motion.div
            key={i}
            className="h-96 bg-white/5 rounded-2xl animate-pulse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          />
        ))}
      </div>
    );
  }

  // Prepare data for charts
  const categoryData = startups.reduce(
    (acc, startup) => {
      const existing = acc.find((item) => item.name === startup.category);
      if (existing) {
        existing.value += 1;
        existing.funding += parseFloat(startup.fundingTotal?.replace(/[^0-9.]/g, "") || "0");
      } else {
        acc.push({
          name: startup.category,
          value: 1,
          funding: parseFloat(startup.fundingTotal?.replace(/[^0-9.]/g, "") || "0"),
        });
      }
      return acc;
    },
    [] as Array<{ name: string; value: number; funding: number }>
  );

  const roundData = startups.reduce(
    (acc, startup) => {
      const existing = acc.find((item) => item.name === startup.latestRound);
      if (existing) {
        existing.count += 1;
      } else {
        acc.push({
          name: startup.latestRound,
          count: 1,
        });
      }
      return acc;
    },
    [] as Array<{ name: string; count: number }>
  );

  const colors = ["#8b5cf6", "#a855f7", "#c084fc", "#d8b4fe", "#22c55e", "#f97316"];

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      {/* Bar Chart - Funding by Category */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">Funding by Category</h3>
          <p className="text-sm text-gray-400">Distribution across AI sectors</p>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} margin={{ top: 8, right: 8, left: -16, bottom: 56 }}>
              <defs>
                <linearGradient id="colorFunding" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={1} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#9ca3af"
                tick={{ fill: "#9ca3af", fontSize: 11 }}
                angle={-30}
                textAnchor="end"
                height={72}
              />
              <YAxis stroke="#9ca3af" tick={{ fill: "#9ca3af", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: "rgba(0, 0, 0, 0.95)",
                  border: "1px solid rgba(139, 92, 246, 0.3)",
                  borderRadius: "12px",
                  backdropFilter: "blur(12px)",
                }}
                labelStyle={{ color: "#e5e7eb", fontWeight: 600 }}
                itemStyle={{ color: "#c084fc" }}
                cursor={{ fill: "rgba(139, 92, 246, 0.1)" }}
              />
              <Bar dataKey="value" fill="url(#colorFunding)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Pie Chart - Round Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="space-y-4"
      >
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">Round Distribution</h3>
          <p className="text-sm text-gray-400">Funding stages breakdown</p>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={roundData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry: any) => `${entry.name} (${entry.count})`}
                outerRadius={110}
                innerRadius={60}
                fill="#8b5cf6"
                dataKey="count"
                paddingAngle={2}
              >
                {roundData.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={colors[index % colors.length]}
                    stroke="rgba(0,0,0,0.3)"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "rgba(0, 0, 0, 0.95)",
                  border: "1px solid rgba(139, 92, 246, 0.3)",
                  borderRadius: "12px",
                  backdropFilter: "blur(12px)",
                }}
                labelStyle={{ color: "#e5e7eb", fontWeight: 600 }}
                itemStyle={{ color: "#c084fc" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Empty State */}
      {startups.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="xl:col-span-2"
        >
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl py-20 text-center">
            <div className="mx-auto max-w-md space-y-2">
              <p className="text-lg font-medium text-gray-300">No data to visualize yet</p>
              <p className="text-sm text-gray-500">Fetch startup data to see funding analysis and trends.</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
