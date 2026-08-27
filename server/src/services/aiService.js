import { GoogleGenAI } from "@google/genai";
import DailyFact from "../models/DailyFact.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const getDailyFact = async () => {
  const today = new Date().toISOString().split("T")[0];

  const existingFact = await DailyFact.findOne({
    date: today,
  });

  if (existingFact) {
    return existingFact;
  }

  const prompt = `
Generate ONE interesting astronomy or astrophysics fun fact.

Rules:
- Maximum 70 words.
- Scientifically accurate.
- Easy for students.
- No numbering.
- No markdown.
- No title.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,
  });

  const fact = response.text.trim();

  const savedFact = await DailyFact.create({
    date: today,
    fact,
  });

  return savedFact;
};