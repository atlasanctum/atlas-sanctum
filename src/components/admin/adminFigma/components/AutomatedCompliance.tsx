import React, { useState } from 'react';
import { FileText, Download, CheckCircle, Clock, AlertCircle, Sparkles } from 'lucide-react';

interface ComplianceReport {
  id: string;
  standard: string;
  status: 'ready' | 'generating' | 'review';
  completeness: number;
  lastGenerated: Date;
}

export function AutomatedCompliance() {
  const [generating, setGenerating] = useState(false);
  const [selectedStandard, setSelectedStandard] = useState('');

  const reports: ComplianceReport[] = [
    {
      id: '1',
      standard: 'GRI (Global Reporting Initiative)',
      status: 'ready',
      completeness: 100,
      lastGenerated: new Date(Date.now() - 7 * 24 * 60 * 60000),
    },
    {
      id: '2',
      standard: 'SASB (Sustainability Accounting)',
      status: 'ready',
      completeness: 100,
      lastGenerated: new Date(Date.now() - 14 * 24 * 60 * 60000),
    },
    {
      id: '3',
      standard: 'TCFD (Climate Financial Disclosures)',
      status: 'review',
      completeness: 95,
      lastGenerated: new Date(Date.now() - 2 * 24 * 60 * 60000),
    },
    {
      id: '4',
      standard: 'CDP (Carbon Disclosure Project)',
      status: 'generating',
      completeness: 67,
      lastGenerated: new Date(),
    },
  ];

  const generateReport = (standard: string) => {
    setGenerating(true);
    setSelectedStandard(standard);
    setTimeout(() => {
      setGenerating(false);
      setSelectedStandard('');
    }, 3000);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="mb-4 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl mb-2 flex items-center gap-2 sm:gap-3">
          <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
          Automated Compliance Reporting
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          AI-powered report generation for all major sustainability standards
        </p>
      </div>

      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-4 sm:p-6 text-white">
        <div className="flex items-start gap-3">
          <Sparkles className="w-6 h-6 flex-shrink-0" />
          <div>
            <h3 className="text-base sm:text-lg mb-2">90% Time Savings</h3>
            <p className="text-sm opacity-90 mb-3">
              Our AI automatically pulls data from all systems, formats to standards, validates completeness, and generates audit-ready reports in minutes instead of weeks.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white/20 rounded text-xs">GRI</span>
              <span className="px-3 py-1 bg-white/20 rounded text-xs">SASB</span>
              <span className="px-3 py-1 bg-white/20 rounded text-xs">TCFD</span>
              <span className="px-3 py-1 bg-white/20 rounded text-xs">CDP</span>
              <span className="px-3 py-1 bg-white/20 rounded text-xs">UN SDGs</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {reports.map((report) => (
          <div key={report.id} className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-sm mb-1">{report.standard}</h3>
                <p className="text-xs text-gray-500">
                  Last generated: {report.lastGenerated.toLocaleDateString()}
                </p>
              </div>
              <span className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${
                report.status === 'ready' ? 'bg-emerald-100 text-emerald-700' :
                report.status === 'generating' ? 'bg-blue-100 text-blue-700' :
                'bg-amber-100 text-amber-700'
              }`}>
                {report.status === 'ready' && <CheckCircle className="w-3 h-3" />}
                {report.status === 'generating' && <Clock className="w-3 h-3 animate-spin" />}
                {report.status === 'review' && <AlertCircle className="w-3 h-3" />}
                {report.status}
              </span>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Completeness</span>
                <span>{report.completeness}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
                  style={{ width: `${report.completeness}%` }}
                />
              </div>
            </div>

            <div className="flex gap-2">
              {report.status === 'ready' && (
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-xs">
                  <Download className="w-3 h-3" />
                  Download PDF
                </button>
              )}
              <button
                onClick={() => generateReport(report.standard)}
                disabled={generating}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-xs disabled:opacity-50"
              >
                Regenerate
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg mb-4">Generate New Report</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-2">Reporting Standard</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white">
              <option>GRI Standards 2021</option>
              <option>SASB Standards</option>
              <option>TCFD Recommendations</option>
              <option>CDP Climate Change</option>
              <option>UN SDG Impact Standards</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-2">Reporting Period</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white">
              <option>Q4 2025</option>
              <option>Full Year 2025</option>
              <option>Q1 2026</option>
              <option>Custom Range</option>
            </select>
          </div>
        </div>
        <button className="mt-4 w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4" />
          Generate Report
        </button>
      </div>
    </div>
  );
}
