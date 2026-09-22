const express = require('express');
const router  = express.Router();
const Groq    = require('groq-sdk');

const GROQ_MODEL        = 'openai/gpt-oss-120b'; // free tier, high quality
const GROQ_VISION_MODEL = 'openai/gpt-oss-120b'; // supports vision too

// Initialise Groq client (reads GROQ_API_KEY from env automatically)
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ─── Helper: call Groq text model ───────────────────────────────────────────
async function callGroq(systemPrompt, userMessage, options = {}) {
  const completion = await groq.chat.completions.create({
    model:       options.model       || GROQ_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user',   content: userMessage  }
    ],
    temperature:        options.temperature        ?? 0.85,
    max_completion_tokens: options.max_tokens      ?? 1024,
    top_p:              options.top_p              ?? 0.9
  });

  const text = completion.choices[0]?.message?.content;
  if (!text) throw new Error('Empty response from Groq');
  return text.trim();
}

// ─── POST /api/ai/chat ──────────────────────────────────────────────────────
router.post('/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message) return res.status(400).json({ error: 'message is required' });

    const system = `You are Sahayak, an expert AI cultural guide for RIWAYAT — India's premier cultural heritage platform.
You have deep knowledge of:
- Indian classical & folk art forms (Madhubani, Warli, Kalamkari, Pattachitra, Tanjore, etc.)
- Traditional crafts (Banarasi silk, Pashmina, Bidriware, Dhokra, Channapatna, Jaipur Blue Pottery, etc.)
- Classical dance forms (Bharatanatyam, Kathakali, Odissi, Kuchipudi, Manipuri, Kathak, etc.)
- Indian heritage monuments, UNESCO sites, temples, and forts
- Regional festivals, music traditions, and folk literature
- Indian artisans, master craftsmen, and cultural practitioners
- Workshops, learning resources, and cultural travel destinations in India

Guidelines:
- Be warm, knowledgeable, and passionate about Indian culture
- Give concise but rich answers (3–5 sentences max per response)
- When relevant, mention specific regions, artisans, or techniques
- Use respectful cultural context and avoid stereotyping
- If asked about something unrelated to Indian culture, gently redirect to cultural topics
- Reply in English unless user writes in another language`;

    // Build multi-turn conversation (last 6 turns)
    const messages = [
      { role: 'system', content: system },
      ...history.slice(-6).map(h => ({
        role:    h.role === 'user' ? 'user' : 'assistant',
        content: h.content
      })),
      { role: 'user', content: message }
    ];

    const completion = await groq.chat.completions.create({
      model:                GROQ_MODEL,
      messages,
      temperature:          0.85,
      max_completion_tokens: 1024,
      top_p:                0.9
    });

    const reply = completion.choices[0]?.message?.content?.trim();
    if (!reply) throw new Error('Empty response from Groq');

    res.json({ reply });
  } catch (err) {
    console.error('[AI Chat Error]', err.message);
    res.status(500).json({ error: 'AI service temporarily unavailable. Please try again.' });
  }
});

// ─── POST /api/ai/generate-story ────────────────────────────────────────────
router.post('/generate-story', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'prompt is required' });

    const system = `You are an expert Indian cultural heritage documentarian for RIWAYAT platform.
Generate a rich, structured cultural heritage story/documentation based on the user's input.
Return ONLY a valid JSON object with exactly these fields (no markdown, no extra text):
{
  "title": "compelling, evocative title (max 10 words)",
  "category": "one of: art, dance, music, food, festival, handicrafts, monument, textile",
  "region": "specific Indian state or region",
  "description": "2-sentence summary of the cultural tradition/art form",
  "content": "a 150-200 word rich documentation paragraph",
  "author": "a realistic Indian cultural researcher name",
  "authorRole": "realistic role like 'Master Craft Documentarian' or 'Folk Art Specialist'",
  "readTime": "X min read",
  "tags": ["tag1", "tag2", "tag3"]
}`;

    const raw = await callGroq(system, `Generate a heritage documentation story about: ${prompt}`);

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Could not parse story JSON from AI response');
    const story = JSON.parse(jsonMatch[0]);

    res.json({ story });
  } catch (err) {
    console.error('[AI Generate Story Error]', err.message);
    res.status(500).json({ error: 'Could not generate story. Please try again.' });
  }
});

// ─── POST /api/ai/search ────────────────────────────────────────────────────
router.post('/search', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: 'query is required' });

    const system = `You are a cultural search intelligence for RIWAYAT, India's heritage platform.
When given a search query about Indian culture, arts, crafts, dance, music, or monuments:
1. Understand the intent behind the search
2. Provide a rich 2-3 sentence curated answer
3. Suggest related topics or categories from: stories, workshops, marketplace, artists, destinations, events

Return ONLY valid JSON (no markdown):
{
  "summary": "2-3 sentence rich answer about the cultural topic",
  "highlights": ["key fact 1", "key fact 2", "key fact 3"],
  "relatedPages": [
    {"label": "readable label", "path": "/stories or /workshops or /marketplace or /artists or /destinations or /recent-events"}
  ],
  "suggestedSearches": ["related term 1", "related term 2"]
}`;

    const raw = await callGroq(system, `Search query: "${query}"`);
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Could not parse search JSON');
    const result = JSON.parse(jsonMatch[0]);

    res.json({ result });
  } catch (err) {
    console.error('[AI Search Error]', err.message);
    res.status(500).json({ error: 'AI search temporarily unavailable.' });
  }
});

// ─── POST /api/ai/analyze-image ─────────────────────────────────────────────
router.post('/analyze-image', async (req, res) => {
  try {
    const { base64Image, mimeType = 'image/jpeg' } = req.body;
    if (!base64Image) return res.status(400).json({ error: 'base64Image is required' });

    const prompt = `You are an expert Indian cultural heritage analyst for RIWAYAT platform.
Analyze this image and identify if it shows Indian traditional art, craft, textile, dance, music, architecture, or cultural item.
Return ONLY valid JSON (no markdown):
{
  "identified": true or false,
  "craftType": "specific art/craft form name (e.g. Madhubani Painting, Banarasi Silk, Kathakali)",
  "region": "likely Indian state or region of origin",
  "confidence": "High / Medium / Low",
  "culturalSignificance": "2-3 sentences about the cultural importance and history",
  "characteristics": ["visual characteristic 1", "visual characteristic 2", "visual characteristic 3"],
  "relatedSearch": "suggested search term to find more about this on Riwayat",
  "notCultural": "if not Indian cultural item, describe what you see briefly"
}`;

    const completion = await groq.chat.completions.create({
      model: GROQ_VISION_MODEL,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: { url: `data:${mimeType};base64,${base64Image}` }
            }
          ]
        }
      ],
      temperature:           0.7,
      max_completion_tokens: 1024
    });

    const raw = completion.choices[0]?.message?.content?.trim();
    if (!raw) throw new Error('Empty response from Groq Vision');

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Could not parse image analysis JSON');
    const analysis = JSON.parse(jsonMatch[0]);

    res.json({ analysis });
  } catch (err) {
    console.error('[AI Image Analyze Error]', err.message);
    res.status(500).json({ error: 'Image analysis failed. Please try a different image.' });
  }
});

// ─── POST /api/ai/artisan-summary ────────────────────────────────────────────
router.post('/artisan-summary', async (req, res) => {
  try {
    const { name, craft, region, bio } = req.body;
    if (!name || !craft) return res.status(400).json({ error: 'name and craft are required' });

    const system = `You are a poetic Indian cultural writer for RIWAYAT platform.
Write a single evocative, poetic 2-sentence "Craft Heritage Profile" for a master artisan.
It should feel literary, celebratory, and deeply rooted in Indian cultural tradition.
Mention their specific craft form and region if available.
Return ONLY the 2-sentence profile text, nothing else.`;

    const userMsg = `Artisan: ${name} | Craft: ${craft} | Region: ${region || 'India'} | Bio context: ${bio || 'Traditional master craftsperson'}`;
    const profile = await callGroq(system, userMsg, { max_tokens: 256, temperature: 0.9 });

    res.json({ profile });
  } catch (err) {
    console.error('[AI Artisan Summary Error]', err.message);
    res.status(500).json({ error: 'Could not generate artisan profile.' });
  }
});

module.exports = router;
