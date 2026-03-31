# AI Funding Radar

**Autonomous LLM agent for AI startup funding discovery, extraction, and semantic search.**

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | Next.js | 16.2.1 |
| **Backend** | Node.js + TypeScript | 18+ |
| **Vector DB** | Qdrant | Cloud/Local |
| **LLM** | GPT-4o-mini | text-embedding-3-small |
| **Styling** | Tailwind CSS | 3.x |

## Setup

```bash
# Install
npm install

# Configure
cp .env.example .env.local
# Set: OPENAI_API_KEY, QDRANT_URL, QDRANT_API_KEY

# Start
npm run dev
# http://localhost:3000
```

## Architecture

```
Articles → GPT-4o-mini Extract → text-embedding-3-small
                                        ↓
                                    1536-dim Vector
                                        ↓
                        Qdrant (HNSW Index, 0.85 threshold)
                                        ↓
                            Dedup → Store → Google Sheets
```

## API Endpoints

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| `POST` | `/api/fetch-and-extract` | — | `{ inserted, duplicates, errors }` |
| `POST` | `/api/search` | `{ query, limit }` | `{ results: [{startup, similarity_score}] }` |
| `GET` | `/api/startups` | `?page=1&pageSize=20` | `{ data, total, hasMore }` |
| `GET` | `/api/stats` | — | `{ totalCompanies, topCategory, ... }` |
| `GET` | `/api/trending` | `?days=7` | `{ data: [StartupData] }` |

## Data Model

```typescript
interface StartupData {
  name: string
  founders: string[]
  fundingAmount: number
  fundingRound: "Seed" | "Series A-D" | "Strategic"
  category: "AI Infra" | "AI Dev Tools" | "LLM Tools" | "Agent Platform"
  article_source: string
  extracted_at: Date
}
```

## Project Structure

```
lib/
  ├── openai.ts         # generateEmbedding(), extractStartupData()
  ├── qdrant.ts         # checkDuplicate(), insertStartup(), findSimilarStartups()
  ├── lyzr-agent.ts     # ExtractorAgent.run(), .runBatch()
  ├── sheets.ts         # pushToSheets()
  └── sample-data.ts    # 7 real AI companies

pages/
  ├── api/fetch-and-extract.ts
  ├── api/search.ts
  ├── api/startups.ts
  ├── api/stats.ts
  ├── api/trending.ts
  ├── index.tsx         # Dashboard
  ├── search.tsx        # Semantic search
  └── startups.tsx      # All startups

components/
  ├── StatCard.tsx
  ├── StartupTable.tsx
  └── LoadingStatus.tsx

types/
  └── index.ts          # Interfaces
```

## Environment

```env
# Required
OPENAI_API_KEY=sk-...

# Qdrant (Cloud or Local)
QDRANT_URL=https://[cluster].cloud.qdrant.io
QDRANT_API_KEY=eyJ...

# Optional: Google Sheets
NEXT_PUBLIC_GOOGLE_SHEET_ID=...
GOOGLE_PROJECT_ID=qdrant-491917
GOOGLE_SHEETS_CLIENT_EMAIL=...
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_PRIVATE_KEY_ID=...
GOOGLE_CLIENT_ID=...
```

## Pipeline Flow

```
1. FETCH
   → 7 hardcoded sample articles

2. EXTRACT
   → Article text → GPT-4o-mini
   → JSON: {name, founders, funding, category}
   → Retry 3x on parse failure

3. EMBED
   → Extracted text → text-embedding-3-small
   → 1536-dim vector

4. DEDUPLICATE
   → Qdrant similarity_search()
   → Result ≥ 0.85? → SKIP
   → Result < 0.85? → INSERT

5. STORE
   → Insert point: {id, vector, payload}
   → Cosine similarity metric

6. EXPORT (Async)
   → Google Sheets append
   → Doesn't block response
```

## Performance

| Operation | Time | Notes |
|-----------|------|-------|
| Article fetch | 50ms | I/O |
| LLM extraction | 400ms | ⚠️ OpenAI bottleneck |
| Embedding | 50ms | I/O |
| Qdrant search | 10ms | HNSW index |
| Qdrant insert | 5ms | Storage |
| Sheets sync | 2s | Async (non-blocking) |

## Error Handling

```typescript
// Extraction fail → Skip article, continue
// Qdrant down → Return empty, continue
// Sheets fail → Log warning, data stays in Qdrant
```

## Deduplication

```
Threshold: 0.85 (Cosine similarity)
- 0.90: Strict (may reject valid new companies)
- 0.85: Balanced (default)
- 0.75: Lenient (allows duplicates)

# Adjust in lib/qdrant.ts
const SIMILARITY_THRESHOLD = 0.85
```

## Testing

```bash
# Fetch data
curl -X POST http://localhost:3000/api/fetch-and-extract

# Search
curl -X POST http://localhost:3000/api/search \
  -d '{"query":"LLM platform","limit":5}'

# Get stats
curl http://localhost:3000/api/stats

# List startups
curl "http://localhost:3000/api/startups?page=1&pageSize=10"
```

## Deployment

### Vercel
```bash
npm run build && vercel deploy
```

### Docker
```bash
docker build -t funding-radar .
docker run -p 3000:3000 -e OPENAI_API_KEY=sk-... -e QDRANT_URL=... funding-radar
```

## Troubleshooting

| Error | Solution |
|-------|----------|
| Qdrant 404 | Start Qdrant: `docker run -p 6333:6333 qdrant/qdrant:latest` |
| OpenAI 401 | Verify `OPENAI_API_KEY` at https://platform.openai.com |
| No startups | Click "Fetch & Extract" button, check terminal logs |
| Slow extraction | Normal: 2-3s/article. Check OpenAI rate limits. |
| Sheets sync fail | Check service account share permissions; pipeline continues |

## Key Files

| File | Purpose |
|------|---------|
| `lib/openai.ts` | Embeddings + LLM extraction |
| `lib/qdrant.ts` | Vector DB ops (search, insert, dedup) |
| `pages/api/fetch-and-extract.ts` | Main pipeline orchestration |
| `lib/sample-data.ts` | 7 real AI company articles |

## Features

✅ Semantic deduplication (Qdrant + 0.85 threshold)
✅ Smart extraction (GPT-4o-mini + JSON schema)
✅ Semantic search (text-embedding-3-small)
✅ Auto-classification (AI Infra / Dev Tools / LLM / Agent)
✅ Real-time dashboard (KPIs + trending)
✅ Google Sheets sync (async, non-blocking)
✅ Pagination (default 20/page)

## Configuration

### Adjust extraction timeout
`pages/api/fetch-and-extract.ts` → `CONFIG.EXTRACTION_TIMEOUT_MS`

### Adjust similarity threshold
`lib/qdrant.ts` → `SIMILARITY_THRESHOLD`

### Add data sources
Edit `lib/sample-data.ts` articles array

## License

MIT
