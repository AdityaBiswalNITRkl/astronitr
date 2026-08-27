import axios from "axios";
import DailyNews from "../models/DailyNews.js";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const getDailyNews = async () => {
  const today = new Date().toISOString().split("T")[0];

  const existing = await DailyNews.findOne({
    date: today,
  });

  if (existing) return existing;

  const response = await axios.get(
    "https://newsapi.org/v2/everything",
    {
      params: {
        q: "astronomy OR astrophysics OR NASA OR space",
        language: "en",
        sortBy: "publishedAt",
        pageSize: 5,
        apiKey: process.env.NEWS_API_KEY,
      },
    }
  );

  const articles = [];

  for (const article of response.data.articles) {
    const prompt = `
Summarize this astronomy news in exactly 2 sentences.

Title:
${article.title}

Description:
${article.description}
`;

    const summary = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    articles.push({
      title: article.title,
      summary: summary.text,
      image: article.urlToImage,
      url: article.url,
      source: article.source?.name,
      publishedAt: article.publishedAt,
    });
  }

  return await DailyNews.create({
    date: today,
    articles,
  });
};