// Lyzr-inspired extraction agent

import { extractStartupData } from "@/lib/openai";
import { StartupData, ArticleData, ExtractionResult } from "@/types/index";

interface LyzrAgent {
  name: string;
  role: string;
  instructions: string;
}

/**
 * LyzrAgent - Orchestrates extraction of structured data from articles
 * Acts as a wrapper around OpenAI for Lyzr-like functionality
 */
export class ExtractorAgent {
  private agents: LyzrAgent[];

  constructor(config?: { agents?: LyzrAgent[] }) {
    this.agents = config?.agents || [
      {
        name: "extraction",
        role: "Financial Data Extraction Specialist",
        instructions:
          "Extract funding data with precision from AI startup announcements",
      },
    ];
  }

  /**
   * Run extraction on article content
   */
  async run(article: ArticleData): Promise<ExtractionResult> {
    try {
      console.log(
        `🔍 Extracting data for article: ${article.title.substring(0, 50)}...`
      );

      // Use the first agent for extraction
      const agent = this.agents[0];

      const extracted = await extractStartupData(article.content);

      const startup: StartupData = {
        id: undefined,
        companyName: extracted.companyName,
        founderNames: extracted.founderNames,
        founderLinkedIns: extracted.founderLinkedIns,
        email: extracted.email,
        fundingTotal: extracted.fundingTotal,
        latestRound: extracted.latestRound,
        sourceUrl: article.url,
        dateFounded: extracted.dateFounded,
        category: extracted.category as any,
        marketingManagerLinkedIn: extracted.marketingManagerLinkedIn,
        marketingEmail: extracted.marketingEmail,
        processedAt: new Date(),
        metadata: {
          articleTitle: article.title,
          articleSource: article.source,
          extractedBy: agent.name,
        },
      };

      return {
        success: true,
        data: startup,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`❌ Extraction failed: ${errorMessage}`);
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Run extraction on multiple articles
   */
  async runBatch(articles: ArticleData[]): Promise<ExtractionResult[]> {
    const results: ExtractionResult[] = [];

    for (const article of articles) {
      const result = await this.run(article);
      results.push(result);

      // Add small delay to avoid rate limits
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    return results;
  }

  /**
   * Get agent configuration
   */
  getAgents(): LyzrAgent[] {
    return this.agents;
  }
}

/**
 * Create a new extractor agent
 */
export function createExtractorAgent(config?: {
  agents?: LyzrAgent[];
}): ExtractorAgent {
  return new ExtractorAgent(config);
}

export default ExtractorAgent;
