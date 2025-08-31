import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY || "default_key",
  dangerouslyAllowBrowser: true 
});

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AIResponse {
  response: string;
  resources?: Array<{
    title: string;
    description: string;
    url?: string;
  }>;
}

export async function generateAIResponse(
  message: string,
  topic?: string,
  conversationHistory: ChatMessage[] = []
): Promise<AIResponse> {
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

    const messages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.slice(-6), // Keep last 6 messages for context
      { role: "user", content: message }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-5",
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
