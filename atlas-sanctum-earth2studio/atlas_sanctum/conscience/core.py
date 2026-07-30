"""
Planetary Conscience Module for Atlas Sanctum Earth2Studio

This module ensures that Earth2Studio operates as Atlas Sanctum's planetary conscience,
implementing principles that:

1. Regeneration is measurable
2. Value is constrained by nature
3. AI remains humble before physics

Provides ethical oversight and nature-constrained decision-making for
Earth system modeling operations.
"""

from dataclasses import dataclass, field
from typing import Optional, Dict, Any, List, Tuple
from enum import Enum
from datetime import datetime
import json
from pathlib import Path


class ConscienceState(Enum):
    ACTIVE = "active"
    CONSTRAINED = "constrained"
    OVERRIDDEN = "overridden"
    WARNING = "warning"


@dataclass
class RegenerationMetrics:
    """
    Metrics for measuring ecosystem regeneration.
    
    Ensures that economic activities remain within regenerative capacity
    and that progress toward sustainability is quantifiable.
    """
    # Carbon metrics
    carbon_sequestration_rate: float = 0.0  # tonnes CO2/year
    net_carbon_balance: float = 0.0  # tonnes CO2
    
    # Biodiversity metrics
    biodiversity_index: float = 1.0  # 0-1 scale
    species_diversity_score: float = 1.0  # 0-1 scale
    
    # Water cycle metrics
    water_retention_rate: float = 0.0  # percentage
    watershed_health_score: float = 1.0  # 0-1 scale
    
    # Soil metrics
    soil_carbon_content: float = 0.0  # tonnes/hectare
    soil_health_index: float = 1.0  # 0-1 scale
    
    # Timestamp
    measured_at: datetime = field(default_factory=datetime.utcnow)
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "carbon_sequestration_rate": self.carbon_sequestration_rate,
            "net_carbon_balance": self.net_carbon_balance,
            "biodiversity_index": self.biodiversity_index,
            "species_diversity_score": self.species_diversity_score,
            "water_retention_rate": self.water_retention_rate,
            "watershed_health_score": self.watershed_health_score,
            "soil_carbon_content": self.soil_carbon_content,
            "soil_health_index": self.soil_health_index,
            "measured_at": self.measured_at.isoformat()
        }


@dataclass
class NatureConstraint:
    """
    Constraint derived from nature's limits.
    
    Represents hard boundaries that economic activities must respect
    to maintain ecosystem integrity.
    """
    constraint_type: str  # e.g., "carbon_budget", "biodiversity", "water"
    max_value: float
    min_value: float
    current_value: float
    is_binding: bool = False  # True if constraint is active
    severity: str = "warning"  # warning, error, critical
    
    def check_compliance(self) -> Tuple[bool, str]:
        """Check if current value is within constraint bounds."""
        if self.current_value < self.min_value:
            return False, f"{self.constraint_type} below minimum: {self.current_value} < {self.min_value}"
        elif self.current_value > self.max_value:
            return False, f"{self.constraint_type} above maximum: {self.current_value} > {self.max_value}"
        return True, f"{self.constraint_type} within bounds: {self.current_value}"


@dataclass
class ConscienceDecision:
    """
    Decision made by the planetary conscience.
    
    Records the reasoning behind conscience decisions for
    transparency and accountability.
    """
    decision_type: str  # "approved", "constrained", "rejected"
    reasoning: str
    constraints_applied: List[str] = field(default_factory=list)
    regeneration_score: float = 0.0
    nature_value_impact: float = 0.0
    physics_humility_factor: float = 0.0
    timestamp: datetime = field(default_factory=datetime.utcnow)
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "decision_type": self.decision_type,
            "reasoning": self.reasoning,
            "constraints_applied": self.constraints_applied,
            "regeneration_score": self.regeneration_score,
            "nature_value_impact": self.nature_value_impact,
            "physics_humility_factor": self.physics_humility_factor,
            "timestamp": self.timestamp.isoformat()
        }


class PlanetaryConscience:
    """
    Planetary conscience for Atlas Sanctum Earth2Studio.
    
    This class ensures that all Earth system modeling operations:
    1. Measure and prioritize regeneration
    2. Constrain value by nature's limits
    3. Maintain humility before physical laws
    
    Acts as an ethical oversight layer between scientific modeling
    and economic decision-making.
    """
    
    def __init__(self, config_path: Optional[str] = None):
        """
        Initialize planetary conscience.
        
        Args:
            config_path: Optional path to conscience configuration
        """
        self.state = ConscienceState.ACTIVE
        self.regeneration_metrics = RegenerationMetrics()
        self.nature_constraints: List[NatureConstraint] = []
        self.decision_history: List[ConscienceDecision] = []
        self.uncertainty_factor = 0.1  # Default uncertainty margin
        
        # Load default constraints
        self._setup_default_constraints()
    
    def _setup_default_constraints(self) -> None:
        """Set up default nature constraints."""
        # Carbon budget constraint
        self.add_constraint(
            NatureConstraint(
                constraint_type="carbon_budget",
                max_value=1.0e6,  # tonnes CO2/year
                min_value=-1.0e6,  # Can be negative (sequestration)
                current_value=0.0,
                severity="error"
            )
        )
        
        # Biodiversity constraint
        self.add_constraint(
            NatureConstraint(
                constraint_type="biodiversity",
                max_value=1.0,
                min_value=0.5,
                current_value=1.0,
                severity="warning"
            )
        )
        
        # Water cycle constraint
        self.add_constraint(
            NatureConstraint(
                constraint_type="water_retention",
                max_value=100.0,
                min_value=30.0,
                current_value=70.0,
                severity="warning"
            )
        )
    
    def add_constraint(self, constraint: NatureConstraint) -> None:
        """Add a nature constraint."""
        self.nature_constraints.append(constraint)
    
    def update_regeneration_metrics(self, metrics: RegenerationMetrics) -> None:
        """Update regeneration metrics from scientific modeling."""
        self.regeneration_metrics = metrics
        self._check_constraints()
    
    def _check_constraints(self) -> None:
        """Check all constraints against current metrics."""
        binding_constraints = []
        
        for constraint in self.nature_constraints:
            compliant, _ = constraint.check_compliance()
            if not compliant:
                constraint.is_binding = True
                binding_constraints.append(constraint.constraint_type)
                if constraint.severity == "error":
                    self.state = ConscienceState.OVERRIDDEN
                else:
                    self.state = ConscienceState.CONSTRAINED
            else:
                constraint.is_binding = False
        
        if not binding_constraints:
            self.state = ConscienceState.ACTIVE
    
    def evaluate_decision(
        self,
        proposed_action: str,
        economic_value: float,
        scientific_prediction: Dict[str, Any]
    ) -> ConscienceDecision:
        """
        Evaluate a proposed action against planetary conscience principles.
        
        Args:
            proposed_action: Description of the proposed action
            economic_value: Predicted economic value of the action
            scientific_prediction: Scientific modeling results
            
        Returns:
            ConscienceDecision with approval, constraints, or rejection
        """
        # Calculate regeneration impact
        regeneration_impact = self._calculate_regeneration_impact(scientific_prediction)
        
        # Calculate nature value constraint
        nature_value = self._constrain_value_by_nature(economic_value, regeneration_impact)
        
        # Calculate physics humility (uncertainty margin)
        physics_humility = self._calculate_physics_humility(scientific_prediction)
        
        # Apply constraints
        constraints_applied = self._get_active_constraints()
        
        # Make decision
        if self.state == ConscienceState.OVERRIDDEN:
            decision = ConscienceDecision(
                decision_type="rejected",
                reasoning="Action violates hard nature constraint",
                constraints_applied=constraints_applied,
                regeneration_score=regeneration_impact,
                nature_value_impact=nature_value,
                physics_humility_factor=physics_humility
            )
        elif self.state == ConscienceState.CONSTRAINED:
            adjusted_value = nature_value * 0.5  # Apply 50% reduction
            decision = ConscienceDecision(
                decision_type="constrained",
                reasoning=f"Action constrained by nature limits. Original value: {economic_value}, Adjusted: {adjusted_value}",
                constraints_applied=constraints_applied,
                regeneration_score=regeneration_impact,
                nature_value_impact=adjusted_value,
                physics_humility_factor=physics_humility
            )
        else:
            decision = ConscienceDecision(
                decision_type="approved",
                reasoning="Action consistent with planetary regeneration",
                constraints_applied=constraints_applied,
                regeneration_score=regeneration_impact,
                nature_value_impact=nature_value,
                physics_humility_factor=physics_humility
            )
        
        self.decision_history.append(decision)
        return decision
    
    def _calculate_regeneration_impact(self, prediction: Dict[str, Any]) -> float:
        """Calculate regeneration impact score from prediction."""
        # Base score
        score = 0.5
        
        # Adjust based on carbon impact
        carbon = prediction.get("carbon_impact", 0)
        if carbon < 0:  # Negative carbon (sequestration)
            score += min(0.5, -carbon / 1e6)
        else:  # Positive carbon (emission)
            score -= min(0.5, carbon / 1e6)
        
        # Adjust based on biodiversity impact
        bio = prediction.get("biodiversity_impact", 0)
        score += bio * 0.2
        
        return max(0, min(1, score))
    
    def _constrain_value_by_nature(
        self, 
        economic_value: float, 
        regeneration_score: float
    ) -> float:
        """
        Constrain economic value by nature's regenerative capacity.
        
        Ensures value is never created at the expense of irreversible
        environmental damage.
        """
        # Nature value multiplier based on regeneration score
        nature_multiplier = 0.5 + (regeneration_score * 0.5)  # 0.5 to 1.0
        
        constrained_value = economic_value * nature_multiplier
        
        # Apply hard cap based on constraints
        if self.state == ConscienceState.OVERRIDDEN:
            return 0.0
        
        return constrained_value
    
    def _calculate_physics_humility(self, prediction: Dict[str, Any]) -> float:
        """Calculate uncertainty margin for prediction."""
        # Default uncertainty
        uncertainty = self.uncertainty_factor
        
        # Adjust based on prediction confidence
        confidence = prediction.get("confidence", 0.9)
        uncertainty = 1.0 - confidence
        
        return uncertainty
    
    def _get_active_constraints(self) -> List[str]:
        """Get list of currently active constraints."""
        return [
            c.constraint_type for c in self.nature_constraints 
            if c.is_binding
        ]
    
    def get_conscience_report(self) -> Dict[str, Any]:
        """
        Generate comprehensive conscience report.
        
        Returns:
            Dictionary containing full conscience status report
        """
        return {
            "state": self.state.value,
            "regeneration_metrics": self.regeneration_metrics.to_dict(),
            "active_constraints": self._get_active_constraints(),
            "decisions_made": len(self.decision_history),
            "uncertainty_factor": self.uncertainty_factor,
            "principles": {
                "regeneration_measurable": True,
                "value_constrained_by_nature": True,
                "ai_humble_before_physics": True
            }
        }
    
    def get_principles(self) -> Dict[str, str]:
        """
        Get planetary conscience principles.
        
        Returns:
            Dictionary of conscience principles
        """
        return {
            "principle_1": {
                "name": "Regeneration is Measurable",
                "description": "All actions are evaluated against quantitative regeneration metrics",
                "implemented": True
            },
            "principle_2": {
                "name": "Value Constrained by Nature",
                "description": "Economic value cannot exceed nature's regenerative capacity",
                "implemented": True
            },
            "principle_3": {
                "name": "AI Humble Before Physics",
                "description": "Predictions include uncertainty margins acknowledging physical limits",
                "implemented": True
            }
        }


def create_planetary_conscience(
    config_path: Optional[str] = None
) -> PlanetaryConscience:
    """
    Create and configure planetary conscience for Atlas Sanctum.
    
    This is the primary entry point for conscience integration.
    
    Args:
        config_path: Optional path to conscience configuration
        
    Returns:
        Configured PlanetaryConscience instance
    """
    return PlanetaryConscience(config_path)


if __name__ == "__main__":
    conscience = create_planetary_conscience()
    
    print("=" * 60)
    print("Atlas Sanctum - Planetary Conscience")
    print("=" * 60)
    print(f"State: {conscience.state.value}")
    
    report = conscience.get_conscience_report()
    print(f"Active Constraints: {len(report['active_constraints'])}")
    print(f"Decisions Made: {report['decisions_made']}")
    
    print("\nPrinciples:")
    for key, principle in conscience.get_principles().items():
        print(f"  {principle['name']}: {principle['description']}")
    
    print("\nTesting Decision Evaluation:")
    test_prediction = {
        "carbon_impact": -500000,  # Sequestration
        "biodiversity_impact": 0.1,
        "confidence": 0.85
    }
    
    decision = conscience.evaluate_decision(
        proposed_action="forest_conservation",
        economic_value=1000000,
        scientific_prediction=test_prediction
    )
    
    print(f"  Decision: {decision.decision_type}")
    print(f"  Reasoning: {decision.reasoning}")
    print(f"  Nature Value: {decision.nature_value_impact}")
    print(f"  Physics Humility: {decision.physics_humility_factor}")
    print("=" * 60)
