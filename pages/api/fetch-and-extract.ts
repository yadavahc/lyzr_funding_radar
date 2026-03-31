// Main orchestration endpoint: fetch -> extract -> deduplicate -> store -> sync

import type { NextApiRequest, NextApiResponse } from "next";
import { getSampleArticles } from "@/lib/sample-data";
import { ExtractorAgent } from "@/lib/lyzr-agent";
import {
  initializeCollection,
  checkDuplicate,
  insertStartup,
} from "@/lib/qdrant";
import { pushToSheets, initializeSheet } from "@/lib/sheets";
import { FetchAndExtractResponse } from "@/types/index";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FetchAndExtractResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      totalProcessed: 0,
      inserted: 0,
      duplicates: 0,
      errors: ["Method not allowed"],
      results: [],
    });
  }

  try {
    console.log("🚀 Starting fetch-and-extract pipeline...");

    // Initialize Qdrant collection if needed
    await initializeCollection();

    // Initialize Google Sheet if needed
    await initializeSheet();

    // Step 1: Fetch articles
    console.log("📰 Fetching sample articles...");
    const articles = getSampleArticles();
    console.log(`✅ Fetched ${articles.length} articles`);

    // Step 2: Extract data from articles
    console.log("🔍 Starting extraction with agent...");
    const agent = new ExtractorAgent();
    const extractionResults = await agent.runBatch(articles);

    console.log(
      `✅ Extraction complete: ${extractionResults.filter((r) => r.success).length}/${articles.length} successful`
    );

    // Step 3: Process results - check for duplicates, insert to Qdrant
    console.log("🔄 Processing results...");
    const successfulExtractions = extractionResults.filter(
      (r) => r.success && r.data
    );
    let insertedCount = 0;
    let duplicateCount = 0;
    const errors: string[] = [];

    const startupsToPush = [];

    for (const extraction of successfulExtractions) {
      try {
        if (!extraction.data) continue;

        // Check for duplicates
        const existing = await checkDuplicate(
          extraction.data.companyName,
          extraction.data.category
        );

        if (existing) {
          console.log(`⏭️  Skipping duplicate: ${extraction.data.companyName}`);
          duplicateCount++;
          continue;
        }

        // Insert to Qdrant
        const id = await insertStartup(extraction.data);
        extraction.data.id = id;
        startupsToPush.push(extraction.data);
        insertedCount++;
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error(`❌ Error processing ${extraction.data?.companyName}:`, msg);
        errors.push(msg);
      }
    }

    // Step 4: Push to Google Sheets
    if (startupsToPush.length > 0) {
      console.log(
        `📊 Pushing ${startupsToPush.length} startups to Google Sheets...`
      );
      try {
        await pushToSheets(startupsToPush);
        console.log("✅ Successfully pushed to Google Sheets");
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.warn("⚠️  Could not push to sheets:", msg);
        errors.push(`Sheets sync failed: ${msg}`);
      }
    }

    console.log(`
🎉 Pipeline Complete!
   Total Processed: ${articles.length}
   Inserted: ${insertedCount}
   Duplicates: ${duplicateCount}
   Errors: ${errors.length}
    `);

    return res.status(200).json({
      success: true,
      totalProcessed: articles.length,
      inserted: insertedCount,
      duplicates: duplicateCount,
      errors,
      results: extractionResults,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Pipeline failed:", errorMessage);

    return res.status(500).json({
      success: false,
      totalProcessed: 0,
      inserted: 0,
      duplicates: 0,
      errors: [errorMessage],
      results: [],
    });
  }
}
