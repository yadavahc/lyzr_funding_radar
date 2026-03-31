// Trending startups endpoint

import type { NextApiRequest, NextApiResponse } from "next";
import { getTrendingStartups } from "@/lib/qdrant";
import { StartupData } from "@/types/index";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    { success: boolean; data?: StartupData[]; error?: string }
  >
) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const daysBack = parseInt(req.query.days as string) || 7;

    console.log(`📈 Fetching trending startups from last ${daysBack} days...`);

    const trending = await getTrendingStartups(daysBack);

    return res.status(200).json({
      success: true,
      data: trending,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Failed to fetch trending:", errorMessage);

    return res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
}
