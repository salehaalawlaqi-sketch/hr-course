Build an **AI-powered Human Resources Learning Platform** that teaches HR through structured lessons and quizzes.

The platform must follow a strict learning flow:

**Choose Level → Choose Course → Read Topic → Take Quiz → Get Score → Review Answers → Continue**

## 1. User Level

When the learner first enters the platform, ask them to select their HR knowledge level:

* Beginner
* Intermediate
* Advanced
* HR Professional

The difficulty, terminology, examples, and quiz questions must automatically adapt to the selected level.

### Beginner

Use simple explanations, basic HR terminology, and practical workplace examples.

### Intermediate

Use more detailed HR concepts, workplace scenarios, and moderately complex questions.

### Advanced

Use strategic HR concepts, analytical questions, complex scenarios, and decision-making situations.

### HR Professional

Use advanced professional scenarios, HR analytics, strategic decision-making, policies, and real-world HR cases.

Allow the learner to change their level at any time.

---

## 2. HR Courses

Provide structured HR courses such as:

* HR Fundamentals
* Recruitment & Selection
* Talent Management
* Performance Management
* Employee Relations
* Learning & Development
* Compensation & Benefits
* Workforce Planning
* HR Analytics
* Employee Engagement
* Strategic HR Management
* HR Policies & Procedures
* Leadership
* UAE HR & Labour Law
* AI in Human Resources

Each course should be divided into:

**Course → Module → Topic → Reading Material → Quiz**

---

## 3. Mandatory Reading Before Quiz

This is a critical requirement.

**The learner must READ the topic before being allowed to take the quiz.**

For every topic, provide a concise but informative learning section containing:

1. Topic title
2. Learning objectives
3. Main explanation
4. Important definitions
5. Practical HR examples
6. Workplace scenarios where relevant
7. Key takeaways
8. Sources / references

Display a button at the end:

**"Start Quiz"**

Do not allow the learner to access the quiz before completing the reading section.

---

## 4. Quiz Questions Must Come From the Topic

The quiz must test **only information that was provided in the topic the learner just read**.

Do NOT ask questions about information that was not included in the reading material.

For every quiz question:

* The answer must be clearly supported by the topic.
* The question should test understanding rather than memorization whenever possible.
* Avoid ambiguous questions.
* Avoid information that requires outside knowledge.
* Make incorrect answers plausible but clearly distinguishable from the information in the topic.

The AI should internally verify:

**Question → Correct Answer → Supporting Information in Topic**

before displaying the question.

---

## 5. Quiz Format

After reading each topic, generate a short quiz of **5 questions**.

Use a mixture of:

* Multiple choice
* True / False
* Scenario-based questions
* Situational Judgment Questions (SJT)

For multiple-choice questions, provide **4 answer options (A, B, C, D)**.

Do not reveal the correct answer before the learner submits the quiz.

---

## 6. Answer Explanation

After the learner submits the quiz:

Show:

**Your Score: 4/5 – 80%**

For every question, display:

* Learner's answer
* Correct answer
* Correct / Incorrect status
* Short explanation

Most importantly, show the learner **where the answer came from in the reading material**.

For example:

**Why is this correct?**

"The correct answer is B because the topic explains that performance management includes setting expectations, monitoring performance, providing feedback, and supporting development."

Add:

**📖 Related section:** Performance Management – Key Responsibilities

This helps the learner understand that the answer was based on what they read.

---

## 7. Scoring

Calculate the score automatically.

Example:

**5/5 – 100%**

**4/5 – 80%**

**3/5 – 60%**

Use the following feedback:

* 90–100% → Excellent understanding
* 80–89% → Very good understanding
* 70–79% → Good understanding
* 60–69% → Review recommended
* Below 60% → Re-read the topic and try again

Do not allow the learner to simply guess their way through the course.

---

## 8. Re-Take Logic

If the learner scores below **70%**:

Show:

**"We recommend reviewing this topic before continuing."**

Provide a button:

**Review Topic**

Then allow them to take a new quiz.

The second quiz must contain different questions but must still be based **only on the same reading material**.

If the learner scores 70% or higher, allow them to continue to the next topic.

---

## 9. Evidence-Based Answers

Every quiz question must have an internal evidence reference.

For example:

**Question:** What is the main purpose of workforce planning?

**Correct Answer:** B

**Evidence from Topic:**
"Workforce planning helps organizations ensure they have the right number of people with the right skills at the right time."

The platform does not need to show the technical evidence tag to the learner, but the AI must use it internally to ensure that every answer is supported by the lesson.

---

## 10. Sources

Every topic must contain a **Sources** section.

Use reliable sources such as:

* Government websites
* Official legislation
* International HR organizations
* Academic research
* Professional HR organizations
* Reputable HR publications

For UAE Labour Law topics, prioritize official UAE government and legal sources.

Never invent a source or citation.

If information is uncertain or has changed, clearly indicate that the learner should verify the current official source.

---

## 11. Progress Dashboard

Create a learner dashboard showing:

* Selected HR level
* Courses started
* Courses completed
* Topics completed
* Quiz scores
* Average score
* Weak topics
* Strong topics
* Overall progress
* Certificates earned

Example:

**HR Fundamentals**

████████░░ 80%

Topics completed: 8/10

Average Quiz Score: 86%

---

## 12. Personalized Learning

The AI should analyze quiz results and identify areas where the learner needs improvement.

For example:

**Your results suggest that you need more practice with Recruitment & Selection concepts.**

Then recommend the relevant topic.

The AI should adjust future questions according to the learner's level and performance.

---

## 13. AI HR Tutor

Include an AI HR Tutor.

The learner can ask:

* "Explain this concept."
* "Give me an example."
* "Why was my answer wrong?"
* "Give me another practice question."
* "Explain this in simple English."
* "Explain this in Arabic."

However, when explaining quiz answers, the AI must prioritize the course material as the primary source.

---

## 14. Language

Support:

**English and Arabic**

The learner can switch languages at any time.

The meaning of the HR content and quiz questions must remain consistent between languages.

---

## 15. Important AI Rules

The AI must follow these rules:

1. **Teach before testing.**
2. **The learner must read the topic before taking the quiz.**
3. **Every quiz answer must be supported by the topic.**
4. **Never test information that was not taught in the topic.**
5. **Explain every incorrect answer.**
6. **Show the relevant part/section of the lesson that supports the correct answer.**
7. **Adapt difficulty to the learner's selected level.**
8. **Do not make questions unnecessarily tricky.**
9. **Do not use ambiguous questions.**
10. **Use reliable sources and display them at the end of each topic.**
11. **Track the learner's progress and scores.**
12. **Allow learners to review and retake quizzes.**

## Core Learning Model

The entire platform should be built around this educational cycle:

**📚 READ**

↓

**🧠 UNDERSTAND**

↓

**📝 QUIZ**

↓

**📊 SCORE**

↓

**🔎 REVIEW MISTAKES**

↓

**🔄 RE-LEARN IF NEEDED**

↓

**✅ COMPLETE TOPIC**

↓

**➡️ NEXT TOPIC**

The objective is to create an **interactive HR Learning & Assessment Agent**, not simply a library of HR courses. The learner should acquire knowledge first and then demonstrate understanding through questions that are directly based on the material they studied.
