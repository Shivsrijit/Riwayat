# 🏆 Riwayat — Hackathon-Ready AI Integration Plan

**Goal:** Transform Riwayat, India's Cultural Heritage Platform, into a powerful AI-augmented product that wows hackathon judges in terms of technical depth, real-world impact, and polish.

---

## Project Snapshot

| Layer | Stack |
|---|---|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS |
| Backend | Node.js + Express.js + MongoDB/Mongoose |
| Auth | JWT + bcrypt |
| Maps | Leaflet.js |
| Pages | Home, Stories, Workshops, Marketplace, Forum, Destinations, Events, Artists, Dashboard |

---

## 🧠 AI Features to Implement

Ranked by **hackathon impact** — each feature takes 30–90 minutes to build.

---

### 🥇 Feature 1 — "Sahayak" AI Cultural Guide Chatbot *(High Impact, ~60 min)*

A floating AI chatbot powered by **Google Gemini API (free tier)** that answers questions about Indian culture, art forms, artisans, destinations, and workshops using context from your existing database.

**What it does:**
- Answers questions like *"Tell me about Madhubani painting"*, *"Which festivals are in Rajasthan?"*, *"Recommend a workshop for beginners"*
- Has access to the site data (stories, artisans, events) via a system prompt
- Floating button on all pages, opens in a panel

**Files to create:**
- `frontend/src/components/AIChatbot.tsx` — chat UI component
- `frontend/src/services/aiService.ts` — Gemini API call
- `backend/routes/ai.js` — proxies Gemini key safely

---

### 🥈 Feature 2 — AI Story Generator / Heritage Doc Writer *(High Impact, ~45 min)*

In the **Dashboard**, content creators can describe a cultural artifact or tradition, and the AI generates a rich, structured documentation story for submission.

**What it does:**
- "Generate Story" button with a prompt input
- AI generates: title, category, content, tags, region
- Auto-fills the AddStoryForm fields

**Files to modify:**
- `backend/routes/ai.js` — add `/api/ai/generate-story` endpoint
- `frontend/src/pages/Dashboard.tsx` — add AI generate button + story fill

---

### 🥉 Feature 3 — Smart Cultural Search with AI Relevance *(Medium Impact, ~30 min)*

Upgrade the existing search bar on the Home page to use AI to understand intent rather than just keyword matching.

**What it does:**
- User types *"traditional dance of Kerala"* → AI returns a curated answer + links to relevant content
- Shows an AI-generated summary card above search results

**Files to modify:**
- `frontend/src/pages/Home.tsx` — AI search results panel
- `backend/routes/ai.js` — add `/api/ai/search` endpoint

---

### ✨ Feature 4 — Heritage Image Analyzer *(Wow Factor, ~45 min)*

In the Marketplace or Stories page, users can upload/paste an image of a craft/artwork and the AI identifies it (e.g., *"This appears to be a Phulkari embroidery from Punjab"*).

**What it does:**
- Upload image → Gemini Vision API analyzes it
- Returns: craft type, region, cultural significance, similar items in the store

**Files to create:**
- `frontend/src/components/ImageAnalyzer.tsx`
- `backend/routes/ai.js` — add `/api/ai/analyze-image` endpoint

---

### 🌟 Feature 5 — Artisan Profile AI Summary *(Polish, ~20 min)*

On the Artists page, each artisan card gets an AI-generated "Craft Heritage Profile" blurb on hover/click — a 2-sentence poetic description of their art form.

**Files to modify:**
- `frontend/src/pages/Artists.tsx`
- `backend/routes/ai.js` — add `/api/ai/artisan-summary` endpoint

---

## 📁 Proposed File Changes

### Backend

#### [MODIFY] [app.js](file:///d:/Project/Riwayat/backend/app.js)
- Register new `/api/ai` route

#### [NEW] `backend/routes/ai.js`
- All AI endpoints: chat, generate-story, search, analyze-image, artisan-summary
- Proxies Gemini API key (never exposed to frontend)

#### [MODIFY] `backend/.env`
- Add `GEMINI_API_KEY=your_key_here`

---

### Frontend

#### [NEW] `frontend/src/components/AIChatbot.tsx`
- Floating chat panel UI
- Sends messages to `/api/ai/chat`
- Shows AI responses with cultural context

#### [NEW] `frontend/src/services/aiService.ts`
- `chatWithSahayak(message)` → calls backend
- `generateStory(prompt)` → calls backend
- `analyzeImage(base64)` → calls backend
- `aiSearch(query)` → calls backend

#### [MODIFY] `frontend/src/App.tsx`
- Add `<AIChatbot />` globally (floating)

#### [MODIFY] `frontend/src/pages/Home.tsx`
- Add AI search result summary card

#### [MODIFY] `frontend/src/pages/Dashboard.tsx`
- Add AI "Generate Story" button

#### [NEW] `frontend/src/components/ImageAnalyzer.tsx`
- Drag-and-drop / URL image input
- Calls `/api/ai/analyze-image`, shows results

---

## 🔑 API Key Required

> [!IMPORTANT]
> You need a **free Google Gemini API key** from [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey).
> The free tier is very generous (60 requests/minute) — more than enough for a hackathon demo.

Add to `backend/.env`:
```
GEMINI_API_KEY=your_key_here
```

---

## 🛠️ Implementation Order

```
1. backend/routes/ai.js          ← Core AI proxy (all features depend on this)
2. backend/app.js                ← Register /api/ai route
3. frontend/src/services/aiService.ts   ← API calls
4. AIChatbot.tsx + App.tsx       ← Chatbot (biggest wow factor)
5. Dashboard.tsx AI story gen    ← Creator tool
6. Home.tsx AI search            ← Enhanced discovery
7. ImageAnalyzer.tsx             ← Vision feature
8. Artists.tsx AI summaries      ← Polish
```

---

## ✅ Verification Plan

### Automated
- Test each `/api/ai/*` endpoint with curl or Postman
- Confirm Gemini responses are non-empty

### Manual
1. Open chatbot and ask *"Tell me about Warli painting"*
2. In Dashboard, use Generate Story with *"Pattachitra art of Odisha"*
3. Try AI search from Home with *"music of Rajasthan"*
4. Upload an image of a craft and verify AI identifies it
5. Hover over an artist card and verify the AI blurb loads

---

## ⚡ Time Estimate

| Feature | Time |
|---|---|
| Backend AI proxy (all endpoints) | 30 min |
| AIChatbot component | 40 min |
| AI Story Generator in Dashboard | 25 min |
| AI Search panel on Home | 20 min |
| Image Analyzer component | 35 min |
| Artisan summaries | 15 min |
| **Total** | **~2.5 hours** |

---

## Open Questions

> [!IMPORTANT]
> Do you have a **Gemini API key**? If not, I can guide you to get one — it's free and instant.

> [!NOTE]
> Which features do you want to prioritize? I recommend starting with **Features 1 + 2** as they have the highest demo impact for judges. All 5 can be done in a single hackathon session.

> [!NOTE]
> Should the chatbot use **only your DB data** as context (RAG-style), or should it freely answer any India culture question using Gemini's knowledge?
