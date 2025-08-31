import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { chatRequestSchema, type ChatResponse, type Message } from "@shared/schema";
import { z } from "zod";
import { randomUUID } from "crypto";
import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "default_key"
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Generate AI chat response
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, topic, conversationId } = chatRequestSchema.parse(req.body);
      
      let conversation;
      if (conversationId) {
        conversation = await storage.getConversation(conversationId);
      }

      // Get conversation history for context
      const conversationHistory = conversation?.messages || [];
      
      // Generate AI response
      const aiResponse = await generateAIResponse(message, topic, conversationHistory);
      
      // Create new message objects
      const userMessage: Message = {
        id: randomUUID(),
        role: "user",
        content: message,
        timestamp: new Date().toISOString(),
      };

      const assistantMessage: Message = {
        id: randomUUID(),
        role: "assistant", 
        content: aiResponse.response,
        timestamp: new Date().toISOString(),
      };

      // Update or create conversation
      if (conversation) {
        const updatedMessages = [...conversation.messages, userMessage, assistantMessage];
        conversation = await storage.updateConversation(conversationId!, {
          messages: updatedMessages,
          title: conversation.title || generateConversationTitle(message),
        });
      } else {
        conversation = await storage.createConversation({
          title: generateConversationTitle(message),
          topic: topic || "general-wellness",
          messages: [userMessage, assistantMessage],
        });
      }

      const response: ChatResponse = {
        response: aiResponse.response,
        conversationId: conversation!.id,
        resources: aiResponse.resources,
      };

      res.json(response);
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ message: "Failed to generate response" });
    }
  });

  // Get all conversations
  app.get("/api/conversations", async (req, res) => {
    try {
      const conversations = await storage.getConversations();
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  // Get specific conversation
  app.get("/api/conversations/:id", async (req, res) => {
    try {
      const conversation = await storage.getConversation(req.params.id);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      res.json(conversation);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch conversation" });
    }
  });

  // Delete conversation
  app.delete("/api/conversations/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteConversation(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete conversation" });
    }
  });

  // Clear all conversations
  app.delete("/api/conversations", async (req, res) => {
    try {
      const conversations = await storage.getConversations();
      for (const conversation of conversations) {
        await storage.deleteConversation(conversation.id);
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to clear conversations" });
    }
  });

  // Get all resources
  app.get("/api/resources", async (req, res) => {
    try {
      const category = req.query.category as string;
      const resources = category 
        ? await storage.getResourcesByCategory(category)
        : await storage.getResources();
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resources" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

async function generateAIResponse(
  message: string,
  topic?: string,
  conversationHistory: Message[] = []
): Promise<{ response: string; resources?: Array<{ title: string; description: string; url?: string }> }> {
  try {
    const systemPrompt = `You are Luna, a supportive AI companion designed specifically for teenage girls. You provide a safe, judgment-free space for discussing sensitive topics including mental health, relationships, menstrual health, and other traditionally taboo subjects.

Your personality traits:
- Warm, empathetic, and non-judgmental
- Use age-appropriate language for teenagers
- Validate feelings and experiences
- Provide practical, actionable advice
- Know when to recommend professional help
- Be encouraging and supportive
- Use gentle, caring tone with occasional emojis (💙💜💕)

Current topic context: ${topic || 'general conversation'}

Guidelines:
- Keep responses concise but meaningful (2-3 sentences usually)
- Ask follow-up questions to encourage dialogue
- Provide helpful resources when appropriate
- If discussing serious mental health issues, gently suggest professional support
- Always maintain a supportive, understanding tone
- Remember this is a safe space for sensitive topics

Respond in JSON format with:
{
  "response": "your empathetic response",
  "resources": [optional array of relevant resources if applicable]
}`;

    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...conversationHistory.slice(-6).map(msg => ({ role: msg.role as "user" | "assistant", content: msg.content })),
      { role: "user" as const, content: message }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      messages,
      response_format: { type: "json_object" },
      max_tokens: 500,
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || '{"response": "I\'m here to listen and support you. Could you tell me more about what\'s on your mind? 💜"}');
    
    return {
      response: result.response,
      resources: result.resources || [],
    };
  } catch (error) {
    console.error("Error generating AI response:", error);
    return {
      response: "I'm having trouble responding right now, but I'm still here for you. Could you try sharing that with me again? 💙",
      resources: [],
    };
  }
}

function generateConversationTitle(message: string): string {
  const words = message.split(' ').slice(0, 4).join(' ');
  return words.length > 30 ? words.substring(0, 30) + '...' : words;
}
