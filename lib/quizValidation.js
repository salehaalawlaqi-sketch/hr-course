export function validateQuestions(questions) {
  if (!Array.isArray(questions) || questions.length !== 5) return false;
  return questions.every((q) => {
    if (!q.id || !q.type || !q.question || !Array.isArray(q.choices)) return false;
    if (q.type === "true_false" && q.choices.length !== 2) return false;
    if (q.type !== "true_false" && q.choices.length !== 4) return false;
    if (typeof q.correctIndex !== "number" || q.correctIndex < 0 || q.correctIndex >= q.choices.length) return false;
    if (!q.evidence || !q.relatedSection) return false;
    return true;
  });
}

const SECTION_LABELS = {
  title: "Reading",
  objectives: "Learning Objectives",
  mainexplanation: "Main Explanation",
  definitions: "Definitions",
  examples: "Examples",
  scenarios: "Scenarios",
  keytakeaways: "Key Takeaways",
  sources: "Sources",
};

export function normalizeRelatedSection(value) {
  if (!value) return value;
  const key = value.trim().toLowerCase().replace(/[\s_-]+/g, "");
  return SECTION_LABELS[key] || value;
}
