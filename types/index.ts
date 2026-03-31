// Core data types for AI Funding Radar

export interface StartupData {
  id?: string;
  companyName: string;
  founderNames: string[];
  founderLinkedIns: string[];
  email?: string;
  fundingTotal: string;
  latestRound: string;
  sourceUrl: string;
  dateFounded?: string;
  category: "AI Infra" | "AI Dev Tools" | "LLM Tools" | "Agent Platform" | "Other";
  marketingManagerLinkedIn?: string;
  marketingEmail?: string;
  processedAt: Date;
  embedding?: number[];
  metadata?: Record<string, any>;
}

export interface ArticleData {
  title: string;
  url: string;
  source: string;
  publishedAt: Date;
  content: string;
}

export interface ExtractionResult {
  success: boolean;
  data?: StartupData;
  error?: string;
}

export interface FetchAndExtractResponse {
  success: boolean;
  totalProcessed: number;
  inserted: number;
  duplicates: number;
  errors: string[];
  results: ExtractionResult[];
}

export interface SearchResult {
  company: StartupData;
  similarity: number;
}

export interface DashboardStats {
  totalCompanies: number;
  latestFundingAmount: string;
  topCategory: string;
  trendingCompanies: number;
  thisWeekCount: number;
  totalFunding: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
