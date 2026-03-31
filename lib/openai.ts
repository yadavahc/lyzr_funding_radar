// OpenAI client for embeddings and extraction

import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate embeddings for a company name and category
 * Used for Qdrant vector storage
 */
export async function generateEmbedding(
  companyName: string,
  category: string
): Promise<number[]> {
  const text = `${companyName} ${category}`;

  const embedding = await openai.embeddings.create({
    input: text,
    model: "text-embedding-3-small",
  });

  return embedding.data[0].embedding;
}

/**
 * Extract structured startup data from article content using OpenAI
 * This simulates Lyzr's extraction capability
 */
export async function extractStartupData(articleContent: string): Promise<{
  companyName: string;
  founderNames: string[];
  founderLinkedIns: string[];
  email?: string;
  fundingTotal: string;
  latestRound: string;
  dateFounded?: string;
  category: string;
  marketingManagerLinkedIn?: string;
  marketingEmail?: string;
}> {
  const prompt = `You are a financial data extraction specialist. Extract the following information from the article text below. Return ONLY valid JSON, no markdown.

Article:
${articleContent}

Extract and return this JSON structure:
{
  "companyName": "exact company name",
  "founderNames": ["founder1", "founder2"],
  "founderLinkedIns": ["linkedin url or empty string"],
  "email": "company email if found",
  "fundingTotal": "total funding amount e.g. '$5M' or 'unknown'",
  "latestRound": "Round type e.g. 'Series A', 'Seed', 'unknown'",
  "dateFounded": "YYYY-MM-DD or empty",
  "category": "one of: AI Infra, AI Dev Tools, LLM Tools, Agent Platform, Other",
  "marketingManagerLinkedIn": "linkedin url or empty",
  "marketingEmail": "marketing email if found"
}

Important: Return ONLY the JSON object, no other text.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    const content = response.choices[0].message.content || "{}";

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    const extracted = JSON.parse(jsonMatch[0]);

    // Ensure arrays are arrays
    return {
      companyName: extracted.companyName || "Unknown",
      founderNames: Array.isArray(extracted.founderNames)
        ? extracted.founderNames
        : [],
      founderLinkedIns: Array.isArray(extracted.founderLinkedIns)
        ? extracted.founderLinkedIns
        : [],
      email: extracted.email || undefined,
      fundingTotal: extracted.fundingTotal || "Unknown",
      latestRound: extracted.latestRound || "Unknown",
      dateFounded: extracted.dateFounded || undefined,
      category: extracted.category || "Other",
      marketingManagerLinkedIn: extracted.marketingManagerLinkedIn || undefined,
      marketingEmail: extracted.marketingEmail || undefined,
    };
  } catch (error) {
    console.error("OpenAI extraction error:", error);
    throw new Error(
      `Failed to extract data: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export default openai;
