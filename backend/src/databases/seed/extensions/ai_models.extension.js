export const aiModelsExtension = async (prisma) => {
  console.log("Seeding AiModels...");

  const MODEL_OPTIONS = {
    OPENAI: [
      'gpt-4o', 'gpt-4o-2024-08-06', 'gpt-4o-2024-05-13', 
      'gpt-4o-mini', 'gpt-4o-mini-2024-07-18', 
      'gpt-4-turbo', 'gpt-4-turbo-2024-04-09', 'gpt-4-0125-preview', 'gpt-4-1106-preview', 
      'gpt-4', 'gpt-4-32k', 
      'gpt-3.5-turbo', 'gpt-3.5-turbo-0125', 'gpt-3.5-turbo-1106', 'gpt-3.5-turbo-16k'
    ],
    GEMINI: [
      'gemini-2.5-pro', 'gemini-2.5-flash',
      'gemini-1.5-pro', 'gemini-1.5-pro-latest', 'gemini-1.5-pro-exp-0801',
      'gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-flash-8b-exp-0827',
      'gemini-1.0-pro', 'gemini-1.0-pro-vision', 'gemini-pro', 'gemini-pro-vision'
    ],
    CLAUDE: [
      'claude-3-5-sonnet-20240620', 
      'claude-3-opus-20240229', 
      'claude-3-sonnet-20240229', 
      'claude-3-haiku-20240307',
      'claude-2.1', 'claude-2.0'
    ],
    DEEPSEEK: ['deepseek-chat', 'deepseek-coder'],
    MISTRAL: [
      'mistral-large-latest', 'mistral-large-2407', 'mistral-medium-latest', 'mistral-small-latest', 
      'open-mixtral-8x22b', 'open-mixtral-8x7b', 'open-mistral-7b', 'open-mistral-nemo'
    ],
    GROQ: [
      'llama-3.1-70b-versatile', 'llama-3.1-8b-instant', 
      'llama3-70b-8192', 'llama3-8b-8192', 
      'mixtral-8x7b-32768', 'gemma2-9b-it', 'gemma-7b-it'
    ],
    COHERE: ['command-r-plus', 'command-r', 'command', 'command-light'],
    AZURE_OPENAI: ['gpt-4o', 'gpt-4o-mini', 'gpt-4', 'gpt-4-32k', 'gpt-35-turbo', 'gpt-35-turbo-16k'],
  };

  for (const [provider, models] of Object.entries(MODEL_OPTIONS)) {
    // 1. Create or get the Chatbox first
    let chatbox = await prisma.aiChatbox.findUnique({
      where: { name: provider }
    });
    if (!chatbox) {
      chatbox = await prisma.aiChatbox.create({
        data: {
          name: provider,
          isActive: true
        }
      });
    }

    for (const modelName of models) {
      const displayName = `${provider} ${modelName}`;
      await prisma.aiModel.create({
        data: {
          name: modelName,
          displayName: displayName,
          chatboxId: chatbox.id
        }
      });
    }
  }

  console.log("AiModels seeded successfully!");
};
