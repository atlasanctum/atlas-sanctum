// Custom Report Builder Component with Drag-and-Drop
import React, { useState, useCallback } from 'react';
import {
  Plus,
  GripVertical,
  Trash2,
  Settings,
  BarChart3,
  PieChart,
  LineChart,
  Table,
  Save,
  Download,
  Eye,
  Clock,
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  X,
} from 'lucide-react';
import type {
  DashboardWidget,
  ChartConfig,
  ReportConfig,
  ReportSchedule,
} from '../../types/analytics';

// Widget Type Definitions
const WIDGET_TYPES = [
  { type: 'line', label: 'Line Chart', icon: LineChart },
  { type: 'bar', label: 'Bar Chart', icon: BarChart3 },
  { type: 'pie', label: 'Pie Chart', icon: PieChart },
  { type: 'area', label: 'Area Chart', icon: LineChart },
  { type: 'table', label: 'Data Table', icon: Table },
] as const;

// Data Source Options
const DATA_SOURCES = [
  { id: 'revenue', label: 'Revenue Data', icon: DollarSign },
  { id: 'users', label: 'User Analytics', icon: Users },
  { id: 'conversions', label: 'Conversion Rates', icon: TrendingUp },
  { id: 'performance', label: 'Performance Metrics', icon: Activity },
];

// Widget Configuration Modal
interface WidgetConfigModalProps {
  widget: Partial<DashboardWidget>;
  onSave: (widget: Partial<DashboardWidget>) => void;
  onClose: () => void;
}

const WidgetConfigModal: React.FC<WidgetConfigModalProps> = ({ widget, onSave, onClose }) => {
  const [config, setConfig] = useState<Partial<DashboardWidget>>(
    widget && Object.keys(widget).length > 0
      ? widget
      : {
          type: 'chart',
          title: '',
          config: {
            type: 'line',
            title: 'New Chart',
            dataSource: 'revenue',
            colors: ['#3b82f6'],
          },
        }
  );
  
  const [chartType, setChartType] = useState<ChartConfig['type']>(
    config.config?.type || 'line'
  );

  const handleSave = () => {
    if (config.title) {
      onSave(config);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-lg mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">Configure Widget</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Widget Title
            </label>
            <input
              type="text"
              value={config.title || ''}
              onChange={(e) => setConfig({ ...config, title: e.target.value })}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
              placeholder="Enter widget title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Chart Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {WIDGET_TYPES.map((wt) => {
                const Icon = wt.icon;
                return (
                  <button
                    key={wt.type}
                    onClick={() =>
                      setConfig({
                        ...config,
                          type: 'chart',
                        config: {
                          ...config.config,
                          type: wt.type as ChartConfig['type'],
                        },
                      })
                    }
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-colors ${
                        config.config?.type === wt.type
                        ? 'border-blue-500 bg-blue-500/20'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-gray-300" />
                    <span className="text-xs text-gray-400">{wt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Data Source
            </label>
            <select
              value={config.config?.dataSource || ''}
              onChange={(e) =>
                setConfig({
                  ...config,
                  config: { ...config.config!, dataSource: e.target.value },
                })
              }
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select data source</option>
              {DATA_SOURCES.map((ds) => (
                <option key={ds.id} value={ds.id}>
                  {ds.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Refresh Interval
            </label>
            <select
              value={config.config?.refreshInterval || 0}
              onChange={(e) =>
                setConfig({
                  ...config,
                  config: { ...config.config!, refreshInterval: parseInt(e.target.value) },
                })
              }
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value={0}>Manual</option>
              <option value={5000}>5 seconds</option>
              <option value={15000}>15 seconds</option>
              <option value={30000}>30 seconds</option>
              <option value={60000}>1 minute</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
          >
            Save Widget
          </button>
        </div>
      </div>
    </div>
  );
};

// Schedule Configuration Modal
interface ScheduleConfigModalProps {
  schedule?: ReportSchedule;
  onSave: (schedule: ReportSchedule) => void;
  onClose: () => void;
}

const ScheduleConfigModal: React.FC<ScheduleConfigModalProps> = ({
  schedule,
  onSave,
  onClose,
}) => {
  const [config, setConfig] = useState<ReportSchedule>(
    schedule || {
      frequency: 'weekly',
      recipients: [],
      enabled: true,
    }
  );
  const [recipientInput, setRecipientInput] = useState('');

  const addRecipient = () => {
    if (recipientInput && recipientInput.includes('@')) {
      setConfig({
        ...config,
        recipients: [...config.recipients, recipientInput],
      });
      setRecipientInput('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-lg mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">Schedule Report</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Frequency
            </label>
            <select
              value={config.frequency}
              onChange={(e) =>
                setConfig({ ...config, frequency: e.target.value as ReportSchedule['frequency'] })
              }
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Recipients
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="email"
                value={recipientInput}
                onChange={(e) => setRecipientInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addRecipient()}
                className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Enter email address"
              />
              <button
                onClick={addRecipient}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {config.recipients.map((email, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm"
                >
                  {email}
                  <button
                    onClick={() =>
                      setConfig({
                        ...config,
                        recipients: config.recipients.filter((_, i) => i !== index),
                      })
                    }
                    className="hover:text-blue-300"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="enabled"
              checked={config.enabled}
              onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
              className="w-4 h-4 bg-gray-900 border-gray-700 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="enabled" className="text-sm text-gray-300">
              Enable scheduled generation
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(config)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
          >
            Save Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Report Builder Component
const ReportBuilder: React.FC = () => {
  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
  const [showWidgetModal, setShowWidgetModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [editingWidget, setEditingWidget] = useState<Partial<DashboardWidget> | null>(null);
  const [reportName, setReportName] = useState('Untitled Report');
  const [reportDescription, setReportDescription] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  const addWidget = useCallback((type: string) => {
    const newWidget: DashboardWidget = {
      id: `widget-${Date.now()}`,
      type: type as DashboardWidget['type'],
      title: `New ${type} chart`,
      config: {
        type: type as ChartConfig['type'],
        title: `New ${type} chart`,
        dataSource: 'revenue',
        colors: ['#3b82f6'],
      },
      position: { x: 0, y: 0, width: 6, height: 3 },
    };
    setWidgets([...widgets, newWidget]);
  }, [widgets]);

  const removeWidget = useCallback((id: string) => {
    setWidgets(widgets.filter((w) => w.id !== id));
  }, [widgets]);

  const updateWidget = useCallback((updatedWidget: Partial<DashboardWidget>) => {
    if (editingWidget?.id) {
      setWidgets(widgets.map((w) => (w.id === editingWidget.id ? { ...w, ...updatedWidget } : w)));
    } else {
      const fullConfig: ChartConfig = {
        type: (updatedWidget.config?.type || updatedWidget.type || 'line') as ChartConfig['type'],
        title: updatedWidget.title || 'New Chart',
        dataSource: updatedWidget.config?.dataSource || 'revenue',
        colors: updatedWidget.config?.colors || ['#3b82f6'],
      };
      const newWidget: DashboardWidget = {
        ...updatedWidget as DashboardWidget,
        id: `widget-${Date.now()}`,
        config: fullConfig,
        position: { x: 0, y: 0, width: 6, height: 3 },
      };
      setWidgets([...widgets, newWidget]);
    }
    setShowWidgetModal(false);
    setEditingWidget(null);
  }, [editingWidget, widgets]);

  const handleDragStart = (index: number) => {
    setDraggedItem(index);
  };

  const handleDragOver = (index: number) => {
    if (draggedItem === null || draggedItem === index) return;
    const newWidgets = [...widgets];
    const draggedWidget = newWidgets[draggedItem];
    newWidgets.splice(draggedItem, 1);
    newWidgets.splice(index, 0, draggedWidget);
    setWidgets(newWidgets);
    setDraggedItem(index);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleSaveReport = async () => {
    const report: ReportConfig = {
      id: `report-${Date.now()}`,
      name: reportName,
      description: reportDescription,
      widgets,
      exportFormat: 'pdf',
    };

    try {
      const response = await fetch('/api/analytics/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report),
      });
      const data = await response.json();
      if (data.success) {
        console.log('Report saved:', data.data);
      }
    } catch (error) {
      console.error('Failed to save report:', error);
    }
  };

  const handleExport = async (format: 'pdf' | 'csv' | 'excel') => {
    const report: ReportConfig = {
      id: `report-${Date.now()}`,
      name: reportName,
      description: reportDescription,
      widgets,
      exportFormat: format,
    };

    try {
      const response = await fetch('/api/analytics/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId: report.id, format }),
      });
      const data = await response.json();
      if (data.success) {
        window.open(data.data.downloadUrl, '_blank');
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <input
              type="text"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              className="bg-transparent text-xl font-bold text-white focus:outline-none focus:border-b border-blue-500"
            />
            <input
              type="text"
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              className="bg-transparent text-sm text-gray-400 focus:outline-none w-full"
              placeholder="Add a description..."
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              previewMode ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Eye className="w-4 h-4" />
            {previewMode ? 'Edit Mode' : 'Preview'}
          </button>
          <button
            onClick={() => setShowScheduleModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            <Clock className="w-4 h-4" />
            Schedule
          </button>
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <button
                onClick={() => handleExport('pdf')}
                className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 first:rounded-t-lg"
              >
                Export as PDF
              </button>
              <button
                onClick={() => handleExport('csv')}
                className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700"
              >
                Export as CSV
              </button>
              <button
                onClick={() => handleExport('excel')}
                className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 last:rounded-b-lg"
              >
                Export as Excel
              </button>
            </div>
          </div>
          <button
            onClick={handleSaveReport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Widget Palette */}
        <div className="col-span-1">
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4">
            <h3 className="text-sm font-medium text-white mb-4">Add Widgets</h3>
            <div className="space-y-2">
              {WIDGET_TYPES.map((wt) => {
                const Icon = wt.icon;
                return (
                  <button
                    key={wt.type}
                    onClick={() => {
                      setEditingWidget(null);
                      addWidget(wt.type);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 bg-gray-700/50 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{wt.label}</span>
                    <Plus className="w-4 h-4 ml-auto opacity-50" />
                  </button>
                );
              })}
            </div>

            <h3 className="text-sm font-medium text-white mt-6 mb-4">Data Sources</h3>
            <div className="space-y-2">
              {DATA_SOURCES.map((ds) => {
                const Icon = ds.icon;
                return (
                  <div
                    key={ds.id}
                    className="flex items-center gap-3 px-3 py-2 bg-gray-700/30 rounded-lg text-gray-400"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{ds.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Report Canvas */}
        <div className="col-span-3">
          <div className="bg-gray-800/30 rounded-xl border-2 border-dashed border-gray-700/50 min-h-[600px] p-4">
            {widgets.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Plus className="w-12 h-12 mb-4 opacity-50" />
                <p className="text-lg font-medium">Click widgets to add them</p>
                <p className="text-sm">Build your custom report by adding widgets</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {widgets.map((widget, index) => {
                  const WidgetIcon = WIDGET_TYPES.find((w) => w.type === widget.type)?.icon || BarChart3;
                  return (
                    <div
                      key={widget.id}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => {
                        e.preventDefault();
                        handleDragOver(index);
                      }}
                      onDragEnd={handleDragEnd}
                      className={`bg-gray-800/50 border border-gray-700/50 rounded-lg p-4 hover:border-gray-600/50 transition-all cursor-move ${
                        draggedItem === index ? 'opacity-50' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-700/50 rounded">
                          <GripVertical className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                          <WidgetIcon className="w-4 h-4 text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-white">{widget.title}</h4>
                          <p className="text-xs text-gray-400">
                            {widget.config.type} chart • {widget.config.dataSource}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingWidget(widget);
                              setShowWidgetModal(true);
                            }}
                            className="p-1.5 hover:bg-gray-700/50 rounded transition-colors"
                            title="Configure widget"
                          >
                            <Settings className="w-4 h-4 text-gray-400" />
                          </button>
                          <button
                            onClick={() => removeWidget(widget.id)}
                            className="p-1.5 hover:bg-red-500/20 rounded transition-colors"
                            title="Remove widget"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Widget Configuration Modal */}
      {showWidgetModal && (
        <WidgetConfigModal
          widget={editingWidget || {}}
          onSave={updateWidget}
          onClose={() => {
            setShowWidgetModal(false);
            setEditingWidget(null);
          }}
        />
      )}

      {/* Schedule Configuration Modal */}
      {showScheduleModal && (
        <ScheduleConfigModal
          onSave={(schedule) => {
            console.log('Schedule saved:', schedule);
            setShowScheduleModal(false);
          }}
          onClose={() => setShowScheduleModal(false)}
        />
      )}
    </div>
  );
};

export default ReportBuilder;
