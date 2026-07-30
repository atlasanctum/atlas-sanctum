/**
 * ReportBuilder Page
 * Custom report builder with templates and export options
 */

import { useState, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Download, FileText, Calendar, Trash2, Eye, Layout, BarChart3, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';

type WidgetType = 'metric' | 'bar' | 'line' | 'pie' | 'table';

interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  data: Record<string, unknown>[];
  config: Record<string, unknown>;
  size: 'small' | 'medium' | 'large';
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  widgets: Widget[];
}

const TEMPLATES: ReportTemplate[] = [
  {
    id: 'impact-summary',
    name: 'Impact Summary',
    description: 'Overview of environmental impact metrics',
    widgets: [],
  },
  {
    id: 'portfolio-performance',
    name: 'Portfolio Performance',
    description: 'Investment returns and carbon credits',
    widgets: [],
  },
  {
    id: 'project-analysis',
    name: 'Project Analysis',
    description: 'Detailed project performance breakdown',
    widgets: [],
  },
];

// Mock data
const BAR_DATA = [
  { name: 'Amazon', value: 1200 },
  { name: 'Coral', value: 800 },
  { name: 'Mangrove', value: 650 },
  { name: 'Soil', value: 900 },
  { name: 'Forest', value: 1100 },
];

const LINE_DATA = [
  { date: 'Jan', carbon: 120, biodiversity: 80 },
  { date: 'Feb', carbon: 150, biodiversity: 85 },
  { date: 'Mar', carbon: 180, biodiversity: 88 },
  { date: 'Apr', carbon: 220, biodiversity: 92 },
  { date: 'May', carbon: 280, biodiversity: 95 },
  { date: 'Jun', carbon: 350, biodiversity: 98 },
];

const PIE_DATA = [
  { name: 'Reforestation', value: 45, color: '#10b981' },
  { name: 'Ocean', value: 25, color: '#3b82f6' },
  { name: 'Soil', value: 15, color: '#8b5cf6' },
  { name: 'Conservation', value: 15, color: '#f59e0b' },
];

export default function ReportBuilder() {
  const [reportTitle, setReportTitle] = useState('My Custom Report');
  const [widgets, setWidgets] = useState<Widget[]>([
    {
      id: '1',
      type: 'metric',
      title: 'Total Carbon Offset',
      data: [{ value: 1250 }],
      config: {},
      size: 'small',
    },
    {
      id: '2',
      type: 'bar',
      title: 'Carbon by Project',
      data: BAR_DATA,
      config: {},
      size: 'medium',
    },
    {
      id: '3',
      type: 'line',
      title: 'Impact Trend',
      data: LINE_DATA,
      config: {},
      size: 'large',
    },
  ]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [previewMode, setPreviewMode] = useState(false);

  const addWidget = useCallback((type: WidgetType) => {
    const newWidget: Widget = {
      id: Date.now().toString(),
      type,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Widget`,
      data: type === 'bar' ? BAR_DATA : type === 'line' ? LINE_DATA : PIE_DATA,
      config: {},
      size: 'medium',
    };
    setWidgets((prev) => [...prev, newWidget]);
  }, []);

  const removeWidget = useCallback((id: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const updateWidget = useCallback((id: string, updates: Partial<Widget>) => {
    setWidgets((prev) => prev.map((w) => (w.id === id ? { ...w, ...updates } : w)));
  }, []);

  const exportReport = useCallback((format: 'pdf' | 'csv' | 'excel') => {
    console.log(`Exporting report as ${format}`);
    // Implementation would call export service
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Report Builder</h1>
            <p className="text-slate-600 mt-2">Create custom reports with drag-and-drop widgets</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              {previewMode ? 'Edit' : 'Preview'}
            </button>
            <button
              onClick={() => exportReport('pdf')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Templates */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <h3 className="font-semibold text-slate-900 mb-3">Templates</h3>
              <div className="space-y-2">
                {TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedTemplate === template.id
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <p className="font-medium text-slate-900 text-sm">{template.name}</p>
                    <p className="text-xs text-slate-500 mt-1">{template.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Widget Library */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <h3 className="font-semibold text-slate-900 mb-3">Add Widget</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { type: 'metric' as WidgetType, icon: Layout, label: 'Metric' },
                  { type: 'bar' as WidgetType, icon: BarChart3, label: 'Bar Chart' },
                  { type: 'line' as WidgetType, icon: TrendingUp, label: 'Line Chart' },
                  { type: 'pie' as WidgetType, icon: PieChartIcon, label: 'Pie Chart' },
                ].map(({ type, icon: Icon, label }) => (
                  <button
                    key={type}
                    onClick={() => addWidget(type)}
                    className="p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 flex flex-col items-center gap-1 transition-colors"
                  >
                    <Icon className="w-5 h-5 text-slate-600" />
                    <span className="text-xs font-medium text-slate-700">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Date Filter */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date Range
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-slate-500">Start Date</label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange((p) => ({ ...p, start: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-500">End Date</label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange((p) => ({ ...p, end: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Report Title */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
              <input
                type="text"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                className="w-full text-xl font-semibold text-slate-900 border-none focus:outline-none focus:ring-0"
                placeholder="Enter report title..."
              />
            </div>

            {/* Widgets Grid */}
            <div className="space-y-4">
              {widgets.map((widget) => (
                <div
                  key={widget.id}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
                >
                  {/* Widget Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                    <input
                      type="text"
                      value={widget.title}
                      onChange={(e) => updateWidget(widget.id, { title: e.target.value })}
                      className="font-medium text-slate-900 border-none focus:outline-none focus:ring-0"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => removeWidget(widget.id)}
                        className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Widget Content */}
                  <div className={`p-4 ${widget.size === 'large' ? 'h-96' : widget.size === 'medium' ? 'h-64' : 'h-40'}`}>
                    {widget.type === 'metric' && (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <p className="text-5xl font-bold text-emerald-600">
                            {widget.data[0]?.value?.toLocaleString()}
                          </p>
                          <p className="text-slate-500 mt-2">Total Carbon Offset (tons)</p>
                        </div>
                      </div>
                    )}
                    {widget.type === 'bar' && (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={widget.data}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                          <YAxis stroke="#94a3b8" fontSize={12} />
                          <Tooltip />
                          <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                    {widget.type === 'line' && (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={widget.data}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                          <YAxis stroke="#94a3b8" fontSize={12} />
                          <Tooltip />
                          <Line type="monotone" dataKey="carbon" stroke="#10b981" strokeWidth={2} />
                          <Line type="monotone" dataKey="biodiversity" stroke="#3b82f6" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                    {widget.type === 'pie' && (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={widget.data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {widget.data.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={(entry as { color?: string }).color || '#10b981'} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              ))}

              {widgets.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900">No Widgets Added</h3>
                  <p className="text-slate-500 mt-2">Add widgets from the sidebar to build your report</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
