import { GoogleGenAI } from '@google/genai';

interface GenerationOptions {
  prompt: string;
  systemInstruction?: string;
  temperature?: number;
  apiKey?: string;
}

/**
 * Generate text using Google Gemini API or fall back gracefully
 */
export async function generateWithGemini(options: GenerationOptions): Promise<string> {
  const apiKey =
    options.apiKey ||
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    throw new Error('No Gemini API key provided');
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: options.prompt,
      config: {
        systemInstruction: options.systemInstruction || 'You are an expert NGO grant proposal writer and researcher.',
        temperature: options.temperature || 0.3,
      }
    });

    if (response && response.text) {
      return response.text;
    }
    throw new Error('Empty response received from Gemini');
  } catch (error: any) {
    console.warn('Gemini API call failed, falling back to smart synthesizer:', error.message || error);
    throw error;
  }
}
