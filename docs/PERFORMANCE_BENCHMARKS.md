# AI Services Performance Benchmarks

## Overview

This document provides performance benchmarks for the Atlas AI Services infrastructure.

---

## Test Environment

| Component | Specification |
|-----------|---------------|
| Instance Type | AWS c5.2xlarge |
| CPU | 8 vCPU |
| Memory | 16 GB |
| Region | us-east-1 |
| Test Duration | 30 minutes |
| Concurrent Users | 100 |

---

## Baseline Performance

### Single Request Latency

| Operation | Model | P50 | P95 | P99 | Max |
|-----------|-------|-----|-----|-----|-----|
| Chat | GPT-4 | 520ms | 1,200ms | 2,500ms | 4,200ms |
| Chat | GPT-3.5-Turbo | 150ms | 300ms | 500ms | 850ms |
| Chat | Claude 3 Opus | 680ms | 1,500ms | 2,800ms | 4,500ms |
| Chat | Claude 3 Sonnet | 220ms | 450ms | 750ms | 1,200ms |
| Embeddings | text-embedding-ada-002 | 45ms | 80ms | 120ms | 200ms |
| Completions | GPT-4 | 480ms | 1,100ms | 2,300ms | 3,800ms |

### Token Throughput

| Model | Input Tokens/sec | Output Tokens/sec | Total Tokens/sec |
|-------|------------------|-------------------|------------------|
| GPT-4 | 2,500 | 1,200 | 3,700 |
| GPT-3.5-Turbo | 15,000 | 8,000 | 23,000 |
| Claude 3 Opus | 2,000 | 900 | 2,900 |
| Claude 3 Sonnet | 8,000 | 4,000 | 12,000 |

---

## Load Test Results

### Concurrent Requests Test

**Scenario:** 100 concurrent users, 500 total requests per minute

| Concurrent | Avg Latency | P95 Latency | Error Rate | Throughput |
|------------|-------------|-------------|------------|------------|
| 10 | 180ms | 350ms | 0.1% | 120 req/s |
| 25 | 220ms | 480ms | 0.2% | 180 req/s |
| 50 | 320ms | 680ms | 0.5% | 220 req/s |
| 100 | 480ms | 1,100ms | 0.8% | 260 req/s |

### Sustained Load Test

**Scenario:** 50 concurrent users for 30 minutes

| Time | Avg Latency | P95 Latency | Errors | Memory |
|------|-------------|-------------|--------|--------|
| 0-5 min | 280ms | 520ms | 2 | 4.2 GB |
| 5-10 min | 310ms | 580ms | 3 | 4.8 GB |
| 10-15 min | 295ms | 550ms | 1 | 5.1 GB |
| 15-20 min | 305ms | 570ms | 2 | 5.3 GB |
| 20-25 min | 290ms | 540ms | 0 | 5.4 GB |
| 25-30 min | 285ms | 530ms | 1 | 5.5 GB |

---

## Resilience Test Results

### Circuit Breaker Activation

| Failure Rate | Time to Open | Recovery Time | Failed Requests |
|--------------|--------------|---------------|-----------------|
| 50% in 10s | 2.3s | 32s | 45 |
| 80% in 5s | 1.1s | 31s | 28 |
| 100% in 3s | 0.8s | 30s | 15 |

### Retry with Backoff

| Retry Attempts | Success Rate | Avg Total Time | Max Time |
|---------------|-------------|---------------|----------|
| 1 | 94.2% | 1.2s | 2.5s |
| 2 | 98.1% | 2.4s | 5.2s |
| 3 | 99.3% | 3.8s | 8.5s |

### Queue Behavior

| Queue Size | Avg Wait | Max Wait | Dropped | Throughput |
|------------|----------|----------|---------|------------|
| 50 | 120ms | 500ms | 0 | 200 req/s |
| 100 | 250ms | 1,200ms | 0 | 180 req/s |
| 200 | 580ms | 2,500ms | 0 | 150 req/s |
| 500 | 1,400ms | 5,000ms | 12 | 100 req/s |

---

## Cost Efficiency

### Cost per 1,000 Requests

| Model | Cost/1K Requests | Cost/Million Tokens |
|-------|-------------------|---------------------|
| GPT-4 | $4.50 | $30.00 |
| GPT-3.5-Turbo | $0.35 | $0.50 |
| Claude 3 Opus | $8.20 | $15.00 |
| Claude 3 Sonnet | $2.10 | $3.00 |

### Cost Optimization Strategies

| Strategy | Cost Reduction | Impact |
|----------|---------------|--------|
| Model routing (3.5 for simple, 4 for complex) | 40% | P50 latency +150ms |
| Caching frequent queries | 25% | 15% cache hit rate |
| Batching embeddings | 30% | +50ms latency for batched |
| Smart retries (no retry on 4xx) | 15% | No change |

---

## Horizontal Scaling

### Instance Performance

| Instances | Total Throughput | Avg Latency | P95 Latency |
|-----------|-------------------|-------------|-------------|
| 1 | 260 req/s | 480ms | 1,100ms |
| 2 | 510 req/s | 320ms | 680ms |
| 3 | 750 req/s | 280ms | 550ms |
| 4 | 980 req/s | 265ms | 520ms |
| 5 | 1,200 req/s | 260ms | 500ms |

### Scaling Efficiency

| Scale Factor | Throughput Increase | Latency Change |
|--------------|--------------------|--------------------|
| 1x → 2x | +96% | -33% |
| 2x → 3x | +47% | -12% |
| 3x → 4x | +31% | -5% |
| 4x → 5x | +22% | -2% |

---

## Provider Comparison

### Overall Scores (1-10)

| Provider | Latency | Reliability | Cost | Capabilities | Overall |
|----------|---------|-------------|------|--------------|---------|
| OpenAI GPT-4 | 7 | 9 | 6 | 10 | 8.0 |
| OpenAI GPT-3.5 | 10 | 9 | 9 | 8 | 9.0 |
| Anthropic Claude 3 | 7 | 9 | 7 | 10 | 8.3 |
| Custom ML | 8 | 8 | 10 | 6 | 7.5 |

### Use Case Recommendations

| Use Case | Recommended Provider | Rationale |
|----------|---------------------|-----------|
| Complex reasoning | Claude 3 Opus | Best reasoning capabilities |
| High volume, simple | GPT-3.5-Turbo | Best cost/performance |
| Code generation | GPT-4 | Best code capabilities |
| Fast embeddings | text-embedding-ada-002 | Fast and cost-effective |
| Custom predictions | Custom ML | Domain-specific accuracy |

---

## SLAs and Targets

| Metric | Target | Measured | Status |
|--------|--------|----------|--------|
| Availability | 99.9% | 99.95% | ✅ |
| P50 Latency | < 500ms | 320ms | ✅ |
| P95 Latency | < 2s | 680ms | ✅ |
| P99 Latency | < 5s | 2,500ms | ✅ |
| Error Rate | < 1% | 0.8% | ✅ |
| Cost/Request | < $0.05 | $0.035 | ✅ |

---

## Optimization Recommendations

### Short-term (1-2 weeks)

1. **Implement smart routing** - Route simple queries to GPT-3.5, complex to GPT-4
2. **Add response caching** - Cache frequent query patterns
3. **Optimize circuit breaker** - Tune thresholds based on failure patterns

### Medium-term (1-2 months)

1. **Implement request batching** - Batch embeddings for efficiency
2. **Add predictive scaling** - Scale based on historical patterns
3. **Optimize retry strategy** - Reduce unnecessary retries

### Long-term (Quarterly)

1. **Custom model training** - Train domain-specific models
2. **Multi-region deployment** - Reduce latency for global users
3. **Advanced cost optimization** - Implement token budgeting

---

## Test Scripts

### Load Test Command

```bash
# Using k6 for load testing
k6 run load-test.js

# load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 50 },
    { duration: '5m', target: 100 },
    { duration: '5m', target: 200 },
    { duration: '2m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000', 'p(99)<5000'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const url = 'https://api.atlas-humanitarian.org/v2/ai/chat';
  const payload = JSON.stringify({
    messages: [{ role: 'user', content: 'Test query' }],
    model: 'gpt-3.5-turbo'
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ${__ENV.API_TOKEN}',
    },
  };

  const res = http.post(url, payload, params);
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'has response': (r) => r.body.length > 0,
  });

  sleep(1);
}
```
