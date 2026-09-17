import { getClient, isLiveModeEnabled, MODEL } from "@/lib/llm";

const SYSTEM_PROMPT = `You are a friendly, patient HR Tutor embedded inside an HR training platform.

Rules:
- When explaining a concept or giving an example, base your answer primarily on the provided course material (the reading content). You may add outside knowledge only if it does not conflict with the material, and make clear when you are doing so.
- When asked why an answer was wrong (or similar), use the provided quiz question, the learner's answer, the correct answer, and its explanation/evidence to give a clear, encouraging explanation grounded in the course material.
- Keep answers concise and conversational — a few sentences to a short paragraph — unless asked for more detail or a practice question.
- If asked for "another practice question", write ONE new question testing the same topic, in a similar style to the course quiz, as plain text (not JSON). Do not reveal the answer unless asked.
- If asked to explain "in simple English", simplify vocabulary and shorten sentences.
- Never contradict the course material's definitions or facts.
- Do not use markdown headers; plain prose or short bullet lists only.
- Respond in the platform's current interface language by default (given below as "Interface language"), unless the learner explicitly asks for a different language — then switch and answer in that language instead.`;

function buildContextBlock({ course, topic, level, language, topicContent, quizContext }) {
  const languageName = language === "ar" ? "Arabic (Modern Standard Arabic)" : "English";
  let block = `Course: ${course || "unknown"}\nTopic: ${topic || "unknown"}\nLearner level: ${level || "beginner"}\nInterface language: ${languageName}\n\nReading material (JSON):\n${JSON.stringify(topicContent)}`;

  if (quizContext?.questions && quizContext?.grade) {
    const incorrect = quizContext.grade.results
      .filter((r) => !r.isCorrect)
      .map((r) => {
        const q = quizContext.questions.find((q) => q.id === r.questionId);
        const learnerAnswer = q?.choices?.[quizContext.answers?.[q.id]] ?? "no answer";
        return {
          question: q?.question,
          learnerAnswer,
          correctAnswer: q?.choices?.[q.correctIndex],
          explanation: q?.explanation,
          evidence: q?.evidence,
        };
      });
    block += `\n\nMost recent quiz result: ${quizContext.grade.score}% (${quizContext.grade.correctCount}/${quizContext.grade.total}).`;
    if (incorrect.length > 0) {
      block += `\nQuestions the learner got wrong:\n${JSON.stringify(incorrect)}`;
    }
  }

  return block;
}

export async function POST(request) {
  const body = await request.json();
  const { message, history, course, topic, level, language, topicContent, quizContext } = body || {};

  if (!message || !topicContent) {
    return Response.json({ error: "message and topicContent are required" }, { status: 400 });
  }

  if (!isLiveModeEnabled()) {
    return Response.json(
      { error: "The AI Tutor needs a live AI connection. Set NVIDIA_API_KEY to enable it." },
      { status: 503 }
    );
  }

  const contextBlock = buildContextBlock({ course, topic, level, language, topicContent, quizContext });
  const trimmedHistory = Array.isArray(history) ? history.slice(-8) : [];

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: contextBlock },
    { role: "assistant", content: "Understood — I'll ground my answers in that material." },
    ...trimmedHistory.map((m) => ({ role: m.role, content: m.text })),
    { role: "user", content: message },
  ];

  const client = getClient();
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const completion = await client.chat.completions.create({
          model: MODEL,
          messages,
          temperature: 0.6,
          top_p: 0.9,
          max_tokens: 1024,
          stream: true,
        });
        for await (const chunk of completion) {
          const delta = chunk.choices?.[0]?.delta?.content;
          if (delta) controller.enqueue(encoder.encode(delta));
        }
      } catch (err) {
        controller.enqueue(encoder.encode(`\n[[STREAM_ERROR]] ${err.message || "Failed to reach the tutor."}`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
