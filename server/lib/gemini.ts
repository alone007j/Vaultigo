import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';

// Initialize the Gemini API with our key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Default model for most text-based operations
const defaultModel = "gemini-1.5-pro";

// Configure safety settings for content generation
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// Function to generate a response from Gemini
export async function generateGeminiResponse(
  prompt: string,
  options: {
    model?: string;
    temperature?: number;
    maxOutputTokens?: number;
  } = {}
) {
  try {
    // Set default values for options
    const model = options.model || defaultModel;
    const temperature = options.temperature || 0.7;
    const maxOutputTokens = options.maxOutputTokens || 500;

    // Get the model and create a generation config
    const geminiModel = genAI.getGenerativeModel({
      model,
      safetySettings,
      generationConfig: {
        temperature,
        maxOutputTokens,
      },
    });

    // Generate content
    const result = await geminiModel.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return {
      success: true,
      content: text,
    };
  } catch (error: any) {
    console.error("Error generating response from Gemini:", error);
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
  maxOutputTokens = 500
) {
  const prompt = `${instruction}\n\nContent: ${content}`;
  return generateGeminiResponse(prompt, { maxOutputTokens });
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

Analyze each file's relevance to the query and return a JSON array of objects with the following properties:
- filename: the name of the file
- relevance: a number from 0 to 1 indicating how relevant the file is to the query
- reason: a brief explanation of why this file is relevant

Format your response as valid JSON like this:
{ "results": [ { "filename": "example.txt", "relevance": 0.95, "reason": "Contains direct information about the query topic" } ] }

IMPORTANT: Return ONLY the JSON. No additional text before or after.`;

    // Use structured format for better JSON responses
    const model = genAI.getGenerativeModel({
      model: defaultModel,
      safetySettings,
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 1000,
      },
    });

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // Remove any markdown formatting if present (```json ... ```)
    const jsonText = text.replace(/```json|```|`/g, '').trim();

    try {
      const parsedResults = JSON.parse(jsonText);
      return {
        success: true,
        results: parsedResults.results,
      };
    } catch (parseError: any) {
      console.error("Error parsing JSON from Gemini:", parseError);
      return {
        success: false,
        error: "Failed to parse search results: " + parseError.message,
        rawResponse: text,
      };
    }
  } catch (error: any) {
    console.error("Error searching files with Gemini:", error);
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
    // Start with system context
    let contextPrompt = "You are an AI assistant for a cloud storage platform called Vaultigo. "
      + "Your purpose is to help users manage their files, organize storage, and find information.\n\n";
    
    // Add file context if available
    if (filesContext) {
      contextPrompt += `Here is information about the user's files that might be relevant:\n${filesContext}\n\n`;
    }
    
    // Build the chat history
    contextPrompt += "Previous conversation:\n";
    if (chatHistory.length > 0) {
      chatHistory.forEach(msg => {
        const role = msg.role === "user" ? "User" : "Assistant";
        contextPrompt += `${role}: ${msg.content}\n`;
      });
    }
    
    // Add the new message
    contextPrompt += `\nUser: ${userMessage}\n\nAssistant: `;
    
    // Generate the response
    const response = await generateGeminiResponse(contextPrompt, {
      temperature: 0.7,
      maxOutputTokens: 800,
    });
    
    return response;
  } catch (error: any) {
    console.error("Error in chat with Gemini:", error);
    return {
      success: false,
      error: error.message || "Failed to generate chat response",
    };
  }
}

export default {
  generateGeminiResponse,
  analyzeFileContent,
  summarizeDocument,
  searchFilesSemantics,
  chatAboutFiles,
};