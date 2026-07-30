import React, { useState } from 'react';
import { Button } from './ui/button';
import { 
  Download, 
  Share2, 
  Bookmark, 
  Mail,
  Printer,
  Copy,
  ExternalLink,
  Plus,
  MoreVertical,
  Check,
  X
} from 'lucide-react';
import { cn } from './ui/utils';
import { motion, AnimatePresence } from 'motion/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

interface QuickAction {
  id: string;
  label: string;
  icon: any;
  action: () => void;
  variant?: 'default' | 'ghost' | 'outline';
  badge?: number;
}

interface QuickActionsProps {
  context?: 'dashboard' | 'sector' | 'innovations';
  onAction?: (actionId: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ 
  context = 'dashboard',
  onAction 
}) => {
  const [feedback, setFeedback] = useState<{ id: string; type: 'success' | 'error' } | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const showFeedback = (id: string, type: 'success' | 'error') => {
    setFeedback({ id, type });
    setTimeout(() => setFeedback(null), 2000);
  };

  const handleAction = (action: QuickAction) => {
    try {
      action.action();
      onAction?.(action.id);
      showFeedback(action.id, 'success');
    } catch (error) {
      showFeedback(action.id, 'error');
    }
  };

  const primaryActions: QuickAction[] = [
    {
      id: 'export',
      label: 'Export Data',
      icon: Download,
      action: () => {
        console.log('Exporting data...');
        // Simulate export
        const data = { context, timestamp: new Date().toISOString() };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${context}-export-${Date.now()}.json`;
        a.click();
      },
      variant: 'default'
    },
    {
      id: 'share',
      label: 'Share',
      icon: Share2,
      action: () => {
        if (navigator.share) {
          navigator.share({
            title: 'RegenMetrics Dashboard',
            text: 'Check out these metrics',
            url: window.location.href
          });
        } else {
          navigator.clipboard.writeText(window.location.href);
        }
      },
      variant: 'outline'
    },
    {
      id: 'bookmark',
      label: 'Bookmark',
      icon: Bookmark,
      action: () => {
        console.log('Bookmarked');
        localStorage.setItem(`bookmark-${context}`, JSON.stringify({
          url: window.location.href,
          timestamp: new Date().toISOString()
        }));
      },
      variant: 'ghost'
    },
  ];

  const secondaryActions: QuickAction[] = [
    {
      id: 'copy',
      label: 'Copy Link',
      icon: Copy,
      action: () => {
        navigator.clipboard.writeText(window.location.href);
      }
    },
    {
      id: 'email',
      label: 'Email Report',
      icon: Mail,
      action: () => {
        const subject = encodeURIComponent(`RegenMetrics - ${context} Report`);
        const body = encodeURIComponent(`View the report here: ${window.location.href}`);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
      }
    },
    {
      id: 'print',
      label: 'Print',
      icon: Printer,
      action: () => {
        window.print();
      }
    },
    {
      id: 'external',
      label: 'Open in New Tab',
      icon: ExternalLink,
      action: () => {
        window.open(window.location.href, '_blank');
      }
    },
  ];

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        {/* Primary Actions */}
        <div className="flex items-center gap-1">
          <AnimatePresence>
            {primaryActions.map((action, index) => {
              const Icon = action.icon;
              const hasFeedback = feedback?.id === action.id;
              const isSuccess = hasFeedback && feedback?.type === 'success';
              const isError = hasFeedback && feedback?.type === 'error';

              return (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={action.variant || 'ghost'}
                        size="sm"
                        onClick={() => handleAction(action)}
                        disabled={hasFeedback}
                        className={cn(
                          "relative transition-all",
                          isSuccess && "bg-green-500/10 text-green-600 border-green-500/20",
                          isError && "bg-red-500/10 text-red-600 border-red-500/20"
                        )}
                      >
                        <AnimatePresence mode="wait">
                          {hasFeedback ? (
                            <motion.div
                              key="feedback"
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              exit={{ scale: 0, rotate: 180 }}
                            >
                              {isSuccess ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <X className="h-4 w-4" />
                              )}
                            </motion.div>
                          ) : (
                            <motion.div
                              key="icon"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                            >
                              <Icon className="h-4 w-4" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <span className="ml-2">{action.label}</span>
                        {action.badge && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                          >
                            {action.badge}
                          </motion.div>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{action.label}</p>
                    </TooltipContent>
                  </Tooltip>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* More Actions Dropdown */}
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>More Actions</p>
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Additional Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {secondaryActions.map((action) => {
              const Icon = action.icon;
              return (
                <DropdownMenuItem
                  key={action.id}
                  onClick={() => handleAction(action)}
                  className="cursor-pointer"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {action.label}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Floating Action Button (Mobile) */}
        <div className="md:hidden">
          <motion.div
            animate={{
              rotate: isExpanded ? 45 : 0,
            }}
          >
            <Button
              variant="default"
              size="icon"
              className="rounded-full h-12 w-12 shadow-lg"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Plus className="h-6 w-6" />
            </Button>
          </motion.div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                className="absolute bottom-16 right-0 flex flex-col gap-2"
              >
                {[...primaryActions, ...secondaryActions].map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <motion.div
                      key={action.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          handleAction(action);
                          setIsExpanded(false);
                        }}
                        className="shadow-lg"
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {action.label}
                      </Button>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </TooltipProvider>
  );
};
