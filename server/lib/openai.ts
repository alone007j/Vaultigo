import OpenAI from "openai";

// Initialize the OpenAI API with our key
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

// Default model to use for text-based operations
// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const defaultModel = "gpt-4o";

// Function to generate a response from OpenAI
export async function generateOpenAIResponse(
  prompt: string,
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    systemMessage?: string;
  } = {}
) {
  try {
    // Set default values for options
    const model = options.model || defaultModel;
    const temperature = options.temperature || 0.7;
    const maxTokens = options.maxTokens || 500;
    const systemMessage = options.systemMessage || "You are a helpful assistant.";

    // Generate content
    const completion = await openai.chat.completions.create({
      model,
      temperature,
      max_tokens: maxTokens,
      messages: [
        {
          role: "system",
          content: systemMessage,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const response = completion.choices[0].message.content || "";

    return {
      success: true,
      content: response,
    };
  } catch (error: any) {
    console.error("Error generating response from OpenAI:", error);
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
  const systemMessage = "You are a file analysis assistant. Analyze the provided content thoroughly and respond to the user's instruction.";
  const prompt = `${instruction}\n\nContent: ${content}`;
  
  return generateOpenAIResponse(prompt, { 
    systemMessage,
    maxTokens 
  });
}

// Function for summarizing documents
export async function summarizeDocument(content: string) {
  const systemMessage = "You are a document summarization assistant. Create a concise summary that captures the key points of the document.";
  const prompt = `Please provide a concise summary of the following document:\n\n${content}`;
  
  return generateOpenAIResponse(prompt, { 
    systemMessage,
    maxTokens: 300,
    temperature: 0.3 
  });
}

// Function for searching within files by semantic meaning
export async function searchFilesSemantics(query: string, filesContent: { name: string; content: string }[]) {
  try {
    const systemMessage = "You are a search assistant that analyzes file content and determines relevance to a search query. Return your results in JSON format only.";
    
    const prompt = `I need to find files related to: "${query}"
    
Here are the files and their contents:
${filesContent.map(file => `FILENAME: ${file.name}\nCONTENT: ${file.content}\n---`).join("\n")}

Analyze each file's relevance to the query and return a JSON array of objects with the following properties:
- filename: the name of the file
- relevance: a number from 0 to 1 indicating how relevant the file is to the query
- reason: a brief explanation of why this file is relevant

Format your response as valid JSON like this:
{ "results": [ { "filename": "example.txt", "relevance": 0.95, "reason": "Contains direct information about the query topic" } ] }`;

    // Use structured format for better JSON responses
    const response = await openai.chat.completions.create({
      model: defaultModel,
      temperature: 0.2,
      max_tokens: 1000,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system", 
          content: systemMessage
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const text = response.choices[0].message.content || "";
    
    try {
      const parsedResults = JSON.parse(text);
      return {
        success: true,
        results: parsedResults.results,
      };
    } catch (parseError: any) {
      console.error("Error parsing JSON from OpenAI:", parseError);
      return {
        success: false,
        error: "Failed to parse search results: " + parseError.message,
        rawResponse: text,
      };
    }
  } catch (error: any) {
    console.error("Error searching files with OpenAI:", error);
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
    // Create message array for the chat
    const messages: Array<{ role: string; content: string }> = [
      { 
        role: "system", 
        content: "You are an AI assistant for a cloud storage platform called Vaultigo. Your purpose is to help users manage their files, organize storage, and find information." + 
                 (filesContext ? `\n\nHere is information about the user's files that might be relevant:\n${filesContext}` : "")
      }
    ];
    
    // Add chat history
    if (chatHistory && chatHistory.length > 0) {
      chatHistory.forEach(msg => {
        messages.push({ 
          role: msg.role, 
          content: msg.content 
        });
      });
    }
    
    // Add current user message
    messages.push({ role: "user", content: userMessage });
    
    // Generate the response
    const completion = await openai.chat.completions.create({
      model: defaultModel,
      temperature: 0.7,
      max_tokens: 800,
      messages: messages as any,
    });

    const response = completion.choices[0].message.content || "";
    
    return {
      success: true,
      content: response,
    };
  } catch (error: any) {
    console.error("Error in chat with OpenAI:", error);
    return {
      success: false,
      error: error.message || "Failed to generate chat response",
    };
  }
}

export default {
  generateOpenAIResponse,
  analyzeFileContent,
  summarizeDocument,
  searchFilesSemantics,
  chatAboutFiles,
};