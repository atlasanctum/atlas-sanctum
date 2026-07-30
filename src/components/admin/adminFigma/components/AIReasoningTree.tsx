import React, { useState } from 'react';
import { Brain, ChevronRight, CheckCircle, AlertTriangle, Info } from 'lucide-react';

interface DecisionNode {
  id: string;
  question: string;
  answer: string;
  confidence: number;
  ethicalScore: number;
  children?: DecisionNode[];
  impact?: string;
}

const decisionTree: DecisionNode = {
  id: 'root',
  question: 'Should we allocate $500K to Amazon Rainforest Carbon Credits?',
  answer: 'YES - High confidence recommendation',
  confidence: 94,
  ethicalScore: 96,
  impact: 'Estimated 10,000 tCO2 offset annually',
  children: [
    {
      id: 'env',
      question: 'Environmental Impact Assessment',
      answer: 'Positive - High biodiversity protection',
      confidence: 92,
      ethicalScore: 94,
      children: [
        {
          id: 'carbon',
          question: 'Carbon Sequestration Potential',
          answer: 'Verified 10,000 tCO2/year capacity',
          confidence: 95,
          ethicalScore: 98,
        },
        {
          id: 'bio',
          question: 'Biodiversity Enhancement',
          answer: '+340 species protected',
          confidence: 89,
          ethicalScore: 92,
        },
      ],
    },
    {
      id: 'ethical',
      question: 'Ethical Alignment Check',
      answer: 'Aligned - Community consent verified',
      confidence: 96,
      ethicalScore: 98,
      children: [
        {
          id: 'community',
          question: 'Indigenous Community Consent',
          answer: 'Full consent with profit-sharing agreement',
          confidence: 98,
          ethicalScore: 99,
        },
        {
          id: 'transparency',
          question: 'Transparency & Verification',
          answer: 'Third-party audited, blockchain-verified',
          confidence: 94,
          ethicalScore: 96,
        },
      ],
    },
    {
      id: 'financial',
      question: 'Financial Viability Analysis',
      answer: 'Strong ROI with impact multiplier',
      confidence: 88,
      ethicalScore: 90,
      children: [
        {
          id: 'roi',
          question: 'Expected Return on Investment',
          answer: '18.4% projected ROI over 5 years',
          confidence: 86,
          ethicalScore: 88,
        },
        {
          id: 'risk',
          question: 'Risk Assessment',
          answer: 'Low risk - diversified portfolio fit',
          confidence: 90,
          ethicalScore: 92,
        },
      ],
    },
  ],
};

interface TreeNodeProps {
  node: DecisionNode;
  depth: number;
}

function TreeNode({ node, depth }: TreeNodeProps) {
  const [expanded, setExpanded] = useState(depth < 2);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (confidence >= 80) return 'text-blue-600 bg-blue-50 border-blue-200';
    return 'text-amber-600 bg-amber-50 border-amber-200';
  };

  const getEthicalColor = (score: number) => {
    if (score >= 95) return 'text-purple-600 bg-purple-50';
    if (score >= 85) return 'text-indigo-600 bg-indigo-50';
    return 'text-blue-600 bg-blue-50';
  };

  return (
    <div className="ml-0">
      <div
        className={`border rounded-lg p-4 mb-3 transition-all hover:shadow-md ${
          depth === 0
            ? 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-300'
            : 'bg-white border-gray-200 hover:border-purple-300'
        }`}
      >
        <div className="flex items-start gap-3">
          {node.children && node.children.length > 0 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-1 p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <ChevronRight
                className={`w-4 h-4 text-gray-500 transition-transform ${
                  expanded ? 'rotate-90' : ''
                }`}
              />
            </button>
          )}
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <p className="text-sm mb-1 text-gray-600">{node.question}</p>
                <p className={`text-sm ${depth === 0 ? 'text-base' : ''}`}>
                  {node.answer}
                </p>
              </div>
              
              {depth === 0 && (
                <Brain className="w-6 h-6 text-purple-600 ml-3 flex-shrink-0" />
              )}
            </div>

            <div className="flex items-center gap-3 mt-3">
              <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${getConfidenceColor(node.confidence)}`}>
                <CheckCircle className="w-3 h-3" />
                <span>Confidence: {node.confidence}%</span>
              </div>
              
              <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${getEthicalColor(node.ethicalScore)}`}>
                <Info className="w-3 h-3" />
                <span>Ethical: {node.ethicalScore}</span>
              </div>

              {node.impact && (
                <span className="text-xs text-emerald-600 ml-2">
                  {node.impact}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {expanded && node.children && (
        <div className="ml-8 border-l-2 border-purple-200 pl-4">
          {node.children.map(child => (
            <TreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function AIReasoningTree() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="mb-4">
        <h3 className="text-lg flex items-center gap-2 mb-2">
          <Brain className="w-5 h-5 text-purple-600" />
          AI Reasoning Tree - Recent Decision
        </h3>
        <p className="text-sm text-gray-600">
          Transparent algorithmic decision-making process with ethical validation
        </p>
      </div>

      <div className="mb-4 p-3 bg-gradient-to-r from-purple-100 to-indigo-100 border border-purple-200 rounded-lg">
        <div className="flex items-center gap-2 text-sm">
          <AlertTriangle className="w-4 h-4 text-purple-600" />
          <span className="text-purple-900">
            This AI decision was validated through 12 ethical checkpoints and approved by the Moral Ontology Validator
          </span>
        </div>
      </div>

      <TreeNode node={decisionTree} depth={0} />

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
            <p className="text-xs text-emerald-700 mb-1">Decision Time</p>
            <p className="text-lg text-emerald-900">1.2s</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
            <p className="text-xs text-purple-700 mb-1">Nodes Evaluated</p>
            <p className="text-lg text-purple-900">8</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <p className="text-xs text-blue-700 mb-1">Overall Confidence</p>
            <p className="text-lg text-blue-900">94%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
