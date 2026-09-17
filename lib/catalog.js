export const LEVELS = [
  {
    id: "beginner",
    name: "Beginner",
    nameAr: "مبتدئ",
    description: "New to HR — simple explanations and basic terminology.",
    descriptionAr: "جديد في مجال الموارد البشرية — شروحات بسيطة ومصطلحات أساسية.",
  },
  {
    id: "intermediate",
    name: "Intermediate",
    nameAr: "متوسط",
    description: "Comfortable with HR basics — more detailed concepts and scenarios.",
    descriptionAr: "ملمّ بأساسيات الموارد البشرية — مفاهيم وسيناريوهات أكثر تفصيلاً.",
  },
  {
    id: "advanced",
    name: "Advanced",
    nameAr: "متقدم",
    description: "Strategic HR concepts, analytical questions, complex scenarios.",
    descriptionAr: "مفاهيم استراتيجية في الموارد البشرية، أسئلة تحليلية، وسيناريوهات معقدة.",
  },
  {
    id: "hr-professional",
    name: "HR Professional",
    nameAr: "محترف موارد بشرية",
    description: "Advanced scenarios, HR analytics, strategic decision-making.",
    descriptionAr: "سيناريوهات متقدمة، تحليلات الموارد البشرية، واتخاذ القرار الاستراتيجي.",
  },
];

export const COURSES = [
  { id: "hr-fundamentals", name: "HR Fundamentals", nameAr: "أساسيات الموارد البشرية" },
  { id: "recruitment-selection", name: "Recruitment & Selection", nameAr: "التوظيف والاختيار" },
  { id: "talent-management", name: "Talent Management", nameAr: "إدارة المواهب" },
  { id: "performance-management", name: "Performance Management", nameAr: "إدارة الأداء" },
  { id: "employee-relations", name: "Employee Relations", nameAr: "علاقات الموظفين" },
  { id: "learning-development", name: "Learning & Development", nameAr: "التعلّم والتطوير" },
  { id: "compensation-benefits", name: "Compensation & Benefits", nameAr: "التعويضات والمزايا" },
  { id: "workforce-planning", name: "Workforce Planning", nameAr: "تخطيط القوى العاملة" },
  { id: "hr-analytics", name: "HR Analytics", nameAr: "تحليلات الموارد البشرية" },
  { id: "employee-engagement", name: "Employee Engagement", nameAr: "مشاركة الموظفين" },
  { id: "strategic-hr", name: "Strategic HR Management", nameAr: "الإدارة الاستراتيجية للموارد البشرية" },
  { id: "hr-policies", name: "HR Policies & Procedures", nameAr: "سياسات وإجراءات الموارد البشرية" },
  { id: "leadership", name: "Leadership", nameAr: "القيادة" },
  { id: "uae-labour-law", name: "UAE HR & Labour Law", nameAr: "قانون العمل والموارد البشرية في الإمارات" },
  { id: "ai-in-hr", name: "AI in Human Resources", nameAr: "الذكاء الاصطناعي في الموارد البشرية" },
];

export const TOPICS_BY_COURSE = {
  "hr-fundamentals": [
    { id: "what-is-hr", title: "What Is HR?", titleAr: "ما هي الموارد البشرية؟" },
    { id: "hr-strategic-role", title: "HR's Strategic Role in the Business", titleAr: "الدور الاستراتيجي للموارد البشرية في الأعمال" },
    { id: "core-hr-functions", title: "Core HR Functions Overview", titleAr: "نظرة عامة على الوظائف الأساسية للموارد البشرية" },
  ],
  "recruitment-selection": [
    { id: "sourcing-candidates", title: "Sourcing Candidates", titleAr: "استقطاب المرشحين" },
    { id: "structured-interviewing", title: "Structured Interviewing", titleAr: "المقابلات المنظّمة" },
    { id: "making-the-offer", title: "Making the Offer", titleAr: "تقديم عرض التوظيف" },
  ],
  "talent-management": [
    { id: "talent-identification", title: "Identifying High-Potential Talent", titleAr: "تحديد المواهب ذات الإمكانات العالية" },
    { id: "career-development-planning", title: "Career Development Planning", titleAr: "تخطيط التطوير الوظيفي" },
    { id: "high-potential-programs", title: "Designing High-Potential Programs", titleAr: "تصميم برامج المواهب الواعدة" },
  ],
  "performance-management": [
    { id: "setting-performance-goals", title: "Setting Performance Goals", titleAr: "تحديد أهداف الأداء" },
    { id: "conducting-performance-reviews", title: "Conducting Performance Reviews", titleAr: "إجراء تقييمات الأداء" },
    { id: "performance-improvement-plans", title: "Performance Improvement Plans", titleAr: "خطط تحسين الأداء" },
  ],
  "employee-relations": [
    { id: "handling-workplace-conflict", title: "Handling Workplace Conflict", titleAr: "التعامل مع النزاعات في مكان العمل" },
    { id: "progressive-discipline", title: "Progressive Discipline", titleAr: "الانضباط التدريجي" },
    { id: "investigating-complaints", title: "Investigating Employee Complaints", titleAr: "التحقيق في شكاوى الموظفين" },
  ],
  "learning-development": [
    { id: "training-needs-analysis", title: "Training Needs Analysis", titleAr: "تحليل الاحتياجات التدريبية" },
    { id: "designing-learning-programs", title: "Designing Learning Programs", titleAr: "تصميم برامج التعلّم" },
    { id: "measuring-training-roi", title: "Measuring Training ROI", titleAr: "قياس عائد الاستثمار في التدريب" },
  ],
  "compensation-benefits": [
    { id: "base-pay-structures", title: "Base Pay Structures", titleAr: "هياكل الأجور الأساسية" },
    { id: "designing-benefits-packages", title: "Designing Benefits Packages", titleAr: "تصميم حزم المزايا" },
    { id: "pay-equity", title: "Pay Equity", titleAr: "عدالة الأجور" },
  ],
  "workforce-planning": [
    { id: "workforce-planning-intro", title: "Workforce Planning", titleAr: "تخطيط القوى العاملة" },
    { id: "succession-basics", title: "Succession Planning Basics", titleAr: "أساسيات تخطيط التعاقب الوظيفي" },
    { id: "talent-pipelines", title: "Building Talent Pipelines", titleAr: "بناء مسارات المواهب" },
  ],
  "hr-analytics": [
    { id: "hr-metrics-basics", title: "HR Metrics Basics", titleAr: "أساسيات مقاييس الموارد البشرية" },
    { id: "turnover-analysis", title: "Turnover Analysis", titleAr: "تحليل معدل دوران الموظفين" },
    { id: "predictive-people-analytics", title: "Predictive People Analytics", titleAr: "التحليلات التنبؤية للموظفين" },
  ],
  "employee-engagement": [
    { id: "measuring-engagement", title: "Measuring Employee Engagement", titleAr: "قياس مشاركة الموظفين" },
    { id: "engagement-strategy", title: "Building an Engagement Strategy", titleAr: "بناء استراتيجية المشاركة" },
    { id: "recognition-programs", title: "Recognition Programs", titleAr: "برامج التقدير" },
  ],
  "strategic-hr": [
    { id: "aligning-hr-with-strategy", title: "Aligning HR with Business Strategy", titleAr: "مواءمة الموارد البشرية مع استراتيجية الأعمال" },
    { id: "hr-business-partnering", title: "HR Business Partnering", titleAr: "الشراكة الاستراتيجية للموارد البشرية" },
    { id: "change-management", title: "Leading Organizational Change", titleAr: "قيادة التغيير التنظيمي" },
  ],
  "hr-policies": [
    { id: "writing-effective-policies", title: "Writing Effective HR Policies", titleAr: "صياغة سياسات فعّالة للموارد البشرية" },
    { id: "employee-handbooks", title: "Employee Handbooks", titleAr: "أدلة الموظفين" },
    { id: "policy-rollout", title: "Policy Communication & Rollout", titleAr: "تعميم السياسات وتطبيقها" },
  ],
  leadership: [
    { id: "foundations-of-people-leadership", title: "Foundations of People Leadership", titleAr: "أساسيات قيادة الأفراد" },
    { id: "coaching-skills-for-managers", title: "Coaching Skills for Managers", titleAr: "مهارات التدريب للمديرين" },
    { id: "leading-through-change", title: "Leading Through Change", titleAr: "القيادة في أوقات التغيير" },
  ],
  "uae-labour-law": [
    { id: "uae-labour-law-basics", title: "UAE Labour Law Basics", titleAr: "أساسيات قانون العمل الإماراتي" },
    { id: "end-of-service-benefits", title: "End of Service Benefits", titleAr: "مستحقات نهاية الخدمة" },
    { id: "termination-notice-requirements", title: "Termination & Notice Requirements", titleAr: "متطلبات إنهاء الخدمة والإشعار" },
  ],
  "ai-in-hr": [
    { id: "ai-in-recruitment", title: "AI in Recruitment", titleAr: "الذكاء الاصطناعي في التوظيف" },
    { id: "ethical-use-of-ai-in-hr", title: "Ethical Use of AI in HR", titleAr: "الاستخدام الأخلاقي للذكاء الاصطناعي في الموارد البشرية" },
    { id: "ai-powered-people-analytics", title: "AI-Powered People Analytics", titleAr: "تحليلات الموظفين المدعومة بالذكاء الاصطناعي" },
  ],
};
