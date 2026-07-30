/**
 * AI Service for Proposal Analysis
 * 
 * NOTE: This is a mock implementation for demonstration purposes.
 * For production use, integrate with actual AI services:
 * 
 * 1. OpenAI API Integration:
 *    - Sign up at https://platform.openai.com
 *    - Get your API key from the dashboard
 *    - NEVER expose API keys in frontend code
 *    - Use environment variables and backend proxy
 * 
 * 2. Implementation Example (Backend Required):
 *    ```typescript
 *    async function analyzeProposal(title: string, description: string) {
 *      const response = await fetch('/api/analyze-proposal', {
 *        method: 'POST',
 *        headers: { 'Content-Type': 'application/json' },
 *        body: JSON.stringify({ title, description })
 *      });
 *      return response.json();
 *    }
 *    ```
 * 
 * 3. Backend Endpoint Example (Node.js):
 *    ```typescript
 *    app.post('/api/analyze-proposal', async (req, res) => {
 *      const { title, description } = req.body;
 *      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
 *      
 *      const completion = await openai.chat.completions.create({
 *        model: "gpt-4",
 *        messages: [{
 *          role: "user",
 *          content: `Analyze this DAO proposal for ethical alignment:
 *                    Title: ${title}
 *                    Description: ${description}
 *                    
 *                    Evaluate against: Human Dignity, Fairness & Justice,
 *                    Transparency, Privacy Protection, Global Welfare, Responsible AI.
 *                    
 *                    Return a JSON with score (0-100) and reasoning.`
 *        }],
 *        response_format: { type: "json_object" }
 *      });
 *      
 *      res.json(JSON.parse(completion.choices[0].message.content));
 *    });
 *    ```
 */

export interface AIAnalysisResult {
  ethicsScore: number;
  recommendation: {
    score: number;
    reasoning: string;
  };
  breakdown: {
    humanDignity: number;
    fairness: number;
    transparency: number;
    privacy: number;
    globalWelfare: number;
    responsibleAI: number;
  };
}

/**
 * Mock AI analysis - simulates what a real AI service would return
 * Replace this with actual API calls to OpenAI, Anthropic, or your custom ML model
 */
export async function analyzeProposal(
  title: string,
  description: string,
  category: string
): Promise<AIAnalysisResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Mock analysis based on keywords and category
  const keywords = {
    positive: ['transparent', 'fair', 'privacy', 'inclusive', 'sustainable', 'ethical', 'democratic'],
    negative: ['centralized', 'exclusive', 'opaque', 'discriminatory']
  };

  const text = `${title} ${description}`.toLowerCase();
  
  const positiveCount = keywords.positive.filter(word => text.includes(word)).length;
  const negativeCount = keywords.negative.filter(word => text.includes(word)).length;

  // Calculate base scores
  const baseScore = 75 + (positiveCount * 5) - (negativeCount * 10);
  const ethicsScore = Math.max(60, Math.min(99, baseScore + Math.random() * 10));

  // Category-specific adjustments
  const categoryBonus = {
    ethics: 5,
    governance: 3,
    technical: 0,
    funding: -2
  };

  const finalScore = Math.min(99, ethicsScore + (categoryBonus[category as keyof typeof categoryBonus] || 0));

  // Generate reasoning
  const reasoningOptions = [
    "Demonstrates strong alignment with universal ethical principles and promotes inclusive decision-making.",
    "Shows commitment to transparency and accountability while respecting individual rights.",
    "Aligns well with community values and sustainable development goals.",
    "Promotes fair governance practices and equitable resource distribution.",
    "Exhibits strong consideration for privacy rights and data protection.",
    "Demonstrates responsible approach to technology deployment and human welfare."
  ];

  return {
    ethicsScore: Math.round(finalScore),
    recommendation: {
      score: Math.round(finalScore * 0.95), // Slightly lower for recommendation
      reasoning: reasoningOptions[Math.floor(Math.random() * reasoningOptions.length)]
    },
    breakdown: {
      humanDignity: Math.round(80 + Math.random() * 15),
      fairness: Math.round(75 + Math.random() * 20),
      transparency: Math.round(85 + Math.random() * 10),
      privacy: Math.round(80 + Math.random() * 15),
      globalWelfare: Math.round(75 + Math.random() * 20),
      responsibleAI: Math.round(85 + Math.random() * 10)
    }
  };
}

/**
 * Instructions for integrating with real AI services:
 * 
 * 1. Set up a backend service (Node.js, Python, etc.)
 * 2. Store API keys securely in environment variables
 * 3. Create an API endpoint that:
 *    - Receives proposal data from frontend
 *    - Calls AI service (OpenAI, Anthropic, etc.)
 *    - Returns analysis results
 * 4. Update this function to call your backend endpoint
 * 5. Implement proper error handling and rate limiting
 * 6. Consider caching results to save costs
 * 
 * Example AI Prompt Engineering:
 * - Be specific about ethical frameworks to use
 * - Request structured JSON output
 * - Include examples of good/bad proposals
 * - Set temperature parameter for consistency
 * - Use system prompts to define AI's role and expertise
 */
