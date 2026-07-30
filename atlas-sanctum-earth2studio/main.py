#!/usr/bin/env python3
"""
Atlas Sanctum Earth2Studio - Planetary Conscience Entry Point

This module serves as the primary entry point for Atlas Sanctum's
integration with Earth2Studio, ensuring that:

1. Regeneration is measurable
2. Value is constrained by nature
3. AI remains humble before physics

Usage:
    python main.py [--config CONFIG_PATH] [--model MODEL_NAME]
"""

import argparse
import json
import sys
from pathlib import Path

# Add current directory to path for imports
sys.path.insert(0, str(Path(__file__).parent))

from atlas_sanctum import (
    verify_gpu_for_atlas_sanctum,
    get_atlas_sanctum_config,
    create_planetary_conscience,
    create_atlas_sanctum_integration,
    ModelingDomain
)


def print_header():
    """Print Atlas Sanctum header."""
    print("=" * 60)
    print("Atlas Sanctum - Earth2Studio Planetary Conscience")
    print("=" * 60)
    print()
    print("Ensuring Earth2Studio serves as Atlas Sanctum's planetary")
    print("conscience for measurable regeneration and nature-constrained")
    print("economic decisions.")
    print()
    print("Principles:")
    print("  1. Regeneration is measurable")
    print("  2. Value is constrained by nature")
    print("  3. AI remains humble before physics")
    print()
    print("=" * 60)


def print_gpu_status():
    """Print GPU verification status."""
    print("\n[GPU Verification]")
    gpu_info = verify_gpu_for_atlas_sanctum()
    
    print(f"  Status: {gpu_info.status.value}")
    print(f"  GPU: {gpu_info.name}")
    print(f"  Memory: {gpu_info.memory_gb:.1f} GB")
    print(f"  Compute Capability: {gpu_info.compute_capability}")
    
    if gpu_info.recommendations:
        print("  Recommendations:")
        for rec in gpu_info.recommendations:
            print(f"    - {rec}")


def print_config_status():
    """Print configuration status."""
    print("\n[Configuration]")
    config = get_atlas_sanctum_config()
    earth2studio_cfg = config.get_earth2studio_config()
    
    print(f"  Default Model: {earth2studio_cfg.default_model}")
    print(f"  Cache Location: {earth2studio_cfg.cache_location}")
    print(f"  Conscience Mode: {earth2studio_cfg.enable_conscience_mode}")
    print(f"  Nature Value Weight: {config.get_nature_constraints().nature_value_weight}")


def print_conscience_status():
    """Print planetary conscience status."""
    print("\n[Planetary Conscience]")
    conscience = create_planetary_conscience()
    report = conscience.get_conscience_report()
    
    print(f"  State: {report['state']}")
    print(f"  Active Constraints: {len(report['active_constraints'])}")
    
    print("\n  Principles:")
    for key, principle in report['principles'].items():
        if isinstance(principle, dict):
            print(f"    {principle.get('name', key)}: {principle.get('description', '')}")
        else:
            print(f"    {principle}")


def run_demo():
    """Run demonstration of Earth2Studio integration."""
    print("\n[Demo: Scientific Modeling & Economic Recommendation]")
    
    try:
        # Create integration
        integration = create_atlas_sanctum_integration()
        
        # Run scientific modeling
        print("\n  Running scientific model...")
        prediction = integration.run_scientific_modeling(
            domain=ModelingDomain.CLIMATE,
            time_range={"start": "2024-01-01", "end": "2024-01-07"},
            spatial_domain={"lat": [0, 90], "lon": [0, 360]}
        )
        print(f"    Model: {prediction.model_name}")
        print(f"    Confidence: {prediction.confidence_score:.1%}")
        print(f"    Regeneration Score: {sum(prediction.regeneration_indicators.values())/4:.2f}")
        
        # Generate economic recommendation
        print("\n  Evaluating economic recommendation...")
        recommendation = integration.generate_economic_recommendation(
            scientific_prediction=prediction,
            proposed_action="renewable_energy_investment",
            base_economic_value=1000000
        )
        print(f"    Original Value: ${recommendation.economic_value:,.0f}")
        print(f"    Constrained Value: ${recommendation.constrained_value:,.0f}")
        print(f"    Decision: {recommendation.conscience_decision['decision_type']}")
        print(f"    Conditions:")
        for condition in recommendation.conditions:
            print(f"      - {condition}")
        
        return True
        
    except RuntimeError as e:
        print(f"\n  Error: {e}")
        return False


def get_full_report() -> dict:
    """Generate comprehensive status report."""
    gpu_info = verify_gpu_for_atlas_sanctum()
    config = get_atlas_sanctum_config()
    conscience = create_planetary_conscience()
    
    try:
        integration = create_atlas_sanctum_integration()
        status = integration.get_status_report()
    except RuntimeError:
        status = {"error": "Integration not initialized"}
    
    return {
        "timestamp": str(__import__('datetime').datetime.utcnow()),
        "gpu": {
            "status": gpu_info.status.value,
            "name": gpu_info.name,
            "memory_gb": gpu_info.memory_gb,
            "compute_capability": gpu_info.compute_capability
        },
        "conscience": {
            "state": conscience.get_conscience_report()['state'],
            "principles": conscience.get_principles()
        },
        "config": {
            "default_model": config.get_earth2studio_config().default_model,
            "conscience_mode": config.get_earth2studio_config().enable_conscience_mode,
            "nature_value_weight": config.get_nature_constraints().nature_value_weight
        },
        "integration": status
    }


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description="Atlas Sanctum Earth2Studio Planetary Conscience"
    )
    parser.add_argument(
        "--report",
        action="store_true",
        help="Generate full status report"
    )
    parser.add_argument(
        "--demo",
        action="store_true",
        help="Run demonstration"
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Output in JSON format"
    )
    parser.add_argument(
        "--config",
        type=str,
        help="Path to configuration file"
    )
    
    args = parser.parse_args()
    
    print_header()
    
    # GPU status (always shown)
    print_gpu_status()
    
    # Config status
    print_config_status()
    
    # Conscience status
    print_conscience_status()
    
    # Run demo if requested
    if args.demo:
        success = run_demo()
        if not success:
            print("\nNote: Demo requires Earth2Studio models to be loaded.")
            print("Install models with: python -m atlas_sanctum.integration.engine")
    
    # Full report
    if args.report or args.json:
        report = get_full_report()
        if args.json:
            print("\n[JSON Report]")
            print(json.dumps(report, indent=2))
        else:
            print("\n[Full Report]")
            print(json.dumps(report, indent=2))
    
    print("\n" + "=" * 60)
    print("Atlas Sanctum is ready to serve as planetary conscience.")
    print("=" * 60)


if __name__ == "__main__":
    main()
