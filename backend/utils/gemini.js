import { GoogleGenAI } from "@google/genai";

const getClient = () => {

  if (!process.env.GEMINI_API_KEY) {

    throw new Error(
      "GEMINI_API_KEY is missing in .env"
    );

  }

  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
  });

};


export const askGemini = async (
  prompt
) => {

  const ai = getClient();

  const models = [
    "gemini-2.5-flash",
    "gemini-3.5-flash-lite"
  ];
  let lastError;

  for (const model of models) {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt
        });

        return response.text || "No AI response generated.";
      } catch (error) {
        lastError = error;
        const status = Number(error.status || error.code);
        const isTemporary =
          status === 429 ||
          status === 503 ||
          /UNAVAILABLE|RESOURCE_EXHAUSTED|high demand/i.test(error.message || "");

        if (!isTemporary || attempt === 1) {
          break;
        }

        await new Promise((resolve) => setTimeout(resolve, 800 * (attempt + 1)));
      }
    }
  }

  throw lastError;

};


export const analyzeIssueWithAI = async ({
  title,
  description,
  location
}) => {

  const prompt = `

You are an AI assistant for a college
campus problem management system called SmartCampus.

Analyze the following campus problem.

Return ONLY valid JSON with these keys:

category
priority
summary
suggestedAction
reason

Allowed category values:

Wi-Fi / Network
Classroom
Hostel
Library
Cleanliness
Electrical
Water
Other

Allowed priority values:

Low
Medium
High
Critical

Rules:

- Choose exactly one allowed category.
- Choose exactly one allowed priority.
- Keep summary short and factual.
- suggestedAction should give practical next steps.
- reason should briefly explain the priority.
- Do not invent facts.

Problem title:
${title}

Problem description:
${description}

Location:
${location}

`;


  const raw =
    await askGemini(prompt);


  const cleaned =
    raw
      .replace(
        /^```json\s*/i,
        ""
      )
      .replace(
        /\s*```$/i,
        ""
      )
      .trim();


  try {

    return JSON.parse(cleaned);

  } catch {

    return {

      category: "Other",

      priority: "Medium",

      summary:
        cleaned.slice(0, 500),

      suggestedAction:
        "Review the issue manually and assign it to the relevant staff member.",

      reason:
        "AI returned an unexpected format, so manual review is recommended."

    };

  }

};