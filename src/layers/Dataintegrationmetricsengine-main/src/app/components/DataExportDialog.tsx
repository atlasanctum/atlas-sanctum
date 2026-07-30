import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Checkbox } from './ui/checkbox';
import { Download, FileJson, FileSpreadsheet, FileText, Database } from 'lucide-react';
import { Badge } from './ui/badge';

interface DataExportDialogProps {
  sectorName?: string;
  trigger?: React.ReactNode;
}

export const DataExportDialog: React.FC<DataExportDialogProps> = ({ 
  sectorName,
  trigger 
}) => {
  const [format, setFormat] = useState('csv');
  const [includeMetrics, setIncludeMetrics] = useState(true);
  const [includeForecast, setIncludeForecast] = useState(true);
  const [includeAlerts, setIncludeAlerts] = useState(false);
  const [includeInsights, setIncludeInsights] = useState(true);

  const handleExport = () => {
    // In a real app, this would generate and download the file
    console.log('Exporting data:', {
      format,
      includeMetrics,
      includeForecast,
      includeAlerts,
      includeInsights,
      sector: sectorName
    });
  };

  const formatOptions = [
    { value: 'csv', label: 'CSV', icon: FileSpreadsheet, description: 'Comma-separated values' },
    { value: 'json', label: 'JSON', icon: FileJson, description: 'JavaScript Object Notation' },
    { value: 'xlsx', label: 'Excel', icon: FileSpreadsheet, description: 'Microsoft Excel format' },
    { value: 'pdf', label: 'PDF Report', icon: FileText, description: 'Formatted PDF document' },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Export Data
          </DialogTitle>
          <DialogDescription>
            {sectorName 
              ? `Export ${sectorName} sector data in your preferred format.`
              : 'Export data from all sectors in your preferred format.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Format Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Export Format</Label>
            <RadioGroup value={format} onValueChange={setFormat} className="grid grid-cols-2 gap-3">
              {formatOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <div key={option.value}>
                    <RadioGroupItem
                      value={option.value}
                      id={option.value}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={option.value}
                      className="flex flex-col items-start gap-2 rounded-lg border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                    >
                      <Icon className="h-5 w-5" />
                      <div>
                        <div className="font-semibold text-sm">{option.label}</div>
                        <div className="text-xs text-muted-foreground">{option.description}</div>
                      </div>
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>

          {/* Data Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Include in Export</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <Checkbox 
                  id="metrics" 
                  checked={includeMetrics}
                  onCheckedChange={(checked) => setIncludeMetrics(checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor="metrics" className="font-medium cursor-pointer">
                    Metrics Data
                  </Label>
                  <p className="text-xs text-muted-foreground">Current values and historical trends</p>
                </div>
                <Badge variant="secondary">~2.4 MB</Badge>
              </div>
              
              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <Checkbox 
                  id="forecast" 
                  checked={includeForecast}
                  onCheckedChange={(checked) => setIncludeForecast(checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor="forecast" className="font-medium cursor-pointer">
                    AI Forecasts
                  </Label>
                  <p className="text-xs text-muted-foreground">Predicted values and confidence intervals</p>
                </div>
                <Badge variant="secondary">~840 KB</Badge>
              </div>
              
              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <Checkbox 
                  id="insights" 
                  checked={includeInsights}
                  onCheckedChange={(checked) => setIncludeInsights(checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor="insights" className="font-medium cursor-pointer">
                    AI Insights
                  </Label>
                  <p className="text-xs text-muted-foreground">Recommendations and analysis</p>
                </div>
                <Badge variant="secondary">~120 KB</Badge>
              </div>
              
              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <Checkbox 
                  id="alerts" 
                  checked={includeAlerts}
                  onCheckedChange={(checked) => setIncludeAlerts(checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor="alerts" className="font-medium cursor-pointer">
                    System Alerts
                  </Label>
                  <p className="text-xs text-muted-foreground">Warning and error logs</p>
                </div>
                <Badge variant="secondary">~85 KB</Badge>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => {}}>
            Cancel
          </Button>
          <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
