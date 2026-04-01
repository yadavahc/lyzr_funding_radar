import { motion } from "framer-motion";
import { StartupData } from "@/types/index";
import { ExternalLink, TrendingUp, Sparkles, Users } from "lucide-react";
import { useState } from "react";

interface StartupTableProps {
  startups: StartupData[];
  loading?: boolean;
}

export default function StartupTable({ startups, loading }: StartupTableProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="h-24 skeleton rounded-2xl"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatType: "reverse",
              delay: i * 0.1,
            }}
          />
        ))}
      </div>
    );
  }

  if (!startups || startups.length === 0) {
    return (
      <motion.div
        className="rounded-2xl border border-white/10 bg-white/5 py-16 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <p className="mb-2 text-lg text-zinc-300">No startups yet</p>
        <p className="text-sm text-zinc-500">Run a fresh fetch to populate funding data.</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      {startups.map((startup, idx) => {
        const isHighestFunding =
          idx === 0 &&
          startups.reduce(
            (max, s) =>
              parseFloat(s.fundingTotal?.replace(/[^0-9.]/g, "") || "0") >
              parseFloat(max.fundingTotal?.replace(/[^0-9.]/g, "") || "0")
                ? s
                : max,
            startups[0]
          ) === startup;

        return (
          <motion.a
            key={idx}
            href={startup.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            whileHover={{ scale: 1.02, y: -4 }}
            onHoverStart={() => setHoveredIdx(idx)}
            onHoverEnd={() => setHoveredIdx(null)}
            className={`group relative block overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:border-violet-400/40 hover:bg-white/10 ${
              isHighestFunding ? "ring-1 ring-emerald-400/40" : ""
            }`}
          >
            {isHighestFunding && (
              <motion.div
                className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-transparent to-violet-500/10"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            )}

            <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <h3 className="truncate text-base font-semibold text-white transition-colors group-hover:text-violet-200">
                    {startup.companyName}
                  </h3>
                  {isHighestFunding && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-300">
                      <Sparkles className="h-3 w-3" /> Top funded
                    </span>
                  )}
                </div>

                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-violet-400/30 bg-violet-500/15 px-2 py-0.5 text-xs font-medium text-violet-200">
                    <TrendingUp className="h-3 w-3" />
                    {startup.latestRound}
                  </span>
                  <span className="inline-flex rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-xs text-zinc-300">
                    {startup.category}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <Users className="h-4 w-4 text-zinc-500" />
                  <p className="truncate">{startup.founderNames?.join(", ") || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 sm:justify-end">
                <motion.div
                  className="text-left sm:text-right"
                  animate={hoveredIdx === idx ? { scale: 1.03 } : { scale: 1 }}
                  transition={{ type: "spring", stiffness: 250 }}
                >
                  <p className="text-2xl font-semibold tracking-tight text-white">
                    {startup.fundingTotal || "N/A"}
                  </p>
                  <p className="text-xs text-zinc-500">Total funding</p>
                </motion.div>

                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-lg border border-white/10 bg-white/5 p-2.5 text-zinc-300 transition group-hover:border-violet-400/40 group-hover:text-violet-200"
                >
                  <ExternalLink className="h-4 w-4" />
                </motion.div>
              </div>
            </div>

            <motion.div
              className="absolute bottom-0 left-0 h-0.5 w-full origin-left rounded-b-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: hoveredIdx === idx ? 1 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{ originX: 0 }}
            />
          </motion.a>
        );
      })}
    </div>
  );
}
