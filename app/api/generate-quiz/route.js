import { getClient, isLiveModeEnabled, MODEL } from "@/lib/llm";
import { MOCK_QUIZZES, MOCK_QUIZZES_AR } from "@/lib/mockContent";

const SYSTEM_PROMPT = `You are writing a 5-question quiz that tests ONLY the information contained in the reading material provided by the user. You must not test outside knowledge.

Before producing each question, internally verify: Question -> Correct Answer -> Supporting sentence(s) in the reading material. If you cannot find direct support in the reading material, do not use that question.

Rules:
- Use a mix of question types across the 5 questions: at least one "mcq", one "true_false", and one of "scenario" or "sjt".
- Every "mcq", "scenario", and "sjt" question must have exactly 4 choices. Every "true_false" question must have exactly 2 choices: ["True", "False"] if writing in English, or ["صح", "خطأ"] if writing in Arabic.
- Incorrect choices must be plausible but clearly distinguishable from the reading material, not silly or obviously wrong.
- Test understanding, not verbatim memorization, wherever possible.
- Avoid ambiguous questions and avoid requiring outside knowledge.
- Each question needs an "evidence" field: a short quote or close paraphrase from the reading material that supports the correct answer.
- Each question needs a "relatedSection" field naming which part of the reading material supports it. If writing in English, use one of these exact labels: "Main Explanation", "Definitions", "Examples", "Scenarios", "Key Takeaways", "Learning Objectives", "Sources". If writing in Arabic, use one of: "الشرح الرئيسي", "التعريفات", "الأمثلة", "السيناريوهات", "أهم النقاط", "أهداف التعلم", "المصادر". Never use a raw JSON field name like "mainExplanation" or "definitions".
- If the requested language is Arabic, write every string VALUE in the JSON (question, choices, explanation, evidence, relatedSection) in Modern Standard Arabic. Keep JSON key names in English exactly as specified.

Return ONLY a JSON object with this exact shape, no prose outside the JSON:
{
  "questions": [
    {
      "id": string (short slug, unique within the array),
      "type": "mcq" | "true_false" | "scenario" | "sjt",
      "question": string,
      "choices": string[],
      "correctIndex": number (0-based index into choices),
      "explanation": string (why the correct answer is right),
      "evidence": string,
      "relatedSection": string
    }
  ]
}
The array must contain exactly 5 questions.
"question", every item in "choices", "explanation", "evidence", and "relatedSection" MUST be plain strings — never objects or nested fields.`;

export async function POST(request) {
  const body = await request.json();
  const { course, topic, level, readingContent, variant, excludeQuestionTexts, language } = body || {};

  if (!isLiveModeEnabled()) {
    const mockVariant = variant === "B" ? "B" : "A";
    const mockSet = language === "ar" ? MOCK_QUIZZES_AR : MOCK_QUIZZES;
    return Response.json({ questions: mockSet[mockVariant], mode: "demo" });
  }

  if (!readingContent) {
    return Response.json({ error: "readingContent is required in live mode" }, { status: 400 });
  }

  const exclusions =
    Array.isArray(excludeQuestionTexts) && excludeQuestionTexts.length > 0
      ? `\n\nDo not repeat or closely paraphrase these previously used questions:\n${excludeQuestionTexts.map((q) => `- ${q}`).join("\n")}`
      : "";

  const languageName = language === "ar" ? "Arabic (Modern Standard Arabic)" : "English";
  const userPrompt = `Course: ${course}\nTopic: ${topic}\nLearner level: ${level || "beginner"}\nRequested language: ${languageName}\n\nReading material (JSON):\n${JSON.stringify(readingContent)}${exclusions}`;

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
        controller.enqueue(encoder.encode(`\n[[STREAM_ERROR]] ${err.message || "Failed to generate quiz."}`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
