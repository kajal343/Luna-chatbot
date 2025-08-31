import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Send, Sparkles, User, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { ChatRequest, ChatResponse, Conversation, Message } from "@shared/schema";

interface ChatInterfaceProps {
  selectedTopic?: string;
  conversationId?: string;
}

export default function ChatInterface({ selectedTopic, conversationId }: ChatInterfaceProps) {
  const [message, setMessage] = useState("");
  const [currentConversationId, setCurrentConversationId] = useState(conversationId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get conversation if we have an ID
  const { data: conversation } = useQuery<Conversation>({
    queryKey: ["/api/conversations", currentConversationId],
    enabled: !!currentConversationId,
  });

  const chatMutation = useMutation({
    mutationFn: async (chatRequest: ChatRequest): Promise<ChatResponse> => {
      const response = await apiRequest("POST", "/api/chat", chatRequest);
      return response.json();
    },
    onSuccess: (data) => {
      setCurrentConversationId(data.conversationId);
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      setMessage("");
      
      if (data.resources && data.resources.length > 0) {
        toast({
          title: "Helpful resources available",
          description: "I've found some resources that might help you.",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "I'm having trouble responding right now. Please try again.",
        variant: "destructive",
      });
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  const handleSend = () => {
    if (!message.trim()) return;

    chatMutation.mutate({
      message: message.trim(),
      topic: selectedTopic,
      conversationId: currentConversationId,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickResponses = [
    "I need support 💙",
    "I'm feeling overwhelmed",
    "Help me understand",
  ];

  const messages = conversation?.messages || [];

  return (
    <div className="h-full flex flex-col" data-testid="chat-interface">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto chat-scroll px-4 py-4 space-y-4">
        {/* Welcome message */}
        {messages.length === 0 && (
          <div className="flex justify-center">
            <div className="bg-muted/50 rounded-2xl px-4 py-3 max-w-xs text-center">
              <p className="text-sm text-muted-foreground font-medium">Welcome to your safe space 💕</p>
              <p className="text-xs text-muted-foreground mt-1">I'm here to listen without judgment</p>
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {/* Typing indicator */}
        {chatMutation.isPending && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="bg-card border border-border rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse-gentle"></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse-gentle" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse-gentle" style={{ animationDelay: "0.4s" }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 bg-card border-t border-border">
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share what's on your mind... I'm here to listen 💜"
              className="resize-none pr-12 min-h-[48px] max-h-32 rounded-2xl border-border focus:ring-2 focus:ring-ring"
              rows={1}
              data-testid="message-input"
            />
            <Button
              onClick={handleSend}
              disabled={!message.trim() || chatMutation.isPending}
              size="sm"
              className="absolute right-2 bottom-2 p-2 rounded-full h-8 w-8"
              data-testid="send-button"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Quick responses */}
        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {quickResponses.map((response) => (
              <Button
                key={response}
                variant="outline"
                size="sm"
                onClick={() => setMessage(response)}
                className="text-xs rounded-full bg-muted hover:bg-muted/80 border-muted"
                data-testid={`quick-response-${response}`}
              >
                {response}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  const time = new Date(message.timestamp).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div
      className={cn(
        "flex items-start space-x-3 animate-slide-up",
        isUser && "justify-end"
      )}
      data-testid={`message-${message.role}`}
    >
      {!isUser && (
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
      )}

      <div
        className={cn(
          "rounded-2xl px-4 py-3 max-w-xs shadow-sm",
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-md"
            : "bg-card border border-border rounded-tl-md"
        )}
      >
        <p className={cn("text-sm", isUser ? "text-primary-foreground" : "text-foreground")}>
          {message.content}
        </p>
        <p className={cn("text-xs mt-2", isUser ? "text-primary-foreground/70" : "text-muted-foreground")}>
          {time}
        </p>
      </div>

      {isUser && (
        <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
}
