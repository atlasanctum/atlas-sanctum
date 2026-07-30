import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { 
  Search, 
  TrendingUp, 
  BarChart3, 
  Settings, 
  Download,
  Filter,
  Sparkles,
  Database,
  Bell,
  MapPin,
  Command
} from 'lucide-react';
import { cn } from './ui/utils';
import { motion, AnimatePresence } from 'motion/react';

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: any;
  category: 'Navigation' | 'Actions' | 'Sectors' | 'Features';
  keywords: string[];
  action: () => void;
  badge?: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ 
  isOpen, 
  onClose,
  onNavigate 
}) => {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: CommandItem[] = [
    {
      id: 'dashboard',
      label: 'Go to Dashboard',
      description: 'View main dashboard with all metrics',
      icon: BarChart3,
      category: 'Navigation',
      keywords: ['home', 'overview', 'main'],
      action: () => { onNavigate('dashboard'); onClose(); }
    },
    {
      id: 'innovations',
      label: 'Go to Innovations',
      description: 'View platform innovations and new features',
      icon: Sparkles,
      category: 'Navigation',
      keywords: ['new', 'features', 'advanced'],
      action: () => { onNavigate('innovations'); onClose(); },
      badge: 'New'
    },
    {
      id: 'agriculture',
      label: 'Agriculture Sector',
      description: 'View agriculture metrics and analytics',
      icon: TrendingUp,
      category: 'Sectors',
      keywords: ['farming', 'soil', 'crops'],
      action: () => { onNavigate('agriculture'); onClose(); }
    },
    {
      id: 'oceanic',
      label: 'Oceanic Sector',
      description: 'View oceanic metrics and analytics',
      icon: MapPin,
      category: 'Sectors',
      keywords: ['ocean', 'marine', 'water'],
      action: () => { onNavigate('oceanic'); onClose(); }
    },
    {
      id: 'healthcare',
      label: 'Healthcare Sector',
      description: 'View healthcare metrics and analytics',
      icon: TrendingUp,
      category: 'Sectors',
      keywords: ['health', 'medical', 'patient'],
      action: () => { onNavigate('healthcare'); onClose(); }
    },
    {
      id: 'circular',
      label: 'Circular Economy',
      description: 'View circular economy metrics',
      icon: TrendingUp,
      category: 'Sectors',
      keywords: ['recycling', 'waste', 'sustainability'],
      action: () => { onNavigate('circular'); onClose(); }
    },
    {
      id: 'export',
      label: 'Export Data',
      description: 'Export current view data',
      icon: Download,
      category: 'Actions',
      keywords: ['download', 'save', 'csv', 'excel'],
      action: () => { console.log('Export data'); onClose(); }
    },
    {
      id: 'filters',
      label: 'Toggle Filters',
      description: 'Show/hide data filters',
      icon: Filter,
      category: 'Actions',
      keywords: ['filter', 'search', 'refine'],
      action: () => { console.log('Toggle filters'); onClose(); }
    },
    {
      id: 'settings',
      label: 'Open Settings',
      description: 'Configure application settings',
      icon: Settings,
      category: 'Features',
      keywords: ['preferences', 'config', 'options'],
      action: () => { console.log('Open settings'); onClose(); }
    },
    {
      id: 'notifications',
      label: 'View Notifications',
      description: 'See all system notifications',
      icon: Bell,
      category: 'Features',
      keywords: ['alerts', 'updates', 'messages'],
      action: () => { console.log('View notifications'); onClose(); }
    },
    {
      id: 'data-sources',
      label: 'Manage Data Sources',
      description: 'Configure data integration sources',
      icon: Database,
      category: 'Features',
      keywords: ['integrations', 'connections', 'apis'],
      action: () => { console.log('Manage data sources'); onClose(); }
    },
  ];

  const filteredCommands = commands.filter(cmd => {
    const searchLower = search.toLowerCase();
    return (
      cmd.label.toLowerCase().includes(searchLower) ||
      cmd.description?.toLowerCase().includes(searchLower) ||
      cmd.keywords.some(k => k.includes(searchLower)) ||
      cmd.category.toLowerCase().includes(searchLower)
    );
  });

  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands]);

  // Reset on open/close
  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Type a command or search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-8"
            autoFocus
          />
          <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
            <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">⌘</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">K</kbd>
          </div>
        </div>

        <ScrollArea className="max-h-[400px]">
          <div className="p-2">
            {filteredCommands.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                No commands found
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {Object.entries(groupedCommands).map(([category, items]) => (
                  <div key={category} className="mb-4 last:mb-0">
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {category}
                    </div>
                    <div className="space-y-1">
                      {items.map((cmd, index) => {
                        const globalIndex = filteredCommands.findIndex(c => c.id === cmd.id);
                        const isSelected = globalIndex === selectedIndex;
                        const Icon = cmd.icon;

                        return (
                          <motion.button
                            key={cmd.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ delay: index * 0.02 }}
                            onClick={cmd.action}
                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                            className={cn(
                              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                              isSelected 
                                ? "bg-primary text-primary-foreground" 
                                : "hover:bg-muted"
                            )}
                          >
                            <div className={cn(
                              "p-1.5 rounded-md",
                              isSelected ? "bg-primary-foreground/20" : "bg-muted"
                            )}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm truncate">{cmd.label}</span>
                                {cmd.badge && (
                                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                    {cmd.badge}
                                  </Badge>
                                )}
                              </div>
                              {cmd.description && (
                                <p className={cn(
                                  "text-xs truncate",
                                  isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
                                )}>
                                  {cmd.description}
                                </p>
                              )}
                            </div>
                            {isSelected && (
                              <kbd className="px-2 py-1 rounded bg-primary-foreground/20 text-xs font-mono">
                                ⏎
                              </kbd>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </ScrollArea>

        <div className="flex items-center justify-between px-4 py-2 border-t bg-muted/30 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-background font-mono">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-background font-mono">↓</kbd>
              <span>Navigate</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-background font-mono">⏎</kbd>
              <span>Select</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-background font-mono">Esc</kbd>
              <span>Close</span>
            </div>
          </div>
          <div>{filteredCommands.length} results</div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
