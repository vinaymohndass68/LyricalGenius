import { GoogleGenAI, Type } from "@google/genai";
import { SongRequest, GeneratedSong } from "../types";

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API_KEY is not defined in the environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey });

export const generateSongLyrics = async (request: SongRequest): Promise<GeneratedSong> => {
  try {
    const model = "gemini-2.5-flash";
    
    const prompt = `
      Create a song based on the following details:
      Situation: ${request.situation}
      Mood: ${request.mood}
      Occasion: ${request.occasion}
      Speed/Tempo: ${request.speed}
      Language: ${request.language}

      Requirements:
      1. Generate a catchy Title.
      2. Provide a detailed Style Description (MAX 200 characters). You MUST explicitly describe:
         - The specific musical genre.
         - The instrumentation (e.g., "lo-fi hip hop beats", "distorted electric guitars", "sweeping orchestral strings").
         - The vocal style (e.g., "autotuned trap vocals", "operatic soprano", "whispered intimate vocals").
         - Ensure it fits within 200 characters.
      3. Write the full Lyrics. If the language is not English, you may provide the lyrics in the native script or transliterated (Romanized) depending on what is most common for that language context, but native script is preferred for readability if valid.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: "The title of the song",
            },
            styleDescription: {
              type: Type.STRING,
              description: "A detailed style description including genre, specific instruments, and vocal style (max 200 chars)",
            },
            lyrics: {
              type: Type.STRING,
              description: "The complete lyrics of the song, formatted with line breaks",
            },
          },
          required: ["title", "styleDescription", "lyrics"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response generated from AI.");
    }

    const songData: GeneratedSong = JSON.parse(text);
    return songData;

  } catch (error) {
    console.error("Error generating song:", error);
    throw new Error("Failed to generate lyrics. Please try again.");
  }
};