// Export Service for PDF, CSV, and Excel generation
import type { ReportConfig, ExportResult, AnalyticsFilter } from '../types/analytics';

interface ExportData {
  headers: string[];
  rows: Array<Record<string, unknown>>;
  title: string;
  generatedAt: string;
}

function triggerDownload(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// CSV Export
export function exportToCSV(data: ExportData, filename: string): void {
  const { headers, rows } = data;
  
  const headerRow = headers.join(',');
  
  const dataRows = rows.map((row) =>
    headers.map((header) => {
      const value = row[header];
      if (value === null || value === undefined) {
        return '';
      }
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return String(value);
    }).join(',')
  ).join('\n');
  
  triggerDownload(`${headerRow}\n${dataRows}`, `${filename}.csv`, 'text/csv');
}

// Excel Export
export function exportToExcel(data: ExportData, filename: string): void {
  const { headers, rows, title, generatedAt } = data;
  
  const headerCells = headers.map((h) => 
    `<Cell ss:StyleID="Header"><Data ss:Type="String">${h}</Data></Cell>`
  ).join('\n      ');
  
  const dataRows = rows.map((row) =>
    `<Row>${headers.map((h) => {
      const value = row[h];
      const type = typeof value === 'number' ? 'Number' : 'String';
      return `<Cell><Data ss:Type="${type}">${value}</Data></Cell>`;
    }).join('')}</Row>`
  ).join('\n      ');
  
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Styles>
    <Style ss:ID="Header">
      <Font ss:Bold="1"/>
      <Interior ss:Color="#D3D3D3" ss:Pattern="Solid"/>
    </Style>
  </Styles>
  <Worksheet ss:Name="${title}">
    <Table>
      <Row ss:Height="20"><Cell ss:MergeAcross="${headers.length - 1}"><Data ss:Type="String">${title}</Data></Cell></Row>
      <Row><Cell ss:MergeAcross="${headers.length - 1}"><Data ss:Type="String">Generated: ${generatedAt}</Data></Cell></Row>
      <Row>${headerCells}</Row>
      ${dataRows}
    </Table>
  </Worksheet>
</Workbook>`;
  
  triggerDownload(xmlContent, `${filename}.xls`, 'application/vnd.ms-excel');
}

// PDF Export (HTML-based for printing)
export function exportToPDF(data: ExportData, filename: string): void {
  const { headers, rows, title, generatedAt } = data;
  
  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>${title}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    h1 { color: #1a1a1a; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
    .meta { color: #666; font-size: 12px; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th { background-color: #3b82f6; color: white; padding: 12px; text-align: left; }
    td { border: 1px solid #ddd; padding: 10px; }
    tr:nth-child(even) { background-color: #f9fafb; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 11px; }
    button { padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 5px; cursor: pointer; margin-top: 20px; }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <div class="meta">Generated: ${generatedAt}</div>
  <table>
    <thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
    <tbody>
      ${rows.map((row) => `<tr>${headers.map((h) => `<td>${row[h] ?? ''}</td>`).join('')}</tr>`).join('')}
    </tbody>
  </table>
  <button onclick="window.print()">Print / Save as PDF</button>
</body>
</html>`;
  
  triggerDownload(htmlContent, `${filename}.html`, 'text/html');
}

// Export Service Class
class ExportService {
  async exportReport(report: ReportConfig, format: 'pdf' | 'csv' | 'excel', filters?: AnalyticsFilter[]): Promise<ExportResult> {
    try {
      const response = await fetch('/api/analytics/aggregate', { method: 'GET', headers: { 'Content-Type': 'application/json' }});
      const responseData = await response.json();
      
      if (!responseData.success) {
        throw new Error('Failed to fetch report data');
      }
      
      const exportData: ExportData = {
        headers: ['Metric', 'Value', 'Change', 'Change %'],
        rows: responseData.data.metrics.map((m: { metric: string; value: number; change?: number; changePercent?: number }) => ({
          Metric: m.metric,
          Value: m.value.toFixed(2),
          Change: m.change?.toFixed(2) || '0',
          'Change %': (m.changePercent?.toFixed(2) || '0') + '%',
        })),
        title: report.name,
        generatedAt: new Date().toISOString(),
      };
      
      const safeFilename = `${report.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`;
      
      switch (format) {
        case 'csv':
          exportToCSV(exportData, safeFilename);
          break;
        case 'excel':
          exportToExcel(exportData, safeFilename);
          break;
        case 'pdf':
          exportToPDF(exportData, safeFilename);
          break;
      }
      
      return { downloadUrl: '', filename: `${safeFilename}.${format}`, expiresAt: new Date(Date.now() + 3600000).toISOString() };
    } catch (error) {
      console.error('Export failed:', error);
      throw error;
    }
  }

  exportDataToCSV(data: Array<Record<string, unknown>>, filename: string): void {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]);
    exportToCSV({ headers, rows: data, title: filename, generatedAt: new Date().toISOString() }, filename);
  }

  exportTimeSeriesToCSV(data: Array<{ timestamp: string; value: number; label?: string }>, filename: string): void {
    exportToCSV({
      headers: ['Timestamp', 'Value', 'Label'],
      rows: data.map((d) => ({ Timestamp: new Date(d.timestamp).toLocaleString(), Value: d.value.toFixed(2), Label: d.label || '' })),
      title: filename,
      generatedAt: new Date().toISOString(),
    }, filename);
  }
}

export const exportService = new ExportService();
export default exportService;
