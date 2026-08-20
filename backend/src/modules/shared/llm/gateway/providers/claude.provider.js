export class ClaudeProvider {
  static async generateContent(apiKey, modelName, systemPrompt, userMessage, tools) {
    console.warn("[MOCK] ClaudeProvider is currently a mock. Please install '@anthropic-ai/sdk' and implement adapter.");
    throw new Error("Claude Provider chưa được cấu hình.");
  }

  static async sendToolResponse(chatSession, apiResponses) {
    throw new Error("Claude Provider chưa được cấu hình.");
  }
}
