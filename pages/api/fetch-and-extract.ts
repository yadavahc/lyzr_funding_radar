// Main orchestration endpoint: fetch -> extract -> deduplicate -> store -> sync

import type { NextApiRequest, NextApiResponse } from "next";
import {
  initializeCollection,
  checkDuplicate,
  insertStartup,
} from "@/lib/mock-db";
import { fetchRealStartupData } from "@/lib/real-data";
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

    // Initialize collection
    await initializeCollection();

    // Initialize Google Sheets
    await initializeSheet();

    // Fetch real startup data
    console.log("📰 Fetching real AI startup data...");
    const startups = await fetchRealStartupData();
    console.log(`✅ Fetched ${startups.length} startups`);

    let insertedCount = 0;
    let duplicateCount = 0;
    const errors: string[] = [];
    const results = [];
    const startupsForSheets = [];

    // Process each startup
    for (const startup of startups) {
      try {
        // Check for duplicates
        const existing = await checkDuplicate(
          startup.companyName,
          startup.category
        );

        if (existing) {
          console.log(`⏭️  Skipping duplicate: ${startup.companyName}`);
          duplicateCount++;
          results.push({ success: false, error: "Duplicate" });
          continue;
        }

        // Insert to mock DB
        const id = await insertStartup(startup);
        insertedCount++;
        startupsForSheets.push({ ...startup, id });
        results.push({ success: true, data: startup });
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error(`❌ Error processing ${startup.companyName}:`, msg);
        errors.push(msg);
        results.push({ success: false, error: msg });
      }
    }

    // Push to Google Sheets
    if (startupsForSheets.length > 0) {
      console.log(
        `📊 Pushing ${startupsForSheets.length} startups to Google Sheets...`
      );
      try {
        await pushToSheets(startupsForSheets);
        console.log("✅ Successfully pushed to Google Sheets");
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.warn("⚠️  Could not push to sheets:", msg);
        errors.push(`Sheets sync failed: ${msg}`);
      }
    }

    console.log(`
🎉 Pipeline Complete!
   Total Processed: ${startups.length}
   Inserted: ${insertedCount}
   Duplicates: ${duplicateCount}
   Errors: ${errors.length}
    `);

    return res.status(200).json({
      success: true,
      totalProcessed: startups.length,
      inserted: insertedCount,
      duplicates: duplicateCount,
      errors,
      results,
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
