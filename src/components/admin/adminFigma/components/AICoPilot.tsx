import React, { useState } from 'react';
import { Sparkles, Send, X, Maximize2, Minimize2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const suggestions = [
  'Analyze carbon offset efficiency this month',
  'Show high-impact investment opportunities',
  'Explain recent DAO proposal #089',
  'Summarize ethical AI performance',
];

export function AICoPilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your Atlas Sanctum AI Co-Pilot. I can help you analyze data, interpret decisions, and suggest regenerative actions. How can I assist you today?',
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        role: 'assistant',
        content: generateResponse(input),
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);

    setInput('');
  };

  const generateResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('carbon')) {
      return 'Based on current data, carbon offset efficiency is at 94.2%. The Amazon Rainforest project shows the highest ROI at 18.4% with 10,000 tCO2/year capacity. I recommend increasing allocation by 15% for optimal impact.';
    } else if (lowerQuery.includes('dao') || lowerQuery.includes('proposal')) {
      return 'DAO Proposal #089 seeks to allocate $500K to Amazon Rainforest Carbon Credits. It has achieved quorum with 9,650 votes (87.2% in favor). The ethical score is 96/100, and predicted impact is +10,000 tCO2 annually. Execution is recommended.';
    } else if (lowerQuery.includes('ethical') || lowerQuery.includes('ai')) {
      return 'Current AI models maintain an average ethical score of 89.7%. The Moral Ontology Validator achieved 96% alignment. All 12 active models passed recent transparency audits. The Carbon Optimizer model shows exceptional performance with 94.2% accuracy.';
    } else if (lowerQuery.includes('investment') || lowerQuery.includes('finance')) {
      return 'High-impact opportunities: 1) Ocean Guardian Pool (10.8% APR, marine restoration focus), 2) Biodiversity tokens showing +21.7% ROI, 3) Community Health Impact Fund with proven social outcomes. Portfolio rebalancing toward biodiversity is recommended.';
    } else {
      return 'I understand you\'re asking about regenerative systems. Could you be more specific? You can ask me about carbon offsets, DAO governance, ethical AI performance, or investment opportunities.';
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center group z-50"
      >
        <Sparkles className="w-6 h-6 group-hover:scale-110 transition-transform" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50 transition-all ${
        isExpanded ? 'w-[600px] h-[700px]' : 'w-[400px] h-[550px]'
      }`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          <div>
            <h3 className="text-sm">AI Co-Pilot</h3>
            <p className="text-xs opacity-80">Atlas Sanctum Intelligence Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            {isExpanded ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, idx) => (
          <div
            key={idx}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span className="text-xs text-purple-600">AI Co-Pilot</span>
                </div>
              )}
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Suggestions */}
      {messages.length <= 2 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-gray-500 mb-2">Quick suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-full text-xs transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about regenerative systems..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
