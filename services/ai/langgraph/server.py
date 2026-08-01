"""
Atlas Sanctum — Agent Service HTTP API
Exposes AtlasAgentGraph as a FastAPI microservice.

Runs on: http://localhost:8001 (configurable via PORT env var)
Called by: backend /api/v3/sanctum/ai/agent route
"""

from __future__ import annotations

import logging
import os
import sys
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Header
from pydantic import BaseModel

from atlas_agent_graph import atlas_agent_graph
from dev_lifecycle_agents import dev_lifecycle_graph
from engineering_copilot import engineering_copilot
sys.path.insert(0, str(Path(__file__).parent.parent / "knowledge-commons"))
from unified_query_engine import unified_query_engine, knowledge_ingestion, UnifiedQuery

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Atlas Sanctum Agent Service",
    version="1.0.0",
    docs_url="/docs" if os.getenv("NODE_ENV") != "production" else None,
)

# ─── Internal auth — shared secret with Node.js backend ──────────────────────

AGENT_SERVICE_SECRET = os.getenv("AGENT_SERVICE_SECRET", "")


def _verify_secret(x_agent_secret: str | None) -> None:
    if AGENT_SERVICE_SECRET and x_agent_secret != AGENT_SERVICE_SECRET:
        raise HTTPException(status_code=401, detail="Unauthorized")


# ─── Request / Response Models ────────────────────────────────────────────────

class RunRequest(BaseModel):
    task_type: str
    payload: dict[str, Any]
    covenant_id: str | None = None
    requested_by: str | None = None


class RunResponse(BaseModel):
    success: bool
    data: dict[str, Any]


# ─── Routes ───────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "ok", "service": "atlas-sanctum-agents"}


@app.get("/task-types")
def task_types(x_agent_secret: str | None = Header(default=None)):
    _verify_secret(x_agent_secret)
    return {
        "task_types": atlas_agent_graph.available_task_types(),
        "lifecycle_task_types": dev_lifecycle_graph.available_task_types(),
    }


@app.post("/run", response_model=RunResponse)
def run_agent(body: RunRequest, x_agent_secret: str | None = Header(default=None)):
    _verify_secret(x_agent_secret)

    if body.task_type not in atlas_agent_graph.available_task_types():
        raise HTTPException(
            status_code=400,
            detail=f"Unknown task_type '{body.task_type}'. "
                   f"Valid: {atlas_agent_graph.available_task_types()}",
        )

    try:
        result = atlas_agent_graph.run(
            task_type=body.task_type,
            payload=body.payload,
            covenant_id=body.covenant_id,
            requested_by=body.requested_by,
        )
        return RunResponse(success=True, data=result)
    except Exception as e:
        logger.error("Agent run failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


# ─── Lifecycle Routes ────────────────────────────────────────────────────────

@app.get("/lifecycle/task-types")
def lifecycle_task_types(x_agent_secret: str | None = Header(default=None)):
    _verify_secret(x_agent_secret)
    return {"task_types": dev_lifecycle_graph.available_task_types()}


@app.post("/lifecycle/run", response_model=RunResponse)
def run_lifecycle(body: RunRequest, x_agent_secret: str | None = Header(default=None)):
    _verify_secret(x_agent_secret)

    if body.task_type not in dev_lifecycle_graph.available_task_types():
        raise HTTPException(
            status_code=400,
            detail=f"Unknown lifecycle task_type '{body.task_type}'. "
                   f"Valid: {dev_lifecycle_graph.available_task_types()}",
        )

    try:
        result = dev_lifecycle_graph.run(
            task_type=body.task_type,
            payload=body.payload,
            covenant_id=body.covenant_id,
            requested_by=body.requested_by,
        )
        return RunResponse(success=True, data=result)
    except Exception as e:
        logger.error("Lifecycle run failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


# ─── Copilot Routes ──────────────────────────────────────────────────────────

class CopilotArchitectRequest(BaseModel):
    request: str
    covenant_id: str | None = None
    requested_by: str | None = None


class CopilotReviewRequest(BaseModel):
    module_path: str
    code: str


class CopilotPRRequest(BaseModel):
    pr_title: str
    pr_description: str = ""
    changed_files: list[str] = []
    diff_summary: str = ""


@app.get("/copilot/context")
def copilot_context(x_agent_secret: str | None = Header(default=None)):
    _verify_secret(x_agent_secret)
    return engineering_copilot.context_summary()


@app.post("/copilot/architect", response_model=RunResponse)
def copilot_architect(body: CopilotArchitectRequest, x_agent_secret: str | None = Header(default=None)):
    _verify_secret(x_agent_secret)
    try:
        result = engineering_copilot.architect(body.request)
        return RunResponse(success=True, data=result)
    except Exception as e:
        logger.error("Copilot architect failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/copilot/review", response_model=RunResponse)
def copilot_review(body: CopilotReviewRequest, x_agent_secret: str | None = Header(default=None)):
    _verify_secret(x_agent_secret)
    try:
        result = engineering_copilot.review_module(body.module_path, body.code)
        return RunResponse(success=True, data=result)
    except Exception as e:
        logger.error("Copilot review failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/copilot/pr", response_model=RunResponse)
def copilot_pr(body: CopilotPRRequest, x_agent_secret: str | None = Header(default=None)):
    _verify_secret(x_agent_secret)
    try:
        result = engineering_copilot.review_pr(
            body.pr_title,
            body.pr_description,
            body.changed_files,
            body.diff_summary,
        )
        return RunResponse(success=True, data=result)
    except Exception as e:
        logger.error("Copilot PR review failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


# ─── Knowledge Routes ────────────────────────────────────────────────────────

class KnowledgeQueryRequest(BaseModel):
    text: str
    user_id: str | None = None
    access_levels: list[str] = ["public", "community", "institutional"]
    domain: str | None = None
    top_k: int = 10
    include_graph: bool = True
    include_vector: bool = True
    include_sql: bool = True


class IngestRequest(BaseModel):
    source_type: str
    source_ref: str
    raw_text: str
    metadata: dict[str, Any] = {}


@app.post("/knowledge/query", response_model=RunResponse)
async def knowledge_query(body: KnowledgeQueryRequest, x_agent_secret: str | None = Header(default=None)):
    _verify_secret(x_agent_secret)
    try:
        uq = UnifiedQuery(
            text=body.text,
            user_id=body.user_id,
            access_levels=body.access_levels,
            domain=body.domain,
            top_k=body.top_k,
            include_graph=body.include_graph,
            include_vector=body.include_vector,
            include_sql=body.include_sql,
        )
        result = await unified_query_engine.query(uq)
        return RunResponse(success=True, data={
            "query_id":        result.query_id,
            "intent":          result.intent,
            "layers_used":     result.layers_used,
            "synthesis":       result.synthesis,
            "citations":       result.citations,
            "contradictions":  result.contradictions,
            "confidence":      result.confidence,
            "total_latency_ms": result.total_latency_ms,
            "reasoning":       result.reasoning,
            "result_count":    len(result.ir_result.documents) if result.ir_result else 0,
        })
    except Exception as e:
        logger.error("Knowledge query failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/knowledge/ingest", response_model=RunResponse)
async def knowledge_ingest(body: IngestRequest, x_agent_secret: str | None = Header(default=None)):
    _verify_secret(x_agent_secret)
    try:
        result = await knowledge_ingestion.ingest(
            source_type=body.source_type,
            source_ref=body.source_ref,
            raw_text=body.raw_text,
            metadata=body.metadata,
        )
        return RunResponse(success=True, data=result)
    except Exception as e:
        logger.error("Knowledge ingest failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/knowledge/stats")
def knowledge_stats(x_agent_secret: str | None = Header(default=None)):
    _verify_secret(x_agent_secret)
    return {
        "ir_index_size": unified_query_engine.index_size,
        "service":       "atlas-knowledge-engine",
    }


# ─── Entry Point ──────────────────────────────────────────────────────────────

def main():
    import uvicorn
    uvicorn.run(
        "server:app",
        host="0.0.0.0",
        port=int(os.getenv("AGENT_SERVICE_PORT", "8001")),
        reload=os.getenv("NODE_ENV") != "production",
        log_level="info",
    )


if __name__ == "__main__":
    main()
