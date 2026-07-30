import { useState } from 'react';
import { Download, FileSpreadsheet, FileJson, Printer, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import {
  exportHoldingsToCSV,
  exportTransactionsToCSV,
  exportPortfolioJSON,
  generatePrintableReport,
} from '@/lib/export/portfolioExport';

interface ExportMenuProps {
  holdings: any[];
  transactions: any[];
  stats: {
    totalCredits: number;
    totalOffset: number;
    totalValue: number;
    retiredCredits: number;
  };
  userName?: string;
}

const ExportMenu = ({ holdings, transactions, stats, userName }: ExportMenuProps) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (type: 'holdings-csv' | 'transactions-csv' | 'json' | 'print') => {
    setIsExporting(true);
    
    try {
      switch (type) {
        case 'holdings-csv':
          exportHoldingsToCSV(holdings, stats);
          toast.success('Holdings exported to CSV');
          break;
        case 'transactions-csv':
          exportTransactionsToCSV(transactions);
          toast.success('Transactions exported to CSV');
          break;
        case 'json':
          exportPortfolioJSON(holdings, transactions, stats);
          toast.success('Portfolio report exported as JSON');
          break;
        case 'print':
          generatePrintableReport(holdings, stats, userName);
          toast.success('Opening print preview...');
          break;
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="border-border/50 gap-2"
          disabled={isExporting || holdings.length === 0}
        >
          <Download className="w-4 h-4" />
          Export
          <ChevronDown className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Export Portfolio</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => handleExport('holdings-csv')}
          className="cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4 mr-2 text-green-500" />
          <div className="flex flex-col">
            <span>Holdings (CSV)</span>
            <span className="text-xs text-muted-foreground">Spreadsheet format</span>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => handleExport('transactions-csv')}
          className="cursor-pointer"
          disabled={transactions.length === 0}
        >
          <FileSpreadsheet className="w-4 h-4 mr-2 text-blue-500" />
          <div className="flex flex-col">
            <span>Transactions (CSV)</span>
            <span className="text-xs text-muted-foreground">Transaction history</span>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => handleExport('json')}
          className="cursor-pointer"
        >
          <FileJson className="w-4 h-4 mr-2 text-orange-500" />
          <div className="flex flex-col">
            <span>Full Report (JSON)</span>
            <span className="text-xs text-muted-foreground">Machine-readable format</span>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => handleExport('print')}
          className="cursor-pointer"
        >
          <Printer className="w-4 h-4 mr-2 text-primary" />
          <div className="flex flex-col">
            <span>Print Report</span>
            <span className="text-xs text-muted-foreground">PDF-ready format</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportMenu;
