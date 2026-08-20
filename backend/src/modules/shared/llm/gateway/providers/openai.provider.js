export class OpenAIProvider {
  static async generateContent(apiKey, modelName, systemPrompt, userMessage, tools) {
    console.warn("[MOCK] OpenAIProvider is currently a mock. Please install 'openai' SDK and implement adapter.");
    throw new Error("OpenAI Provider chưa được cấu hình.");
  }

  static async sendToolResponse(chatSession, apiResponses) {
    throw new Error("OpenAI Provider chưa được cấu hình.");
  }
}
