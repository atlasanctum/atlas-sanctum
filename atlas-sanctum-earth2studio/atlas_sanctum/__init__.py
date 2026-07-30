"""
Atlas Sanctum Earth2Studio Integration

This package provides integration between Earth2Studio scientific modeling
and Atlas Sanctum's planetary conscience system.

Modules:
- config: Configuration management
- gpu: GPU verification
- conscience: Planetary conscience evaluation
- integration: Earth2Studio integration engine
"""

from atlas_sanctum.config.manager import (
    ConfigurationManager,
    Earth2StudioConfig,
    NatureConstraintConfig,
    get_atlas_sanctum_config
)
from atlas_sanctum.gpu.verifier import (
    GPUVerifier,
    GPUInfo,
    GPUStatus,
    verify_gpu_for_atlas_sanctum
)
from atlas_sanctum.conscience.core import (
    PlanetaryConscience,
    RegenerationMetrics,
    NatureConstraint,
    ConscienceDecision,
    ConscienceState,
    create_planetary_conscience
)
from atlas_sanctum.integration.engine import (
    Earth2StudioIntegration,
    ScientificPrediction,
    EconomicRecommendation,
    ModelingDomain,
    create_atlas_sanctum_integration
)

__version__ = "0.1.0"

__all__ = [
    # Configuration
    "ConfigurationManager",
    "Earth2StudioConfig",
    "NatureConstraintConfig",
    "get_atlas_sanctum_config",
    # GPU
    "GPUVerifier",
    "GPUInfo",
    "GPUStatus",
    "verify_gpu_for_atlas_sanctum",
    # Conscience
    "PlanetaryConscience",
    "RegenerationMetrics",
    "NatureConstraint",
    "ConscienceDecision",
    "ConscienceState",
    "create_planetary_conscience",
    # Integration
    "Earth2StudioIntegration",
    "ScientificPrediction",
    "EconomicRecommendation",
    "ModelingDomain",
    "create_atlas_sanctum_integration",
]
