// Look for the key in multiple possible locations
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

export interface GeneratedTitle {
  text: string;
  copyLabel: string;
}

export async function generateTitles(userInput: string): Promise<GeneratedTitle[]> {
  const FINAL_KEY = GEMINI_API_KEY;

  if (!FINAL_KEY) {
    console.warn("API KEY MISSING: Ensure EXPO_PUBLIC_GEMINI_API_KEY is set in your .env file");
    return [{ text: "Error: API Key Missing", copyLabel: "copy" }];
  }

  const PRIMARY_MODEL = "gemini-flash-latest"; 
  const FALLBACK_MODEL = "gemini-pro-latest";
  
  const prompt = `You are a YouTube growth expert and UI-aware AI.
Your task is to generate YouTube title suggestions and format them for a mobile app UI.

---
### 🎯 Goal
Generate 3–5 highly clickable YouTube titles based on the user's idea.

---
### 🧠 Rules for Titles
* Max 70 characters
* High CTR (curiosity, emotion, urgency)
* Avoid generic titles
* Use power words when relevant

---
### 🎨 UI FORMAT (VERY IMPORTANT)
Return the output in a structured JSON format.
Each item must contain:
* "text": the title
* "copyLabel": always "copy"

---
### 📦 Output Format (STRICT)
{
  "titles": [
    { "text": "Title 1", "copyLabel": "copy" },
    { "text": "Title 2", "copyLabel": "copy" }
  ]
}

---
### 🚫 Important Constraints
* Do NOT return plain text
* Do NOT add explanations
* Only return valid JSON
* Keep titles clean and ready for UI display

---
### 📥 Input
"${userInput}"`;

  const fetchTitles = async (model: string) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${FINAL_KEY}`;
    return await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
  };

  try {
    let response = await fetchTitles(PRIMARY_MODEL);

    if (!response.ok) {
      response = await fetchTitles(FALLBACK_MODEL);
    }

    if (!response.ok) {
      const errorData = await response.json();
      console.error("GEMINI API ERROR:", response.status, JSON.stringify(errorData, null, 2));
      return [];
    }

    const data = await response.json();
    let resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!resultText) return [];
    
    resultText = resultText.replace(/```json/g, "").replace(/```/g, "").trim();
    
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
