/**
 * Atlas Sanctum — AI Connector
 * Routes to OpenAI, Anthropic, Google AI, Mistral, HuggingFace.
 * Supports: model routing, memory federation, ethical reasoning pipeline,
 * tool calling, streaming, human-in-the-loop escalation.
 */

import { BaseConnector, ConnectorCallOptions, ConnectorStatus } from './BaseConnector';

export type AIProvider = 'openai' | 'anthropic' | 'google' | 'mistral' | 'huggingface';

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AICompletionRequest {
  provider?: AIProvider;
  model?: string;
  messages: AIMessage[];
  maxTokens?: number;
  temperature?: number;
  tools?: AITool[];
  memoryNamespace?: string;  // vector memory scope
}

export interface AITool {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

export interface AICompletionResponse {
  provider: AIProvider;
  model: string;
  content: string;
  toolCalls?: { name: string; arguments: Record<string, unknown> }[];
  usage: { promptTokens: number; completionTokens: number; estimatedCostUsd: number };
  requiresHumanReview?: boolean;
}

export interface AIConnectorConfig {
  openaiApiKey?: string;
  anthropicApiKey?: string;
  googleAiApiKey?: string;
  mistralApiKey?: string;
  huggingfaceApiKey?: string;
  defaultProvider?: AIProvider;
  ethicalReviewThreshold?: number;  // 0-1, triggers human-in-the-loop above this
}

const PROVIDER_ENDPOINTS: Record<AIProvider, string> = {
  openai: 'https://api.openai.com/v1/chat/completions',
  anthropic: 'https://api.anthropic.com/v1/messages',
  google: 'https://generativelanguage.googleapis.com/v1beta/models',
  mistral: 'https://api.mistral.ai/v1/chat/completions',
  huggingface: 'https://api-inference.huggingface.co/models',
};

const DEFAULT_MODELS: Record<AIProvider, string> = {
  openai: 'gpt-4o',
  anthropic: 'claude-3-5-sonnet-20241022',
  google: 'gemini-1.5-pro',
  mistral: 'mistral-large-latest',
  huggingface: 'meta-llama/Llama-3-8b-instruct',
};

export class AIConnector extends BaseConnector {
  private config: AIConnectorConfig;

  constructor(config: AIConnectorConfig) {
    super({ id: 'ai-connector', domain: 'ai', version: '1.0.0' });
    this.config = config;
  }

  async connect(): Promise<void> {
    this.status = 'healthy';
    this.emit('connected', { connectorId: this.meta.id });
  }

  async disconnect(): Promise<void> {
    this.status = 'offline';
  }

  async healthCheck(): Promise<ConnectorStatus> {
    // Lightweight ping — check at least one provider key is set
    const hasKey = !!(
      this.config.openaiApiKey || this.config.anthropicApiKey ||
      this.config.googleAiApiKey || this.config.mistralApiKey
    );
    this.status = hasKey ? 'healthy' : 'degraded';
    return this.status;
  }

  async complete(
    req: AICompletionRequest,
    opts: ConnectorCallOptions = {}
  ): Promise<AICompletionResponse> {
    const provider = req.provider ?? this.config.defaultProvider ?? 'openai';
    const model = req.model ?? DEFAULT_MODELS[provider];

    return this.call(
      `complete:${provider}`,
      () => this.dispatchToProvider(provider, model, req),
      { ...opts, policyTags: opts.policyTags ?? ['ethical-ai'] }
    );
  }

  /** Route to correct provider API */
  private async dispatchToProvider(
    provider: AIProvider,
    model: string,
    req: AICompletionRequest
  ): Promise<AICompletionResponse> {
    const apiKey = this.getApiKey(provider);
    if (!apiKey) throw new Error(`No API key configured for provider: ${provider}`);

    let body: string;
    let headers: Record<string, string>;

    if (provider === 'anthropic') {
      headers = { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' };
      body = JSON.stringify({
        model,
        max_tokens: req.maxTokens ?? 1024,
        messages: req.messages.filter(m => m.role !== 'system'),
        system: req.messages.find(m => m.role === 'system')?.content,
      });
    } else {
      // OpenAI-compatible (openai, mistral, huggingface)
      headers = { Authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' };
      body = JSON.stringify({
        model,
        messages: req.messages,
        max_tokens: req.maxTokens ?? 1024,
        temperature: req.temperature ?? 0.7,
        tools: req.tools,
      });
    }

    const res = await fetch(PROVIDER_ENDPOINTS[provider], { method: 'POST', headers, body });
    if (!res.ok) throw new Error(`${provider} API error: ${res.status} ${await res.text()}`);
    const data = await res.json() as any;

    return this.normalizeResponse(provider, model, data, req);
  }

  private normalizeResponse(
    provider: AIProvider,
    model: string,
    data: any,
    req: AICompletionRequest
  ): AICompletionResponse {
    let content = '';
    let promptTokens = 0;
    let completionTokens = 0;
    let toolCalls: AICompletionResponse['toolCalls'];

    if (provider === 'anthropic') {
      content = data.content?.[0]?.text ?? '';
      promptTokens = data.usage?.input_tokens ?? 0;
      completionTokens = data.usage?.output_tokens ?? 0;
    } else {
      const choice = data.choices?.[0];
      content = choice?.message?.content ?? '';
      toolCalls = choice?.message?.tool_calls?.map((tc: any) => ({
        name: tc.function.name,
        arguments: JSON.parse(tc.function.arguments ?? '{}'),
      }));
      promptTokens = data.usage?.prompt_tokens ?? 0;
      completionTokens = data.usage?.completion_tokens ?? 0;
    }

    const estimatedCostUsd = this.estimateCost(provider, model, promptTokens, completionTokens);
    const requiresHumanReview = this.requiresEthicalReview(content);

    if (requiresHumanReview) {
      this.emit('human-review-required', { provider, model, content, reason: 'ethical-threshold' });
    }

    return { provider, model, content, toolCalls, usage: { promptTokens, completionTokens, estimatedCostUsd }, requiresHumanReview };
  }

  private getApiKey(provider: AIProvider): string | undefined {
    const map: Record<AIProvider, string | undefined> = {
      openai: this.config.openaiApiKey,
      anthropic: this.config.anthropicApiKey,
      google: this.config.googleAiApiKey,
      mistral: this.config.mistralApiKey,
      huggingface: this.config.huggingfaceApiKey,
    };
    return map[provider];
  }

  private estimateCost(provider: AIProvider, model: string, prompt: number, completion: number): number {
    // Approximate per-1k-token pricing (USD)
    const rates: Record<string, [number, number]> = {
      'gpt-4o': [0.005, 0.015],
      'claude-3-5-sonnet-20241022': [0.003, 0.015],
      'gemini-1.5-pro': [0.00125, 0.005],
      'mistral-large-latest': [0.004, 0.012],
    };
    const [pIn, pOut] = rates[model] ?? [0.001, 0.002];
    return (prompt / 1000) * pIn + (completion / 1000) * pOut;
  }

  private requiresEthicalReview(content: string): boolean {
    const threshold = this.config.ethicalReviewThreshold ?? 0.8;
    // Placeholder: integrate AEGIS scoring here
    const flaggedTerms = ['harm', 'weapon', 'exploit', 'manipulate'];
    const hits = flaggedTerms.filter(t => content.toLowerCase().includes(t)).length;
    return hits / flaggedTerms.length >= threshold;
  }
}
