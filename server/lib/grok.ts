import OpenAI from "openai";

// Setting up XAI client using OpenAI's compatible API client
const xai = new OpenAI({ 
    baseURL: "https://api.x.ai/v1", 
    apiKey: process.env.XAI_API_KEY || "" 
});

// Function to generate a response from Grok
export async function generateGrokResponse(
  prompt: string,
  options: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
    responseFormat?: { type: "json_object" } | undefined;
  } = {}
) {
  try {
    // Set default values for options
    const model = options.model || "grok-2-1212";
    const maxTokens = options.maxTokens || 500;
    const temperature = options.temperature || 0.7;

    // Create the request parameters
    const requestParams: any = {
      model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: maxTokens,
      temperature,
    };
    
    // Add response format if specified
    if (options.responseFormat) {
      requestParams.response_format = { type: "json_object" };
    }

    const response = await xai.chat.completions.create(requestParams);

    return {
      success: true,
      content: response.choices[0].message.content,
      usage: response.usage,
    };
  } catch (error: any) {
    console.error("Error generating response from Grok:", error);
    return {
      success: false,
      error: error.message || "Failed to generate response",
    };
  }
}

// Function to analyze file content
export async function analyzeFileContent(
  content: string,
  instruction: string,
  maxTokens = 500
) {
  const prompt = `${instruction}\n\nContent: ${content}`;
  return generateGrokResponse(prompt, { maxTokens });
}

// Function for summarizing documents
export async function summarizeDocument(content: string) {
  return analyzeFileContent(
    content,
    "Please provide a concise summary of the following document:",
    300
  );
}

// Function for searching within files by semantic meaning
export async function searchFilesSemantics(query: string, filesContent: { name: string; content: string }[]) {
  try {
    const prompt = `I need to find files related to: "${query}"
    
Here are the files and their contents:
${filesContent.map(file => `FILENAME: ${file.name}\nCONTENT: ${file.content}\n---`).join("\n")}

Return a JSON array of objects with the following properties:
- filename: the name of the file
- relevance: a number from 0 to 1 indicating how relevant the file is to the query
- reason: a brief explanation of why this file is relevant

Format the response as a valid JSON object like this:
{ "results": [ { "filename": "example.txt", "relevance": 0.95, "reason": "Contains direct information about the query topic" } ] }`;

    const response = await generateGrokResponse(prompt, {
      responseFormat: { type: "json_object" },
      maxTokens: 1000,
    });

    if (!response.success || !response.content) {
      return { success: false, error: response.error || "Failed to search files" };
    }

    return {
      success: true,
      results: JSON.parse(response.content).results,
    };
  } catch (error: any) {
    console.error("Error searching files with Grok:", error);
    return {
      success: false,
      error: error.message || "Failed to search files",
    };
  }
}

// Function for AI chat conversations about files
export async function chatAboutFiles(
  userMessage: string,
  chatHistory: Array<{ role: "user" | "assistant"; content: string }>,
  filesContext?: string
) {
  try {
    // Prepare the messages array
    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [];
    
    // Add system message with context about files if available
    if (filesContext) {
      messages.push({
        role: "system",
        content: `You are an AI assistant for a cloud storage platform called Vaultigo. 
        Your purpose is to help users manage their files, organize storage, and find information.
        Here is information about the user's files that might be relevant:
        ${filesContext}`,
      });
    } else {
      messages.push({
        role: "system",
        content: `You are an AI assistant for a cloud storage platform called Vaultigo. 
        Your purpose is to help users manage their files, organize storage, and find information.`,
      });
    }
    
    // Add chat history
    chatHistory.forEach(msg => messages.push(msg));
    
    // Add the current user message
    messages.push({ role: "user", content: userMessage });
    
    const response = await xai.chat.completions.create({
      model: "grok-2-1212",
      messages: messages,
      temperature: 0.7,
      max_tokens: 800,
    });

    return {
      success: true,
      content: response.choices[0].message.content,
    };
  } catch (error: any) {
    console.error("Error in chat with Grok:", error);
    return {
      success: false,
      error: error.message || "Failed to generate chat response",
    };
  }
}

export default {
  generateGrokResponse,
  analyzeFileContent,
  summarizeDocument,
  searchFilesSemantics,
  chatAboutFiles,
};