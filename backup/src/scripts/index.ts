import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const chatSession = {
  async sendMessage(prompt: string) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      return {
        response: {
          text: () => text
        }
      };
    } catch (error) {
      console.error("Error in chat session:", error);
      throw new Error("Failed to get response from AI. Please try again.");
    }
  }
};
