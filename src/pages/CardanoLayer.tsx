import React, { useState, useEffect } from 'react';
import type { ProbabilisticValueUnit, CivilizationScenario, RiskHeatmap } from '../cardano/CardanoLayerArchitecture';
import { getOracleState, updateOracle, calculatePVU } from '../backend/cardano';

const CardanoLayerPage: React.FC = () => {
  const [oracleStatus, setOracleStatus] = useState<string>('inactive');
  const [scenarios, setScenarios] = useState<CivilizationScenario[]>([]);
  const [riskHeatmap, setRiskHeatmap] = useState<RiskHeatmap | null>(null);
  const [pvu, setPvu] = useState<ProbabilisticValueUnit | null>(null);
  const [investmentValue, setInvestmentValue] = useState<number>(1000);

  useEffect(() => {
    // Initialize Cardano Layer and get initial state
    const initialState = getOracleState();
    setOracleStatus(initialState.status);
    setScenarios(initialState.scenarios);
    setRiskHeatmap(initialState.riskHeatmap);
  }, []);

  const handleUpdateOracle = async () => {
    try {
      setOracleStatus('calculating');
      const updatedOracle = await updateOracle();
      setScenarios(updatedOracle.scenarios);
      setRiskHeatmap(updatedOracle.riskHeatmap);
      setOracleStatus('active');
    } catch (error) {
      console.error('Error updating oracle:', error);
      setOracleStatus('inactive');
    }
  };

  const handleCalculatePVU = () => {
    const pvuResult = calculatePVU(`investment-${Date.now()}`, investmentValue);
    setPvu(pvuResult);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-green-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            The Cardano Layer
          </h1>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            Probabilistic Civilization Infrastructure (PCI) - Reality is not binary, and neither should our systems
          </p>
        </div>

        {/* Oracle Status */}
        <div className="bg-black bg-opacity-30 rounded-lg p-6 mb-8 border border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Atlas Probabilistic Oracle (APO)</h2>
              <p className="text-blue-200">Living system that models civilization probabilities</p>
            </div>
            <div className="flex items-center gap-4">
              <div className={`px-4 py-2 rounded-full font-semibold ${
                oracleStatus === 'active' ? 'bg-green-500' : 
                oracleStatus === 'calculating' ? 'bg-yellow-500' : 'bg-red-500'
              }`}>
                {oracleStatus.toUpperCase()}
              </div>
              <button 
                onClick={handleUpdateOracle}
                disabled={oracleStatus === 'calculating'}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {oracleStatus === 'calculating' ? 'Calculating...' : 'Update Oracle'}
              </button>
            </div>
          </div>
        </div>

        {/* PVU Calculator */}
        <div className="bg-black bg-opacity-30 rounded-lg p-6 mb-8 border border-blue-500">
          <h2 className="text-2xl font-bold mb-6">Probabilistic Value Units (PVUs)</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Investment Value</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={investmentValue}
                    onChange={(e) => setInvestmentValue(parseFloat(e.target.value) || 0)}
                    className="flex-1 px-4 py-2 bg-black bg-opacity-50 border border-blue-400 rounded-lg text-white"
                    placeholder="Enter investment value"
                  />
                  <span className="px-4 py-2 bg-blue-500 bg-opacity-20 rounded-lg font-semibold">USD</span>
                </div>
              </div>
              
              <button
                onClick={handleCalculatePVU}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
              >
                Calculate PVU
              </button>
            </div>

            {pvu && (
              <div className="bg-black bg-opacity-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">PVU Calculation</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-blue-200">Base Value:</span>
                    <span className="font-semibold">${pvu.baseValue.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-blue-200">Ecological Discount:</span>
                    <span className="font-semibold">{(pvu.ecologicalEntropyDiscount * 100).toFixed(1)}%</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-blue-200">Social Discount:</span>
                    <span className="font-semibold">{(pvu.socialEntropyDiscount * 100).toFixed(1)}%</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-blue-200">Regenerative Multiplier:</span>
                    <span className="font-semibold">{pvu.regenerativeMultiplier.toFixed(2)}x</span>
                  </div>
                  
                  <div className="border-t border-blue-400 pt-3">
                    <div className="flex justify-between items-end">
                      <span className="text-xl font-semibold">Probabilistic Value:</span>
                      <span className="text-2xl font-bold text-yellow-400">
                        ${pvu.probabilisticValue.toFixed(2)} PVU
                      </span>
                    </div>
                    <p className="text-sm text-blue-300 mt-1">
                      95% confidence: ${pvu.confidenceInterval.lower.toFixed(2)} - ${pvu.confidenceInterval.upper.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Civilization Scenarios */}
        <div className="bg-black bg-opacity-30 rounded-lg p-6 mb-8 border border-green-500">
          <h2 className="text-2xl font-bold mb-6">Civilization Scenarios</h2>
          
          {scenarios.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {scenarios.map((scenario) => (
                <div key={scenario.id} className="bg-black bg-opacity-50 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold">{scenario.name}</h3>
                    <div className="px-3 py-1 bg-purple-500 bg-opacity-20 rounded-full text-sm font-semibold">
                      {Math.round(scenario.probability * 100)}%
                    </div>
                  </div>
                  
                  <p className="text-blue-200 mb-6 text-sm">{scenario.description}</p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-green-400 mb-2">Key Indicators:</h4>
                      <div className="space-y-2">
                        {scenario.indicators.map((indicator, idx) => (
                          <div key={idx} className="flex justify-between items-center text-sm">
                            <span className="text-blue-200">{indicator.name}:</span>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{indicator.value.toFixed(2)}</span>
                              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                indicator.trend === 'positive' ? 'bg-green-500' : 
                                indicator.trend === 'negative' ? 'bg-red-500' : 'bg-yellow-500'
                              }`}>
                                {indicator.trend}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold text-green-400 mb-2">Policy Recommendation:</h4>
                      <div className="text-sm text-blue-200 mb-2">
                        {scenario.policyRecommendations[0].name}
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-blue-300">Impact: {Math.round(scenario.policyRecommendations[0].impactScore * 100)}%</span>
                        <span className="text-blue-300">Difficulty: {Math.round(scenario.policyRecommendations[0].difficulty * 100)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-blue-300">
              <p className="text-lg mb-4">No scenarios generated yet</p>
              <p className="text-sm">Click "Update Oracle" to run civilization simulations</p>
            </div>
          )}
        </div>

        {/* Risk Heatmap */}
        {riskHeatmap && (
          <div className="bg-black bg-opacity-30 rounded-lg p-6 border border-red-500">
            <h2 className="text-2xl font-bold mb-6">Risk Heatmap</h2>
            
            <div className="bg-black bg-opacity-50 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-blue-200 text-sm">Resolution: {riskHeatmap.resolution}</p>
                  <p className="text-blue-300 text-xs">Generated: {new Date(riskHeatmap.generatedAt).toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span>Low Risk</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    <span>Medium Risk</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span>High Risk</span>
                  </div>
                </div>
              </div>
              
              {/* Simple Grid Visualization */}
              <div className="grid grid-cols-5 gap-1">
                {riskHeatmap.grid.flat().map((cell, idx) => {
                  const riskColor = cell.risk < 0.3 ? 'bg-green-500' : 
                                    cell.risk < 0.7 ? 'bg-yellow-500' : 'bg-red-500';
                  
                  return (
                    <div
                      key={idx}
                      className={`aspect-square rounded ${riskColor} cursor-pointer hover:opacity-80 transition-opacity`}
                      title={`Risk: ${(cell.risk * 100).toFixed(1)}%\n${cell.dominantRisk}`}
                    >
                      <div className="flex flex-col items-center justify-center h-full text-xs font-semibold p-1">
                        <div>{(cell.risk * 100).toFixed(0)}%</div>
                        <div className="text-[8px]">{cell.dominantRisk.slice(0, 3)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="bg-black bg-opacity-30 rounded-lg p-6 border border-yellow-500">
          <h2 className="text-2xl font-bold mb-6">Cardano Layer Features</h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-black bg-opacity-50 rounded-lg p-6">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Probabilistic Policies</h3>
              <p className="text-blue-200 text-sm">Every policy has a probability curve</p>
            </div>
            
            <div className="bg-black bg-opacity-50 rounded-lg p-6">
              <div className="text-4xl mb-4">🎲</div>
              <h3 className="text-xl font-semibold mb-2">Risk Ecology</h3>
              <p className="text-blue-200 text-sm">Every investment has a risk ecology</p>
            </div>
            
            <div className="bg-black bg-opacity-50 rounded-lg p-6">
              <div className="text-4xl mb-4">🌳</div>
              <h3 className="text-xl font-semibold mb-2">Scenario Trees</h3>
              <p className="text-blue-200 text-sm">Every intervention has scenario trees</p>
            </div>
            
            <div className="bg-black bg-opacity-50 rounded-lg p-6">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-semibold mb-2">Confidence Intervals</h3>
              <p className="text-blue-200 text-sm">Every future has confidence intervals</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardanoLayerPage;
