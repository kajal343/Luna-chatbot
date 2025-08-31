import { Heart, Users, Calendar, Sparkles, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TopicsViewProps {
  onSelectTopic: (topic: string) => void;
}

const topics = [
  {
    id: "mental-health",
    title: "Mental Health & Wellbeing",
    description: "Anxiety, depression, stress, self-care, and emotional support",
    icon: Heart,
    gradient: "from-primary to-secondary",
    tags: ["Anxiety", "Self-care", "Stress"],
    color: "primary",
  },
  {
    id: "relationships",
    title: "Relationships & Social Life", 
    description: "Friendships, family, crushes, dating, and social anxiety",
    icon: Users,
    gradient: "from-secondary to-accent",
    tags: ["Friendships", "Family", "Dating"],
    color: "secondary",
  },
  {
    id: "menstrual-health",
    title: "Menstrual Health & Body",
    description: "Periods, body changes, hygiene, and reproductive health",
    icon: Heart,
    gradient: "from-accent to-primary",
    tags: ["Periods", "Body changes", "Health"],
    color: "accent",
  },
  {
    id: "general-wellness",
    title: "General Wellness & Life",
    description: "School, hobbies, future goals, and everyday challenges",
    icon: Sparkles,
    gradient: "from-primary/60 to-secondary/60",
    tags: ["School", "Goals", "Life advice"],
    color: "primary",
  },
];

export default function TopicsView({ onSelectTopic }: TopicsViewProps) {
  return (
    <div className="p-4 space-y-6" data-testid="topics-view">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-nunito font-bold text-foreground">Explore Topics</h2>
        <p className="text-sm text-muted-foreground">
          Choose a topic you'd like to discuss. Remember, no question is too small or embarrassing.
        </p>
      </div>

      {/* Topic Categories */}
      <div className="grid grid-cols-1 gap-4">
        {topics.map((topic) => (
          <div
            key={topic.id}
            onClick={() => onSelectTopic(topic.id)}
            className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
            data-testid={`topic-${topic.id}`}
          >
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${topic.gradient} rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200`}>
                <topic.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className={`font-nunito font-semibold text-base text-foreground group-hover:text-${topic.color} transition-colors duration-200`}>
                  {topic.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{topic.description}</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {topic.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className={`text-xs bg-${topic.color}/10 text-${topic.color} hover:bg-${topic.color}/20`}>
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Emergency Resources */}
      <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 mt-6">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-destructive rounded-full flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-destructive-foreground" />
          </div>
          <div>
            <h4 className="font-nunito font-semibold text-sm text-destructive">Need immediate help?</h4>
            <p className="text-xs text-destructive/80 mt-1">
              If you're having thoughts of self-harm or suicide, please reach out for professional help immediately.
            </p>
            <Button
              variant="destructive"
              size="sm"
              className="mt-2 text-xs rounded-full"
              data-testid="emergency-resources-button"
            >
              Emergency Resources
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
