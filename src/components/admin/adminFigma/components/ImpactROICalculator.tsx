import React, { useState } from 'react';
import { Calculator, TrendingUp, DollarSign, Target, BarChart3, AlertTriangle } from 'lucide-react';

interface ROIScenario {
  projectType: string;
  budget: number;
  timeline: number;
  location: string;
  predictedCarbon: { min: number; avg: number; max: number };
  financialROI: { min: number; avg: number; max: number };
  socialImpact: number;
  confidence: number;
  riskFactors: string[];
}

export function ImpactROICalculator() {
  const [projectType, setProjectType] = useState('reforestation');
  const [budget, setBudget] = useState(100000);
  const [timeline, setTimeline] = useState(12);
  const [location, setLocation] = useState('tropical');
  const [calculating, setCalculating] = useState(false);
  const [result, setResult] = useState<ROIScenario | null>(null);

  const calculateROI = () => {
    setCalculating(true);
    
    // Simulate ML prediction
    setTimeout(() => {
      const baseCarbon = budget * 0.15; // Simplified model
      const locationMultiplier = location === 'tropical' ? 1.3 : location === 'temperate' ? 1.0 : 0.8;
      const typeMultiplier = projectType === 'reforestation' ? 1.2 : projectType === 'ocean' ? 1.0 : 1.4;
      
      const avgCarbon = baseCarbon * locationMultiplier * typeMultiplier;
      
      const scenario: ROIScenario = {
        projectType,
        budget,
        timeline,
        location,
        predictedCarbon: {
          min: avgCarbon * 0.7,
          avg: avgCarbon,
          max: avgCarbon * 1.4,
        },
        financialROI: {
          min: -0.15,
          avg: 0.12,
          max: 0.45,
        },
        socialImpact: 82,
        confidence: 87,
        riskFactors: [
          'Weather volatility in region',
          'Community engagement dependent',
          'Regulatory changes possible',
        ],
      };
      
      setResult(scenario);
      setCalculating(false);
    }, 2000);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="mb-4 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl mb-2 flex items-center gap-2 sm:gap-3">
          <Calculator className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />
          Impact ROI Calculator
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          ML-powered predictions for regenerative project returns
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg p-4 sm:p-6 text-white">
        <div className="flex items-start gap-3">
          <Target className="w-6 h-6 flex-shrink-0" />
          <div>
            <h3 className="text-base sm:text-lg mb-2">Data-Driven Investment Planning</h3>
            <p className="text-sm opacity-90 mb-3">
              Our ML model analyzes 500+ historical projects to predict carbon offset, financial returns, and social impact for your specific scenario.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white/20 rounded text-xs">XGBoost Model</span>
              <span className="px-3 py-1 bg-white/20 rounded text-xs">87% Accuracy</span>
              <span className="px-3 py-1 bg-white/20 rounded text-xs">Risk-Adjusted</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Input Form */}
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg mb-4">Project Parameters</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Project Type</label>
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white"
              >
                <option value="reforestation">Reforestation</option>
                <option value="ocean">Ocean Restoration</option>
                <option value="renewable">Renewable Energy</option>
                <option value="agriculture">Regenerative Agriculture</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-2">
                Budget: ${budget.toLocaleString()}
              </label>
              <input
                type="range"
                min="10000"
                max="1000000"
                step="10000"
                value={budget}
                onChange={(e) => setBudget(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>$10K</span>
                <span>$1M</span>
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2">
                Timeline: {timeline} months
              </label>
              <input
                type="range"
                min="6"
                max="60"
                step="6"
                value={timeline}
                onChange={(e) => setTimeline(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>6 months</span>
                <span>5 years</span>
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2">Location/Climate</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white"
              >
                <option value="tropical">Tropical</option>
                <option value="temperate">Temperate</option>
                <option value="arid">Arid/Desert</option>
                <option value="coastal">Coastal</option>
              </select>
            </div>

            <button
              onClick={calculateROI}
              disabled={calculating}
              className="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {calculating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Calculating...</span>
                </>
              ) : (
                <>
                  <Calculator className="w-4 h-4" />
                  <span>Calculate ROI</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg mb-4">Predicted Outcomes</h3>
            
            <div className="space-y-4">
              {/* Carbon Offset */}
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Carbon Offset (tons CO2)</span>
                  <span className="text-xs text-gray-500">{result.confidence}% confidence</span>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-2xl">{result.predictedCarbon.avg.toLocaleString()}</span>
                  <span className="text-xs text-gray-600">avg</span>
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Min: {result.predictedCarbon.min.toLocaleString()}</span>
                  <span>Max: {result.predictedCarbon.max.toLocaleString()}</span>
                </div>
              </div>

              {/* Financial ROI */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Financial ROI</span>
                  <DollarSign className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-2xl">{(result.financialROI.avg * 100).toFixed(1)}%</span>
                  <span className="text-xs text-gray-600">avg return</span>
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Min: {(result.financialROI.min * 100).toFixed(1)}%</span>
                  <span>Max: {(result.financialROI.max * 100).toFixed(1)}%</span>
                </div>
              </div>

              {/* Social Impact */}
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Social Impact Score</span>
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
                      style={{ width: `${result.socialImpact}%` }}
                    />
                  </div>
                  <span className="text-sm">{result.socialImpact}/100</span>
                </div>
              </div>

              {/* Risk Factors */}
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span className="text-sm text-gray-600">Risk Factors</span>
                </div>
                <ul className="space-y-1">
                  {result.riskFactors.map((risk, index) => (
                    <li key={index} className="text-xs text-gray-700 flex items-start gap-2">
                      <span className="text-amber-600 mt-0.5">•</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {!result && (
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200 flex items-center justify-center text-center">
            <div>
              <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-600">
                Enter project parameters and click Calculate to see predicted outcomes
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Comparison */}
      {result && (
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg mb-4">Similar Projects Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left text-xs text-gray-600">Project</th>
                  <th className="px-4 py-2 text-left text-xs text-gray-600">Budget</th>
                  <th className="px-4 py-2 text-left text-xs text-gray-600">Carbon</th>
                  <th className="px-4 py-2 text-left text-xs text-gray-600">ROI</th>
                  <th className="px-4 py-2 text-left text-xs text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  { name: 'Amazon Project A', budget: 95000, carbon: 18200, roi: 0.14, status: 'Completed' },
                  { name: 'Southeast Asia B', budget: 110000, carbon: 16800, roi: 0.09, status: 'Active' },
                  { name: 'Africa Initiative C', budget: 88000, carbon: 21500, roi: 0.18, status: 'Completed' },
                ].map((project, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{project.name}</td>
                    <td className="px-4 py-3 text-sm">${project.budget.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm">{project.carbon.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-emerald-600">+{(project.roi * 100).toFixed(1)}%</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        project.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {project.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
