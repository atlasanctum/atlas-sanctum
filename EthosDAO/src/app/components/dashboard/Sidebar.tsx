import React from 'react';
import { 
  LayoutDashboard, 
  Scale, 
  RefreshCw, 
  ChartBar, 
  BookOpen, 
  Globe, 
  Settings, 
  LogOut,
  Hexagon,
  Users,
  Cpu,
  Layers
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'workspace', label: 'Workspace', icon: Users },
    { id: 'engineering', label: 'Engineering', icon: Cpu },
    { id: 'platform', label: 'Platform', icon: Layers },
    { id: 'governance', label: 'Ethical Governance', icon: Scale },
    { id: 'exchange', label: 'Regenerative Exchange', icon: RefreshCw },
    { id: 'metrics', label: 'Impact Metrics', icon: ChartBar },
    { id: 'knowledge', label: 'Knowledge Hub', icon: BookOpen },
    { id: 'economy', label: 'Impact Economy', icon: Globe },
  ];

  return (
    <div className="w-64 h-full border-r border-slate-800 bg-slate-900/50 backdrop-blur-xl flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <Hexagon className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight text-white">Ethos<span className="text-emerald-400">DAO</span></h1>
          <p className="text-xs text-slate-400">Collective Workspace</p>
        </div>
      </div>

      <ScrollArea className="flex-1 px-4 py-2">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                  isActive 
                    ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]" 
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-l-lg shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                )}
                <Icon className={cn("w-5 h-5", isActive ? "text-emerald-400" : "text-slate-500 group-hover:text-slate-300")} />
                {item.label}
              </button>
            );
          })}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-slate-400">Wallet Status</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Connected</span>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono text-slate-300 truncate">0x71C...9A23</span>
          </div>
          <Button variant="outline" size="sm" className="w-full text-xs h-8 border-slate-700 hover:bg-slate-800 text-slate-300">
            Disconnect
          </Button>
        </div>
        
        <div className="flex items-center justify-between text-slate-400 px-2">
          <button className="hover:text-white transition-colors"><Settings className="w-5 h-5" /></button>
          <button className="hover:text-red-400 transition-colors"><LogOut className="w-5 h-5" /></button>
        </div>
      </div>
    </div>
  );
}