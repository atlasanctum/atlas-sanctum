# AI Services API Contracts

This document describes the API contracts for Atlas AI Services.

## Base URL

```
Production: https://api.atlas-humanitarian.org/v2/ai
Development: http://localhost:3000/api/v2/ai
```

## Authentication

All endpoints require authentication via:
- Bearer Token (JWT): `Authorization: Bearer <token>`
- API Key: `X-API-Key: <key>`

---

## 1. Chat Completion API

### POST /chat

Send a chat message and receive a completion.

#### Request

```json
{
  "messages": [
    {
      "role": "system",
      "content": "You are Atlas, an AI assistant for humanitarian projects."
    },
    {
      "role": "user",
      "content": "What are the key considerations for forest conservation?"
    }
  ],
  "model": "gpt-4",
  "temperature": 0.7,
  "max_tokens": 1000,
  "provider": "auto",
  "correlation_id": "req-12345-abcde"
}
```

#### Response

```json
{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "created": 1706986200,
  "model": "gpt-4",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Forest conservation involves several key considerations..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 45,
    "completion_tokens": 234,
    "total_tokens": 279
  },
  "provider": "openai",
  "latency_ms": 523
}
```

#### Error Responses

**400 Bad Request**
```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Invalid request parameters",
    "details": {
      "field": "messages",
      "issue": "messages array cannot be empty"
    }
  }
}
```

**401 Unauthorized**
```json
{
  "error": {
    "code": "AUTHENTICATION_ERROR",
    "message": "Invalid or missing authentication credentials"
  }
}
```

**429 Rate Limited**
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Please retry after 30 seconds",
    "details": {
      "retry_after": 30,
      "limit": 100,
      "remaining": 0
    }
  }
}
```

**503 Service Unavailable**
```json
{
  "error": {
    "code": "PROVIDER_UNAVAILABLE",
    "message": "All AI providers are currently unavailable",
    "details": {
      "providers": ["openai", "anthropic"],
      "circuit_state": "open"
    }
  }
}
```

### Streaming Chat

#### POST /chat/stream

Enable streaming responses by setting `stream: true`.

#### Response Format (Server-Sent Events)

```
data: {"id":"chatcmpl-abc123","choices":[{"delta":{"role":"assistant"}}]}

data: {"id":"chatcmpl-abc123","choices":[{"delta":{"content":"Forest"}}]}

data: {"id":"chatcmpl-abc123","choices":[{"delta":{"content":" conservation"}}]}

data: [DONE]
```

---

## 2. Embeddings API

### POST /embeddings

Generate vector embeddings for text.

#### Request

```json
{
  "input": [
    "Forest conservation is crucial for biodiversity",
    "Ocean projects help sequester carbon"
  ],
  "model": "text-embedding-ada-002",
  "encoding_format": "float"
}
```

#### Response

```json
{
  "object": "list",
  "data": [
    {
      "object": "embedding",
      "embedding": [0.002, -0.031, 0.089, ...],
      "index": 0
    },
    {
      "object": "embedding",
      "embedding": [0.015, -0.022, 0.067, ...],
      "index": 1
    }
  ],
  "model": "text-embedding-ada-002",
  "usage": {
    "prompt_tokens": 20,
    "completion_tokens": 0,
    "total_tokens": 20
  },
  "provider": "openai"
}
```

---

## 3. Completions API

### POST /completions

Generate a text completion for the given prompt.

#### Request

```json
{
  "prompt": "The main benefits of regenerative agriculture include:",
  "model": "gpt-3.5-turbo",
  "max_tokens": 200,
  "temperature": 0.6
}
```

#### Response

```json
{
  "id": "cmpl-xyz789",
  "object": "text_completion",
  "created": 1706986200,
  "model": "gpt-3.5-turbo",
  "choices": [
    {
      "text": "1. Improved soil health and fertility\n2. Increased biodiversity\n3. Carbon sequestration\n4. Enhanced water retention\n5. Greater resilience to climate change",
      "index": 0,
      "finish_reason": "length"
    }
  ],
  "usage": {
    "prompt_tokens": 12,
    "completion_tokens": 200,
    "total_tokens": 212
  },
  "provider": "openai"
}
```

---

## 4. Provider Management API

### GET /providers

Get status of all configured AI providers.

#### Response

```json
{
  "providers": [
    {
      "id": "openai",
      "name": "OpenAI",
      "status": "healthy",
      "circuit_state": "closed",
      "capabilities": ["chat", "completion", "embedding", "function-calling"],
      "metrics": {
        "total_requests": 15234,
        "success_rate": 0.998,
        "avg_latency_ms": 450,
        "p99_latency_ms": 1200,
        "error_rate": 0.002
      },
      "rate_limits": {
        "requests_remaining": 4500,
        "tokens_remaining": 900000,
        "reset_at": "2024-02-04T00:00:00Z"
      },
      "last_health_check": "2024-02-03T18:30:00Z"
    },
    {
      "id": "anthropic",
      "name": "Anthropic",
      "status": "healthy",
      "circuit_state": "closed",
      "capabilities": ["chat", "completion", "function-calling"],
      "metrics": {
        "total_requests": 5432,
        "success_rate": 0.997,
        "avg_latency_ms": 680,
        "p99_latency_ms": 1800,
        "error_rate": 0.003
      },
      "last_health_check": "2024-02-03T18:30:00Z"
    }
  ],
  "primary": "openai",
  "fallbacks": ["anthropic"]
}
```

### PATCH /providers/{providerId}

Update provider configuration.

#### Request Body

```json
{
  "enabled": true,
  "priority": 1
}
```

#### Response

```json
{
  "success": true,
  "message": "Provider configuration updated",
  "provider": {
    "id": "anthropic",
    "enabled": true,
    "priority": 1
  }
}
```

---

## 5. Health & Monitoring API

### GET /health

Get overall health status.

#### Response

```json
{
  "overall_status": "healthy",
  "timestamp": "2024-02-03T18:30:00Z",
  "version": "1.0.0",
  "uptime_seconds": 86400,
  "providers": [...]
}
```

### GET /metrics

Get detailed metrics.

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| period | string | 5m | Time period (1m, 5m, 15m, 1h, 24h) |

#### Response

```json
{
  "timestamp": "2024-02-03T18:30:00Z",
  "period": "5m",
  "metrics": {
    "throughput": {
      "total": 1523,
      "per_second": 5.1
    },
    "latency": {
      "p50_ms": 320,
      "p95_ms": 890,
      "p99_ms": 1450,
      "avg_ms": 480
    },
    "errors": {
      "total": 3,
      "rate": 0.002,
      "by_code": {
        "PROVIDER_UNAVAILABLE": 1,
        "RATE_LIMIT_EXCEEDED": 2
      }
    },
    "costs": {
      "total": 42.50,
      "currency": "USD",
      "by_provider": {
        "openai": 35.20,
        "anthropic": 7.30
      }
    }
  }
}
```

### GET /metrics/cost

Get cost tracking information.

#### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| start_date | date | Start date (YYYY-MM-DD) |
| end_date | date | End date (YYYY-MM-DD) |
| group_by | string | Group by (provider, model, day) |

#### Response

```json
{
  "total_cost": 1250.75,
  "currency": "USD",
  "period": {
    "start": "2024-02-01",
    "end": "2024-02-03"
  },
  "by_provider": {
    "openai": 980.50,
    "anthropic": 270.25
  },
  "by_model": {
    "gpt-4": 650.00,
    "gpt-3.5-turbo": 330.50,
    "claude-3-opus": 270.25
  },
  "daily_costs": [
    {
      "date": "2024-02-01",
      "cost": 425.30
    },
    {
      "date": "2024-02-02",
      "cost": 410.20
    },
    {
      "date": "2024-02-03",
      "cost": 415.25
    }
  ]
}
```

---

## 6. Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_REQUEST` | 400 | Invalid request parameters |
| `AUTHENTICATION_ERROR` | 401 | Invalid credentials |
| `RATE_LIMIT_EXCEEDED` | 429 | Rate limit exceeded |
| `TOKEN_LIMIT_EXCEEDED` | 400 | Token limit exceeded |
| `PROVIDER_UNAVAILABLE` | 503 | AI provider unavailable |
| `CIRCUIT_OPEN` | 503 | Circuit breaker is open |
| `TIMEOUT` | 504 | Request timeout |
| `CONTENT_FILTERED` | 400 | Content filtered |
| `UNKNOWN_ERROR` | 500 | Unknown error |

---

## Rate Limits

| Provider | Requests/Min | Tokens/Min |
|----------|--------------|------------|
| OpenAI (GPT-4) | 100 | 60,000 |
| OpenAI (GPT-3.5) | 500 | 500,000 |
| Anthropic | 50 | 100,000 |

---

## Model Pricing (USD per 1M tokens)

| Model | Input | Output |
|-------|-------|--------|
| GPT-4 | $30.00 | $60.00 |
| GPT-3.5-Turbo | $0.50 | $1.50 |
| Claude 3 Opus | $15.00 | $75.00 |
| Claude 3 Sonnet | $3.00 | $15.00 |
| Embeddings | $0.10 | - |
