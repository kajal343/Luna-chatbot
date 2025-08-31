import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/components/ThemeProvider";
import { Sun, Moon, Menu, MessageCircle, Sparkles } from "lucide-react";
import ChatInterface from "@/components/ChatInterface";
import TopicsView from "@/components/TopicsView";
import HistoryView from "@/components/HistoryView";
import ResourcesView from "@/components/ResourcesView";
import { cn } from "@/lib/utils";

export default function Home() {
  const [activeTab, setActiveTab] = useState("chat");
  const [selectedTopic, setSelectedTopic] = useState<string>();
  const [conversationId, setConversationId] = useState<string>();
  const [showMenu, setShowMenu] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleSelectTopic = (topic: string) => {
    setSelectedTopic(topic);
    setConversationId(undefined);
    setActiveTab("chat");
  };

  const handleSelectConversation = (id: string) => {
    setConversationId(id);
    setSelectedTopic(undefined);
    setActiveTab("chat");
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-background shadow-2xl relative">
      
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-50 backdrop-blur-sm bg-card/95">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-nunito font-bold text-lg text-foreground" data-testid="app-title">Luna</h1>
            <p className="text-xs text-muted-foreground">Your safe space</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-muted"
            data-testid="theme-toggle"
          >
            {theme === "light" ? (
              <Sun className="w-5 h-5 text-foreground" />
            ) : (
              <Moon className="w-5 h-5 text-foreground" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-full hover:bg-muted"
            data-testid="menu-toggle"
          >
            <Menu className="w-5 h-5 text-foreground" />
          </Button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="bg-card border-b border-border px-4 py-2">
          <TabsList className="grid w-full grid-cols-4 bg-muted rounded-full p-1">
            <TabsTrigger 
              value="chat" 
              className="rounded-full text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              data-testid="tab-chat"
            >
              Chat
            </TabsTrigger>
            <TabsTrigger 
              value="topics"
              className="rounded-full text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              data-testid="tab-topics"
            >
              Topics
            </TabsTrigger>
            <TabsTrigger 
              value="history"
              className="rounded-full text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              data-testid="tab-history"
            >
              History
            </TabsTrigger>
            <TabsTrigger 
              value="resources"
              className="rounded-full text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              data-testid="tab-resources"
            >
              Resources
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          <TabsContent value="chat" className="h-full m-0">
            <ChatInterface 
              selectedTopic={selectedTopic}
              conversationId={conversationId}
            />
          </TabsContent>

          <TabsContent value="topics" className="h-full m-0 overflow-y-auto">
            <TopicsView onSelectTopic={handleSelectTopic} />
          </TabsContent>

          <TabsContent value="history" className="h-full m-0 overflow-y-auto">
            <HistoryView onSelectConversation={handleSelectConversation} />
          </TabsContent>

          <TabsContent value="resources" className="h-full m-0 overflow-y-auto">
            <ResourcesView />
          </TabsContent>
        </div>
      </Tabs>

      {/* Menu Overlay */}
      {showMenu && (
        <div 
          className="fixed inset-0 bg-background/95 backdrop-blur-sm z-40"
          onClick={() => setShowMenu(false)}
          data-testid="menu-overlay"
        >
          <div 
            className="absolute top-16 right-4 bg-card border border-border rounded-2xl shadow-lg p-4 w-64"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-nunito font-semibold text-sm text-foreground">Anonymous User</p>
                  <p className="text-xs text-muted-foreground">Safe & secure</p>
                </div>
              </div>
              
              <hr className="border-border" />
              
              <Button
                variant="ghost"
                className="w-full justify-start text-sm"
                onClick={() => {
                  // Handle privacy info
                  setShowMenu(false);
                }}
                data-testid="privacy-info-button"
              >
                Privacy & Safety
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start text-sm"
                onClick={() => {
                  // Handle about
                  setShowMenu(false);
                }}
                data-testid="about-button"
              >
                About Luna
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
