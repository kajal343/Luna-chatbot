import { type Conversation, type InsertConversation, type Resource, type InsertResource, type Message } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Conversations
  getConversation(id: string): Promise<Conversation | undefined>;
  getConversations(): Promise<Conversation[]>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  updateConversation(id: string, updates: Partial<Conversation>): Promise<Conversation | undefined>;
  deleteConversation(id: string): Promise<boolean>;
  
  // Resources
  getResources(): Promise<Resource[]>;
  getResourcesByCategory(category: string): Promise<Resource[]>;
  createResource(resource: InsertResource): Promise<Resource>;
}

export class MemStorage implements IStorage {
  private conversations: Map<string, Conversation>;
  private resources: Map<string, Resource>;

  constructor() {
    this.conversations = new Map();
    this.resources = new Map();
    this.seedResources();
  }

  private seedResources() {
    const defaultResources: InsertResource[] = [
      {
        title: "Teen Mental Health Guide",
        description: "Understanding anxiety, depression, and stress management techniques specifically for teenagers.",
        category: "mental-health",
        content: "A comprehensive guide covering common mental health challenges faced by teenagers, including practical coping strategies, when to seek help, and how to build resilience.",
        icon: "brain",
      },
      {
        title: "Mindfulness & Meditation",
        description: "Simple breathing exercises and mindfulness practices to help manage stress and anxiety.",
        category: "mental-health",
        content: "Learn evidence-based mindfulness techniques including 4-7-8 breathing, body scan meditation, and grounding exercises that can be done anywhere.",
        icon: "heart",
      },
      {
        title: "Menstrual Health 101",
        description: "Everything you need to know about periods, cycles, and managing menstrual health.",
        category: "body-health",
        content: "Complete information about menstrual cycles, period products, managing symptoms, and when to consult a healthcare provider.",
        icon: "calendar",
      },
      {
        title: "Body Positivity & Self-Image",
        description: "Building confidence and developing a healthy relationship with your changing body.",
        category: "body-health",
        content: "Tips for developing a positive body image, dealing with body changes during puberty, and building self-confidence.",
        icon: "user",
      },
      {
        title: "National Suicide Prevention Lifeline",
        description: "24/7 crisis support hotline",
        category: "crisis",
        content: "Call 988 for immediate crisis support. Available 24/7 with trained counselors.",
        url: "tel:988",
        icon: "phone",
      },
      {
        title: "Crisis Text Line",
        description: "Text-based crisis support",
        category: "crisis",
        content: "Text HOME to 741741 for free, 24/7 crisis support via text message.",
        url: "sms:741741",
        icon: "message-circle",
      },
      {
        title: "Headspace",
        description: "Meditation & mindfulness app",
        category: "apps",
        content: "Popular meditation app with guided sessions for anxiety, sleep, and focus.",
        url: "https://headspace.com",
        icon: "smartphone",
      },
      {
        title: "Clue",
        description: "Period & cycle tracking app",
        category: "apps",
        content: "Science-based period tracker that helps you understand your menstrual cycle.",
        url: "https://helloclue.com",
        icon: "calendar",
      },
    ];

    defaultResources.forEach(resource => {
      this.createResource(resource);
    });
  }

  async getConversation(id: string): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }

  async getConversations(): Promise<Conversation[]> {
    return Array.from(this.conversations.values()).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = randomUUID();
    const now = new Date();
    const conversation: Conversation = {
      ...insertConversation,
      id,
      createdAt: now,
      updatedAt: now,
      messages: insertConversation.messages || [],
    };
    this.conversations.set(id, conversation);
    return conversation;
  }

  async updateConversation(id: string, updates: Partial<Conversation>): Promise<Conversation | undefined> {
    const existing = this.conversations.get(id);
    if (!existing) return undefined;

    const updated: Conversation = {
      ...existing,
      ...updates,
      id,
      updatedAt: new Date(),
    };
    this.conversations.set(id, updated);
    return updated;
  }

  async deleteConversation(id: string): Promise<boolean> {
    return this.conversations.delete(id);
  }

  async getResources(): Promise<Resource[]> {
    return Array.from(this.resources.values());
  }

  async getResourcesByCategory(category: string): Promise<Resource[]> {
    return Array.from(this.resources.values()).filter(resource => resource.category === category);
  }

  async createResource(insertResource: InsertResource): Promise<Resource> {
    const id = randomUUID();
    const resource: Resource = { 
      ...insertResource, 
      id,
      url: insertResource.url || null
    };
    this.resources.set(id, resource);
    return resource;
  }
}

export const storage = new MemStorage();
