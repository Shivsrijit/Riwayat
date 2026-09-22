import axios from 'axios';

const AI_BASE =
  (import.meta.env.VITE_API_URL || 'http://localhost:4000/api') + '/ai';

// ─── Sahayak Chatbot ─────────────────────────────────────────────────────────
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function chatWithSahayak(
  message: string,
  history: ChatMessage[] = []
): Promise<string> {
  const { data } = await axios.post<{ reply: string }>(
    `${AI_BASE}/chat`,
    { message, history },
    { timeout: 30000 }
  );

  return data.reply;
}

// ─── AI Story Generator ──────────────────────────────────────────────────────
export interface GeneratedStory {
  title: string;
  category: string;
  region: string;
  description: string;
  content: string;
  author: string;
  authorRole: string;
  readTime: string;
  tags: string[];
}

export async function generateHeritageStory(prompt: string): Promise<GeneratedStory> {
  const { data } = await axios.post<{ story: GeneratedStory }>(`${AI_BASE}/generate-story`, { prompt }, { timeout: 30000 });
  return data.story;
}

// ─── AI Smart Search ─────────────────────────────────────────────────────────
export interface AISearchResult {
  summary: string;
  highlights: string[];
  relatedPages: { label: string; path: string }[];
  suggestedSearches: string[];
}

export async function aiCulturalSearch(query: string): Promise<AISearchResult> {
  const { data } = await axios.post<{ result: AISearchResult }>(`${AI_BASE}/search`, { query }, { timeout: 30000 });
  return data.result;
}

// ─── Heritage Image Analyzer ─────────────────────────────────────────────────
export interface ImageAnalysis {
  identified: boolean;
  craftType: string;
  region: string;
  confidence: string;
  culturalSignificance: string;
  characteristics: string[];
  relatedSearch: string;
  notCultural?: string;
}

export async function analyzeHeritageImage(base64Image: string, mimeType = 'image/jpeg'): Promise<ImageAnalysis> {
  const { data } = await axios.post<{ analysis: ImageAnalysis }>(`${AI_BASE}/analyze-image`, { base64Image, mimeType }, { timeout: 40000 });
  return data.analysis;
}

// ─── Artisan AI Summary ──────────────────────────────────────────────────────
export async function getArtisanAISummary(
  name: string,
  craft: string,
  region: string,
  bio: string
): Promise<string> {
  const { data } = await axios.post<{ profile: string }>(`${AI_BASE}/artisan-summary`, { name, craft, region, bio }, { timeout: 20000 });
  return data.profile;
}
