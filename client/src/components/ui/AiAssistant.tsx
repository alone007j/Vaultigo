import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Send, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AiAssistantProps {
  onClose: () => void;
}

interface Message {
  id: string;
  isUser: boolean;
  text: string;
  typing?: boolean;
}

export default function AiAssistant({ onClose }: AiAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      isUser: false,
      text: "Hi there! I'm your AI assistant. How can I help you with your files today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isMinimized) {
      inputRef.current?.focus();
    }
  }, [isMinimized]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: `user-${Date.now()}`,
      isUser: true,
      text: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Add AI typing indicator
    const typingId = `ai-typing-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id: typingId, isUser: false, text: "", typing: true },
    ]);

    try {
      // Format chat history for the API
      const chatHistory = messages
        .filter(msg => !msg.typing)
        .map(msg => ({
          role: msg.isUser ? "user" : "assistant",
          content: msg.text
        }));

      // Call the AI API
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          chatHistory
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const data = await response.json();
      
      // Remove typing indicator and add AI response
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== typingId).concat({
          id: `ai-${Date.now()}`,
          isUser: false,
          text: data.content || getFallbackResponse(input),
        })
      );
    } catch (error) {
      console.error("Error getting AI response:", error);
      
      // If API fails, fall back to local response
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== typingId).concat({
          id: `ai-${Date.now()}`,
          isUser: false,
          text: getFallbackResponse(input),
        })
      );
    }
  };

  // Fallback responses when the API is unavailable
  const getFallbackResponse = (userInput: string) => {
    // Simple pattern matching for demo purposes
    const input = userInput.toLowerCase();
    
    if (input.includes("file") && (input.includes("find") || input.includes("search"))) {
      return "I can help you find files. What type of files are you looking for? Documents, images, videos, or something else?";
    } else if (input.includes("organize") || input.includes("sort")) {
      return "I can help organize your files by type, date, or content. Would you like me to suggest a folder structure for your current files?";
    } else if (input.includes("space") || input.includes("storage")) {
      return "You're currently using 5.3 GB out of your 10 GB storage. Would you like suggestions on how to optimize your storage space?";
    } else if (input.includes("hello") || input.includes("hi")) {
      return "Hello! I'm your Vaultigo AI assistant. I can help you find files, organize your storage, summarize documents, and more. What would you like help with today?";
    } else if (input.includes("summarize") || input.includes("summary")) {
      return "I can summarize your documents. Which document would you like me to summarize?";
    } else if (input.includes("upgrade") || input.includes("plan")) {
      return "Vaultigo offers three plans: Free (10GB), Pro (1TB at $9.99/month), and Elite (5TB at $24.99/month). Each tier offers additional features like more AI capabilities and external storage connections. Would you like more details on any specific plan?";
    } else if (input.includes("thank")) {
      return "You're welcome! Is there anything else I can help you with?";
    } else {
      return "I'm here to help you manage your files more efficiently. You can ask me to find files, organize your storage, summarize documents, or suggest storage optimizations. What would you like to do?";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleClearConversation = () => {
    setMessages([
      {
        id: "welcome",
        isUser: false,
        text: "Hi there! I'm your AI assistant. How can I help you with your files today?",
      },
    ]);
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-primary-800/90 backdrop-blur-md rounded-2xl border border-muted/30 shadow-xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-muted/30">
        <div className="flex items-center">
          <div className="ai-pulse bg-primary-900 rounded-full w-8 h-8 flex items-center justify-center mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-accent-cyan"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
              <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
              <path d="M15 9.5a3.5 3.5 0 0 0-3.5-3.5" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-foreground">AI Assistant</h3>
            <div className="flex items-center">
              <span className="bg-green-500 w-1.5 h-1.5 rounded-full"></span>
              <span className="text-xs text-muted-foreground ml-1">Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={toggleMinimize}>
            {isMinimized ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Messages area */}
            <div className="p-4 h-80 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start ${
                      message.isUser ? "justify-end" : ""
                    }`}
                  >
                    {!message.isUser && (
                      <div className="ai-pulse bg-primary-900 rounded-full w-8 h-8 flex items-center justify-center shrink-0 mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-accent-cyan"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 22a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
                          <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
                          <path d="M15 9.5a3.5 3.5 0 0 0-3.5-3.5" />
                        </svg>
                      </div>
                    )}
                    <div
                      className={`py-2 px-3 rounded-xl ${
                        message.isUser
                          ? "bg-accent-blue text-white rounded-tr-none ml-12"
                          : "bg-primary-700/50 text-foreground rounded-tl-none mr-12"
                      }`}
                    >
                      {message.typing ? (
                        <div className="typing-dots">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      ) : (
                        <p className="text-sm">{message.text}</p>
                      )}
                    </div>
                    {message.isUser && (
                      <div className="bg-accent-blue rounded-full w-8 h-8 flex items-center justify-center shrink-0 ml-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-white"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message controls */}
            <div className="p-4 border-t border-muted/30">
              <div className="flex justify-center mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground flex items-center"
                  onClick={handleClearConversation}
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Clear conversation
                </Button>
              </div>
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-primary-900/60 border border-muted/50 rounded-xl py-2 px-4 pr-10 text-foreground focus:outline-none glow-border"
                />
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  onClick={handleSend}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-accent-blue hover:text-accent-cyan"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
