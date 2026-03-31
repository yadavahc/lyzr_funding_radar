// Google Sheets integration

import { google } from "googleapis";
import { StartupData } from "@/types/index";

let sheetsClient: ReturnType<typeof google.sheets> | null = null;

/**
 * Initialize Google Sheets API client
 */
function getAuthClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      type: "service_account",
      project_id: process.env.GOOGLE_PROJECT_ID,
      private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      client_id: process.env.GOOGLE_CLIENT_ID,
    } as any,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return auth;
}

/**
 * Get sheets API client
 */
function getSheetsClient() {
  if (!sheetsClient) {
    const auth = getAuthClient();
    sheetsClient = google.sheets({ version: "v4", auth });
  }
  return sheetsClient;
}

/**
 * Push startups to Google Sheet
 */
export async function pushToSheets(startups: StartupData[]): Promise<{
  success: boolean;
  updatedRows: number;
  error?: string;
}> {
  try {
    if (!process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID) {
      console.warn("⚠️  Google Sheet ID not configured. Skipping sheet update.");
      return {
        success: false,
        updatedRows: 0,
        error: "Google Sheet ID not configured",
      };
    }

    const sheets = getSheetsClient();
    const spreadsheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID;

    // Prepare rows for insertion
    const rows = startups.map((startup) => [
      startup.companyName || "",
      startup.founderNames?.join(", ") || "",
      startup.founderLinkedIns?.join(", ") || "",
      startup.email || "",
      startup.fundingTotal || "",
      startup.latestRound || "",
      startup.sourceUrl || "",
      startup.dateFounded || "",
      startup.marketingManagerLinkedIn || "",
      startup.marketingEmail || "",
      startup.category || "",
      new Date().toISOString(),
    ]);

    // Append rows to sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A:L",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: rows,
      },
    });

    console.log(`✅ Updated ${rows.length} rows in Google Sheet`);
    return {
      success: true,
      updatedRows: rows.length,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Failed to update Google Sheet:", errorMessage);
    return {
      success: false,
      updatedRows: 0,
      error: errorMessage,
    };
  }
}

/**
 * Initialize Google Sheet with headers (run once)
 */
export async function initializeSheet(): Promise<void> {
  try {
    if (!process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID) {
      console.warn(
        "⚠️  Google Sheet ID not configured. Skipping initialization."
      );
      return;
    }

    const sheets = getSheetsClient();
    const spreadsheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID;

    const headers = [
      "Company Name",
      "Founder Names",
      "Founder LinkedIn",
      "Email",
      "Funding Total",
      "Latest Round",
      "Source URL",
      "Date Founded",
      "Marketing Manager LinkedIn",
      "Marketing Email",
      "Category",
      "Date Processed",
    ];

    // Check if sheet has content
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet1!A1:L1",
    });

    if (!response.data.values || response.data.values.length === 0) {
      // Add headers
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: "Sheet1!A1:L1",
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [headers],
        },
      });

      console.log("✅ Initialized Google Sheet with headers");
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.warn("⚠️  Could not initialize sheet:", errorMessage);
  }
}

/**
 * Get all startups from Google Sheet
 */
export async function getStartupsFromSheet(): Promise<StartupData[]> {
  try {
    if (!process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID) {
      return [];
    }

    const sheets = getSheetsClient();
    const spreadsheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet1!A2:L",
    });

    const rows = response.data.values || [];

    return rows.map((row) => ({
      companyName: row[0] || "",
      founderNames: (row[1] || "").split(", ").filter((x: string) => x),
      founderLinkedIns: (row[2] || "").split(", ").filter((x: string) => x),
      email: row[3] || undefined,
      fundingTotal: row[4] || "",
      latestRound: row[5] || "",
      sourceUrl: row[6] || "",
      dateFounded: row[7] || undefined,
      marketingManagerLinkedIn: row[8] || undefined,
      marketingEmail: row[9] || undefined,
      category: row[10] || "Other",
      processedAt: new Date(row[11] || Date.now()),
    })) as StartupData[];
  } catch (error) {
    console.error("Error fetching from Google Sheet:", error);
    return [];
  }
}
