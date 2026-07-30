import React from 'react';
import { Bell, Search, User, Wallet, LogOut, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Input } from '../ui/input';
import { useDashboard } from '../../context/DashboardContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface HeaderProps {
  activeTab: string;
}

export function Header({ activeTab }: HeaderProps) {
  const { isWalletConnected, walletAddress, connectWallet, disconnectWallet, isWalletConnecting } = useDashboard();

  const getTitle = () => {
    switch (activeTab) {
      case 'overview': return 'Dashboard Overview';
      case 'governance': return 'Ethical Governance & DAO';
      case 'exchange': return 'Regenerative Value Exchange';
      case 'metrics': return 'Data Integration & Metrics';
      case 'knowledge': return 'Cultural & Knowledge Impact';
      case 'economy': return 'Global Impact Economy';
      default: return 'Dashboard';
    }
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex flex-col">
        <h2 className="text-xl font-semibold text-slate-100">{getTitle()}</h2>
        <p className="text-xs text-slate-400">Welcome back, Guardian of the Future</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-64 hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input 
            placeholder="Search ecosystem..." 
            className="pl-9 h-9 bg-slate-950/50 border-slate-800 focus:border-emerald-500/50 focus:ring-emerald-500/20 text-slate-300 placeholder:text-slate-600 rounded-lg"
          />
        </div>

        <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-slate-100 hover:bg-slate-800">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
        </Button>

        <div className="h-8 w-[1px] bg-slate-800 mx-2" />

        <div className="flex items-center gap-3 pl-2">
          {!isWalletConnected ? (
            <Button 
              onClick={connectWallet}
              disabled={isWalletConnecting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 disabled:opacity-50"
            >
              {isWalletConnecting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4" />
                  Connect Wallet
                </>
              )}
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 gap-2">
                  <Wallet className="w-4 h-4" />
                  <span>{walletAddress}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-slate-900 border-slate-800 text-slate-200">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-800" />
                <DropdownMenuItem className="focus:bg-slate-800 focus:text-emerald-400">
                  <span className="flex-1">Balance</span>
                  <span className="font-mono">1,250 GEN</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-slate-800 focus:text-rose-400" onClick={disconnectWallet}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Disconnect
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Avatar className="h-9 w-9 border border-slate-700 ring-2 ring-emerald-500/10 cursor-pointer">
            <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" alt="Elena" />
            <AvatarFallback className="bg-slate-800 text-slate-300">ES</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}