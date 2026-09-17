export const MOCK_TOPIC = {
  title: "Workforce Planning",
  objectives: [
    "Explain what workforce planning is and why it matters",
    "Identify the core steps in a workforce planning cycle",
    "Distinguish workforce planning from routine recruitment",
  ],
  mainExplanation: [
    "Workforce planning is the ongoing process of analyzing, forecasting, and planning for an organization's future talent needs. Rather than reacting to vacancies as they appear, workforce planning looks ahead to ensure the organization has the right number of people, with the right skills, in the right roles, at the right time.",
    "At its core, workforce planning connects business strategy to people strategy. If a company plans to expand into a new market next year, workforce planning asks: what roles will that require, do we have those skills internally, and how long will it take to build or acquire them? Without this step, strategic plans can stall simply because the organization lacks the people to execute them.",
    "A typical workforce planning cycle has four stages: (1) analyzing current workforce supply — headcount, skills, and demographics; (2) forecasting future demand based on business goals; (3) identifying gaps between supply and demand; and (4) building an action plan that may include hiring, training, restructuring, or succession planning to close those gaps.",
    "Workforce planning is different from routine recruitment. Recruitment fills an open position that already exists today. Workforce planning anticipates needs before they become urgent vacancies, giving the organization time to build talent pipelines, cross-train employees, or plan for retirements well in advance.",
  ],
  definitions: [
    {
      term: "Workforce Planning",
      definition:
        "The process of analyzing and forecasting an organization's talent supply and demand to ensure the right people, with the right skills, are in place when needed.",
    },
    {
      term: "Talent Pipeline",
      definition:
        "A pool of pre-identified, partially prepared candidates (internal or external) for anticipated future roles.",
    },
    {
      term: "Succession Planning",
      definition:
        "Identifying and developing internal candidates to fill key roles when they become vacant.",
    },
  ],
  examples: [
    "A retail chain planning 20 new store openings next year uses workforce planning to calculate how many store managers, cashiers, and stock associates it will need, and starts building a pipeline of internal promotions six months in advance.",
    "A hospital system facing an aging nursing workforce uses workforce planning to project retirements over the next five years and begins a nurse residency program today to avoid a future shortage.",
  ],
  scenarios: [
    "Your company is launching a new product line in 8 months that will require a data analytics team that doesn't exist today. Workforce planning would involve forecasting the number and type of roles needed, assessing whether current employees could be trained into some of these roles, and determining a realistic hiring timeline given how long analytics hiring typically takes.",
  ],
  keyTakeaways: [
    "Workforce planning is proactive, not reactive — it looks ahead of the vacancy.",
    "It connects business strategy to people strategy.",
    "The core cycle is: analyze supply, forecast demand, identify gaps, build an action plan.",
    "It is broader than recruitment — recruitment is one possible action a workforce plan may call for.",
  ],
  sources: [
    { author: "SHRM", title: "Workforce Planning", url: "https://www.shrm.org" },
    { author: "CIPD", title: "Workforce planning practices", url: "https://www.cipd.org" },
  ],
};

export const MOCK_QUIZZES = {
  A: [
    {
      id: "wp-a-1",
      type: "mcq",
      question:
        "What is the primary difference between workforce planning and routine recruitment?",
      choices: [
        "Workforce planning only applies to large companies",
        "Workforce planning anticipates future talent needs, while recruitment fills a vacancy that already exists",
        "Recruitment is a long-term process while workforce planning is short-term",
        "There is no meaningful difference between the two",
      ],
      correctIndex: 1,
      explanation:
        "Workforce planning is forward-looking and anticipates needs before they become urgent; recruitment reacts to a vacancy that already exists.",
      evidence:
        "Workforce planning anticipates needs before they become urgent vacancies, giving the organization time to build talent pipelines, cross-train employees, or plan for retirements well in advance.",
      relatedSection: "Main Explanation",
    },
    {
      id: "wp-a-2",
      type: "true_false",
      question: "Workforce planning is only useful when a company is shrinking, not when it's growing.",
      choices: ["True", "False"],
      correctIndex: 1,
      explanation:
        "Workforce planning applies to growth (e.g., new market expansion) just as much as contraction.",
      evidence:
        "If a company plans to expand into a new market next year, workforce planning asks: what roles will that require, do we have those skills internally, and how long will it take to build or acquire them?",
      relatedSection: "Main Explanation",
    },
    {
      id: "wp-a-3",
      type: "mcq",
      question: "Which of the following is the correct order of the workforce planning cycle described in the topic?",
      choices: [
        "Forecast demand → Build action plan → Analyze supply → Identify gaps",
        "Analyze supply → Forecast demand → Identify gaps → Build action plan",
        "Identify gaps → Analyze supply → Build action plan → Forecast demand",
        "Build action plan → Identify gaps → Forecast demand → Analyze supply",
      ],
      correctIndex: 1,
      explanation:
        "The topic describes four stages in this order: analyze current supply, forecast future demand, identify gaps, then build an action plan.",
      evidence:
        "A typical workforce planning cycle has four stages: (1) analyzing current workforce supply... (2) forecasting future demand... (3) identifying gaps... and (4) building an action plan...",
      relatedSection: "Main Explanation",
    },
    {
      id: "wp-a-4",
      type: "scenario",
      question:
        "A hospital system notices that a large share of its nursing staff will reach retirement age within five years. According to the topic, what is the workforce-planning-aligned response?",
      choices: [
        "Wait until nurses actually retire, then post the open positions",
        "Begin building a pipeline today, such as a nurse residency program, to avoid a future shortage",
        "Reduce the number of nursing positions to save costs",
        "Transfer the responsibility entirely to the recruitment team with no advance planning",
      ],
      correctIndex: 1,
      explanation:
        "The hospital example shows workforce planning means acting years ahead of the actual vacancy, not waiting for it.",
      evidence:
        "A hospital system facing an aging nursing workforce uses workforce planning to project retirements over the next five years and begins a nurse residency program today to avoid a future shortage.",
      relatedSection: "Examples",
    },
    {
      id: "wp-a-5",
      type: "sjt",
      question:
        "You're an HR business partner. Your CEO announces a new product line launching in 8 months that will need a data analytics team that doesn't exist in the company today. What is the most workforce-planning-aligned first step?",
      choices: [
        "Immediately post 10 job ads for analytics roles without further analysis",
        "Assess whether current employees could be trained into some of these roles and build a realistic hiring timeline alongside that",
        "Tell the CEO the timeline is impossible and the launch should be delayed",
        "Do nothing until the launch date approaches",
      ],
      correctIndex: 1,
      explanation:
        "The topic's scenario emphasizes assessing internal training potential alongside hiring, not just reflexively posting job ads.",
      evidence:
        "Workforce planning would involve forecasting the number and type of roles needed, assessing whether current employees could be trained into some of these roles, and determining a realistic hiring timeline given how long analytics hiring typically takes.",
      relatedSection: "Scenarios",
    },
  ],
  B: [
    {
      id: "wp-b-1",
      type: "mcq",
      question: "According to the topic, what does workforce planning connect?",
      choices: [
        "Payroll to benefits",
        "Business strategy to people strategy",
        "Recruitment to onboarding",
        "Marketing to sales",
      ],
      correctIndex: 1,
      explanation: "The topic states workforce planning connects business strategy to people strategy.",
      evidence: "At its core, workforce planning connects business strategy to people strategy.",
      relatedSection: "Main Explanation",
    },
    {
      id: "wp-b-2",
      type: "true_false",
      question: "A talent pipeline, as defined in the topic, consists only of external candidates.",
      choices: ["True", "False"],
      correctIndex: 1,
      explanation: "The definition explicitly includes internal or external candidates.",
      evidence:
        "Talent Pipeline: A pool of pre-identified, partially prepared candidates (internal or external) for anticipated future roles.",
      relatedSection: "Definitions",
    },
    {
      id: "wp-b-3",
      type: "mcq",
      question: "In the retail chain example, what did the company do six months before opening 20 new stores?",
      choices: [
        "Nothing, since recruitment would handle it later",
        "Started building a pipeline of internal promotions",
        "Cancelled the expansion plan",
        "Outsourced all store management roles",
      ],
      correctIndex: 1,
      explanation: "The example states the company started building an internal promotion pipeline six months ahead.",
      evidence:
        "A retail chain planning 20 new store openings next year uses workforce planning to calculate how many store managers, cashiers, and stock associates it will need, and starts building a pipeline of internal promotions six months in advance.",
      relatedSection: "Examples",
    },
    {
      id: "wp-b-4",
      type: "scenario",
      question:
        "A mid-size company has no formal workforce plan and is reacting to each vacancy only after an employee resigns. Based on the topic, what risk does this create?",
      choices: [
        "No risk, this is how workforce planning is meant to work",
        "The company may lack people or skills to execute strategic plans on time",
        "The company will automatically have a talent pipeline",
        "Recruitment costs will always decrease",
      ],
      correctIndex: 1,
      explanation:
        "The topic explains that without forward planning, strategic plans can stall due to lacking people to execute them.",
      evidence:
        "Without this step, strategic plans can stall simply because the organization lacks the people to execute them.",
      relatedSection: "Main Explanation",
    },
    {
      id: "wp-b-5",
      type: "sjt",
      question:
        "Your organization is discussing succession planning for a Head of Finance role that the current leader plans to retire from in three years. What is the most aligned action per the topic's definition of succession planning?",
      choices: [
        "Wait until the leader actually leaves before considering candidates",
        "Begin identifying and developing internal candidates now",
        "Assume the role will not need to be filled",
        "Only consider external hires when the time comes",
      ],
      correctIndex: 1,
      explanation: "This matches the topic's definition of succession planning directly.",
      evidence:
        "Succession Planning: Identifying and developing internal candidates to fill key roles when they become vacant.",
      relatedSection: "Definitions",
    },
  ],
};
