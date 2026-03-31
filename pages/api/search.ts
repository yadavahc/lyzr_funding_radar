// Search endpoint - find similar startups using Qdrant

import type { NextApiRequest, NextApiResponse } from "next";
import { findSimilarStartups } from "@/lib/qdrant";
import { SearchResult } from "@/types/index";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ success: boolean; results?: SearchResult[]; error?: string }>
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  try {
    const { query, limit = 5 } = req.body;

    if (!query || typeof query !== "string") {
      return res
        .status(400)
        .json({ success: false, error: "Query parameter required" });
    }

    console.log(`🔍 Searching for similar companies: ${query}`);

    const results = await findSimilarStartups(query, limit);

    console.log(`✅ Found ${results.length} similar startups`);

    return res.status(200).json({
      success: true,
      results: results.map((r) => ({
        company: r.startup,
        similarity: r.similarity,
      })),
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Search failed:", errorMessage);

    return res
      .status(500)
      .json({ success: false, error: errorMessage });
  }
}
