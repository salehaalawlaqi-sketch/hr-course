import { getClient, isLiveModeEnabled, MODEL } from "@/lib/llm";
import { MOCK_TOPIC } from "@/lib/mockContent";

const LEVEL_GUIDANCE = {
  beginner: "Use simple explanations, basic HR terminology, and practical workplace examples.",
  intermediate: "Use more detailed HR concepts, workplace scenarios, and moderately complex language.",
  advanced: "Use strategic HR concepts, analytical framing, and complex scenarios.",
  "hr-professional":
    "Use advanced professional scenarios, HR analytics framing, strategic decision-making, and real-world HR cases.",
};

const SYSTEM_PROMPT = `You are an instructional designer writing a single HR training topic.
Return ONLY a JSON object with this exact shape, no prose outside the JSON:
{
  "title": string,
  "objectives": string[] (2-4 items),
  "mainExplanation": string[] (2-4 paragraphs, each a plain string),
  "definitions": [{"term": string, "definition": string}] (2-4 items),
  "examples": string[] (1-3 concrete workplace examples),
  "scenarios": string[] (0-2 realistic workplace scenarios),
  "keyTakeaways": string[] (3-5 concise bullet points),
  "sources": [{"author": string, "title": string, "url": string}] (1-3 real, well-known HR sources; never invent a source)
}
Every array marked string[] above (objectives, mainExplanation, examples, scenarios, keyTakeaways) MUST contain only plain strings — never objects, never nested fields like {"scenario":..., "analysis":...}. If a scenario needs analysis or a conclusion, write it as ONE combined plain-text string, not a structured object.
Only use real, well-known sources (SHRM, CIPD, government/legislation sites, academic or established HR publications). If unsure of a specific source, use a general reputable organization name rather than inventing a fake title or URL.
If the requested language is Arabic, write every string VALUE in the JSON in Modern Standard Arabic (fus-ha), while keeping the JSON key names exactly as specified in English (e.g. "title", "mainExplanation"). Source author/title names may stay in their original language (e.g. "SHRM"), but everything else must be Arabic.`;

export async function POST(request) {
  const body = await request.json();
  const { course, topic, level, language } = body || {};

  if (!course || !topic) {
    return Response.json({ error: "course and topic are required" }, { status: 400 });
  }

  if (!isLiveModeEnabled()) {
    return Response.json({ topic: { ...MOCK_TOPIC, title: topic }, mode: "demo" });
  }

  const levelGuidance = LEVEL_GUIDANCE[level] || LEVEL_GUIDANCE.beginner;
  const languageName = language === "ar" ? "Arabic (Modern Standard Arabic)" : "English";
  const userPrompt = `Course: ${course}\nTopic: ${topic}\nLearner level: ${level || "beginner"}\nLevel guidance: ${levelGuidance}\nRequested language: ${languageName}`;

  const client = getClient();
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const completion = await client.chat.completions.create({
          model: MODEL,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.6,
          top_p: 0.9,
          max_tokens: 4096,
          stream: true,
        });
        for await (const chunk of completion) {
          const delta = chunk.choices?.[0]?.delta?.content;
          if (delta) controller.enqueue(encoder.encode(delta));
        }
      } catch (err) {
        controller.enqueue(
          encoder.encode(`\n[[STREAM_ERROR]] ${err.message || "Failed to generate topic content."}`)
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
