/**
 * ExportCenter Page
 * Export data, reports, and documents in various formats
 */

import { useState } from 'react';
import { Download, FileText, FileSpreadsheet, FileImage, FileCode, Clock, CheckCircle, AlertCircle, Loader2, Search, RefreshCw } from 'lucide-react';

type ExportFormat = 'pdf' | 'excel' | 'csv' | 'png' | 'json';
type ExportStatus = 'pending' | 'processing' | 'completed' | 'failed';

interface ExportJob {
  id: string;
  name: string;
  format: ExportFormat;
  status: ExportStatus;
  size?: string;
  createdAt: Date;
  completedAt?: Date;
  downloadUrl?: string;
}

interface ExportTemplate {
  id: string;
  name: string;
  description: string;
  format: ExportFormat;
  icon: typeof FileText;
}

const TEMPLATES: ExportTemplate[] = [
  { id: 'impact-report', name: 'Impact Report', description: 'Full environmental impact summary', format: 'pdf', icon: FileText },
  { id: 'portfolio-csv', name: 'Portfolio Data', description: 'Investment portfolio in spreadsheet format', format: 'csv', icon: FileSpreadsheet },
  { id: 'carbon-certificate', name: 'Carbon Certificate', description: 'Download carbon credit certificate', format: 'png', icon: FileImage },
  { id: 'project-json', name: 'Project Data', description: 'Raw project data in JSON format', format: 'json', icon: FileCode },
];

const MOCK_EXPORTS: ExportJob[] = [
  {
    id: '1',
    name: 'Q4 Impact Report',
    format: 'pdf',
    status: 'completed',
    size: '2.4 MB',
    createdAt: new Date('2024-01-15T10:30:00'),
    completedAt: new Date('2024-01-15T10:30:45'),
    downloadUrl: '/exports/q4-impact-report.pdf',
  },
  {
    id: '2',
    name: 'Portfolio Performance Jan',
    format: 'excel',
    status: 'completed',
    size: '1.8 MB',
    createdAt: new Date('2024-01-14T14:20:00'),
    completedAt: new Date('2024-01-14T14:20:30'),
    downloadUrl: '/exports/portfolio-jan.xlsx',
  },
  {
    id: '3',
    name: 'Carbon Credits Export',
    format: 'csv',
    status: 'processing',
    createdAt: new Date('2024-01-16T09:00:00'),
  },
  {
    id: '4',
    name: 'Project Analytics',
    format: 'json',
    status: 'failed',
    createdAt: new Date('2024-01-13T16:45:00'),
  },
];

export default function ExportCenter() {
  const [exports, setExports] = useState<ExportJob[]>(MOCK_EXPORTS);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const formatIcon = (format: ExportFormat) => {
    switch (format) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-500" />;
      case 'excel':
      case 'csv':
        return <FileSpreadsheet className="w-5 h-5 text-green-600" />;
      case 'png':
        return <FileImage className="w-5 h-5 text-blue-500" />;
      case 'json':
        return <FileCode className="w-5 h-5 text-yellow-500" />;
    }
  };

  const formatStatus = (status: ExportStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'processing':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const handleExport = async (template: ExportTemplate) => {
    setIsExporting(true);
    setSelectedTemplate(template.id);

    // Simulate export process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newExport: ExportJob = {
      id: Date.now().toString(),
      name: template.name,
      format: template.format,
      status: 'completed',
      size: `${(Math.random() * 5 + 0.5).toFixed(1)} MB`,
      createdAt: new Date(),
      completedAt: new Date(),
      downloadUrl: `/exports/${template.name.toLowerCase().replace(/\s+/g, '-')}.${template.format}`,
    };

    setExports((prev) => [newExport, ...prev]);
    setIsExporting(false);
    setSelectedTemplate(null);
  };

  const filteredExports = exports.filter((exp) =>
    exp.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Export Center</h1>
            <p className="text-slate-600 mt-2">Download reports, certificates, and data exports</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <button className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Export Templates */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Export</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleExport(template)}
                    disabled={isExporting}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      selectedTemplate === template.id
                        ? 'border-blue-300 bg-blue-50'
                        : 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${selectedTemplate === template.id ? 'bg-blue-100' : 'bg-slate-100'}`}>
                        {isExporting && selectedTemplate === template.id ? (
                          <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                        ) : (
                          <template.icon className="w-5 h-5 text-slate-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{template.name}</p>
                        <p className="text-sm text-slate-500 mt-1">{template.description}</p>
                        <span className="inline-block mt-2 px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded uppercase font-medium">
                          {template.format}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Export History */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 mt-6">
              <div className="px-6 py-4 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">Export History</h2>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search exports..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>
              <div className="divide-y divide-slate-100">
                {filteredExports.map((exp) => (
                  <div key={exp.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50">
                    <div className="flex items-center gap-4">
                      {formatIcon(exp.format)}
                      <div>
                        <p className="font-medium text-slate-900">{exp.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-500">
                            Created {formatDate(exp.createdAt)}
                          </span>
                          {exp.size && (
                            <>
                              <span className="text-slate-300">•</span>
                              <span className="text-xs text-slate-500">{exp.size}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        {formatStatus(exp.status)}
                        <span className="text-sm capitalize text-slate-600">
                          {exp.status}
                        </span>
                      </div>
                      {exp.status === 'completed' && exp.downloadUrl && (
                        <button className="p-2 rounded-lg hover:bg-emerald-50 text-emerald-600">
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                      {exp.status === 'failed' && (
                        <button className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                          Retry
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Storage Info */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <h3 className="font-semibold text-slate-900 mb-3">Storage Usage</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Used</span>
                  <span className="font-medium text-slate-900">2.4 GB</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '48%' }} />
                </div>
                <p className="text-xs text-slate-500">of 5 GB total storage</p>
              </div>
            </div>

            {/* Supported Formats */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <h3 className="font-semibold text-slate-900 mb-3">Supported Formats</h3>
              <div className="space-y-2">
                {[
                  { format: 'PDF', desc: 'Documents', color: 'text-red-500' },
                  { format: 'Excel/CSV', desc: 'Spreadsheets', color: 'text-green-600' },
                  { format: 'PNG', desc: 'Images', color: 'text-blue-500' },
                  { format: 'JSON', desc: 'Data', color: 'text-yellow-500' },
                ].map(({ format, desc, color }) => (
                  <div key={format} className="flex items-center gap-2 text-sm">
                    <span className={`font-medium ${color}`}>{format}</span>
                    <span className="text-slate-500">- {desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Help */}
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
              <p className="text-sm text-blue-700">
                Contact support if you have issues with exports or need custom report formats.
              </p>
              <button className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
