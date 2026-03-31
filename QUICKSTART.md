# 🚀 AI Funding Radar - Quick Start

## ✅ Build Complete!

Project successfully built and ready for demo. All 5 API endpoints + 3 UI pages working.

---

## 📋 What's Included

### 🔧 Backend (API Routes)
- ✅ `/api/fetch-and-extract` - Main orchestration pipeline
- ✅ `/api/search` - Semantic company search
- ✅ `/api/startups` - List all with pagination
- ✅ `/api/stats` - Dashboard KPIs
- ✅ `/api/trending` - Trending last 7 days

### 🎨 Frontend (Pages)
- ✅ `/` - Dashboard (homescreen with stats + fetch button)
- ✅ `/search` - Find similar startups
- ✅ `/startups` - Browse all with category filter

### 📚 Core Libraries
- `lib/openai.ts` - LLM extraction + embeddings
- `lib/qdrant.ts` - Vector deduplication + search
- `lib/lyzr-agent.ts` - Extraction orchestration
- `lib/sample-data.ts` - 7 real AI startups
- `lib/sheets.ts` - Google Sheets auto-export

### 🎯 Components
- `StatCard` - KPI display
- `StartupTable` - Data table
- `LoadingStatus` - Progress modal

---

## 🎬 Demo Ready

### Prerequisites
- Node.js 18+
- OpenAI API key
- Docker (for Qdrant)

### Step 1: Setup Environment
```bash
cd lyzr-funding-radar

# Copy env template
cp .env.example .env.local

# Add your OpenAI key
# OPENAI_API_KEY=sk-your-key-here
# QDRANT_URL=http://localhost:6333
```

### Step 2: Start Qdrant
```bash
docker run -p 6333:6333 \
  -v $(pwd)/qdrant_storage:/qdrant/storage:z \
  qdrant/qdrant:latest
```

### Step 3: Run App
```bash
npm run dev
# Open http://localhost:3000
```

---

## 🎥 Demo Script (3 Minutes)

### 1. **Dashboard** (15 seconds)
- Show: Empty dashboard, 0 companies
- Show: Stat cards (Total, Funding, Category, Trending)

### 2. **Fetch Data** (45 seconds)
- Click: **"🚀 Fetch & Extract Data"**
- Watch: Progress modal ("Fetching...", "Extracting...", "Storing...")
- Show: **✅ Complete! Inserted: 7, Duplicates: 0**

### 3. **Results** (30 seconds)
- Dashboard updates with 7 new companies
- Show: Recent startups table
- Explain: Company name, founders, funding amounts

### 4. **Search** (30 seconds)
- Navigation: Go to **Search** page
- Type: `"LLM inference platform"`
- Show: 5 similar companies with **similarity scores** (75%, 82%, etc.)
- Explain: Semantic search using Qdrant vectors

### 5. **Deduplication** (20 seconds)
- Click: **"Fetch"** again
- Show: **✅ Complete! Inserted: 0, Duplicates: 7**
- Explain: Qdrant prevented exact duplicates

### 6. **Browse** (20 seconds)
- Navigation: Go to **All Startups**
- Show: Filter by category (AI Infra, Dev Tools, LLM, Agent)
- Show: Pagination working

### END: QA + Discussion

---

## 🔑 Key Architecture Decisions

| Decision | Why |
|----------|-----|
| **Sample Data (Hardcoded)** | Demo reliability - no external failures |
| **OpenAI Extraction** | Structured JSON parsing from LLM |
| **Qdrant Vector DB** | Semantic deduplication (0.85 threshold) |
| **Next.js Unified Stack** | No separate backend, simple deployment |
| **Direct HTTP to Qdrant** | Simpler than client libraries |

---

## 📊 Data Pipeline

```
7 Sample Articles
    ↓
[GPT-4o-mini] Extract JSON (company, founders, funding, category)
    ↓
[text-embedding-3-small] Generate 1536-dim vectors
    ↓
[Qdrant] Check similarity (>0.85 = duplicate)
    ↓
[Qdrant] INSERT with embedding + metadata
    ↓
[Google Sheets] APPEND rows (optional)
    ↓
[Dashboard] UI Updates in real-time
```

---

## 🧪 Testing Checklist

- [x] TypeScript builds cleanly
- [x] All 5 API routes respond
- [x] Dashboard loads
- [x] Search page loads
- [x] Startups page loads
- [x] NavLink
