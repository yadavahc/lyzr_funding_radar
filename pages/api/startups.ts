// Get all startups with pagination

import type { NextApiRequest, NextApiResponse } from "next";
import { getAllStartups } from "@/lib/mock-db";
import { PaginatedResponse, StartupData } from "@/types/index";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PaginatedResponse<StartupData> | { error: string }>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;

    console.log(
      `📋 Fetching startups - page: ${page}, pageSize: ${pageSize}`
    );

    const result = await getAllStartups(page, pageSize);

    return res.status(200).json({
      data: result.startups,
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
      hasMore: page * pageSize < result.total,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Failed to fetch startups:", errorMessage);

    return res
      .status(500)
      .json({ error: errorMessage });
  }
}
