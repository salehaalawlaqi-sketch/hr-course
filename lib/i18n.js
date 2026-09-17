const STRINGS = {
  appName: { en: "HR Learning Platform", ar: "منصة التعلم للموارد البشرية" },
  demoModeBadge: {
    en: "Demo mode — set NVIDIA_API_KEY for live AI-generated content",
    ar: "وضع تجريبي — عيّن NVIDIA_API_KEY للحصول على محتوى مُولَّد بالذكاء الاصطناعي مباشرةً",
  },
  dashboard: { en: "Dashboard", ar: "لوحة التقدم" },
  back: { en: "Back", ar: "رجوع" },

  chooseLevel: { en: "Choose your HR knowledge level", ar: "اختر مستوى معرفتك بالموارد البشرية" },
  chooseLevelSubtitle: {
    en: "This sets the difficulty of your reading material and quizzes. You can change it anytime.",
    ar: "يحدد هذا مستوى صعوبة مواد القراءة والاختبارات. يمكنك تغييره في أي وقت.",
  },

  chooseCourse: { en: "Choose a course", ar: "اختر مقررًا" },
  levelLabel: { en: "Level: {value}", ar: "المستوى: {value}" },
  topicsCompleted: { en: "{completed}/{total} topics completed", ar: "اكتمل {completed}/{total} من الموضوعات" },

  backToCourses: { en: "Back to courses", ar: "العودة إلى المقررات" },
  chooseTopicSubtitle: { en: "Choose a topic to read and take its quiz.", ar: "اختر موضوعًا لقراءته وأداء اختباره." },
  completedScore: { en: "Completed · {score}%", ar: "مكتمل · {score}٪" },
  attemptedScore: { en: "Attempted · best {score}%", ar: "تمت المحاولة · أفضل نتيجة {score}٪" },
  notStarted: { en: "Not started", ar: "لم يبدأ بعد" },

  reading: { en: "Reading", ar: "قراءة" },
  learningObjectives: { en: "Learning objectives", ar: "أهداف التعلّم" },
  keyDefinitions: { en: "Key definitions", ar: "تعريفات أساسية" },
  examples: { en: "Examples", ar: "أمثلة" },
  workplaceScenario: { en: "Workplace scenario", ar: "سيناريو في مكان العمل" },
  keyTakeaways: { en: "Key takeaways", ar: "أهم النقاط" },
  sources: { en: "Sources", ar: "المصادر" },
  readingComplete: { en: "You've completed the reading.", ar: "لقد أنهيت القراءة." },
  finishReadingPrompt: {
    en: "Finish reading the material to unlock the quiz.",
    ar: "أنهِ قراءة المادة لفتح الاختبار.",
  },
  startQuiz: { en: "Start Quiz", ar: "ابدأ الاختبار" },
  takeNewQuiz: { en: "Take New Quiz", ar: "أدِ اختبارًا جديدًا" },

  questionOf: { en: "Question {current} of {total}", ar: "السؤال {current} من {total}" },
  typeMcq: { en: "Multiple Choice", ar: "اختيار من متعدد" },
  typeTrueFalse: { en: "True / False", ar: "صح / خطأ" },
  typeScenario: { en: "Scenario", ar: "سيناريو" },
  typeSjt: { en: "Situational Judgment", ar: "الحكم الموقفي" },
  previous: { en: "Previous", ar: "السابق" },
  next: { en: "Next", ar: "التالي" },
  submitQuiz: { en: "Submit Quiz", ar: "إرسال الاختبار" },

  yourScore: { en: "Your Score", ar: "نتيجتك" },
  yourAnswer: { en: "Your answer: ", ar: "إجابتك: " },
  correctAnswer: { en: "Correct answer: ", ar: "الإجابة الصحيحة: " },
  continue: { en: "Continue", ar: "متابعة" },
  reviewRecommendation: {
    en: "We recommend reviewing this topic before continuing. (Passing score: {passScore}%)",
    ar: "نوصي بمراجعة هذا الموضوع قبل المتابعة. (درجة النجاح: {passScore}٪)",
  },
  reviewTopic: { en: "Review Topic", ar: "مراجعة الموضوع" },
  feedbackExcellent: { en: "Excellent understanding", ar: "فهم ممتاز" },
  feedbackVeryGood: { en: "Very good understanding", ar: "فهم جيد جدًا" },
  feedbackGood: { en: "Good understanding", ar: "فهم جيد" },
  feedbackReview: { en: "Review recommended", ar: "يُنصح بالمراجعة" },
  feedbackReread: { en: "Re-read the topic and try again", ar: "أعد قراءة الموضوع وحاول مرة أخرى" },

  yourProgress: { en: "Your Progress", ar: "تقدّمك" },
  overallProgress: { en: "Overall progress", ar: "التقدّم الإجمالي" },
  topicsUnit: { en: "{completed}/{total} topics", ar: "{completed}/{total} موضوعات" },
  coursesStarted: { en: "Courses Started", ar: "المقررات المبدوءة" },
  coursesCompleted: { en: "Courses Completed", ar: "المقررات المكتملة" },
  topicsCompletedStat: { en: "Topics Completed", ar: "الموضوعات المكتملة" },
  averageScore: { en: "Average Score", ar: "متوسط النتيجة" },
  courseProgress: { en: "Course progress", ar: "تقدّم المقررات" },
  strongTopics: { en: "Strong topics", ar: "نقاط القوة" },
  needsReview: { en: "Needs review", ar: "بحاجة إلى مراجعة" },
  noAttemptsYet: { en: "You haven't attempted any quizzes yet.", ar: "لم تخض أي اختبار بعد." },
  viewCertificate: { en: "View Certificate", ar: "عرض الشهادة" },

  teamActivity: { en: "Team Activity", ar: "نشاط الفريق" },
  teamActivitySubtitle: {
    en: "Every learner registered on this platform.",
    ar: "كل متعلم مسجَّل في هذه المنصة.",
  },
  nameColumn: { en: "Name", ar: "الاسم" },
  lastActivityColumn: { en: "Last Activity", ar: "آخر نشاط" },
  recentActivityTitle: { en: "Recent Activity", ar: "النشاط الأخير" },
  activityTopicColumn: { en: "Topic", ar: "الموضوع" },
  activityScoreColumn: { en: "Score", ar: "النتيجة" },
  activityByColumn: { en: "Learner", ar: "المتعلّم" },
  noActivityYet: { en: "No activity recorded yet.", ar: "لا يوجد نشاط مسجَّل بعد." },
  neverAttempted: { en: "No attempts yet", ar: "لا توجد محاولات بعد" },

  authSignInTab: { en: "Sign In", ar: "تسجيل الدخول" },
  authSignUpTab: { en: "Sign Up", ar: "إنشاء حساب" },
  authNameLabel: { en: "Name", ar: "الاسم" },
  authNamePlaceholder: { en: "Your full name", ar: "اسمك الكامل" },
  authPinLabel: { en: "PIN", ar: "الرمز السري" },
  authPinPlaceholder: { en: "4–8 digit PIN", ar: "رمز سري من ٤ إلى ٨ أرقام" },
  authHrCodeLabel: { en: "HR access code (optional)", ar: "رمز وصول الموارد البشرية (اختياري)" },
  authHrCodePlaceholder: { en: "Only for HR staff", ar: "لموظفي الموارد البشرية فقط" },
  authSignInButton: { en: "Sign In", ar: "تسجيل الدخول" },
  authSignUpButton: { en: "Create Account", ar: "إنشاء حساب" },
  authSwitchToSignUp: { en: "New here? Create an account", ar: "جديد هنا؟ أنشئ حسابًا" },
  authSwitchToSignIn: { en: "Already have an account? Sign in", ar: "لديك حساب بالفعل؟ سجّل الدخول" },
  authDbNotConfigured: {
    en: "The database isn't set up yet. Ask your administrator to configure it.",
    ar: "لم يتم إعداد قاعدة البيانات بعد. يرجى التواصل مع المسؤول لإعدادها.",
  },
  signedInAs: { en: "Signed in as {name}", ar: "تم تسجيل الدخول باسم {name}" },
  logOut: { en: "Log Out", ar: "تسجيل الخروج" },
  hrDashboardNav: { en: "HR Dashboard", ar: "لوحة الموارد البشرية" },
  loadingEllipsis: { en: "Loading…", ar: "جارٍ التحميل…" },

  certificateTitle: { en: "Certificate of Completion", ar: "شهادة إتمام" },
  certificateIntro: { en: "This certifies that", ar: "تشهد هذه الوثيقة بأن" },
  certificateBody: { en: "has successfully completed the course", ar: "قد أتم بنجاح مقرر" },
  certificateDate: { en: "Date", ar: "التاريخ" },
  certificatePrint: { en: "Print / Save as PDF", ar: "طباعة / حفظ كملف PDF" },
  certificateClose: { en: "Close", ar: "إغلاق" },

  tutorTitle: { en: "AI HR Tutor", ar: "المعلّم الذكي للموارد البشرية" },
  tutorIntro: {
    en: "Ask me anything about this topic — I'll answer using the course material.",
    ar: "اسألني أي شيء عن هذا الموضوع — سأجيب استنادًا إلى مادة المقرر.",
  },
  tutorPlaceholder: { en: "Ask the tutor…", ar: "اسأل المعلّم…" },
  tutorDemoNotice: {
    en: "Demo mode: the AI Tutor needs a live AI connection (set NVIDIA_API_KEY) to respond.",
    ar: "وضع تجريبي: يحتاج المعلّم الذكي إلى اتصال ذكاء اصطناعي مباشر (عيّن NVIDIA_API_KEY) للرد.",
  },
  suggestExplainConcept: { en: "Explain this concept", ar: "اشرح هذا المفهوم" },
  suggestGiveExample: { en: "Give me an example", ar: "أعطني مثالًا" },
  suggestSimpleEnglish: { en: "Explain this in simple English", ar: "اشرح هذا بأسلوب مبسّط" },
  suggestPracticeQuestion: { en: "Give me another practice question", ar: "أعطني سؤال تدريب آخر" },
  suggestWhyWrong: { en: "Why was my answer wrong?", ar: "لماذا كانت إجابتي خاطئة؟" },

  preparingReading: { en: "Preparing your reading material…", ar: "جارٍ تحضير مادة القراءة…" },
  buildingQuiz: { en: "Building your quiz…", ar: "جارٍ إعداد الاختبار…" },
  errorTitle: { en: "Something went wrong generating your content.", ar: "حدث خطأ أثناء إنشاء المحتوى." },
  errorSubtitle: {
    en: "Please try again — this is usually temporary.",
    ar: "يرجى المحاولة مرة أخرى — عادةً ما يكون هذا خطأ مؤقتًا.",
  },
  technicalDetails: { en: "Technical details", ar: "تفاصيل تقنية" },
  startOver: { en: "Start Over", ar: "البدء من جديد" },
};

export function translate(lang, key, vars) {
  const entry = STRINGS[key];
  if (!entry) return key;
  let text = entry[lang] || entry.en;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.replaceAll(`{${k}}`, v);
    }
  }
  return text;
}
