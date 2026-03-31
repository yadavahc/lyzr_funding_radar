// Dashboard statistics endpoint

import type { NextApiRequest, NextApiResponse } from "next";
import {
  getCollectionStats,
  getAllStartups,
  getTrendingStartups,
} from "@/lib/qdrant";
import { DashboardStats } from "@/types/index";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DashboardStats | { error: string }>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("📊 Fetching dashboard statistics...");

    // Get total companies
    const stats = await getCollectionStats();

    // Get latest startup
    const latest = await getAllStartups(1, 1);
    const latestFunding = latest.startups[0]?.fundingTotal || "N/A";

    // Get trending startups this week
    const trending = await getTrendingStartups(7);

    // Get category distribution
    const allStartups = await getAllStartups(1, 1000);
    const categories: Record<string, number> = {};
    let totalFunding = 0;

    for (const startup of allStartups.startups) {
      const cat = startup.category || "Other";
      categories[cat] = (categories[cat] || 0) + 1;

      // Try to extract total funding
      const amount = startup.fundingTotal
        .match(/\d+/)?.[0]
        ? parseInt(startup.fundingTotal.match(/\d+/)?.[0] || "0")
        : 0;
      totalFunding += amount;
    }

    const topCategory = Object.entries(categories).sort(([, a], [, b]) => b - a)[0]?.[0] || "N/A";

    return res.status(200).json({
      totalCompanies: stats.totalPoints,
      latestFundingAmount: latestFunding,
      topCategory,
      trendingCompanies: trending.length,
      thisWeekCount: trending.length,
      totalFunding,
    } as any);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Failed to fetch stats:", errorMessage);

    return res
      .status(500)
      .json({ error: errorMessage });
  }
}
