import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, Calendar, Sparkles, MessageCircle, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Conversation } from "@shared/schema";

interface HistoryViewProps {
  onSelectConversation: (conversationId: string) => void;
}

const topicIcons: Record<string, React.ComponentType<any>> = {
  "mental-health": Heart,
  "relationships": Users, 
  "menstrual-health": Heart,
  "general-wellness": Sparkles,
};

const topicColors: Record<string, string> = {
  "mental-health": "primary",
  "relationships": "secondary",
  "menstrual-health": "accent", 
  "general-wellness": "primary",
};

const topicGradients: Record<string, string> = {
  "mental-health": "from-primary to-secondary",
  "relationships": "from-secondary to-accent",
  "menstrual-health": "from-accent to-primary",
  "general-wellness": "from-primary/60 to-secondary/60",
};

export default function HistoryView({ onSelectConversation }: HistoryViewProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: conversations = [], isLoading } = useQuery<Conversation[]>({
    queryKey: ["/api/conversations"],
  });

  const clearAllMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", "/api/conversations");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      toast({
        title: "Conversations cleared",
        description: "All your conversations have been deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to clear conversations. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteConversationMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/conversations/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      toast({
        title: "Conversation deleted",
        description: "The conversation has been removed.",
      });
    },
    onError: () => {
      toast({
        title: "Error", 
        description: "Failed to delete conversation. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center h-32">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4" data-testid="history-view">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-nunito font-bold text-foreground">Your Conversations</h2>
        <p className="text-sm text-muted-foreground">
          All your conversations are anonymous and stored locally on your device.
        </p>
      </div>

      {conversations.length > 0 && (
        <div className="flex justify-end">
          <Button
            variant="outline" 
            size="sm"
            onClick={() => clearAllMutation.mutate()}
            disabled={clearAllMutation.isPending}
            className="text-xs text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
            data-testid="clear-all-button"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Clear All
          </Button>
        </div>
      )}

      {conversations.length === 0 ? (
        <div className="text-center py-12" data-testid="empty-history">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-nunito font-semibold text-lg text-foreground">No conversations yet</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Start a conversation and it will appear here for you to reference later.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {conversations.map((conversation) => {
            const IconComponent = topicIcons[conversation.topic] || Sparkles;
            const gradient = topicGradients[conversation.topic] || topicGradients["general-wellness"];
            const color = topicColors[conversation.topic] || "primary";
            const preview = conversation.messages.find(m => m.role === "user")?.content || "No messages";
            const date = new Date(conversation.updatedAt).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            });

            return (
              <div
                key={conversation.id}
                className="bg-card border border-border rounded-2xl p-4 hover:shadow-md transition-all duration-200 cursor-pointer group"
                data-testid={`conversation-${conversation.id}`}
              >
                <div 
                  className="flex items-start space-x-3"
                  onClick={() => onSelectConversation(conversation.id)}
                >
                  <div className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-nunito font-medium text-sm text-foreground truncate">
                      {conversation.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {preview}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="secondary" className={`text-xs bg-${color}/10 text-${color}`}>
                        {conversation.topic.replace("-", " ")}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{date}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversationMutation.mutate(conversation.id);
                    }}
                    disabled={deleteConversationMutation.isPending}
                    className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10 p-1 h-6"
                    data-testid={`delete-conversation-${conversation.id}`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
