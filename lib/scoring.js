export const PASSING_SCORE = 70;

export function gradeQuiz(questions, answerIndexByQuestionId) {
  const results = questions.map((q) => {
    const learnerIndex = answerIndexByQuestionId[q.id];
    const isCorrect = learnerIndex === q.correctIndex;
    return {
      questionId: q.id,
      learnerIndex,
      isCorrect,
    };
  });

  const correctCount = results.filter((r) => r.isCorrect).length;
  const score = Math.round((correctCount / questions.length) * 100);

  return { results, correctCount, total: questions.length, score, passed: score >= PASSING_SCORE };
}

export function feedbackKeyForScore(score) {
  if (score >= 90) return "feedbackExcellent";
  if (score >= 80) return "feedbackVeryGood";
  if (score >= 70) return "feedbackGood";
  if (score >= 60) return "feedbackReview";
  return "feedbackReread";
}
