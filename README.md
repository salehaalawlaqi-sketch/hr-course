HR Specialist Test Agent

An embeddable React component that runs a 4-topic HR assessment, sourcing questions and specialist "ideal answers" from your API, and auto-grading learner responses.

Topics covered
HR Fundamentals
Recruitment & Talent Acquisition
Performance Management
Employee Relations

(Swap these for any 4 topics — see "Changing topics" below.)

Install

Drop HRSpecialistTestAgent.jsx into your project. Requires react and lucide-react.

jsx
import HRSpecialistTestAgent from "./HRSpecialistTestAgent";

<HRSpecialistTestAgent
  apiBaseUrl="https://your-api.example.com/hr-assessment"
  passingScore={70}
  learnerName="Sara Al Mazrouei"
  onComplete={(results) => {
    // results = { overallScore, topicScores, earnedByTopic, possibleByTopic, passed }
    saveToLMS(results);
  }}
/>

Omit apiBaseUrl to run in demo mode with built-in mock questions — useful for previewing the UI before your API is ready.

API contract your backend needs to implement
GET {apiBaseUrl}/topics
json
[{ "id": "fundamentals", "name": "HR Fundamentals" }]
GET {apiBaseUrl}/topics/{topicId}/questions
json
[
  {
    "id": "f1",
    "topic": "fundamentals",
    "type": "mcq",
    "question": "Which HR activity ensures the right headcount and skills at the right time?",
    "choices": ["Employee engagement", "Workforce planning", "Payroll processing", "Employee relations"],
    "correctAnswer": "Workforce planning",
    "explanation": "Workforce planning aligns staffing with future needs.",
    "points": 10,
    "source": { "author": "SHRM", "title": "Workforce Planning", "url": "https://www.shrm.org" }
  },
  {
    "id": "f3",
    "topic": "fundamentals",
    "type": "free_text",
    "question": "Why should HR have a seat at the strategic planning table?",
    "idealAnswer": "HR holds visibility into workforce capability and culture that determines whether a strategy is executable...",
    "rubric": ["Connects HR to strategic execution", "Mentions workforce/culture alignment"],
    "explanation": "Strong answers position HR as a strategic driver, not just an executor.",
    "points": 15,
    "source": { "author": "SHRM", "title": "HR as a Strategic Partner", "url": "https://www.shrm.org" }
  }
]

type is one of mcq, true_false, free_text, scenario. The last two are graded identically (rubric comparison against idealAnswer).

POST {apiBaseUrl}/grade

Request:

json
{ "questionId": "f3", "question": "...", "idealAnswer": "...", "learnerAnswer": "...", "rubric": ["..."] }

Response:

json
{ "score": 82, "feedback": "Covers strategic alignment but doesn't mention culture.", "criteriaMet": [{ "criterion": "...", "met": true }] }

Important: free-text grading against the specialist's ideal answer should happen server-side, where you control the model call and API key. This component intentionally never calls an AI model directly — it only posts to your /grade endpoint. In demo mode (no apiBaseUrl), a simple keyword- overlap heuristic stands in so the UI is testable end to end; replace it with real rubric grading (e.g., an LLM prompted with the question, ideal answer, rubric, and learner answer, instructed to return a 0–100 score) once your API is live.

Scoring logic
Each question carries a points value (default 10).
MCQ / True-False: full points if the learner's choice exactly matches correctAnswer, else zero.
Free-text / scenario: points × (graded score ÷ 100), where the graded score comes from your /grade endpoint's rubric comparison.
Topic score = (points earned in topic ÷ points possible in topic) × 100.
Overall score = (total points earned ÷ total points possible across all 4 topics) × 100 — i.e., weighted by each question's point value, not a simple average of topic percentages.
passingScore prop (default 70) determines pass/fail and the "Needs Improvement / Developing / Competent / Proficient / Expert" band shown on the results screen.
Changing topics

Replace MOCK_TOPICS / MOCK_QUESTIONS in the component (used only in demo mode), or pass your own topics prop and point apiBaseUrl at a backend that returns different topic IDs — the component doesn't hardcode topic count or order beyond rendering whatever the API returns.
