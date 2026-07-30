/**
 * Enhanced Carbon Prediction Card with Uncertainty Visualization
 * 
 * This component extends AIInsights.tsx with:
 * - Confidence intervals (95% CI)
 * - Epistemic status badges
 * - Uncertainty visualization
 * - Model governance metadata
 * - Deferral logic for low-confidence predictions
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, Zap, AlertTriangle } from 'lucide-react';

interface CarbonPrediction {
  projectId: string;
  currentSequestration: number;
  predictedSequestration: number;
  predictedLowerCI: number;  // 95% confidence interval lower bound
  predictedUpperCI: number;  // 95% confidence interval upper bound
  confidenceScore: number;
  confidenceLevel: number;  // e.g., 0.95 for 95% CI
  predictionPeriod: string;
  trend: 'increasing' | 'stable' | 'decreasing';
  seasonalVariation: number;
  recommendations: string[];
  epistemicStatus: 'well_supported' | 'supported' | 'preliminary' | 'speculative';
  modelVersion: string;
  lastCalibrated: string;
  dataQualityScore: number;
  deferralReason?: string;
}

interface EnhancedCarbonPredictionCardProps {
  prediction: CarbonPrediction;
  index: number;
}

export const EnhancedCarbonPredictionCard: React.FC<EnhancedCarbonPredictionCardProps> = ({
  prediction,
  index
}) => {
  const getTrendIcon = () => {
    switch (prediction.trend) {
      case 'increasing': return <TrendingUp className="w-4 h-4 text-emerald-400" />;
      case 'decreasing': return <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />;
      default: return <TrendingUp className="w-4 h-4 text-slate-400" />;
    }
  };

  const getEpistemicBadge = () => {
    switch (prediction.epistemicStatus) {
      case 'well_supported':
        return <span className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30">Well-Supported</span>;
      case 'supported':
        return <span className="px-2 py-1 rounded text-xs bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">Supported</span>;
      case 'preliminary':
        return <span className="px-2 py-1 rounded text-xs bg-orange-500/20 text-orange-400 border border-orange-500/30">Preliminary</span>;
      case 'speculative':
        return <span className="px-2 py-1 rounded text-xs bg-gray-500/20 text-gray-400 border border-gray-500/30">Speculative</span>;
    }
  };

  const getConfidenceColor = () => {
    if (prediction.confidenceScore >= 0.9) return 'from-emerald-500 to-cyan-500';
    if (prediction.confidenceScore >= 0.75) return 'from-blue-500 to-indigo-500';
    if (prediction.confidenceScore >= 0.6) return 'from-amber-500 to-orange-500';
    return 'from-gray-500 to-slate-500';
  };

  // Check if prediction should be deferred
  if (prediction.deferralReason) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="p-4 rounded-xl bg-amber-900/20 border border-amber-500/30 backdrop-blur-sm"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-amber-400 mb-1">Prediction Deferred</h4>
            <p className="text-xs text-slate-300">{prediction.deferralReason}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-400" />
          <span className="text-sm font-medium text-white">ML Forecast</span>
        </div>
        <div className="flex items-center gap-2">
          {getEpistemicBadge()}
          {getTrendIcon()}
          <span className="text-xs text-slate-400 capitalize">{prediction.trend}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-xs text-slate-400 mb-1">Current</div>
          <div className="text-xl font-semibold text-white">
            {prediction.currentSequestration.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500">tCO₂ sequestered</div>
        </div>
        <div>
          <div className="text-xs text-slate-400 mb-1">Predicted</div>
          <div className="text-xl font-semibold text-emerald-400">
            {prediction.predictedSequestration.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500">
            95% CI: [{prediction.predictedLowerCI.toLocaleString()} - {prediction.predictedUpperCI.toLocaleString()}]
          </div>
        </div>
      </div>

      {/* Uncertainty Visualization */}
      <div className="mb-4 p-3 bg-slate-700/30 rounded-lg">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span>Confidence Interval</span>
          <span>{Math.round(prediction.confidenceLevel * 100)}%</span>
        </div>
        <div className="relative h-4 bg-slate-700 rounded-full overflow-hidden">
          {/* Lower bound marker */}
          <div 
            className="absolute top-0 bottom-0 bg-amber-500/30"
            style={{ left: 0, width: '45%' }}
          />
          {/* Center estimate */}
          <div 
            className="absolute top-1 bottom-1 bg-emerald-500 rounded-full"
            style={{ 
              left: `${((prediction.predictedSequestration - prediction.predictedLowerCI) / 
                (prediction.predictedUpperCI - prediction.predictedLowerCI)) * 100}%`,
              width: '10%',
              transform: 'translateX(-50%)'
            }}
          />
          {/* Upper bound marker */}
          <div 
            className="absolute top-0 bottom-0 bg-amber-500/30"
            style={{ left: '55%', right: 0 }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>{prediction.predictedLowerCI.toLocaleString()}</span>
          <span className="text-emerald-400">{prediction.predictedSequestration.toLocaleString()}</span>
          <span>{prediction.predictedUpperCI.toLocaleString()}</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span>Model Confidence</span>
          <span>{Math.round(prediction.confidenceScore * 100)}%</span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${prediction.confidenceScore * 100}%` }}
            transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
            className={`h-full bg-gradient-to-r ${getConfidenceColor()} rounded-full`}
          />
        </div>
      </div>

      {/* Model metadata */}
      <div className="flex items-center gap-4 text-xs text-slate-500 mb-4 pb-4 border-b border-slate-700">
        <span>v{prediction.modelVersion}</span>
        <span>Calibrated: {prediction.lastCalibrated}</span>
        <span>Data Quality: {Math.round(prediction.dataQualityScore * 100)}%</span>
      </div>

      <div className="space-y-2">
        <div className="text-xs text-slate-400">AI Recommendations:</div>
        {prediction.recommendations.map((rec, i) => (
          <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
            <Zap className="w-3 h-3 text-amber-400 mt-0.5 flex-shrink-0" />
            {rec}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default EnhancedCarbonPredictionCard;
