
const { GoogleGenAI, Type } = require("@google/genai");
const { z } = require("zod");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

const interviewReportSchema = z.object({
    matchScore: z.number().min(0).max(100),

    technicalQuestions: z.array(z.object({
        question: z.string(),
        intention: z.string(),
        answer: z.string()
    })),

    behavioralQuestions: z.array(z.object({
        question: z.string(),
        intention: z.string(),
        answer: z.string()
    })),

    skillGaps: z.array(z.object({
        skill: z.string(),
        severity: z.enum(["low", "medium", "high"])
    })),

    preparationPlan: z.array(z.object({
        day: z.number().int().min(1).max(30),
        focus: z.string(),
        tasks: z.array(z.string())
    })).min(1)
});

// Gemini structured output schema
const geminiResponseSchema = {
    type: Type.OBJECT,
    properties: {
        matchScore: {
            type: Type.NUMBER
        },
        technicalQuestions: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING },
                    intention: { type: Type.STRING },
                    answer: { type: Type.STRING }
                },
                required: ["question", "intention", "answer"]
            }
        },
        behavioralQuestions: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING },
                    intention: { type: Type.STRING },
                    answer: { type: Type.STRING }
                },
                required: ["question", "intention", "answer"]
            }
        },
        skillGaps: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    skill: { type: Type.STRING },
                    severity: {
                        type: Type.STRING,
                        enum: ["low", "medium", "high"]
                    }
                },
                required: ["skill", "severity"]
            }
        },
        preparationPlan: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    day: { type: Type.INTEGER },
                    focus: { type: Type.STRING },
                    tasks: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    }
                },
                required: ["day", "focus", "tasks"]
            }
        }
    },
    required: [
        "matchScore",
        "technicalQuestions",
        "behavioralQuestions",
        "skillGaps",
        "preparationPlan"
    ]
};

async function generateInterviewReport({
    resume,
    selfDescription,
    jobDescription
}) {
    try {
        const prompt = `
You are an expert technical interviewer and career preparation
advisor. Your task is to generate a detailed, accurate and
personalized interview preparation report.

CANDIDATE RESUME:
${resume}

CANDIDATE SELF-INTRODUCTION:
${selfDescription}

JOB DESCRIPTION:
${jobDescription}

STRICT OUTPUT REQUIREMENTS:

Return ONE JSON object that follows the exact structure
defined in the response schema.

1. MATCH SCORE
- Generate a realistic matchScore between 0 and 100.
- Evaluate the candidate's demonstrated skills, projects
  and qualifications against the job description.
- Do not give an arbitrary score.

2. TECHNICAL QUESTIONS
- Generate 5 to 8 relevant technical questions.
- Every question MUST be an object containing exactly:
  question, intention and answer.
- The intention must explain what the interviewer
  wants to evaluate.
- The answer must provide a detailed, technically
  correct sample answer with key concepts and examples.
- Questions must be relevant to the candidate's actual
  projects, skills and the job description.
- Do not create separate technicalAnswers or
  technicalIntentions arrays.
- Do not return questions as strings.

3. BEHAVIORAL QUESTIONS
- Generate 5 to 7 relevant behavioral questions.
- Every question MUST be an object containing exactly:
  question, intention and answer.
- Give a practical sample answer for each question.
- Use the candidate's actual background and projects.
- Do not invent personal experiences or achievements.
- Where personal details are unavailable, provide
  an answer framework instead of fabricating an event.
- Do not create separate behavioralAnswers or
  behavioralIntentions arrays.
- Do not return questions as strings.

4. SKILL GAPS
- Identify 2 to 5 relevant skill gaps, if any exist.
- Only identify gaps supported by the comparison
  between the resume and job description.
- Each item MUST be an object containing exactly:
  skill and severity.
- severity must be one of: low, medium, high.
- Do not create separate severityLevels arrays.
- Do not return skills as strings.
- If no meaningful gaps exist, return an empty array.

5. SEVEN-DAY PREPARATION PLAN
- Generate EXACTLY 7 preparation-plan objects.
- Each object represents ONE complete day.
- Every object MUST contain exactly:
  day, focus and tasks.
- day must be an integer from 1 to 7.
- focus must be the main topic for that particular day.
- tasks MUST be an array of 3 to 5 specific,
  actionable preparation activities.
- Every task must be a string describing an actual
  activity the candidate can perform.
- Do not return only day numbers.
- Do not put the focus or tasks in separate arrays.
- Do not create preparationDays, preparationFocus
  or preparationTasks fields.
- Do not combine all seven days into a single object.
- Each day must have its own focus and its own tasks.
- Arrange the seven days in a logical learning sequence,
  taking the identified skill gaps into account.
- Include revision and mock interview practice
  in the final days.

EXACT STRUCTURAL EXAMPLE:

{
  "matchScore": 85,
  "technicalQuestions": [
    {
      "question": "What is the difference between an interface and an abstract class in Java?",
      "intention": "To assess the candidate's understanding of Java OOP.",
      "answer": "An interface defines a contract that implementing classes must follow. An abstract class can contain both abstract and concrete methods."
    }
  ],
  "behavioralQuestions": [
    {
      "question": "How do you handle a difficult technical problem?",
      "intention": "To assess problem-solving ability and persistence.",
      "answer": "Explain how you identify the problem, break it into smaller parts, investigate possible solutions and verify the final fix."
    }
  ],
  "skillGaps": [
    {
      "skill": "SQL joins",
      "severity": "medium"
    }
  ],
  "preparationPlan": [
    {
      "day": 1,
      "focus": "Java and OOP fundamentals",
      "tasks": [
        "Revise encapsulation, inheritance, polymorphism and abstraction.",
        "Practice 15 Java OOP interview questions.",
        "Write small Java programs demonstrating inheritance and interfaces."
      ]
    },
    {
      "day": 2,
      "focus": "Data Structures and Algorithms",
      "tasks": [
        "Revise arrays, strings and hashing.",
        "Solve five DSA problems.",
        "Analyze the time and space complexity of each solution."
      ]
    },
    {
      "day": 3,
      "focus": "DBMS and SQL",
      "tasks": [
        "Revise primary keys and foreign keys.",
        "Practice SELECT, JOIN and GROUP BY queries.",
        "Study database normalization with examples."
      ]
    },
    {
      "day": 4,
      "focus": "Backend development",
      "tasks": [
        "Revise Express routing and middleware.",
        "Practice designing REST APIs.",
        "Revise JWT authentication and error handling."
      ]
    },
    {
      "day": 5,
      "focus": "Frontend and project revision",
      "tasks": [
        "Revise React hooks and component state.",
        "Review the architecture of your projects.",
        "Practice explaining your project contributions."
      ]
    },
    {
      "day": 6,
      "focus": "Skill gap revision",
      "tasks": [
        "Revise the identified skill gaps.",
        "Solve technical questions related to the job description.",
        "Practice explaining difficult technical concepts aloud."
      ]
    },
    {
      "day": 7,
      "focus": "Mock interview and final revision",
      "tasks": [
        "Practice a complete technical mock interview.",
        "Practice behavioral questions using real experiences.",
        "Review important concepts and revisit incorrect answers."
      ]
    }
  ]
}

The example above illustrates the required structure.
Generate content specific to the supplied resume
and job description instead of copying the example.

FINAL VALIDATION RULES:
- Return exactly these five top-level keys:
  matchScore, technicalQuestions, behavioralQuestions,
  skillGaps and preparationPlan.
- Every question must include its own intention and answer.
- Every preparation day must include its own focus and tasks.
- preparationPlan must contain exactly seven objects.
- Do not split nested information into separate arrays.
- Do not add candidateName, position, company, summary,
  recommendation or any other top-level fields.
- Return only valid JSON, without Markdown fences
  or explanatory text.
`;

        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash-lite",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: geminiResponseSchema
            }
        });

        const result = JSON.parse(response.text);

        // Validate the AI response before returning it
        return interviewReportSchema.parse(result);

    } catch (error) {
        console.error("Gemini API Error:", error.message);
        throw error;
    }
}

module.exports = generateInterviewReport;