import { GoogleGenAI } from "@google/genai";

// Initialize Gemini
// Note: In a real production app, this call would likely happen on a backend proxy to protect the key.
// Since we are simulating a client-only architecture as requested:
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

export const geminiService = {
  /**
   * Generates a custom mnemonic for a Kanji
   */
  generateMnemonic: async (kanji: string, meaning: string): Promise<string> => {
    if (!apiKey) return "API Key missing. Please configure environment.";

    try {
      const model = "gemini-2.5-flash";
      const prompt = `Create a short, funny, and memorable mnemonic (memory aid) for the Japanese Kanji "${kanji}" which means "${meaning}". Keep it under 25 words.`;
      
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      return response.text || "Could not generate mnemonic.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "AI is taking a nap. Try again later.";
    }
  },

  /**
   * Generates a context explanation or quiz hint
   */
  explainKanji: async (kanji: string, component: string): Promise<string> => {
    if (!apiKey) return "API Key missing.";

    try {
      const model = "gemini-2.5-flash";
      const prompt = `Explain the origin or etymology of the Kanji part "${component}" in the character "${kanji}" simply for a beginner learner. Max 2 sentences.`;

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      return response.text || "No explanation found.";
    } catch (error) {
      console.error(error);
      return "Could not fetch explanation.";
    }
  }
};