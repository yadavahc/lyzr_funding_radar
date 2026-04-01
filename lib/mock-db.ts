// In-memory mock database - replaces Qdrant for demo
import { StartupData } from "@/types/index";
import { v4 as uuidv4 } from "uuid";

let startups: StartupData[] = [];
let initialized = false;

// Realistic AI startup funding data (2024)
const INITIAL_STARTUPS: StartupData[] = [
  {
    id: uuidv4(),
    companyName: "Anthropic",
    founderNames: ["Dario Amodei", "Daniela Amodei"],
    founderLinkedIns: ["linkedin.com/in/dario-amodei"],
    email: "contact@anthropic.com",
    fundingTotal: "$5.0B",
    latestRound: "Series C",
    sourceUrl: "https://www.anthropic.com",
    dateFounded: "2021-01-01",
    category: "LLM Tools",
    marketingManagerLinkedIn: "",
    marketingEmail: "partnerships@anthropic.com",
    processedAt: new Date("2024-03-20"),
    metadata: {
      articleTitle: "Anthropic Raises $5B Series C",
      articleSource: "TechCrunch",
      extractedBy: "mock-db",
    },
  },
  {
    id: uuidv4(),
    companyName: "OpenAI",
    founderNames: ["Sam Altman", "Greg Brockman"],
    founderLinkedIns: ["linkedin.com/in/sam-altman"],
    email: "contact@openai.com",
    fundingTotal: "$13.0B",
    latestRound: "Strategic Investment",
    sourceUrl: "https://www.openai.com",
    dateFounded: "2015-12-01",
    category: "LLM Tools",
    marketingManagerLinkedIn: "",
    marketingEmail: "business@openai.com",
    processedAt: new Date("2024-03-15"),
    metadata: {
      articleTitle: "OpenAI Secures $6B Microsoft Investment",
      articleSource: "Bloomberg",
      extractedBy: "mock-db",
    },
  },
  {
    id: uuidv4(),
    companyName: "Together AI",
    founderNames: ["Nathan Lambert", "Stephanie Sussman"],
    founderLinkedIns: ["linkedin.com/in/nwalton"],
    email: "hello@together.ai",
    fundingTotal: "$102M",
    latestRound: "Series B",
    sourceUrl: "https://www.together.ai",
    dateFounded: "2022-01-01",
    category: "AI Dev Tools",
    marketingManagerLinkedIn: "",
    marketingEmail: "partnerships@together.ai",
    processedAt: new Date("2024-03-10"),
    metadata: {
      articleTitle: "Together AI Series B Funding",
      articleSource: "VentureBeat",
      extractedBy: "mock-db",
    },
  },
  {
    id: uuidv4(),
    companyName: "Hugging Face",
    founderNames: ["Clement Delangue", "Julien Chaumond"],
    founderLinkedIns: ["linkedin.com/in/clementdelangue"],
    email: "contact@huggingface.co",
    fundingTotal: "$235M",
    latestRound: "Series D",
    sourceUrl: "https://www.huggingface.co",
    dateFounded: "2016-12-01",
    category: "AI Dev Tools",
    marketingManagerLinkedIn: "",
    marketingEmail: "business@huggingface.co",
    processedAt: new Date("2024-03-05"),
    metadata: {
      articleTitle: "Hugging Face $235M Series D",
      articleSource: "TechCrunch",
      extractedBy: "mock-db",
    },
  },
  {
    id: uuidv4(),
    companyName: "Mistral AI",
    founderNames: ["Guillaume Lample", "Timothée Lacroix"],
    founderLinkedIns: ["linkedin.com/in/glample"],
    email: "contact@mistral.ai",
    fundingTotal: "$415M",
    latestRound: "Series B",
    sourceUrl: "https://www.mistral.ai",
    dateFounded: "2023-04-01",
    category: "LLM Tools",
    marketingManagerLinkedIn: "",
    marketingEmail: "partnerships@mistral.ai",
    processedAt: new Date("2024-02-28"),
    metadata: {
      articleTitle: "Mistral AI Raises €400M",
      articleSource: "Reuters",
      extractedBy: "mock-db",
    },
  },
  {
    id: uuidv4(),
    companyName: "Stability AI",
    founderNames: ["Emad Mostaque"],
    founderLinkedIns: ["linkedin.com/in/emadmostaque"],
    email: "dev@stability.ai",
    fundingTotal: "$101M",
    latestRound: "Seed 2",
    sourceUrl: "https://www.stability.ai",
    dateFounded: "2020-09-01",
    category: "AI Dev Tools",
    marketingManagerLinkedIn: "",
    marketingEmail: "partnerships@stability.ai",
    processedAt: new Date("2024-02-20"),
    metadata: {
      articleTitle: "Stability AI Funding Round",
      articleSource: "TechCrunch",
      extractedBy: "mock-db",
    },
  },
  {
    id: uuidv4(),
    companyName: "Replicate",
    founderNames: ["Ben Firshman", "Andreas Jansson"],
    founderLinkedIns: ["linkedin.com/in/bfirshman"],
    email: "hello@replicate.com",
    fundingTotal: "$40M",
    latestRound: "Series B",
    sourceUrl: "https://www.replicate.com",
    dateFounded: "2019-01-01",
    category: "AI Infra",
    marketingManagerLinkedIn: "",
    marketingEmail: "partnerships@replicate.com",
    processedAt: new Date("2024-03-25"),
    metadata: {
      articleTitle: "Replicate Agent Platform Launch",
      articleSource: "Product Hunt",
      extractedBy: "mock-db",
    },
  },
  {
    id: uuidv4(),
    companyName: "Cohere",
    founderNames: ["Aidan Gomez", "Ivan Zhang"],
    founderLinkedIns: ["linkedin.com/in/aidangomez"],
    email: "support@cohere.com",
    fundingTotal: "$275M",
    latestRound: "Series C",
    sourceUrl: "https://www.cohere.com",
    dateFounded: "2021-09-01",
    category: "LLM Tools",
    marketingManagerLinkedIn: "",
    marketingEmail: "business@cohere.com",
    processedAt: new Date("2024-03-01"),
    metadata: {
      articleTitle: "Cohere Series C Funding",
      articleSource: "TechCrunch",
      extractedBy: "mock-db",
    },
  },
  {
    id: uuidv4(),
    companyName: "Perplexity AI",
    founderNames: ["Aravind Srinivas"],
    founderLinkedIns: ["linkedin.com/in/aravindsrinivas"],
    email: "contact@perplexity.ai",
    fundingTotal: "$500M",
    latestRound: "Series B",
    sourceUrl: "https://www.perplexity.ai",
    dateFounded: "2022-08-01",
    category: "AI Dev Tools",
    marketingManagerLinkedIn: "",
    marketingEmail: "partnerships@perplexity.ai",
    processedAt: new Date("2024-02-15"),
    metadata: {
      articleTitle: "Perplexity AI $500M Funding",
      articleSource: "Bloomberg",
      extractedBy: "mock-db",
    },
  },
  {
    id: uuidv4(),
    companyName: "Twelve Labs",
    founderNames: ["Jae Lee"],
    founderLinkedIns: ["linkedin.com/in/jaelee"],
    email: "hello@twelvelabs.io",
    fundingTotal: "$120M",
    latestRound: "Series B",
    sourceUrl: "https://www.twelvelabs.io",
    dateFounded: "2021-10-01",
    category: "AI Dev Tools",
    marketingManagerLinkedIn: "",
    marketingEmail: "business@twelvelabs.io",
    processedAt: new Date("2024-01-28"),
    metadata: {
      articleTitle: "Twelve Labs Video AI Platform",
      articleSource: "VentureBeat",
      extractedBy: "mock-db",
    },
  },
  {
    id: uuidv4(),
    companyName: "Runway",
    founderNames: ["Cristobal Valenzuela"],
    founderLinkedIns: ["linkedin.com/in/cvalenzuela"],
    email: "contact@runwayml.com",
    fundingTotal: "$500M",
    latestRound: "Series D",
    sourceUrl: "https://www.runwayml.com",
    dateFounded: "2018-03-01",
    category: "AI Dev Tools",
    marketingManagerLinkedIn: "",
    marketingEmail: "business@runwayml.com",
    processedAt: new Date("2024-01-15"),
    metadata: {
      articleTitle: "Runway Series D $500M",
      articleSource: "TechCrunch",
      extractedBy: "mock-db",
    },
  },
  {
    id: uuidv4(),
    companyName: "Scale AI",
    founderNames: ["Alexandr Wang"],
    founderLinkedIns: ["linkedin.com/in/alexandrwang"],
    email: "contact@scale.com",
    fundingTotal: "$325M",
    latestRound: "Series D",
    sourceUrl: "https://www.scale.com",
    dateFounded: "2016-05-01",
    category: "AI Infra",
    marketingManagerLinkedIn: "",
    marketingEmail: "business@scale.com",
    processedAt: new Date("2024-01-08"),
    metadata: {
      articleTitle: "Scale AI Data Platform",
      articleSource: "VentureBeat",
      extractedBy: "mock-db",
    },
  },
];

export async function initializeCollection(): Promise<void> {
  if (!initialized) {
    startups = [...INITIAL_STARTUPS];
    initialized = true;
    console.log(`✅ Mock DB initialized with ${startups.length} startups`);
  }
}

export async function checkDuplicate(
  companyName: string,
  category: string
): Promise<StartupData | null> {
  return startups.find(
    (s) =>
      s.companyName.toLowerCase() === companyName.toLowerCase() &&
      s.category === category
  ) || null;
}

export async function insertStartup(startup: StartupData): Promise<string> {
  const id = startup.id || uuidv4();
  startups.push({ ...startup, id });
  console.log(`✅ Inserted startup: ${startup.companyName}`);
  return id;
}

export async function getAllStartups(
  page: number = 1,
  pageSize: number = 20
): Promise<{
  startups: StartupData[];
  total: number;
  page: number;
  pageSize: number;
}> {
  const offset = (page - 1) * pageSize;
  const paginated = startups.slice(offset, offset + pageSize);

  return {
    startups: paginated,
    total: startups.length,
    page,
    pageSize,
  };
}

export async function getCollectionStats(): Promise<{
  totalPoints: number;
  vectorsCount: number;
}> {
  return {
    totalPoints: startups.length,
    vectorsCount: startups.length,
  };
}

export async function getTrendingStartups(daysBack: number = 7): Promise<StartupData[]> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysBack);

  return startups
    .filter((s) => new Date(s.processedAt) >= cutoffDate)
    .sort((a, b) => new Date(b.processedAt).getTime() - new Date(a.processedAt).getTime());
}

export async function getStartupsByCategory(
  category: string,
  limit: number = 20
): Promise<StartupData[]> {
  return startups.filter((s) => s.category === category).slice(0, limit);
}

export async function findSimilarStartups(
  queryCompanyName: string,
  limit: number = 5
): Promise<{ startup: StartupData; similarity: number }[]> {
  return startups
    .filter((s) => s.companyName !== queryCompanyName)
    .slice(0, limit)
    .map((s) => ({
      startup: s,
      similarity: 0.85,
    }));
}

export default {
  initializeCollection,
  checkDuplicate,
  insertStartup,
  getAllStartups,
  getCollectionStats,
  getTrendingStartups,
};
