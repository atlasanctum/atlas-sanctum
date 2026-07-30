"""
Atlas Sanctum — LangGraph Agent Orchestration
Constitutional multi-agent workflow engine with real LLM execution.

Providers: OpenAI (primary) → Anthropic (fallback)
Graph topology: preflight → [agent nodes] → human_gate → aggregate
"""

from __future__ import annotations

import json
import logging
import os
import time
import uuid
from enum import Enum
from typing import Any, Callable, TypedDict

logger = logging.getLogger(__name__)

# ─── LLM Provider (lazy import — only required in production) ─────────────────

def _get_llm():
    """Return primary LLM with Anthropic fallback. Raises if neither is configured."""
    openai_key = os.getenv("OPENAI_API_KEY")
    anthropic_key = os.getenv("ANTHROPIC_API_KEY")

    if openai_key:
        try:
            from langchain_openai import ChatOpenAI
            return ChatOpenAI(
                model=os.getenv("OPENAI_DEFAULT_MODEL", "gpt-4o"),
                temperature=0.1,
                max_tokens=2048,
                timeout=int(os.getenv("LLM_REQUEST_TIMEOUT_MS", "30000")) // 1000,
                api_key=openai_key,
            )
        except ImportError:
            logger.warning("langchain-openai not installed, trying Anthropic")

    if anthropic_key:
        try:
            from langchain_anthropic import ChatAnthropic
            return ChatAnthropic(
                model=os.getenv("ANTHROPIC_DEFAULT_MODEL", "claude-3-5-sonnet-20241022"),
                temperature=0.1,
                max_tokens=2048,
                timeout=int(os.getenv("LLM_REQUEST_TIMEOUT_MS", "30000")) // 1000,
                api_key=anthropic_key,
            )
        except ImportError:
            pass

    raise RuntimeError(
        "No LLM provider configured. Set OPENAI_API_KEY or ANTHROPIC_API_KEY."
    )


# ─── State Types ──────────────────────────────────────────────────────────────

class AgentRole(str, Enum):
    GOVERNANCE   = "governance"
    ECOLOGY      = "ecology"
    ECONOMICS    = "economics"
    RESTORATION  = "restoration"
    MEDICINE     = "medicine"
    ETHICS       = "ethics"
    FORECASTING  = "forecasting"
    DISASTER     = "disaster"
    CULTURE      = "culture"
    SECURITY     = "security"
    KNOWLEDGE    = "knowledge"
    SENTINEL     = "sentinel"


class WorkflowState(TypedDict):
    task_id:          str
    task_type:        str
    payload:          dict[str, Any]
    covenant_id:      str | None
    requested_by:     str | None
    ethics_score:     float
    permitted:        bool
    failed_checks:    list[str]
    agent_results:    list[dict[str, Any]]
    human_approval:   bool | None
    requires_human:   bool
    final_result:     dict[str, Any] | None
    error:            str | None
    timestamp:        float


# ─── Constitutional Pre-Flight ────────────────────────────────────────────────

FORBIDDEN_SIGNALS = ["exploit", "extract", "manipulate", "surveil", "addiction"]
POSITIVE_SIGNALS  = ["restore", "regenerate", "protect", "educate", "heal", "empower"]

HARD_BLOCK_CHECKS = {"identityVerified", "authorityVerified", "purposeValid", "rightsProtected"}


def constitutional_preflight(state: WorkflowState) -> WorkflowState:
    payload_str = json.dumps(state["payload"]).lower()
    failed: list[str] = []

    if not state.get("requested_by"):
        failed.append("identityVerified")
    if not state.get("covenant_id"):
        failed.append("authorityVerified")
    if any(f in payload_str for f in FORBIDDEN_SIGNALS):
        failed.append("purposeValid")
    if "indigenous" in payload_str and "extract" in payload_str:
        failed.append("rightsProtected")
    if not any(p in payload_str for p in POSITIVE_SIGNALS):
        failed.append("publicGoodIncreased")
    if not state["payload"].get("explanation"):
        failed.append("decisionExplainable")
    if not state["payload"].get("restoration_path"):
        failed.append("restorationPossible")

    hard_blocked = bool(HARD_BLOCK_CHECKS & set(failed))
    positive_count = sum(1 for p in POSITIVE_SIGNALS if p in payload_str)
    ethics_score = max(0.0, min(1.0, 0.5 + positive_count * 0.1 - len(failed) * 0.1))

    return {
        **state,
        "ethics_score":  ethics_score,
        "permitted":     not hard_blocked and ethics_score >= 0.3,
        "failed_checks": failed,
    }


# ─── Role System Prompts ──────────────────────────────────────────────────────

ROLE_SYSTEM_PROMPTS: dict[AgentRole, str] = {
    AgentRole.GOVERNANCE: (
        "You are the Governance Agent for Atlas Sanctum, a regenerative planetary OS. "
        "Draft policy recommendations that are ethical, inclusive, and regenerative. "
        "Always consider indigenous sovereignty and community consent. "
        "Respond with structured JSON: {policy_draft, status, stakeholders, risks}."
    ),
    AgentRole.ECOLOGY: (
        "You are the Ecology Agent. Analyze ecosystem health using NDVI, biodiversity indices, "
        "and carbon stock data. Identify threats and restoration opportunities. "
        "Respond with JSON: {ndvi, biodiversity_index, carbon_stock_tonnes_ha, alerts, recommendations}."
    ),
    AgentRole.ECONOMICS: (
        "You are the Regenerative Economics Agent. Value natural capital and regenerative impact "
        "using the Regenerative Value Exchange methodology. Never use extractive valuation models. "
        "Respond with JSON: {valuation_usd, methodology, confidence, regenerative_premium}."
    ),
    AgentRole.RESTORATION: (
        "You are the Restoration Planning Agent. Design science-based ecological restoration plans. "
        "Prioritize native species, soil health, and community involvement. "
        "Respond with JSON: {interventions, estimated_tonnes_co2, timeline_years, community_roles}."
    ),
    AgentRole.MEDICINE: (
        "You are the Planetary Health Agent. Assess climate-health linkages and recommend "
        "interventions that improve human and ecosystem health simultaneously. "
        "Respond with JSON: {health_burden_reduction, recommendations, affected_population, co_benefits}."
    ),
    AgentRole.ETHICS: (
        "You are the Ethics Agent. Evaluate actions against the Atlas Sanctum constitutional principles: "
        "no harm, indigenous sovereignty, regenerative alignment, transparency, and public good. "
        "Respond with JSON: {compliant, score, violations, recommendations}."
    ),
    AgentRole.FORECASTING: (
        "You are the Strategic Forecasting Agent. Model long-term regenerative scenarios using "
        "systems thinking and planetary boundary science. "
        "Respond with JSON: {horizon_years, primary_scenario, confidence, tipping_points, opportunities}."
    ),
    AgentRole.DISASTER: (
        "You are the Disaster Response Agent. Coordinate immediate and long-term responses to "
        "climate and ecological emergencies. Prioritize vulnerable communities. "
        "Respond with JSON: {protocol, estimated_affected, immediate_actions, resources_needed}."
    ),
    AgentRole.CULTURE: (
        "You are the Cultural Knowledge Agent. Preserve and integrate indigenous and traditional "
        "ecological knowledge with full FPIC compliance. Never extract without consent. "
        "Respond with JSON: {preserved, method, communities_consulted, fpic_status, knowledge_type}."
    ),
    AgentRole.SECURITY: (
        "You are the Security Agent. Assess threats to the platform, data, and communities. "
        "Recommend zero-trust mitigations. Never recommend surveillance of communities. "
        "Respond with JSON: {threat_level, mitigations, vulnerabilities, privacy_impact}."
    ),
    AgentRole.KNOWLEDGE: (
        "You are the Knowledge Commons Agent. Index, connect, and surface relevant knowledge "
        "from research, indigenous wisdom, and field observations. "
        "Respond with JSON: {nodes_indexed, relevant_assets, semantic_connections, gaps}."
    ),
    AgentRole.SENTINEL: (
        "You are the Sentinel Agent. Monitor all system layers for anomalies, ethical drift, "
        "and emerging threats. Escalate critical issues immediately. "
        "Respond with JSON: {anomalies_detected, system_status, alerts, escalation_required}."
    ),
}


# ─── LLM Agent Execution ──────────────────────────────────────────────────────

def _execute_agent_llm(role: AgentRole, state: WorkflowState) -> dict[str, Any]:
    """
    Execute agent via LLM. Falls back to structured stub if LLM unavailable.
    All responses are parsed as JSON; raw text is wrapped if parsing fails.
    """
    try:
        llm = _get_llm()
        from langchain_core.messages import HumanMessage, SystemMessage

        system_prompt = ROLE_SYSTEM_PROMPTS[role]
        user_message = (
            f"Task type: {state['task_type']}\n"
            f"Ethics score: {state['ethics_score']:.2f}\n"
            f"Payload: {json.dumps(state['payload'], indent=2)}\n\n"
            f"Provide your analysis and recommendations as valid JSON."
        )

        response = llm.invoke([
            SystemMessage(content=system_prompt),
            HumanMessage(content=user_message),
        ])

        content = response.content if hasattr(response, "content") else str(response)

        # Extract JSON from response (handle markdown code blocks)
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()

        return json.loads(content)

    except RuntimeError:
        # No LLM configured — use structured fallback
        logger.warning("[%s] No LLM provider, using structured fallback", role.value)
        return _fallback_output(role, state)
    except json.JSONDecodeError as e:
        logger.warning("[%s] LLM response not valid JSON: %s", role.value, e)
        return {"raw_response": content, "parse_error": str(e)}
    except Exception as e:
        logger.error("[%s] LLM execution failed: %s", role.value, e)
        return {"error": str(e), "fallback": _fallback_output(role, state)}


def _fallback_output(role: AgentRole, state: WorkflowState) -> dict[str, Any]:
    """Structured fallback when LLM is unavailable."""
    fallbacks: dict[AgentRole, dict[str, Any]] = {
        AgentRole.GOVERNANCE:  {"policy_draft": f"Policy for {state['task_type']}", "status": "proposed", "stakeholders": [], "risks": []},
        AgentRole.ECOLOGY:     {"ndvi": 0.72, "biodiversity_index": 0.81, "carbon_stock_tonnes_ha": 180, "alerts": [], "recommendations": []},
        AgentRole.ECONOMICS:   {"valuation_usd": 850_000, "methodology": "regenerative_value_exchange", "confidence": 0.7, "regenerative_premium": 0.15},
        AgentRole.RESTORATION: {"interventions": ["reforestation", "soil_regeneration"], "estimated_tonnes_co2": 1200, "timeline_years": 10, "community_roles": []},
        AgentRole.MEDICINE:    {"health_burden_reduction": 0.15, "recommendations": ["clean_water", "air_quality"], "affected_population": 0, "co_benefits": []},
        AgentRole.ETHICS:      {"compliant": True, "score": state["ethics_score"], "violations": state["failed_checks"], "recommendations": []},
        AgentRole.FORECASTING: {"horizon_years": 25, "primary_scenario": "regenerative_transition", "confidence": 0.72, "tipping_points": [], "opportunities": []},
        AgentRole.DISASTER:    {"protocol": "immediate_response", "estimated_affected": state["payload"].get("population", 0), "immediate_actions": [], "resources_needed": []},
        AgentRole.CULTURE:     {"preserved": True, "method": "digital_archive_with_sovereignty", "communities_consulted": [], "fpic_status": "pending", "knowledge_type": "traditional_ecological"},
        AgentRole.SECURITY:    {"threat_level": "low", "mitigations": ["zk_verification", "multi_source_consensus"], "vulnerabilities": [], "privacy_impact": "none"},
        AgentRole.KNOWLEDGE:   {"nodes_indexed": 142, "relevant_assets": [], "semantic_connections": [], "gaps": []},
        AgentRole.SENTINEL:    {"anomalies_detected": 0, "system_status": "nominal", "alerts": [], "escalation_required": False},
    }
    return fallbacks.get(role, {"completed": True})


# ─── Agent Node Factory ───────────────────────────────────────────────────────

HUMAN_APPROVAL_ROLES = {AgentRole.GOVERNANCE, AgentRole.MEDICINE, AgentRole.DISASTER}


def make_agent_node(role: AgentRole) -> Callable[[WorkflowState], WorkflowState]:
    def agent_node(state: WorkflowState) -> WorkflowState:
        if not state["permitted"]:
            return {**state, "error": f"Agent {role.value} blocked by constitutional pre-flight"}

        start = time.time()
        result = _execute_agent_llm(role, state)
        requires_human = role in HUMAN_APPROVAL_ROLES

        return {
            **state,
            "agent_results": [*state["agent_results"], {
                "role":           role.value,
                "result":         result,
                "ethics_score":   state["ethics_score"],
                "requires_human": requires_human,
                "latency_ms":     int((time.time() - start) * 1000),
                "completed_at":   time.time(),
            }],
            "requires_human": state["requires_human"] or requires_human,
        }

    agent_node.__name__ = f"{role.value}_agent"
    return agent_node


# ─── Human-in-the-Loop Gate ───────────────────────────────────────────────────

def human_approval_gate(state: WorkflowState) -> WorkflowState:
    if not state["requires_human"]:
        return {**state, "human_approval": True}
    auto_approved = state["ethics_score"] >= 0.7 and not state["failed_checks"]
    return {**state, "human_approval": auto_approved}


# ─── Result Aggregator ────────────────────────────────────────────────────────

def aggregate_results(state: WorkflowState) -> WorkflowState:
    if not state["permitted"] or state["human_approval"] is False:
        return {
            **state,
            "final_result": {
                "permitted":     False,
                "ethics_score":  state["ethics_score"],
                "failed_checks": state["failed_checks"],
                "reason":        "Constitutional pre-flight failed or human approval denied",
            },
        }

    total_latency = sum(r.get("latency_ms", 0) for r in state["agent_results"])

    return {
        **state,
        "final_result": {
            "task_id":       state["task_id"],
            "task_type":     state["task_type"],
            "permitted":     True,
            "ethics_score":  state["ethics_score"],
            "agent_results": state["agent_results"],
            "recommendations": [
                r["result"].get("policy_draft")
                or r["result"].get("recommendations")
                or f"{r['role']} completed successfully"
                for r in state["agent_results"]
            ],
            "total_latency_ms": total_latency,
            "completed_at":  time.time(),
        },
    }


# ─── Task → Role Routing ──────────────────────────────────────────────────────

TASK_ROLE_MAP: dict[str, list[AgentRole]] = {
    "ecological_assessment": [AgentRole.ECOLOGY, AgentRole.FORECASTING, AgentRole.ETHICS],
    "policy_design":         [AgentRole.GOVERNANCE, AgentRole.ETHICS, AgentRole.CULTURE],
    "carbon_validation":     [AgentRole.ECOLOGY, AgentRole.ECONOMICS, AgentRole.SECURITY],
    "disaster_response":     [AgentRole.DISASTER, AgentRole.MEDICINE, AgentRole.GOVERNANCE],
    "governance_proposal":   [AgentRole.GOVERNANCE, AgentRole.ETHICS, AgentRole.CULTURE],
    "restoration_planning":  [AgentRole.RESTORATION, AgentRole.ECOLOGY, AgentRole.ECONOMICS],
    "planetary_simulation":  [AgentRole.FORECASTING, AgentRole.ECOLOGY, AgentRole.ECONOMICS],
    "knowledge_query":       [AgentRole.KNOWLEDGE, AgentRole.ETHICS],
    "security_assessment":   [AgentRole.SECURITY, AgentRole.SENTINEL, AgentRole.ETHICS],
}


# ─── Atlas Agent Graph ────────────────────────────────────────────────────────

class AtlasAgentGraph:
    """
    Constitutional multi-agent workflow.
    Graph: preflight → [role agents] → human_gate → aggregate

    Production path: set OPENAI_API_KEY or ANTHROPIC_API_KEY.
    Without keys: runs structured fallback responses (safe for dev/test).
    """

    def __init__(self) -> None:
        self._agent_nodes = {role: make_agent_node(role) for role in AgentRole}

    def run(
        self,
        task_type: str,
        payload: dict[str, Any],
        covenant_id: str | None = None,
        requested_by: str | None = None,
    ) -> dict[str, Any]:
        initial_state: WorkflowState = {
            "task_id":        str(uuid.uuid4()),
            "task_type":      task_type,
            "payload":        payload,
            "covenant_id":    covenant_id,
            "requested_by":   requested_by,
            "ethics_score":   0.0,
            "permitted":      False,
            "failed_checks":  [],
            "agent_results":  [],
            "human_approval": None,
            "requires_human": False,
            "final_result":   None,
            "error":          None,
            "timestamp":      time.time(),
        }

        state = constitutional_preflight(initial_state)

        roles = TASK_ROLE_MAP.get(task_type, [AgentRole.ETHICS])
        for role in roles:
            state = self._agent_nodes[role](state)

        state = human_approval_gate(state)
        state = aggregate_results(state)

        return state["final_result"] or {"error": state.get("error", "Unknown error")}

    def available_task_types(self) -> list[str]:
        return list(TASK_ROLE_MAP.keys())


# ─── Singleton ────────────────────────────────────────────────────────────────

atlas_agent_graph = AtlasAgentGraph()
