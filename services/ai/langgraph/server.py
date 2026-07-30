"""
Atlas Sanctum — Agent Service HTTP API
Exposes AtlasAgentGraph as a FastAPI microservice.

Runs on: http://localhost:8001 (configurable via PORT env var)
Called by: backend /api/v3/sanctum/ai/agent route
"""

from __future__ import annotations

import logging
import os
from typing import Any

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Header
from pydantic import BaseModel

from atlas_agent_graph import atlas_agent_graph

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
    return {"task_types": atlas_agent_graph.available_task_types()}


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
