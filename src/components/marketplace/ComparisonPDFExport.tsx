import { useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CarbonProject} from '@/types/marketplace';
import { useToast } from '@/hooks/use-toast';

interface ComparisonPDFExportProps {
  projects: CarbonProject[];
}

export function ComparisonPDFExport({ projects }: ComparisonPDFExportProps) {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const generatePDF = async () => {
    if (projects.length < 2) {
      toast({
        title: 'Not enough projects',
        description: 'Select at least 2 projects to export a comparison.',
        variant: 'destructive',
      });
      return;
    }

    setIsExporting(true);

    try {
      // Dynamic imports to reduce bundle size
      // const { jsPDF } = await import('jspdf');

      // Temporary workaround - show toast instead of PDF generation
      toast({
        title: 'PDF Export',
        description: 'PDF export functionality is temporarily unavailable. Please try again later.',
      });
      setIsExporting(false);
      return;

      /*
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      let yPos = margin;

      /*
      // Header
      doc.setFillColor(16, 185, 129); // Primary green
      doc.rect(0, 0, pageWidth, 35, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('Atlas Sanctum', margin, 18);
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('Carbon Credit Project Comparison', margin, 28);

      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - margin - 50, 18);
      doc.text(`Projects: ${projects.length}`, pageWidth - margin - 50, 25);

      yPos = 45;

      // Project comparison table
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Project Comparison', margin, yPos);
      yPos += 10;

      // Table headers
      const colWidth = (pageWidth - margin * 2 - 50) / projects.length;
      const metricColWidth = 50;

      // Draw header row
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, yPos - 5, pageWidth - margin * 2, 12, 'F');
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(100, 116, 139);
      doc.text('Metric', margin + 2, yPos + 2);

      projects.forEach((project, i) => {
        const xPos = margin + metricColWidth + (i * colWidth);
        const title = project.title.length > 20 ? project.title.slice(0, 20) + '...' : project.title;
        doc.text(title, xPos + 2, yPos + 2);
      });

      yPos += 12;

      // Table rows
      const metrics = [
        { label: 'Project Type', getValue: (p: CarbonProject) => PROJECT_TYPE_LABELS[p.project_type] },
        { label: 'Location', getValue: (p: CarbonProject) => p.location },
        { label: 'Country', getValue: (p: CarbonProject) => p.country },
        { label: 'Price/Credit', getValue: (p: CarbonProject) => `${p.price_per_credit.toFixed(2)}` },
        { label: 'CO₂ Offset/Credit', getValue: (p: CarbonProject) => `${p.co2_offset_per_credit.toFixed(1)} tons` },
        { label: 'Available Credits', getValue: (p: CarbonProject) => p.available_credits.toLocaleString() },
        { label: 'Vintage Year', getValue: (p: CarbonProject) => p.vintage_year.toString() },
        { label: 'Certification', getValue: (p: CarbonProject) => p.certification },
        { label: 'Developer', getValue: (p: CarbonProject) => p.developer_name },
        { label: 'Status', getValue: (p: CarbonProject) => p.status.charAt(0).toUpperCase() + p.status.slice(1) },
      ];

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);

      metrics.forEach((metric, rowIndex) => {
        // Alternate row background
        if (rowIndex % 2 === 0) {
          doc.setFillColor(249, 250, 251);
          doc.rect(margin, yPos - 4, pageWidth - margin * 2, 10, 'F');
        }

        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text(metric.label, margin + 2, yPos + 2);

        doc.setTextColor(30, 41, 59);
        projects.forEach((project, i) => {
          const xPos = margin + metricColWidth + (i * colWidth);
          const value = metric.getValue(project);
          const displayValue = value.length > 25 ? value.slice(0, 25) + '...' : value;
          doc.text(displayValue, xPos + 2, yPos + 2);
        });

        yPos += 10;
      });

      // Add divider
      yPos += 5;
      doc.setDrawColor(229, 231, 235);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 10;

      // Summary section
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('Quick Summary', margin, yPos);
      yPos += 8;

      // Find best values
      const lowestPrice = Math.min(...projects.map((p) => p.price_per_credit));
      const highestCO2 = Math.max(...projects.map((p) => p.co2_offset_per_credit));
      const mostCredits = Math.max(...projects.map((p) => p.available_credits));

      const summaryItems = [
        `• Best Price: ${lowestPrice.toFixed(2)}/credit`,
        `• Highest CO₂ Offset: ${highestCO2.toFixed(1)} tons/credit`,
        `• Most Available Credits: ${mostCredits.toLocaleString()}`,
        `• Total Projects Compared: ${projects.length}`,
      ];

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      summaryItems.forEach((item) => {
        doc.text(item, margin, yPos);
        yPos += 6;
      });

      // Footer
      doc.setFillColor(248, 250, 252);
      doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');
      
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(
        'This comparison report was generated by Atlas Sanctum Carbon Credit Marketplace',
        pageWidth / 2,
        pageHeight - 7,
        { align: 'center' }
      );

      // Save the PDF
      const fileName = `project-comparison-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      */

      toast({
        title: 'PDF Downloaded',
        description: 'Comparison saved successfully',
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: 'Export Failed',
        description: 'Failed to generate PDF. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={generatePDF}
      disabled={isExporting || projects.length < 2}
      className="gap-2"
    >
      {isExporting ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <FileText className="w-4 h-4" />
      )}
      Export PDF
    </Button>
  );
}
