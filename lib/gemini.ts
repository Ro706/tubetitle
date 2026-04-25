// Look for the key in multiple possible locations
const GEMINI_API_KEY =
  process.env.EXPO_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

export interface GeneratedTitle {
  text: string;
  copyLabel: string;
}

export async function generateTitles(
  userInput: string,
): Promise<GeneratedTitle[]> {
  const FINAL_KEY = GEMINI_API_KEY;

  if (!FINAL_KEY) {
    console.warn(
      "API KEY MISSING: Ensure EXPO_PUBLIC_GEMINI_API_KEY is set in your .env file",
    );
    return [{ text: "Error: API Key Missing", copyLabel: "copy" }];
  }

  const PRIMARY_MODEL = "gemini-flash-latest";
  const FALLBACK_MODEL = "gemini-pro-latest";

  const prompt = `You are an expert in YouTube growth, content strategy, and mobile UI design.

Your task is to generate high-performing YouTube title suggestions and return them in a format optimized for direct use in a mobile application UI.

---

### 🎯 Objective
Generate 3 to 5 highly engaging and clickable YouTube titles based on the provided user input.

---

### 🧠 Title Guidelines
- Maximum length: 70 characters
- Optimize for high CTR (curiosity, emotion, urgency, intrigue)
- Avoid generic or vague phrasing
- Use strong/power words where appropriate
- Ensure titles are clean, readable, and platform-ready

---

### 🎨 Output Structure (MANDATORY)
Return the response strictly in JSON format.

Each title object must include:
- "text": the generated title
- "copyLabel": must always be "copy"

---

### 📦 Expected Output Format
{
  "titles": [
    { "text": "Title 1", "copyLabel": "copy" },
    { "text": "Title 2", "copyLabel": "copy" },
    { "text": "Title 3", "copyLabel": "copy" }
  ]
}

---

### 🚫 Constraints
- Do NOT return plain text
- Do NOT include explanations, notes, or comments
- Do NOT add extra fields
- Output must be valid JSON only
- Ensure consistency for seamless UI rendering

---

### 📥 Input
"${userInput}"`;

  const fetchTitles = async (model: string) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${FINAL_KEY}`;
    return await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });
  };

  try {
    let response = await fetchTitles(PRIMARY_MODEL);

    if (!response.ok) {
      response = await fetchTitles(FALLBACK_MODEL);
    }

    if (!response.ok) {
      const errorData = await response.json();
      console.error(
        "GEMINI API ERROR:",
        response.status,
        JSON.stringify(errorData, null, 2),
      );
      return [];
    }

    const data = await response.json();
    let resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!resultText) return [];

    resultText = resultText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    try {
      const parsed = JSON.parse(resultText);
      return parsed.titles || [];
    } catch (e) {
      console.error("Parse Error:", e);
      return [];
    }
  } catch (error) {
    console.error("NETWORK ERROR:", error);
    return [];
  }
}
