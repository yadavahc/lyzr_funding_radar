// Qdrant vector database client - using direct HTTP calls

import { StartupData } from "@/types/index";
import { generateEmbedding } from "@/lib/openai";
import { v4 as uuidv4 } from "uuid";

const QDRANT_URL = process.env.QDRANT_URL || "http://localhost:6333";
const QDRANT_API_KEY = process.env.QDRANT_API_KEY;
const COLLECTION_NAME = "startups";
const VECTOR_SIZE = 1536;
const SIMILARITY_THRESHOLD = 0.85;

// Cache to avoid duplicate embeddings in same request
const embeddingCache = new Map<string, number[]>();

async function makeRequest(
  endpoint: string,
  method: string = "GET",
  body?: any
) {
  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (QDRANT_API_KEY) {
      headers["api-key"] = QDRANT_API_KEY;
    }

    const response = await fetch(`${QDRANT_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      console.error(`Qdrant error: ${response.status} ${response.statusText}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Qdrant request failed:", error);
    return null;
  }
}

/**
 * Initialize Qdrant collection if it doesn't exist
 */
export async function initializeCollection(): Promise<void> {
  try {
    // Check if collection exists
    const collections = await makeRequest("/collections");
    if (!collections) return;

    const exists = collections.result?.collections?.some(
      (c: any) => c.name === COLLECTION_NAME
    );

    if (!exists) {
      await makeRequest(`/collections/${COLLECTION_NAME}`, "PUT", {
        vectors: {
          size: VECTOR_SIZE,
          distance: "Cosine",
        },
      });
      console.log(`✅ Created collection: ${COLLECTION_NAME}`);
    } else {
      console.log(`✅ Collection exists: ${COLLECTION_NAME}`);
    }
  } catch (error) {
    console.error("Error initializing collection:", error);
  }
}

/**
 * Check if a startup already exists using semantic similarity search
 */
export async function checkDuplicate(
  companyName: string,
  category: string
): Promise<StartupData | null> {
  try {
    const cacheKey = `${companyName}-${category}`;
    let embedding = embeddingCache.get(cacheKey);

    if (!embedding) {
      embedding = await generateEmbedding(companyName, category);
      embeddingCache.set(cacheKey, embedding);
    }

    const searchResult = await makeRequest(
      `/collections/${COLLECTION_NAME}/points/search`,
      "POST",
      {
        vector: embedding,
        limit: 1,
        score_threshold: SIMILARITY_THRESHOLD,
        with_payload: true,
      }
    );

    if (searchResult?.result && searchResult.result.length > 0) {
      const point = searchResult.result[0];
      if (point.payload) {
        return point.payload as StartupData;
      }
    }

    return null;
  } catch (error) {
    console.error("Error checking duplicate:", error);
    return null;
  }
}

/**
 * Insert a new startup into Qdrant
 */
export async function insertStartup(startup: StartupData): Promise<string> {
  try {
    const id = startup.id || uuidv4();

    const cacheKey = `${startup.companyName}-${startup.category}`;
    let embedding = embeddingCache.get(cacheKey);

    if (!embedding) {
      embedding = await generateEmbedding(
        startup.companyName,
        startup.category
      );
      embeddingCache.set(cacheKey, embedding);
    }

    const payload = {
      ...startup,
      id,
      processedAt: new Date().toISOString(),
    };

    await makeRequest(
      `/collections/${COLLECTION_NAME}/points?wait=true`,
      "PUT",
      {
        points: [
          {
            id: parseInt(id.substring(0, 8), 16) || Math.floor(Math.random() * 1000000),
            vector: embedding,
            payload,
          },
        ],
      }
    );

    console.log(`✅ Inserted startup: ${startup.companyName}`);
    return id;
  } catch (error) {
    console.error("Error inserting startup:", error);
    throw error;
  }
}

/**
 * Find similar startups using semantic search
 */
export async function findSimilarStartups(
  queryCompanyName: string,
  limit: number = 5
): Promise<{ startup: StartupData; similarity: number }[]> {
  try {
    const embedding = await generateEmbedding(queryCompanyName, "AI startup");

    const searchResult = await makeRequest(
      `/collections/${COLLECTION_NAME}/points/search`,
      "POST",
      {
        vector: embedding,
        limit,
        score_threshold: 0.5,
        with_payload: true,
      }
    );

    if (!searchResult?.result) return [];

    return searchResult.result
      .map((point: any) => ({
        startup: point.payload as StartupData,
        similarity: point.score || 0,
      }))
      .filter((r: any) => r.startup.companyName !== queryCompanyName)
      .slice(0, limit);
  } catch (error) {
    console.error("Error searching similar startups:", error);
    return [];
  }
}

/**
 * Get all startups from Qdrant with pagination
 */
export async function getAllStartups(
  page: number = 1,
  pageSize: number = 20
): Promise<{
  startups: StartupData[];
  total: number;
  page: number;
  pageSize: number;
}> {
  try {
    const offset = (page - 1) * pageSize;

    const scrollResult = await makeRequest(
      `/collections/${COLLECTION_NAME}/points?limit=${pageSize}&offset=${offset}`,
      "GET"
    );

    if (!scrollResult?.result) {
      return { startups: [], total: 0, page, pageSize };
    }

    const startups = (scrollResult.result.points || []).map(
      (p: any) => p.payload as StartupData
    );

    const count = scrollResult.result.count || 0;

    return {
      startups,
      total: count,
      page,
      pageSize,
    };
  } catch (error) {
    console.error("Error fetching startups:", error);
    return { startups: [], total: 0, page, pageSize };
  }
}

/**
 * Get collection statistics
 */
export async function getCollectionStats(): Promise<{
  totalPoints: number;
  vectorsCount: number;
}> {
  try {
    const collection = await makeRequest(`/collections/${COLLECTION_NAME}`);

    if (collection?.result) {
      return {
        totalPoints: collection.result.points_count || 0,
        vectorsCount: collection.result.points_count || 0,
      };
    }

    return { totalPoints: 0, vectorsCount: 0 };
  } catch (error) {
    console.error("Error getting stats:", error);
    return { totalPoints: 0, vectorsCount: 0 };
  }
}

/**
 * Get startups by category
 */
export async function getStartupsByCategory(
  category: string,
  limit: number = 20
): Promise<StartupData[]> {
  try {
    // Fetch all and filter (Qdrant filtering requires complex setup)
    const result = await getAllStartups(1, limit * 2);

    return result.startups
      .filter((s) => s.category === category)
      .slice(0, limit);
  } catch (error) {
    console.error("Error filtering by category:", error);
    return [];
  }
}

/**
 * Get startups added in last N days
 */
export async function getTrendingStartups(daysBack: number = 7): Promise<StartupData[]> {
  try {
    const result = await getAllStartups(1, 1000);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysBack);

    return result.startups
      .filter((startup) => {
        const processedDate = new Date(startup.processedAt);
        return processedDate >= cutoffDate;
      })
      .sort((a, b) => {
        return (
          new Date(b.processedAt).getTime() -
          new Date(a.processedAt).getTime()
        );
      });
  } catch (error) {
    console.error("Error getting trending startups:", error);
    return [];
  }
}

export default { initializeCollection, checkDuplicate, insertStartup };
