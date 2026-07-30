import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  FlaskConical, 
  Users, 
  Settings, 
  LogOut, 
  CirclePlus,
  Globe,
  FileText,
  MessageSquare
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { ScrollArea } from '../components/ui/scroll-area';
import { Separator } from '../components/ui/separator';
import { CreateProjectModal } from './CreateProjectModal';

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
}

export const DashboardSidebar = ({ activeView, onNavigate }: SidebarProps) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'my-projects', label: 'My Projects', icon: FileText },
    { id: 'tasks', label: 'Task Board', icon: BookOpen }, // Re-using BookOpen for generic task/kanban
    { id: 'analytics', label: 'Impact Analytics', icon: Globe },
  ];

  const exploreItems = [
    { id: 'stories', label: 'Global Stories', icon: BookOpen },
    { id: 'research', label: 'Research Hub', icon: FlaskConical },
    { id: 'collaborate', label: 'Community', icon: Users },
  ];

  return (
    <div className="hidden h-screen w-64 flex-col border-r bg-card md:flex">
      <div className="p-6 flex items-center gap-2">
        <Globe className="h-6 w-6 text-primary" />
        <span className="text-xl font-bold tracking-tight">KnoWhere</span>
      </div>
      
      <div className="px-4 pb-2">
         <CreateProjectModal 
            trigger={
                <Button className="w-full justify-start" size="sm">
                    <CirclePlus className="mr-2 h-4 w-4" />
                    New Contribution
                </Button>
            }
         />
      </div>

      <ScrollArea className="flex-1 px-4">
        <div className="space-y-4 py-4">
          <div className="py-2">
            <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-muted-foreground uppercase">
              Workspace
            </h2>
            <div className="space-y-1">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeView === item.id ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => onNavigate(item.id)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div className="py-2">
            <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-muted-foreground uppercase">
              Explore Network
            </h2>
            <div className="space-y-1">
              {exploreItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeView === item.id ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => onNavigate(item.id)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t mt-auto">
        <Button 
            variant="ghost" 
            size="sm" 
            className={`w-full justify-start ${activeView === 'settings' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => onNavigate('settings')}
        >
            <Settings className="mr-2 h-4 w-4" />
            Settings
        </Button>
        <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground hover:text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
        </Button>
      </div>
    </div>
  );
};
