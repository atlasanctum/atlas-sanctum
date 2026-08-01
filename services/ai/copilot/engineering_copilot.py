"""
Atlas Sanctum — Engineering Copilot
Retrieval-Augmented Generation (RAG) context assembler for the
Principal Systems Architect workflow.

Assembles project artifacts (ADRs, schema, API specs, domain glossary,
coding standards, bounded context map) into a structured prompt context
so the LLM reasons about Atlas Sanctum as it actually exists — not as
a generic greenfield project.

Pipeline:
  request → artifact retrieval → context assembly → prompt construction
          → LLM execution → quality gate evaluation → structured response

Endpoints (registered in server.py):
  POST /copilot/architect    — Full 10-step systems architect pipeline
  POST /copilot/review       — Module review as a living system
  POST /copilot/pr           — PR systems impact + code review
  GET  /copilot/context      — Inspect assembled context for a query
"""

from __future__ import annotations

import json
import logging
import time
import uuid
from pathlib import Path
from typing import Any

logger = logging.getLogger(__name__)

REPO_ROOT = Path(__file__).resolve().parents[3]


# ─── Artifact Loader ──────────────────────────────────────────────────────────

class ArtifactLoader:
    """
    Loads project artifacts from the filesystem.
    Gracefully skips missing files — the copilot degrades, not fails.
    """

    def _read(self, rel_path: str, max_chars: int = 6000) -> str | None:
        path = REPO_ROOT / rel_path
        try:
            text = path.read_text(encoding="utf-8")
            return text[:max_chars] + ("\n[truncated]" if len(text) > max_chars else "")
        except FileNotFoundError:
            return None

    def adrs(self) -> list[dict[str, str]]:
        adr_dir = REPO_ROOT / "docs" / "adr"
        results = []
        if adr_dir.exists():
            for f in sorted(adr_dir.glob("ADR-*.md")):
                content = f.read_text(encoding="utf-8")[:3000]
                results.append({"id": f.stem, "content": content})
        return results

    def openapi_spec(self) -> str | None:
        return (
            self._read("backend/openapi.yaml", max_chars=8000)
            or self._read("docs/openapi.yaml", max_chars=8000)
        )

    def database_schema(self) -> str | None:
        migration_dir = REPO_ROOT / "supabase" / "migrations"
        if not migration_dir.exists():
            return None
        files = sorted(migration_dir.glob("*.sql"))[-5:]
        return "\n\n---\n\n".join(
            f"-- {f.name}\n{f.read_text(encoding='utf-8')[:2000]}"
            for f in files
        ) or None

    def sdk_types(self) -> str | None:
        return self._read("packages/sdk/index.ts", max_chars=5000)

    def shared_constants(self) -> str | None:
        return self._read("packages/shared/index.ts", max_chars=3000)

    def engineering_standards(self) -> str | None:
        return self._read("packages/config/index.ts", max_chars=6000)

    def route_index(self) -> list[str]:
        route_dir = REPO_ROOT / "backend" / "src" / "routes"
        if not route_dir.exists():
            return []
        return [f.name for f in route_dir.rglob("*.ts")]

    def ai_type_system(self) -> str | None:
        return self._read("src/sanctum-ai/AtlasSanctumAI.types.ts", max_chars=5000)


# ─── Context Assembler ────────────────────────────────────────────────────────

class CopilotContext:
    """
    Assembles all relevant artifacts into a structured context string
    prepended to every copilot prompt.

    Sections:
      1. Platform identity + reasoning mandate
      2. Architecture Decision Records
      3. Engineering standards (glossary, principles, coding standards, quality gates)
      4. Shared domain constants
      5. Existing API surface
      6. Database schema (recent migrations)
      7. Public SDK types
      8. AI type system
    """

    def __init__(self) -> None:
        self._loader = ArtifactLoader()

    def assemble(self, query: str = "") -> str:
        loader = self._loader
        sep = "\n\n" + "─" * 80 + "\n\n"
        sections: list[str] = []

        sections.append(
            "=== ATLAS SANCTUM — ENGINEERING COPILOT CONTEXT ===\n\n"
            "You are the Principal Systems Architect for Atlas Sanctum — a Regenerative\n"
            "Intelligence Platform that helps humanity make wiser decisions through systems\n"
            "intelligence, ethical intelligence, regenerative economics, and collective stewardship.\n\n"
            "You never optimise isolated features. Every implementation must strengthen the whole\n"
            "system. You reason about stakeholders, feedback loops, leverage points, and long-term\n"
            "consequences before proposing any implementation details.\n\n"
            "Before writing code you will always:\n"
            "1. Restate the problem in domain language.\n"
            "2. Map it to the Atlas architecture and bounded contexts.\n"
            "3. Identify affected domains and existing modules.\n"
            "4. Design the domain model (entities, aggregates, events, commands, queries).\n"
            "5. Recommend the architecture with trade-off justification.\n"
            "6. Produce a phased implementation roadmap.\n"
            "7. Generate production-ready code respecting the standards below.\n"
            "8. Generate tests.\n"
            "9. Generate documentation.\n"
            "10. Review and refactor your own work.\n"
            "11. Explain how the feature contributes to regenerative intelligence,\n"
            "    ethical governance, and long-term system resilience."
        )

        adrs = loader.adrs()
        if adrs:
            adr_text = "\n\n".join(f"### {a['id']}\n{a['content']}" for a in adrs)
            sections.append(f"=== ARCHITECTURE DECISION RECORDS ===\n\n{adr_text}")

        standards = loader.engineering_standards()
        if standards:
            sections.append(f"=== ENGINEERING STANDARDS (packages/config/index.ts) ===\n\n{standards}")

        shared = loader.shared_constants()
        if shared:
            sections.append(f"=== SHARED DOMAIN CONSTANTS (packages/shared/index.ts) ===\n\n{shared}")

        routes = loader.route_index()
        if routes:
            sections.append(
                "=== EXISTING API ROUTES (backend/src/routes/) ===\n\n"
                + "\n".join(f"  {r}" for r in sorted(routes))
            )

        openapi = loader.openapi_spec()
        if openapi:
            sections.append(f"=== OPENAPI SPEC (excerpt) ===\n\n{openapi}")

        schema = loader.database_schema()
        if schema:
            sections.append(f"=== DATABASE SCHEMA (recent migrations) ===\n\n{schema}")

        sdk = loader.sdk_types()
        if sdk:
            sections.append(f"=== PUBLIC SDK TYPES (packages/sdk/index.ts) ===\n\n{sdk}")

        ai_types = loader.ai_type_system()
        if ai_types:
            sections.append(f"=== AI TYPE SYSTEM (src/sanctum-ai/AtlasSanctumAI.types.ts) ===\n\n{ai_types}")

        return "\n\n" + sep.join(sections) + "\n\n"

    def summary(self) -> dict[str, Any]:
        loader = self._loader
        return {
            "adrs":            [a["id"] for a in loader.adrs()],
            "openapi":         loader.openapi_spec() is not None,
            "database_schema": loader.database_schema() is not None,
            "sdk_types":       loader.sdk_types() is not None,
            "ai_types":        loader.ai_type_system() is not None,
            "route_count":     len(loader.route_index()),
            "standards":       loader.engineering_standards() is not None,
        }


# ─── Prompt Templates ─────────────────────────────────────────────────────────

_ARCHITECT_USER = """
Execute the full 10-step Principal Systems Architect workflow for the request below.
Do not write code before completing steps 1–6. Use the domain language and
architecture patterns from the context above.

REQUEST: {request}

Respond with valid JSON:
{{
  "step1_problem": {{"restatement": "", "domain_language_used": [], "assumptions": []}},
  "step2_architecture_map": {{"affected_bounded_contexts": [], "existing_modules_impacted": [], "adrs_relevant": []}},
  "step3_domain_model": {{"entities": [], "aggregates": [], "value_objects": [], "events": [], "commands": [], "queries": [], "policies": [], "repositories": []}},
  "step4_architecture_recommendation": {{"pattern": "", "rationale": "", "trade_offs": [], "alternatives_rejected": []}},
  "step5_system_maps": {{"data_flow": [], "event_flow": [], "api_flow": [], "security_flow": [], "ai_flow": [], "user_flow": []}},
  "step6_implementation_roadmap": {{"phase1_backend": [], "phase2_frontend": [], "phase3_ai": [], "phase4_infrastructure": [], "phase5_observability": [], "phase6_testing": []}},
  "step7_code": {{"files": [{{"path": "", "purpose": "", "content": ""}}]}},
  "step8_tests": {{"files": [{{"path": "", "content": ""}}]}},
  "step9_documentation": {{"readme": "", "api_contract": "", "migration_guide": "", "adr_or_rfc": ""}},
  "step10_self_review": {{"bugs_found": [], "performance_issues": [], "security_concerns": [], "technical_debt": [], "refactors_applied": []}},
  "regenerative_alignment": {{"human_flourishing": "", "ecological_health": "", "institutional_trust": "", "economic_regeneration": "", "knowledge_sharing": "", "ethical_governance": "", "dimensions_scored": 0}},
  "scale_evolution": {{"at_100k_users": "", "at_10m_users": "", "at_global_governments": ""}}
}}
"""

_REVIEW_USER = """
Review the module below as a living system. Answer all 10 questions.
Produce architectural recommendations BEFORE suggesting code changes.
Use the ADRs and standards from the context above to identify violations.

MODULE: {module_path}
CODE:
{code}

Respond with valid JSON:
{{
  "living_system_review": {{
    "real_world_system_represented": "",
    "stakeholders": [],
    "hidden_assumptions": [],
    "feedback_loops_present": [],
    "feedback_loops_missing": [],
    "leverage_points_ignored": [],
    "missing_dependencies": [],
    "events_not_emitted": [],
    "atlas_modules_not_connected": [],
    "data_that_should_be_knowledge": [],
    "ai_capability_opportunities": []
  }},
  "architectural_recommendations": [],
  "code_review": {{"bugs": [], "performance_issues": [], "security_concerns": [], "edge_cases": [], "maintainability_problems": [], "technical_debt": [], "adr_violations": []}},
  "refactored_code": {{"files": [{{"path": "", "content": ""}}]}},
  "regenerative_alignment_score": 0.0
}}
"""

_PR_USER = """
Perform a systems impact review of this pull request.
Produce the Systems Impact Report FIRST, then the Code Review Report.
Check all quality gates from the engineering standards above.

PR TITLE: {pr_title}
DESCRIPTION: {pr_description}
CHANGED FILES: {changed_files}
DIFF SUMMARY: {diff_summary}

Respond with valid JSON:
{{
  "systems_impact_report": {{
    "system_being_changed": "",
    "reason_for_change": "",
    "affected_stakeholders": [],
    "downstream_effects": [],
    "upstream_dependencies": [],
    "missing_feedback_loops": [],
    "failure_modes": [],
    "automation_opportunities": [],
    "ai_opportunities": [],
    "regenerative_outcomes": []
  }},
  "code_review_report": {{
    "quality_issues": [],
    "security_issues": [],
    "performance_issues": [],
    "adr_violations": [],
    "missing_tests": [],
    "missing_documentation": [],
    "quality_gates_failed": []
  }},
  "merge_recommendation": "approve | request_changes | block",
  "rationale": "",
  "required_changes": []
}}
"""


# ─── Copilot Engine ───────────────────────────────────────────────────────────

class EngineeringCopilot:
    """
    The Atlas Sanctum Engineering Copilot.

    Assembles project context, constructs grounded prompts, executes via LLM,
    and returns structured responses that respect the actual codebase.
    """

    def __init__(self) -> None:
        self._ctx = CopilotContext()

    def _invoke(self, system: str, user: str) -> dict[str, Any]:
        try:
            from atlas_agent_graph import _get_llm
            from langchain_core.messages import HumanMessage, SystemMessage

            llm = _get_llm()
            response = llm.invoke([
                SystemMessage(content=system),
                HumanMessage(content=user),
            ])
            content = response.content if hasattr(response, "content") else str(response)
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()
            return json.loads(content)
        except RuntimeError:
            logger.warning("[Copilot] No LLM provider configured")
            return {"error": "No LLM provider configured. Set OPENAI_API_KEY or ANTHROPIC_API_KEY."}
        except json.JSONDecodeError as e:
            logger.warning("[Copilot] Response not valid JSON: %s", e)
            return {"parse_error": str(e)}
        except Exception as e:
            logger.error("[Copilot] Invocation failed: %s", e)
            return {"error": str(e)}

    def architect(self, request: str) -> dict[str, Any]:
        """Full 10-step Principal Systems Architect pipeline."""
        context = self._ctx.assemble(query=request)
        start = time.time()
        result = self._invoke(context, _ARCHITECT_USER.format(request=request))
        return {
            "task_id":         str(uuid.uuid4()),
            "mode":            "architect",
            "request":         request,
            "result":          result,
            "latency_ms":      int((time.time() - start) * 1000),
            "context_summary": self._ctx.summary(),
        }

    def review_module(self, module_path: str, code: str) -> dict[str, Any]:
        """Review an existing module as a living system."""
        context = self._ctx.assemble(query=module_path)
        start = time.time()
        result = self._invoke(
            context,
            _REVIEW_USER.format(module_path=module_path, code=code[:8000]),
        )
        return {
            "task_id":    str(uuid.uuid4()),
            "mode":       "module_review",
            "module":     module_path,
            "result":     result,
            "latency_ms": int((time.time() - start) * 1000),
        }

    def review_pr(
        self,
        pr_title: str,
        pr_description: str,
        changed_files: list[str],
        diff_summary: str,
    ) -> dict[str, Any]:
        """PR systems impact + code review. Systems Impact Report first."""
        context = self._ctx.assemble(query=pr_title)
        start = time.time()
        result = self._invoke(
            context,
            _PR_USER.format(
                pr_title=pr_title,
                pr_description=pr_description[:2000],
                changed_files=json.dumps(changed_files),
                diff_summary=diff_summary[:4000],
            ),
        )
        return {
            "task_id":    str(uuid.uuid4()),
            "mode":       "pr_review",
            "pr_title":   pr_title,
            "result":     result,
            "latency_ms": int((time.time() - start) * 1000),
        }

    def context_summary(self) -> dict[str, Any]:
        return self._ctx.summary()


# ─── Singleton ────────────────────────────────────────────────────────────────

engineering_copilot = EngineeringCopilot()
