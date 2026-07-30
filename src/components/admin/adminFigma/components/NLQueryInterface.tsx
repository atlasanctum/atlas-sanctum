import React, { useState } from 'react';
import { MessageSquare, Send, Sparkles, TrendingUp, BarChart3, Download, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';

interface QueryResponse {
  query: string;
  answer: string;
  visualizations?: VisualizationType[];
  data?: any;
  insights?: string[];
  relatedQuestions?: string[];
  timestamp: Date;
}

type VisualizationType = 'chart' | 'table' | 'map' | 'stat';

export function NLQueryInterface() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<QueryResponse[]>([
    {
      query: '',
      answer: "Hello! I'm your AI Analytics Assistant. Ask me anything about your platform data. For example:\n\n• Show me carbon offset trends for the last quarter\n• Which DAO proposals had the highest engagement?\n• Compare biodiversity scores across regions\n• What's our user growth rate?",
      timestamp: new Date(),
    },
  ]);

  const exampleQueries = [
    'Show carbon offset trends in Q4 with biodiversity correlation',
    'What are the top performing regenerative projects?',
    'Compare financial performance across different initiatives',
    'Which regions have the highest community engagement?',
    'Predict next month\'s carbon capture based on current trends',
    'Show me users who joined in the last 30 days',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    
    // Add user query to conversation
    const userQuery: QueryResponse = {
      query,
      answer: '',
      timestamp: new Date(),
    };

    // Simulate API call to AI backend
    setTimeout(() => {
      const response = generateMockResponse(query);
      setConversation([...conversation, userQuery, response]);
      setQuery('');
      setIsLoading(false);
    }, 1500);
  };

  const generateMockResponse = (query: string): QueryResponse => {
    // Mock AI response generator
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('carbon') || lowerQuery.includes('offset')) {
      return {
        query: '',
        answer: "Based on your data, here's what I found:\n\nCarbon offset has increased by 23.4% in Q4 compared to Q3. The total offset for Q4 is 12,456 tons CO2e.\n\nKey drivers:\n• Reforestation projects contributed 45%\n• Ocean restoration added 28%\n• Renewable energy transitions: 27%\n\nThe biodiversity correlation is strong (r=0.82), indicating that areas with higher carbon capture also show improved biodiversity scores.",
        visualizations: ['chart', 'stat'],
        insights: [
          'Reforestation is your most effective carbon strategy',
          'October showed the highest monthly growth (+8.2%)',
          'You\'re on track to exceed annual targets by 15%'
        ],
        relatedQuestions: [
          'Which specific reforestation sites have the best ROI?',
          'What\'s the projected carbon offset for Q1 next year?',
          'Show me the cost per ton of CO2 offset'
        ],
        timestamp: new Date(),
      };
    }
    
    if (lowerQuery.includes('user') || lowerQuery.includes('engagement')) {
      return {
        query: '',
        answer: "User engagement analysis:\n\n• Total active users: 2,847 (+12.5% MoM)\n• Average session duration: 8m 42s\n• Daily active users: 1,234\n• Most engaged feature: DAO Governance (45% of sessions)\n\nTop user segments:\n1. Impact Analysts (892 users, 4.2 sessions/week)\n2. DAO Participants (654 users, 3.8 sessions/week)\n3. Financial Operators (423 users, 5.1 sessions/week)",
        visualizations: ['chart', 'table'],
        insights: [
          'Mobile usage has grown 34% this quarter',
          'DAO proposals get 3x more engagement than other features',
          'User retention rate is 87% after 30 days'
        ],
        relatedQuestions: [
          'What features do power users engage with most?',
          'Show me user churn risk analysis',
          'Which acquisition channels bring the best users?'
        ],
        timestamp: new Date(),
      };
    }
    
    if (lowerQuery.includes('dao') || lowerQuery.includes('proposal')) {
      return {
        query: '',
        answer: "DAO Governance insights:\n\n• Active proposals: 3\n• Total proposals (all-time): 92\n• Average voter turnout: 67%\n• Highest engagement proposal: Ocean Restoration Initiative ($500K allocation)\n\nProposal success rate: 73%\n\nTop contributors:\n1. Dr. Elena Chen (15 proposals, 87% approval)\n2. Marcus Rodriguez (12 proposals, 75% approval)\n3. Aisha Patel (8 proposals, 88% approval)",
        visualizations: ['chart', 'stat'],
        insights: [
          'Proposals with video explanations get 2x more votes',
          'Environmental proposals have 85% approval rate',
          'Optimal proposal length: 300-500 words'
        ],
        relatedQuestions: [
          'What makes a proposal successful?',
          'Show voting patterns by user type',
          'Predict success rate for my draft proposal'
        ],
        timestamp: new Date(),
      };
    }
    
    // Default response
    return {
      query: '',
      answer: `I analyzed your query: "${query}"\n\nI found relevant data across multiple systems. Here's a summary:\n\n• 156 data points matched your criteria\n• 3 key insights identified\n• 2 recommended actions\n\nWould you like me to drill down into any specific area?`,
      insights: [
        'Your query involves cross-functional data',
        'Consider filtering by date range for more specific results',
        'I can generate a detailed report if needed'
      ],
      relatedQuestions: [
        'Show me more details about this data',
        'Export this as a CSV file',
        'Create a dashboard widget from this query'
      ],
      timestamp: new Date(),
    };
  };

  const useExampleQuery = (example: string) => {
    setQuery(example);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="mb-4 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl mb-2 flex items-center gap-2 sm:gap-3">
          <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
          Natural Language Analytics
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Ask questions about your data in plain English - AI will handle the rest
        </p>
      </div>

      {/* AI Capability Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg p-4 sm:p-6 text-white">
        <div className="flex items-start gap-3">
          <Sparkles className="w-6 h-6 flex-shrink-0" />
          <div>
            <h3 className="text-base sm:text-lg mb-2">Powered by Advanced AI</h3>
            <p className="text-sm opacity-90 mb-3">
              Our natural language engine understands complex queries, generates visualizations, and provides actionable insights from your data.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white/20 rounded text-xs">GPT-4</span>
              <span className="px-3 py-1 bg-white/20 rounded text-xs">Semantic Search</span>
              <span className="px-3 py-1 bg-white/20 rounded text-xs">50+ Languages</span>
              <span className="px-3 py-1 bg-white/20 rounded text-xs">Voice Input</span>
            </div>
          </div>
        </div>
      </div>

      {/* Example Queries */}
      {conversation.length === 1 && (
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
          <h3 className="text-sm mb-3">Try asking:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {exampleQueries.map((example, index) => (
              <button
                key={index}
                onClick={() => useExampleQuery(example)}
                className="text-left p-3 bg-gray-50 hover:bg-blue-50 rounded-lg text-sm text-gray-700 hover:text-blue-700 transition-colors border border-gray-200 hover:border-blue-300"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Conversation History */}
      <div className="space-y-4">
        {conversation.map((message, index) => (
          <div key={index}>
            {/* User Query */}
            {message.query && (
              <div className="flex justify-end mb-4">
                <div className="max-w-[80%] bg-blue-600 text-white rounded-lg p-4">
                  <p className="text-sm">{message.query}</p>
                </div>
              </div>
            )}

            {/* AI Response */}
            {message.answer && (
              <div className="flex justify-start">
                <div className="max-w-[90%] bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
                  {/* Response Text */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800 whitespace-pre-line">{message.answer}</p>
                    </div>
                  </div>

                  {/* Visualizations */}
                  {message.visualizations && message.visualizations.length > 0 && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-3">
                        <BarChart3 className="w-4 h-4 text-blue-600" />
                        <span className="text-xs text-gray-600">Generated Visualizations</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {message.visualizations.map((viz, i) => (
                          <div key={i} className="aspect-square bg-white rounded border border-gray-200 flex items-center justify-center">
                            <div className="text-center">
                              <TrendingUp className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                              <p className="text-xs text-gray-500 capitalize">{viz}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Insights */}
                  {message.insights && message.insights.length > 0 && (
                    <div className="mb-4 space-y-2">
                      <p className="text-xs text-gray-600 mb-2">Key Insights:</p>
                      {message.insights.map((insight, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-blue-600 mt-0.5">•</span>
                          <p className="text-gray-700">{insight}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Related Questions */}
                  {message.relatedQuestions && message.relatedQuestions.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-600 mb-2">Related Questions:</p>
                      <div className="space-y-2">
                        {message.relatedQuestions.map((question, i) => (
                          <button
                            key={i}
                            onClick={() => useExampleQuery(question)}
                            className="w-full text-left px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded text-xs text-blue-700 transition-colors"
                          >
                            {question}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                    <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                      <Copy className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                      <Download className="w-4 h-4 text-gray-600" />
                    </button>
                    <div className="flex-1"></div>
                    <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                      <ThumbsUp className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                      <ThumbsDown className="w-4 h-4 text-gray-600" />
                    </button>
                    <span className="text-xs text-gray-400">{message.timestamp.toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center animate-pulse">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Query Input */}
      <div className="sticky bottom-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything about your data..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Ask</span>
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-2">
          💡 Tip: Be specific for better results. You can ask for charts, comparisons, predictions, and more.
        </p>
      </div>
    </div>
  );
}
