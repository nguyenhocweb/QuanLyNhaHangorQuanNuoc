import { genAI } from "../../../../config/ai.config.js";
export const embedText = async (text) => {
  try {
    const embeddingModel = genAI.getGenerativeModel({
      model: "gemini-embedding-001",
    });

    const result = await embeddingModel.embedContent(text);
    const values = result?.embedding?.values;
    if (!values || !Array.isArray(values) || values.length === 0) {
      throw new Error("Embedding failed or empty");
    }

    return values;
  } catch (error) {
    console.error("❌ Embedding Error:", error.message);
    return null; // cực kỳ quan trọng
  }
};