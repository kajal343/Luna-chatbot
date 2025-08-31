import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Heart, 
  Calendar, 
  User, 
  Phone, 
  MessageCircle, 
  Smartphone,
  ExternalLink,
  AlertTriangle 
} from "lucide-react";
import type { Resource } from "@shared/schema";

const iconMap: Record<string, React.ComponentType<any>> = {
  brain: Brain,
  heart: Heart,
  calendar: Calendar,
  user: User,
  phone: Phone,
  "message-circle": MessageCircle,
  smartphone: Smartphone,
};

const categoryTitles: Record<string, string> = {
  "mental-health": "Mental Health & Wellness",
  "body-health": "Body & Health",
  "crisis": "Crisis Support",
  "apps": "Recommended Apps",
};

export default function ResourcesView() {
  const { data: resources = [], isLoading } = useQuery<Resource[]>({
    queryKey: ["/api/resources"],
  });

  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center h-32">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading resources...</p>
        </div>
      </div>
    );
  }

  const groupedResources = resources.reduce((acc, resource) => {
    if (!acc[resource.category]) {
      acc[resource.category] = [];
    }
    acc[resource.category].push(resource);
    return acc;
  }, {} as Record<string, Resource[]>);

  const handleResourceClick = (resource: Resource) => {
    if (resource.url) {
      window.open(resource.url, "_blank");
    }
  };

  return (
    <div className="p-4 space-y-6" data-testid="resources-view">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-nunito font-bold text-foreground">Helpful Resources</h2>
        <p className="text-sm text-muted-foreground">
          Curated resources to support your wellbeing and personal growth.
        </p>
      </div>

      {/* Crisis Resources */}
      {groupedResources.crisis && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-5">
          <h3 className="font-nunito font-semibold text-base text-destructive mb-3">
            {categoryTitles.crisis}
          </h3>
          <div className="space-y-3">
            {groupedResources.crisis.map((resource) => {
              const IconComponent = iconMap[resource.icon] || AlertTriangle;
              return (
                <div 
                  key={resource.id}
                  className="flex items-center space-x-3 cursor-pointer hover:bg-destructive/5 rounded-lg p-2 -m-2 transition-colors"
                  onClick={() => handleResourceClick(resource)}
                  data-testid={`crisis-resource-${resource.id}`}
                >
                  <div className="w-8 h-8 bg-destructive rounded-full flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-4 h-4 text-destructive-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-destructive">{resource.title}</p>
                    <p className="text-xs text-destructive/80">{resource.description}</p>
                  </div>
                  {resource.url && <ExternalLink className="w-4 h-4 text-destructive ml-auto" />}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mental Health Resources */}
      {groupedResources["mental-health"] && (
        <div className="space-y-4">
          <h3 className="font-nunito font-semibold text-lg text-foreground">
            {categoryTitles["mental-health"]}
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {groupedResources["mental-health"].map((resource) => {
              const IconComponent = iconMap[resource.icon] || Brain;
              return (
                <div
                  key={resource.id}
                  className="bg-card border border-border rounded-2xl p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={() => handleResourceClick(resource)}
                  data-testid={`mental-health-resource-${resource.id}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-nunito font-semibold text-sm text-foreground">
                        {resource.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {resource.description}
                      </p>
                      <Button
                        variant="link"
                        size="sm"
                        className="mt-2 text-xs text-primary hover:text-primary/80 font-medium p-0 h-auto"
                      >
                        Read Guide →
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Body & Health Resources */}
      {groupedResources["body-health"] && (
        <div className="space-y-4">
          <h3 className="font-nunito font-semibold text-lg text-foreground">
            {categoryTitles["body-health"]}
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {groupedResources["body-health"].map((resource) => {
              const IconComponent = iconMap[resource.icon] || Heart;
              return (
                <div
                  key={resource.id}
                  className="bg-card border border-border rounded-2xl p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={() => handleResourceClick(resource)}
                  data-testid={`body-health-resource-${resource.id}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-accent to-primary rounded-xl flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-nunito font-semibold text-sm text-foreground">
                        {resource.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {resource.description}
                      </p>
                      <Button
                        variant="link"
                        size="sm"
                        className="mt-2 text-xs text-accent hover:text-accent/80 font-medium p-0 h-auto"
                      >
                        Learn More →
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recommended Apps */}
      {groupedResources.apps && (
        <div className="space-y-4">
          <h3 className="font-nunito font-semibold text-lg text-foreground">
            {categoryTitles.apps}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {groupedResources.apps.map((resource) => {
              const IconComponent = iconMap[resource.icon] || Smartphone;
              return (
                <div
                  key={resource.id}
                  className="bg-card border border-border rounded-2xl p-3 text-center hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={() => handleResourceClick(resource)}
                  data-testid={`app-resource-${resource.id}`}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl mx-auto mb-2 flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h5 className="font-nunito font-semibold text-sm text-foreground">
                    {resource.title}
                  </h5>
                  <p className="text-xs text-muted-foreground mt-1">
                    {resource.description}
                  </p>
                  {resource.url && <ExternalLink className="w-3 h-3 text-primary mx-auto mt-2" />}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
