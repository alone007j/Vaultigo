import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertFileSchema } from "@shared/schema";
import grokAI from "./lib/grok";
import geminiAI from "./lib/gemini";
import openaiAI from "./lib/openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // User management routes
  app.get("/api/users/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const userId = parseInt(req.params.id);
    if (req.user.id !== userId && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Don't send the password hash to the client
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  // File management routes
  app.get("/api/files", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const files = await storage.getFiles(req.user.id);
    res.json(files);
  });
  
  app.get("/api/files/recent", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const limit = parseInt(req.query.limit as string) || 5;
    const files = await storage.getRecentFiles(req.user.id, limit);
    res.json(files);
  });
  
  app.get("/api/files/type/:type", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const type = req.params.type;
    const files = await storage.getFilesByType(req.user.id, type);
    res.json(files);
  });
  
  app.post("/api/files", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const fileData = insertFileSchema.parse({
        ...req.body,
        userId: req.user.id,
        createdAt: new Date().toISOString()
      });
      
      // Check if user has enough storage
      const user = req.user;
      const fileSizeInGB = fileData.size / (1024 * 1024 * 1024);
      
      if (user.storageUsed + fileSizeInGB > user.storage) {
        return res.status(400).json({ message: "Storage limit exceeded" });
      }
      
      const file = await storage.createFile(fileData);
      res.status(201).json(file);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });
  
  app.get("/api/files/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const fileId = parseInt(req.params.id);
    const file = await storage.getFile(fileId);
    
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }
    
    if (file.userId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    res.json(file);
  });
  
  app.delete("/api/files/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const fileId = parseInt(req.params.id);
    const file = await storage.getFile(fileId);
    
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }
    
    if (file.userId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    await storage.deleteFile(fileId);
    res.status(204).send();
  });

  // External account routes
  app.get("/api/external-accounts", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const accounts = await storage.getExternalAccounts(req.user.id);
    res.json(accounts);
  });
  
  // Plan upgrade mock route (would integrate with Stripe in production)
  app.post("/api/upgrade-plan", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const { plan } = req.body;
    if (!["free", "pro", "elite"].includes(plan)) {
      return res.status(400).json({ message: "Invalid plan" });
    }
    
    // Set storage limit based on plan
    let storageLimit = 10; // Free plan: 10GB
    if (plan === "pro") storageLimit = 1024; // Pro plan: 1TB
    if (plan === "elite") storageLimit = 5120; // Elite plan: 5TB
    
    const updatedUser = await storage.updateUser(req.user.id, { plan, storage: storageLimit });
    
    // Don't send the password hash to the client
    const { password, ...userWithoutPassword } = updatedUser;
    res.json(userWithoutPassword);
  });

  // AI Provider selection route
  app.post("/api/ai/set-provider", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const { provider } = req.body;
    
    if (!provider || !["xai", "gemini", "openai"].includes(provider)) {
      return res.status(400).json({ message: "Invalid AI provider. Choose 'xai', 'gemini', or 'openai'." });
    }
    
    try {
      const updatedUser = await storage.updateUser(req.user.id, { aiProvider: provider });
      
      // Don't send the password hash to the client
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error: any) {
      console.error("Error setting AI provider:", error);
      res.status(500).json({ message: error.message });
    }
  });
  
  // AI model information route
  app.get("/api/ai/models", async (req, res) => {
    res.json({
      models: [
        {
          id: "xai",
          name: "XAI Grok",
          description: "Grok is a state-of-the-art AI model developed by xAI that excels at creative problem-solving with a conversational approach.",
          features: ["Long context window", "Strong reasoning capabilities", "Advanced problem-solving"]
        },
        {
          id: "gemini",
          name: "Google Gemini",
          description: "Google's Gemini is a powerful multimodal AI model that can handle text and images with impressive understanding and contextual awareness.",
          features: ["Multimodal capabilities", "Strong language understanding", "Designed for helpful, accurate responses"]
        },
        {
          id: "openai",
          name: "OpenAI GPT-4o",
          description: "OpenAI's latest GPT-4o model offers outstanding performance across a wide range of tasks with exceptional comprehension and reasoning abilities.",
          features: ["Multi-modal capabilities", "Industry-leading reasoning", "Advanced summarization and search"]
        }
      ]
    });
  });
  
  // AI Assistant routes
  app.post("/api/ai/chat", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const { message, chatHistory } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }
    
    try {
      // Get user's preferred AI provider (default to XAI/Grok if not set)
      const aiProvider = req.user.aiProvider || "xai";
      
      // Get some context about user's files
      const files = await storage.getRecentFiles(req.user.id, 5);
      let filesContext = "";
      
      if (files.length > 0) {
        filesContext = `Recent files: ${files.map(f => f.name).join(", ")}. 
        Total storage used: ${req.user.storageUsed}GB out of ${req.user.storage}GB.
        User's plan: ${req.user.plan}.`;
      }
      
      // Process with the selected AI provider
      let response;
      if (aiProvider === "gemini") {
        response = await geminiAI.chatAboutFiles(message, chatHistory || [], filesContext);
      } else if (aiProvider === "openai") {
        response = await openaiAI.chatAboutFiles(message, chatHistory || [], filesContext);
      } else {
        // Default to Grok/XAI
        response = await grokAI.chatAboutFiles(message, chatHistory || [], filesContext);
      }
      
      if (!response.success) {
        return res.status(500).json({ 
          message: "Error generating AI response", 
          error: response.error 
        });
      }
      
      res.json({ 
        content: response.content,
        provider: aiProvider
      });
    } catch (error: any) {
      console.error("Error in AI chat:", error);
      res.status(500).json({ message: error.message });
    }
  });
  
  app.post("/api/ai/summarize", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const { fileId } = req.body;
    
    if (!fileId) {
      return res.status(400).json({ message: "File ID is required" });
    }
    
    try {
      // Get user's preferred AI provider (default to XAI/Grok if not set)
      const aiProvider = req.user.aiProvider || "xai";
      
      const file = await storage.getFile(parseInt(fileId));
      
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }
      
      if (file.userId !== req.user.id && !req.user.isAdmin) {
        return res.status(403).json({ message: "Not authorized" });
      }
      
      // In a real application, we would fetch the file content here
      // For demonstration, we'll use the file name as the content
      const content = `This is a simulated content of the file: ${file.name}.
      It was created on ${file.createdAt} and is of type ${file.type}.
      The file size is ${file.size} bytes.`;
      
      // Process with the selected AI provider
      let summary;
      if (aiProvider === "gemini") {
        summary = await geminiAI.summarizeDocument(content);
      } else if (aiProvider === "openai") {
        summary = await openaiAI.summarizeDocument(content);
      } else {
        // Default to Grok/XAI
        summary = await grokAI.summarizeDocument(content);
      }
      
      if (!summary.success) {
        return res.status(500).json({ 
          message: "Error generating summary", 
          error: summary.error 
        });
      }
      
      res.json({ 
        summary: summary.content,
        provider: aiProvider
      });
    } catch (error: any) {
      console.error("Error summarizing file:", error);
      res.status(500).json({ message: error.message });
    }
  });
  
  app.post("/api/ai/search", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }
    
    try {
      // Get user's preferred AI provider (default to XAI/Grok if not set)
      const aiProvider = req.user.aiProvider || "xai";
      
      // Get all user files
      const files = await storage.getFiles(req.user.id);
      
      // In a real application, we would fetch each file's content
      // For demonstration, we'll create simulated content based on file metadata
      const filesWithContent = files.map(file => ({
        name: file.name,
        content: `This is a simulated content of the file: ${file.name}.
        It was created on ${file.createdAt} and is of type ${file.type}.
        The file size is ${file.size} bytes.`
      }));
      
      // Process with the selected AI provider
      let searchResults;
      if (aiProvider === "gemini") {
        searchResults = await geminiAI.searchFilesSemantics(query, filesWithContent);
      } else if (aiProvider === "openai") {
        searchResults = await openaiAI.searchFilesSemantics(query, filesWithContent);
      } else {
        // Default to Grok/XAI
        searchResults = await grokAI.searchFilesSemantics(query, filesWithContent);
      }
      
      if (!searchResults.success) {
        return res.status(500).json({ 
          message: "Error searching files", 
          error: searchResults.error 
        });
      }
      
      res.json({ 
        results: searchResults.results,
        provider: aiProvider
      });
    } catch (error: any) {
      console.error("Error searching files with AI:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
